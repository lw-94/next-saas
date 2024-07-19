'use client'

import { useEffect, useState } from 'react'
import type { Body, Meta, UploadResult, UppyFile } from '@uppy/core'
import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { Progress } from './ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { trpcClient, trpcClientReact, trpcPureClient } from '@/utils/trpcClient'

export default function UploadS3() {
  const [uppy] = useState(() => {
    // 只执行一次
    const u = new Uppy<any, any>().use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters: async (file: UppyFile<Meta, Body>) => {
        // const data = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     fileName: file.name,
        //     fileType: file.type,
        //     fileSize: file.size,
        //   }),
        // }).then(res => res.json())
        // return data
        const data = await trpcPureClient.file.upload.mutate({
          fileName: file.name!,
          fileType: file.type,
          fileSize: file.size!,
        })
        return data
      },
    })
    return u
  })

  const [progress, setProgress] = useState(0)

  uppy.on('progress', (progress) => {
    setProgress(progress)
  })

  useEffect(() => {
    const completeFunc = (result: UploadResult<any, any>) => {
      result.successful?.forEach((file) => {
        trpcPureClient.file.saveFileToDb.mutate({
          name: file.name!,
          type: file.type,
          path: file.uploadURL!,
        })
      })
    }
    uppy.on('complete', completeFunc)

    return () => {
      uppy.off('complete', completeFunc)
    }
  }, [uppy])

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col w-full max-w-xs gap-4">
        <Input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              Array.from(e.target.files).forEach((file) => {
                uppy.addFile({ name: file.name, data: file })
              })
            }
          }}
          multiple
        />
        <Button onClick={() => uppy.upload()}>Upload</Button>
        <Progress value={progress} />
      </div>

      <span>
        {progress}
        %
      </span>
    </div>
  )
}
