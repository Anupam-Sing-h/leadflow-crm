import { getLeads, getSalesReps } from '@/app/actions/leads';
import { getPipelineStages } from '@/app/actions/pipeline';
import PipelineBoard from '@/components/PipelineBoard';

export const metadata = {
    title: 'Pipeline Board | Admin',
};

export default async function AdminPipelinePage() {
    const leads = await getLeads();
    const salesReps = await getSalesReps();
    const stages = await getPipelineStages();

    return (
        <div className="flex flex-col h-full space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Pipeline Board</h1>
            </div>

            <PipelineBoard
                initialLeads={leads}
                role="Admin"
                salesReps={salesReps}
                pipelineStages={stages || []}
            />
        </div>
    );
}
