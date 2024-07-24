import Image from 'next/image'

function FileItem({
  url,
  name,
  isImage,
}: {
  url: string
  name: string
  isImage: boolean
}) {
  return (
    isImage
      ? (
          <img
            className="max-h-full max-w-full"
            src={url}
            alt={name}
          />
        )
      : <Image src="/unknown-file.png" alt="unknown-file" width={100} height={100} />
  )
}

export function LocalFileItem({
  file,
}: {
  file: File
}) {
  const isImage = file.type.startsWith('image')
  return (
    <FileItem url={URL.createObjectURL(file)} name={file.name} isImage={isImage} />
  )
}

export function RemoteFileItem({
  url,
  name,
  type,
}: {
  url: string
  name: string
  type: string
}) {
  const isImage = type.startsWith('image')
  return (
    <FileItem url={url} name={name} isImage={isImage} />
  )
}
