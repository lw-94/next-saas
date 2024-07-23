import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import z from 'zod'
import { desc } from 'drizzle-orm'
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

    const { name, type, path } = input
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

  listFiles: authProcedure.query(async () => {
    const result = await dbClient.query.files.findMany({
      orderBy: [desc(files.createAt)],
    })
    return result
  }),

  fileBaseUrl: authProcedure.query(async () => {
    return process.env.R2_VIEW_BASE_URL
  }),
})
