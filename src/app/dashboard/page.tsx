import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import UploadS3 from '@/components/upload-s3'
import { Button } from '@/components/ui/button'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{session?.user?.name}</p>
      <Button onClick={async () => {
        'use server'
        await signOut()
      }}
      >
        sign out
      </Button>
      <UploadS3 />
    </div>
  )
}
