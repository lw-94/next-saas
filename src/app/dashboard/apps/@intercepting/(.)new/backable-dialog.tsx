'use client'

import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/dialog'

export function BackableDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <Dialog open onOpenChange={() => router.back()}>
      {children}
    </Dialog>
  )
}
