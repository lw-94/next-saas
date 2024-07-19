import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import UploadS3 from '@/components/upload-s3'
import { SignOut } from '@/components/sign-out'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Dashboard</h1>
      <p>{session?.user?.name}</p>
      <SignOut />

      <UploadS3 />
    </div>
  )
}
