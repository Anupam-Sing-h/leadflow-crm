import { useDroppable } from "@dnd-kit/core";
import LeadCard from "./LeadCard";

interface PipelineColumnProps {
    status: string;
    leads: any[];
    onQuickEdit: (lead: any) => void;
}

export default function PipelineColumn({ status, leads, onQuickEdit }: PipelineColumnProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: status,
    });

    const totalLeads = leads.length;
    const totalExpectedValue = leads.reduce((sum, lead) => sum + (lead.expected_value || 0), 0);

    return (
        <div className="flex flex-col flex-shrink-0 w-80 bg-muted/30 rounded-xl overflow-hidden h-full border">
            {/* Column Header */}
            <div className="p-4 border-b bg-card flex justify-between items-center z-10 sticky top-0">
                <div>
                    <h3 className="font-semibold text-lg">{status}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {totalLeads} leads
                        </span>
                        {totalExpectedValue > 0 && (
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                ${totalExpectedValue.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-3 overflow-y-auto transition-colors ${isOver ? 'bg-primary/5' : ''
                    }`}
                style={{ minHeight: '150px' }} // Ensure there's enough space to drop even when empty
            >
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onQuickEdit={onQuickEdit} />
                ))}

                {leads.length === 0 && (
                    <div className="h-full border-2 border-dashed border-muted rounded-lg flex items-center justify-center opacity-50 m-2 mt-4">
                        <span className="text-sm text-muted-foreground p-4 text-center">Drop leads here</span>
                    </div>
                )}
            </div>
        </div>
    );
}
