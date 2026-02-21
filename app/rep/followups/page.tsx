import { getRepFollowups } from '@/app/actions/followups'
import FollowupsTable from '@/components/FollowupsTable'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'My Follow-ups | Sales Rep',
}

export default async function RepFollowupsPage() {
    const followups = await getRepFollowups()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Follow-ups</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all your scheduled follow-ups.</p>
                </div>
            </div>

            <FollowupsTable followups={(followups as any) || []} />
        </div>
    )
}
