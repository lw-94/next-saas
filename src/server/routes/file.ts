import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import z from 'zod'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { files } from '@/server/db/schema'
import { dbClient } from '@/server/db/db'
import { r2 } from '@/lib/r2'
import { authProcedure, router } from '@/utils/trpcRouter'

export const fileRoutes = router({
  upload: authProcedure.input(
    z.object({
      fileName: z.string(),
      fileType: z.string(),
      fileSize: z.number(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const dateStr = new Date().toISOString().split('T')[0]

    // 生成上传URL
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${dateStr}/${input.fileName.replaceAll(' ', '_')}`,
      }),
      { expiresIn: 60 },
    )

    // 返回上传URL
    return { url: signedUrl, method: 'PUT' as const }
  }),

  saveFileToDb: authProcedure.input(
    z.object({
      name: z.string(),
      type: z.string(),
      path: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const { session } = ctx

    const { type, path } = input
    const url = new URL(path)

    const file = await dbClient.insert(files).values({
      ...input,
      path: url.pathname,
      url: url.toString(),
      userId: session.userId,
      contentType: type,
    }).returning() // 返回插入的数据
    return file[0]
  }),

  listFiles: authProcedure.query(async ({ ctx }) => {
    const { session } = ctx
    const result = await dbClient.query.files.findMany({
      where: eq(files.userId, session.userId),
      orderBy: [desc(files.createdAt)],
    })
    return result
  }),

  fileBaseUrl: authProcedure.query(async () => {
    return process.env.R2_VIEW_BASE_URL
  }),

  // cursor query 更高效
  infiniteQueryFiles: authProcedure.input(z.object({
    cursor: z.object({
      id: z.string(),
      createdAt: z.string(),
    }).optional(),
    limit: z.number().default(10),
  })).query(async ({ ctx, input }) => {
    const { cursor, limit } = input
    const { session } = ctx

    const deletedAtFilter = isNull(files.deletedAt) // 过滤已删除的文件
    const userFilter = eq(files.userId, session.userId) // 过滤不属于当前用户的文件

    const result = await dbClient
      .select()
      .from(files)
      .limit(limit)
      .where(
        cursor
          ? and(
            sql`("files"."created_at", "files"."id") < (${new Date(cursor.createdAt).toISOString()}, ${cursor.id})`,
            deletedAtFilter,
            userFilter,
          )
          : and(deletedAtFilter, userFilter),
      )
      .orderBy(desc(files.createdAt))

    return {
      items: result,
      nextCursor: result.length > 0
        ? {
            id: result[result.length - 1].id,
            createdAt: result[result.length - 1].createdAt!,
          }
        : null,
    }
  }),

  deleteFile: authProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // const { session } = ctx
    const result = await dbClient
      .update(files)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(files.id, input))
    return result
  }),
})
