import type { NextRequest } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { r2 } from '@/lib/r2'
import { dbClient } from '@/server/db/db'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const file = await dbClient.query.files.findFirst({ where: (files, { eq }) => eq(files.id, id) })
  if (!file || !file.contentType.startsWith('image')) {
    return new Response('', { status: 400 })
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: decodeURIComponent(file.path.slice(1)), // 解码，防止中文路径key找不到报错
  })
  const resp = await r2.send(command)

  const byteArrayFile = await resp.Body?.transformToByteArray()
  if (!byteArrayFile) {
    return new Response('', { status: 400 })
  }

  const image = sharp(byteArrayFile)

  image.resize({
    width: 320,
  }).webp()

  const buffer = await image.toBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
