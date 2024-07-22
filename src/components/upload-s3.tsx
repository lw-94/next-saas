'use client'

import type Uppy from '@uppy/core'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function UploadS3({ uppy }: { uppy: Uppy }) {
  return (
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
  )
}
