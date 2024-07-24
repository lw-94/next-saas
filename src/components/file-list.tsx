import type { UploadResult, Uppy } from '@uppy/core'
import { RemoteFileItem } from './file-item'
import { trpcClientReact, trpcPureClient } from '@/utils/trpcClient'
import useUppyEvent from '@/hooks/useUppyEvent'

export function FileList({
  uppy,
}: {
  uppy: Uppy
}) {
  const { data: fileBaseUrl } = trpcClientReact.file.fileBaseUrl.useQuery()
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

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {files?.map((file) => {
        return (
          <RemoteFileItem
            key={file.id}
            url={`${fileBaseUrl}${file.path}`}
            name={file.name}
            type={file.type}
          />
        )
      })}
    </div>
  )
}
