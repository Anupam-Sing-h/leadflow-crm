import { getLeads } from '@/app/actions/leads';
import { getPipelineStages } from '@/app/actions/pipeline';
import PipelineBoard from '@/components/PipelineBoard';

export const metadata = {
    title: 'My Pipeline | Sales Rep',
};

export default async function RepPipelinePage() {
    const leads = await getLeads();
    const stages = await getPipelineStages();

    return (
        <div className="flex flex-col h-full space-y-4 p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">My Pipeline</h1>
            </div>

            <PipelineBoard
                initialLeads={leads}
                role="SalesRep"
                pipelineStages={stages || []}
            />
        </div>
    );
}
