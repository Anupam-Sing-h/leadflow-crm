import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2 } from "lucide-react";

interface LeadCardProps {
    lead: any;
    onQuickEdit: (lead: any) => void;
}

export default function LeadCard({ lead, onQuickEdit }: LeadCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: lead.id,
        data: {
            // Include data for potential future use or conditional logic
            lead,
            fromColumn: lead.status
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none' // Important for mobile interactions
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-card text-card-foreground p-3 mb-3 rounded-lg border shadow-sm flex flex-col gap-2 ${isDragging ? 'z-50 ring-2 ring-primary cursor-grabbing' : 'cursor-grab'
                }`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <span {...listeners} {...attributes} className="text-muted-foreground outline-none cursor-grab active:cursor-grabbing hover:bg-muted p-1 rounded">
                        <GripVertical size={16} />
                    </span>
                    <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{lead.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{lead.company}</p>
                    </div>
                </div>
                <button
                    onClick={() => onQuickEdit(lead)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                    title="Quick Edit"
                >
                    <Edit2 size={14} />
                </button>
            </div>
            {lead.expected_value > 0 && (
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        ₹{lead.expected_value.toLocaleString('en-IN')}
                    </span>
                    {lead.assigned_rep && (
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={lead.assigned_rep.name}>
                            {lead.assigned_rep.name}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
