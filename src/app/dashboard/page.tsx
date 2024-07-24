'use client'

import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import UploadBtnS3 from '@/components/upload-btn-s3'
import { Dropzone } from '@/components/dropzone'
import { useUppy } from '@/hooks/useUppy'
import { Progress } from '@/components/ui/progress'
import { usePasteFile } from '@/hooks/usePasteFile'
import { FileList } from '@/components/file-list'
import { UploadPreview } from '@/components/upload-preview'

export default function Dashboard() {
  // 状态要写在提前返回前
  const { uppy, progress, files: waitFiles } = useUppy()

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
      <UploadBtnS3 uppy={uppy} />

      <Dropzone uppy={uppy} className="my-4">
        {dragging => (
          <div className="relative p-4 border rounded">
            <FileList uppy={uppy} />
            {dragging && <div className="absolute inset-0 bg-secondary/60 flex items-center justify-center">Drop file here to upload</div>}
          </div>
        )}
      </Dropzone>

      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xl">
        {/* <Button onClick={() => uppy.upload()}>Upload</Button> */}
        <Progress value={progress} />
        <span>
          {progress}
          %
        </span>
      </div>

      <UploadPreview uppy={uppy} />

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
