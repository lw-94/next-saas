import type { UploadResult, Uppy } from '@uppy/core'
import { RemoteFileItem } from './file-item'
import { Button } from './ui/button'
import { trpcClientReact, trpcPureClient } from '@/utils/trpcClient'
import useUppyEvent from '@/hooks/useUppyEvent'

export function FileList({
  uppy,
}: {
  uppy: Uppy
}) {
  const { data: fileBaseUrl } = trpcClientReact.file.fileBaseUrl.useQuery()
  // const { data: files } = trpcClientReact.file.listFiles.useQuery()
  const { data, fetchNextPage } = trpcClientReact.file.infiniteQueryFiles.useInfiniteQuery({
    limit: 3,
  }, {
    getNextPageParam: lastPage => lastPage.nextCursor,
  })

  const files = data?.pages.flatMap(page => page.items)

  const utils = trpcClientReact.useUtils()

  useUppyEvent(uppy, 'complete', (result: UploadResult<any, any>) => {
    result.successful?.forEach((file) => {
      trpcPureClient.file.saveFileToDb.mutate({
        name: file.name!,
        type: file.type,
        path: file.uploadURL!,
      }).then((resp) => {
        // 更新文件列表
        utils.file.infiniteQueryFiles.setInfiniteData({ limit: 3 }, (prev) => {
          if (!prev) {
            return prev
          }
          return {
            ...prev,
            pages: prev.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  items: [resp, ...page.items],
                }
              }
              return page
            }),
          }
        })
      })
    })

    // 上传成功后清空文件
    uppy.clear()
  })

  return (
    <>
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
      <div className="mt-4 flex justify-center">
        <Button onClick={() => fetchNextPage()}>load more</Button>
      </div>
    </>
  )
}
