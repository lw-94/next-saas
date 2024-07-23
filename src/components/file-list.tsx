import Image from 'next/image'
import type { UploadResult, Uppy } from '@uppy/core'
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
    <ul className="flex gap-4 flex-wrap">
      {files?.map((file) => {
        const isImage = file.type.startsWith('image')
        return (
          <li key={file.id} className="w-40 h-40 border flex items-center justify-center">
            {isImage
              ? (
                  <img
                    src={`${fileBaseUrl}${file.path}`}
                    alt={file.name}
                  />
                )
              : <Image src="/unknown-file.png" alt="unknown-file" width={100} height={100} />}
          </li>
        )
      })}
    </ul>
  )
}
