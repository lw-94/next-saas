import { Copy, Trash } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { trpcClientReact } from '@/utils/trpcClient'

export function DeleteFile({
  fileId,
  onDeleteSuccess,
}: {
  fileId: string
  onDeleteSuccess: (fileId: string) => void
}) {
  const { mutate: deleteFile, isPending } = trpcClientReact.file.deleteFile.useMutation({
    onSuccess: () => {
      onDeleteSuccess(fileId)
    },
  })
  const handleRemoveFile = () => {
    deleteFile(fileId)
  }

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isPending}>
        <Trash />
      </Button>
    </div>
  )
}

export function CopyFileUrl({
  url,
}: {
  url: string
}) {
  const handleCopyUrl = () => {
    copy(url)
    toast.success('Copied to clipboard')
  }
  return (
    <div>
      <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
        <Copy />
      </Button>
    </div>
  )
}
