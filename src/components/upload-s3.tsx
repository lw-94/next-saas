'use client'

import { useState } from 'react'
import type { Body, Meta, UppyFile } from '@uppy/core'
import Uppy from '@uppy/core'
import type { AwsS3MultipartOptions } from '@uppy/aws-s3'
import AwsS3 from '@uppy/aws-s3'
import { Input } from '~/src/components/ui/input'
import { Button } from '~/src/components/ui/button'

export default function UploadS3() {
  const [uppy] = useState(() => {
    const u = new Uppy<any, any>().use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters: async (file: UppyFile<Meta, Body>) => {
        const data = await fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
          }),
        }).then(res => res.json())
        return data
      },
    })
    return u
  })

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
      </div>
    </div>
  )
}
