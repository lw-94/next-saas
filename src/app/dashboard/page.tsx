'use client'

import { redirect } from 'next/navigation'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useMemo } from 'react'
import UploadS3 from '@/components/upload-s3'
import { trpcClientReact } from '@/utils/trpcClient'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  // 要写在提前返回前
  const { data: files, isPending } = trpcClientReact.file.listFiles.useQuery()
  const { data: fileBaseUrl } = trpcClientReact.file.getFileBaseUrl.useQuery()

  const { data: session, status } = useSession()
  switch (status) {
    case 'loading':
      return <p>Loading...</p>
    case 'unauthenticated':
      redirect('/api/auth/signin')
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Dashboard</h1>
      <p>{session?.user?.name}</p>
      <Button onClick={() => signOut()}>Signout</Button>

      <ul className="flex gap-4">
        {files?.map((file) => {
          const isImage = file.type.startsWith('image')
          return (
            <li key={file.id} className="w-40 h-40 border flex items-center justify-center">
              {isImage
                ? (
                    <img
                      src={`${fileBaseUrl}${file.path}`}
                      alt={file.name}
                    />
                  )
                : <Image src="/unknown-file.png" alt="unknown-file" width={100} height={100} />}
            </li>
          )
        })}
      </ul>

      <UploadS3 />
    </div>
  )
}
