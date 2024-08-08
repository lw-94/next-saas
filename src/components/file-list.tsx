import type { UploadResult, Uppy } from '@uppy/core'
import { RemoteFileItem } from './file-item'
import { Button } from './ui/button'
import { CopyFileUrl, DeleteFile } from './file-item-action'
import { trpcClientReact, trpcPureClient } from '@/utils/trpcClient'
import useUppyEvent from '@/hooks/useUppyEvent'

export function FileList({
  uppy,
}: {
  uppy: Uppy
}) {
  const queryKey = {
    limit: 3,
  }
  const { data, fetchNextPage } = trpcClientReact.file.infiniteQueryFiles.useInfiniteQuery(queryKey, {
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
        utils.file.infiniteQueryFiles.setInfiniteData(queryKey, (prev) => {
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

  const updateFileList = (fileId: string) => {
    utils.file.infiniteQueryFiles.setInfiniteData(queryKey, (prev) => {
      if (!prev) {
        return prev
      }
      return {
        ...prev,
        pages: prev.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              items: page.items.filter(item => item.id !== fileId),
            }
          }
          return page
        }),
      }
    })
  }

  return (
    <>
      <div className="flex gap-4 flex-wrap justify-center">
        {files?.map((file) => {
          // const url = `${fileBaseUrl}${file.path}`
          const url = `/image/${file.id}`
          return (
            <div key={file.id} className="relative w-80 h-80 border flex items-center justify-center">
              <RemoteFileItem
                url={url}
                name={file.name}
                type={file.type}
              />
              <div className="absolute inset-0 flex justify-center items-center bg-background/60 opacity-0 hover:opacity-100 transition-opacity">
                <DeleteFile fileId={file.id} onDeleteSuccess={updateFileList} />
                <CopyFileUrl url={url} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex justify-center">
        <Button onClick={() => fetchNextPage()}>load more</Button>
      </div>
    </>
  )
}
