import { LeadForm } from '@/components/LeadForm'
import { getSalesReps } from '@/app/actions/leads'
import { getPipelineStages } from '@/app/actions/pipeline'

export default async function NewAdminLeadPage() {
    const salesReps = await getSalesReps()
    const pipelineStages = await getPipelineStages()

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Lead</h1>
                <p className="text-muted-foreground mt-1">Add a new lead to the CRM.</p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <LeadForm isAdmin={true} salesReps={salesReps || []} pipelineStages={pipelineStages || []} />
            </div>
        </div>
    )
}
