'use client'

import { redirect } from 'next/navigation'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import UploadS3 from '@/components/upload-s3'
import { trpcClientReact } from '@/utils/trpcClient'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/dropzone'
import { cn } from '@/lib/utils'
import { useUppy } from '@/hooks/useUppy'
import { Progress } from '@/components/ui/progress'
import useUppyEvent from '@/hooks/useUppyEvent'
import { usePasteFile } from '@/hooks/usePasteFile'

export default function Dashboard() {
  const { uppy, progress, files: waitFiles } = useUppy()

  // 要写在提前返回前
  const { data: files, isPending, refetch: refetchFileList } = trpcClientReact.file.listFiles.useQuery()
  const { data: fileBaseUrl } = trpcClientReact.file.fileBaseUrl.useQuery()

  useUppyEvent(uppy, 'complete', () => {
    // 在useUppy中的监听事件之后
    refetchFileList()
  })

  // 粘贴增加文件
  usePasteFile({
    onFilePaste(files) {
      files.forEach((file) => {
        uppy.addFile({ name: file.name, data: file })
      })
    },
  })

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

      <Dropzone uppy={uppy}>
        {dragging => (
          <ul className={cn('flex my-4 gap-4 p-4 border rounded relative', dragging ? 'border' : '')}>
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
            {dragging && <div className="absolute inset-0 bg-secondary/60 flex items-center justify-center">Drop file here to upload</div>}
          </ul>
        )}
      </Dropzone>

      <div className="flex flex-col items-center justify-center gap-4">
        <UploadS3 uppy={uppy} />
        <Progress value={progress} />
        <span>
          {progress}
          %
        </span>
      </div>

      <div>
        <h3>Wait for upload</h3>
        <ul>
          {Object.values(waitFiles).map(file => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
