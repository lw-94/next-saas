'use client'

import { useState } from 'react'
import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import { Input } from '~/src/components/ui/input'
import { Button } from '~/src/components/ui/button'

export default function Dashboard() {
  const [uppy] = useState(() => {
    const u = new Uppy()
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async (file) => {
          const data = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify(file),
          }).then(res => res.json())
          return data
        },
      })
    return u
  })

  return (
    <div>
      <h1>Dashboard</h1>
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
  )
}
