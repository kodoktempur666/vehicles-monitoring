import { AppSidebar } from '@/components/approvals/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getSessionApproval } from '@/lib/actions/auth'

import { SessionProvider } from 'next-auth/react'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    await getSessionApproval()


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