import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'

export async function POST(req: Request) {
  const { name } = await req.json() // 取参数

  try {
    console.log(`正在生成上传URL!`)

    // 生成上传URL
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${new Date().getTime()}-${name}`,
      }),
      { expiresIn: 60 },
    )

    console.log(`上传URL生成成功!`)

    // 返回上传URL
    return NextResponse.json({ url: signedUrl, method: 'PUT' })
  }
  catch (err) {
    console.log('出错了')
  }
}
