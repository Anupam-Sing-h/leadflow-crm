import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Kanban } from 'lucide-react'

export const metadata = {
    title: 'Settings | Admin',
};

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage system configurations.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/admin/settings/pipeline">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Kanban className="h-5 w-5" />
                                Pipeline Stages
                            </CardTitle>
                            <CardDescription>
                                Configure the stages of your sales pipeline.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                {/* Additional settings can be added here in the future */}
            </div>
        </div>
    )
}
