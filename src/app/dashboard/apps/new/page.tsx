import { redirect } from 'next/navigation'
import { SubmitButton } from './submit-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createAppSchema } from '@/server/db/validate-schema'
import { trpcServerCaller } from '@/server/router'

export default function CreateAppPage() {
  async function createApp(formData: FormData) {
    'use server'
    const name = formData.get('name')
    const description = formData.get('description')
    const input = createAppSchema.pick({
      name: true,
      description: true,
    }).safeParse({
      name,
      description,
    })
    if (input.success) {
      const newApp = await trpcServerCaller.app.createApp(input.data)
      redirect(`/dashboard/apps/${newApp.id}`)
    }
    else {
      return input.error
    }
  }

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <form className="w-full max-w-xl flex flex-col gap-4" action={createApp}>
        <h1 className="text-center text-3xl font-bold">Create App</h1>
        <Input name="name" placeholder="Enter app name" minLength={3} required />
        <Textarea name="description" placeholder="Enter app description" />
        <SubmitButton></SubmitButton>
      </form>
    </div>
  )
}
