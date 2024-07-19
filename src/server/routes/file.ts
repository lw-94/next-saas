import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import z from 'zod'
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
    console.log('🚀 ~ ).mutation ~ input:', input)
    // 生成上传URL
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${new Date().getTime()}-${input.fileName}`,
      }),
      { expiresIn: 60 },
    )

    // 返回上传URL
    return { url: signedUrl, method: 'PUT' as const }
  }),
})
