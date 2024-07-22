import { useState } from 'react'
import type { Body, Meta, State, UploadResult, UppyFile } from '@uppy/core'
import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import useUppyState from './useUppyState'
import useUppyEvent from './useUppyEvent'
import { trpcPureClient } from '@/utils/trpcClient'

export function useUppy() {
  const [uppy] = useState(() => {
    // 只执行一次
    const u = new Uppy<any, any>().use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters: async (file: UppyFile<Meta, Body>) => {
        // const data = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     fileName: file.name,
        //     fileType: file.type,
        //     fileSize: file.size,
        //   }),
        // }).then(res => res.json())
        // return data
        const data = await trpcPureClient.file.upload.mutate({
          fileName: file.name!,
          fileType: file.type,
          fileSize: file.size!,
        })
        return data
      },
    })
    return u
  })

  const progress = useUppyState(uppy, (state: State<any, any>) => state.totalProgress)
  const files = useUppyState(uppy, (state: State<any, any>) => state.files)

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
  })

  return { uppy, progress, files }
}
