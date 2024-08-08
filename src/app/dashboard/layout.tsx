import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default async function DashboardLayout({
  children,
  nav,
}: {
  children: React.ReactNode
  nav: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <nav className="h-20 border-b relative">
        <div className="container flex justify-end items-center h-full">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session.user.image!}></AvatarImage>
                <AvatarFallback>{session.user.name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="absolute left-1/2 -translate-x-1/2">
            {nav}
          </div>
        </div>
      </nav>
      <main>
        <SessionProvider>{children}</SessionProvider>
      </main>
    </>
  )
}
