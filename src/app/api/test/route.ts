import type { NextRequest } from 'next/server'
import { createUserSchema } from '@/server/db/validate-schema'

// import z from 'zod'

// const inputSchema = z.object({
//   name: z.string().max(10).min(3),
//   email: z.string().email(),
// })

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams

  const name = query.get('name')
  const email = query.get('email')

  const data = createUserSchema.safeParse({ name, email })

  if (!data.success) {
    return Response.json({ error: data.error })
  }

  return Response.json(data.data)
}
