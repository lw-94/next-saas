'use client'

import type Uppy from '@uppy/core'
import { Plus } from 'lucide-react'
import { useRef } from 'react'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'

export default function UploadS3({ uppy }: { uppy: Uppy }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const onBtnClick = () => {
    inputRef.current?.click()
  }

  return (
    <>
      <Button variant="ghost" onClick={onBtnClick}>
        <Plus />
      </Button>
      <Input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile({ name: file.name, data: file })
            })
          }
        }}
        multiple
        className="fixed left-[-10000px]"
      />
    </>
  )
}
