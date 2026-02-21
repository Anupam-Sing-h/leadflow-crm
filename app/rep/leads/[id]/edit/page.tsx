import { LeadForm } from '@/components/LeadForm'
import { getLead } from '@/app/actions/leads'
import { getPipelineStages } from '@/app/actions/pipeline'
import { notFound } from 'next/navigation'

export default async function EditRepLeadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const lead = await getLead(id)

    if (!lead) return notFound()

    const pipelineStages = await getPipelineStages()

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Lead</h1>
                <p className="text-muted-foreground mt-1">Update lead information.</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <LeadForm initialData={lead} isAdmin={false} salesReps={[]} pipelineStages={pipelineStages || []} />
            </div>
        </div>
    )
}
