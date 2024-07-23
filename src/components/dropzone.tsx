import React, { useRef, useState } from 'react'
import type { Uppy } from '@uppy/core'

export function Dropzone({
  uppy,
  children,
  ...divProps
}: {
  uppy: Uppy
  children: React.ReactNode | ((dragging: boolean) => React.ReactNode)
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
  const [dragging, setDragging] = useState(false)

  // 使用useRef管理定时器
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  return (
    <div
      {...divProps}
      onDragEnter={() => {
        setDragging(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null
        }
      }}
      onDragLeave={() => {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null
        }
        timer.current = setTimeout(() => {
          setDragging(false)
        }, 50)
      }}
      onDrop={(e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        Array.from(files).forEach((file) => {
          uppy.addFile({
            data: file,
            name: file.name,
          })
        })
        setDragging(false)
      }}
    >
      {typeof children === 'function' ? children(dragging) : children}
    </div>
  )
}
