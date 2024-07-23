'use client'

import { redirect } from 'next/navigation'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import type { UploadResult } from '@uppy/core'
import UploadBtnS3 from '@/components/upload-btn-s3'
import { trpcClientReact, trpcPureClient } from '@/utils/trpcClient'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/dropzone'
import { cn } from '@/lib/utils'
import { useUppy } from '@/hooks/useUppy'
import { Progress } from '@/components/ui/progress'
import useUppyEvent from '@/hooks/useUppyEvent'
import { usePasteFile } from '@/hooks/usePasteFile'
import { FileList } from '@/components/file-list'

export default function Dashboard() {
  const { uppy, progress, files: waitFiles } = useUppy()

  // 状态要写在提前返回前
  const { data: files, refetch: refetchFileList } = trpcClientReact.file.listFiles.useQuery()

  useUppyEvent(uppy, 'complete', (result: UploadResult<any, any>) => {
    result.successful?.forEach((file) => {
      trpcPureClient.file.saveFileToDb.mutate({
        name: file.name!,
        type: file.type,
        path: file.uploadURL!,
      })
    })
    // 上传成功后清空文件
    uppy.clear()

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

  // auth check
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
          <div className="relative p-4 border rounded">
            <FileList files={files} />
            {dragging && <div className="absolute inset-0 bg-secondary/60 flex items-center justify-center">Drop file here to upload</div>}
          </div>
        )}
      </Dropzone>

      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xl">
        <UploadBtnS3 uppy={uppy} />
        <Button onClick={() => uppy.upload()}>Upload</Button>
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
