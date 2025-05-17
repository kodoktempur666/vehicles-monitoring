import { auth } from '@/auth'
import { AppSidebar } from '@/components/approvals/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SessionProvider } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()
    const userId = session?.user?.id
    console.log(userId, 'userId')

    if (!session?.user?.id) redirect('/')

    const isApproval = await db
        .select({ role: users.role }) // perjelas nama field
        .from(users)
        .where(eq(users.id, session.user.id))
        .then((res) => {
            const role = res[0]?.role
            return role === 'approver_l1' || role === 'approver_l2'
        })

    if (!isApproval) redirect('/')


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

export default layout