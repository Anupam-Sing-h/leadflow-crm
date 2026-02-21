'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, UserCog, LogOut, Kanban } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface SidebarProps {
    role: 'Admin' | 'SalesRep'
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()

    const adminLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Leads', href: '/admin/leads', icon: Users },
        { name: 'Pipeline', href: '/admin/pipeline', icon: Kanban },
        { name: 'Templates', href: '/admin/templates', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: UserCog },
    ]

    const repLinks = [
        { name: 'Dashboard', href: '/rep/dashboard', icon: LayoutDashboard },
        { name: 'Leads', href: '/rep/leads', icon: Users },
        { name: 'Pipeline', href: '/rep/pipeline', icon: Kanban },
        { name: 'Follow-ups', href: '/rep/followups', icon: LayoutDashboard },
    ]

    const links = role === 'Admin' ? adminLinks : repLinks

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>LeadFlow CRM</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium">
                    {links.map((link) => {
                        const Icon = link.icon
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    pathname === link.href ? "bg-muted text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    )
}
