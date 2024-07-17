import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'

export async function POST(request: Request) {
  const body = request.body as any
  try {
    console.log(`正在生成上传URL!`)

    // 生成上传URL
    const signedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${Date.now()}`,
        ContentType: body?.meta?.type || 'application/octet-stream',
        ContentLength: body?.size || 0,
      }),
      { expiresIn: 60 },
    )

    console.log(`上传URL生成成功!`)

    // 返回上传URL
    return NextResponse.json({ url: signedUrl, method: 'PUT', headers: {
      'Access-Control-Allow-Origin': '*',
    } })
  }
  catch (err) {
    console.log('出错了')
  }
}
