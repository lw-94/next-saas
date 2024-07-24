import { Trash } from 'lucide-react'
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
