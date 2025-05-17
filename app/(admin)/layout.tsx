

// Layout.jsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { auth } from '@/auth'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'


const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  const userId = session?.user?.id
  console.log(userId, 'userId')

  if (!session?.user?.id) redirect('/')

  const isAdmin = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((res) => res[0].isAdmin === 'admin')

  if (!isAdmin) redirect('/')
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <div className="sticky top-0 z-10 bg-background">
              <SidebarTrigger className="p-4" />
            </div>
            <main className="w-full">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>

  )
}

export default Layout