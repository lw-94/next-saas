import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default async function Home() {
  // 'use server'
  // const users = await db.query.Users.findMany()
  // const users = await db.select().from(Users).where(eq(Users.id, 1))
  // const session = await auth()

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-3xl font-bold">Create App</h1>
        <Input placeholder="Enter app name" />
        <Textarea placeholder="Enter app description" />
        <Button>Click Me</Button>
      </form>
      <Link href="/dashboard" className="mt-4">
        <Button>go dashboard</Button>
      </Link>
    </div>
  )
}
