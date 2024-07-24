import type { Uppy } from '@uppy/core'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { LocalFileItem } from './file-item'
import useUppyState from '@/hooks/useUppyState'

export function UploadPreview({
  uppy,
}: {
  uppy: Uppy
}) {
  const files = useUppyState(uppy, s => Object.values(s.files))
  const open = files.length > 0

  const [showIdx, setShowIdx] = useState(0)
  const file = files[showIdx]

  const toLeft = () => {
    if (showIdx === 0) {
      setShowIdx(files.length - 1)
      return
    }
    setShowIdx(showIdx - 1)
  }

  const toRight = () => {
    if (showIdx === files.length - 1) {
      setShowIdx(0)
      return
    }
    setShowIdx(showIdx + 1)
  }

  const clear = () => {
    uppy.clear()
    setShowIdx(0)
  }

  return file
    ? (
        <Dialog open={open} onOpenChange={val => !val && clear()}>
          <DialogContent onPointerDownOutside={e => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Upload Preview</DialogTitle>
              <div className="flex items-center justify-between my-8">
                <Button variant="outline" size="icon" onClick={toLeft}>
                  <ChevronLeft />
                </Button>

                <div className="w-80 h-80 border flex items-center justify-center">
                  <LocalFileItem file={file.data as File} />
                </div>

                <Button variant="outline" size="icon" onClick={toRight}>
                  <ChevronRight />
                </Button>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  uppy.removeFile(files[showIdx].id)
                  if (showIdx === files.length - 1) {
                    setShowIdx(files.length - 2)
                  }
                }}
              >
                Remove this
              </Button>
              <Button onClick={async () => {
                await uppy.upload()
                toast.success('Upload success')
                clear()
              }}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    : null
}
