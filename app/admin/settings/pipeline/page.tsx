import { getPipelineStages } from '@/app/actions/pipeline'
import PipelineStagesClient from './PipelineStagesClient'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Pipeline Settings | Admin',
};

export default async function AdminPipelineSettingsPage() {
    const stages = await getPipelineStages()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/settings">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pipeline Stages</h1>
                    <p className="text-muted-foreground mt-1">Configure the stages for your leads pipeline.</p>
                </div>
            </div>

            <PipelineStagesClient initialStages={stages || []} />
        </div>
    )
}
