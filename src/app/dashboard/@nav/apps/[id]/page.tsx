'use client'

import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { trpcClientReact } from '@/utils/trpcClient'
import { Button } from '@/components/ui/button'

export default function appsNav({
  params: { id: appId },
}: {
  params: { id: string }
}) {
  const { data: apps, isLoading } = trpcClientReact.app.listApps.useQuery()

  const currentApp = apps?.filter(app => app.id === appId)[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {
          isLoading
            ? 'Loading...'
            : (
                <Button variant="outline">
                  {currentApp?.name}
                </Button>
              )
        }
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {apps?.map(app => (
          <DropdownMenuItem key={app.id} disabled={appId === app.id}>
            <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
