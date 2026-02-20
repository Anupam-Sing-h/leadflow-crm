import { Sidebar } from '@/components/Sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role="Admin" />
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
