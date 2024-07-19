import { redirect } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/auth'
import UploadS3 from '@/components/upload-s3'
import { SignOut } from '@/components/sign-out'
import { typeServerCaller } from '@/server/router'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const files = await typeServerCaller.file.listFiles()

  return (
    <div className="flex flex-col items-center">
      <h1>Dashboard</h1>
      <p>{session?.user?.name}</p>
      <SignOut />

      <ul className="flex gap-4">
        {files.map((file) => {
          return (
            <li key={file.id} className="w-40  border">
              <img
                src={`${process.env.R2_VIEW_BASE_URL}${file.path}`}
                alt={file.name}
              />
            </li>
          )
        })}
      </ul>

      <UploadS3 />
    </div>
  )
}
