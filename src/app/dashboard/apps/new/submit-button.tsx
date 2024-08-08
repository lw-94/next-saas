'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export function SubmitButton() {
  const status = useFormStatus()

  return <Button type="submit" disabled={status.pending}>Submit</Button>
}
