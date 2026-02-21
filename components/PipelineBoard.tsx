'use client';

import { useState, useMemo } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import PipelineColumn from './PipelineColumn';
import Modal from './ui/Modal';
import { LeadForm } from './LeadForm';
import { updateLeadStatus } from '@/app/actions/leads';

interface PipelineStage {
    id: string;
    name: string;
    order_index: number;
}

interface PipelineBoardProps {
    initialLeads: any[];
    role: 'Admin' | 'SalesRep';
    assignedRepId?: string;
    salesReps?: any[];
    pipelineStages: PipelineStage[];
}

export default function PipelineBoard({ initialLeads, role, assignedRepId, salesReps = [], pipelineStages = [] }: PipelineBoardProps) {
    const [leads, setLeads] = useState(initialLeads);
    const [quickEditLead, setQuickEditLead] = useState<any | null>(null);

    const sortedStages = useMemo(() => {
        return [...pipelineStages].sort((a, b) => a.order_index - b.order_index);
    }, [pipelineStages]);

    const stageNames = useMemo(() => {
        return sortedStages.map(s => s.name);
    }, [sortedStages]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px movement before drag starts, allows clicking inner buttons
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const leadId = active.id as string;
        const newStatus = over.id as string;

        const currentLead = leads.find((l) => l.id === leadId);

        if (!currentLead || currentLead.status === newStatus) return;

        // Optimistic UI update
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            )
        );

        // Server action update
        try {
            const result = await updateLeadStatus(leadId, newStatus);
            if (result.error) {
                alert(result.error);
                // Revert if error
                setLeads((prev) =>
                    prev.map((lead) =>
                        lead.id === leadId ? { ...lead, status: currentLead.status } : lead
                    )
                );
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update lead status');
            // Revert on error
            setLeads((prev) =>
                prev.map((lead) =>
                    lead.id === leadId ? { ...lead, status: currentLead.status } : lead
                )
            );
        }
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
    };


    const groupedLeads = useMemo(() => {
        const acc: Record<string, any[]> = {};

        // Initialize all active stages
        stageNames.forEach(stage => acc[stage] = []);

        leads.forEach(lead => {
            if (acc[lead.status]) {
                acc[lead.status].push(lead);
            } else {
                // If a lead has a status that no longer exists in stages, try to put it in the first stage
                const firstStage = stageNames.length > 0 ? stageNames[0] : 'New';
                if (!acc[firstStage]) acc[firstStage] = [];
                acc[firstStage].push(lead);
            }
        });
        return acc;
    }, [leads, stageNames]);

    const handleQuickEditClose = () => {
        setQuickEditLead(null);
    };

    if (stageNames.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                No pipeline stages defined. Please configure them in Settings.
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-4 overflow-hidden">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                    <div className="flex gap-4 h-[calc(100vh-170px)] min-h-[500px]">
                        {stageNames.map((stage) => (
                            <PipelineColumn
                                key={stage}
                                status={stage}
                                leads={groupedLeads[stage] || []}
                                onQuickEdit={setQuickEditLead}
                            />
                        ))}
                    </div>
                </div>
            </DndContext>

            <Modal isOpen={!!quickEditLead} onClose={handleQuickEditClose} title={`Quick Edit: ${quickEditLead?.name}`}>
                {quickEditLead && (
                    <LeadForm
                        initialData={quickEditLead}
                        isAdmin={role === 'Admin'}
                        salesReps={salesReps}
                        pipelineStages={pipelineStages}
                        onSuccess={() => {
                            // Ideally, trigger a Next.js router.refresh() 
                            // to pull latest leads natively, as the action handles revalidation
                            window.location.reload();
                        }}
                        onCancel={handleQuickEditClose}
                    />
                )}
            </Modal>
        </div>
    );
}
