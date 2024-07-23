import Image from 'next/image'
import { trpcClientReact } from '@/utils/trpcClient'
import type { files as Files } from '@/server/db/schema'

type FilesType = typeof Files.$inferSelect

type StringifiedFiles = {
  [K in keyof typeof Files.$inferSelect]: K extends 'deleteAt' | 'createAt' ? string | null : FilesType[K]
}

export function FileList({
  files,
}: {
  files: StringifiedFiles[] | undefined
}) {
  const { data: fileBaseUrl } = trpcClientReact.file.fileBaseUrl.useQuery()

  return (
    <ul className="flex gap-4">
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
