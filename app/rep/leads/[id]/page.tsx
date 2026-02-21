import { getLead } from '@/app/actions/leads'
import { notFound } from 'next/navigation'
import { LeadActivities } from '@/components/LeadActivities'
import { LeadFollowups } from '@/components/LeadFollowups'
import { Badge } from '@/components/ui/badge'
import { calculateLeadScore } from '@/utils/leadScoring'

import { SendEmailModal } from '@/components/SendEmailModal'

export default async function RepLeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const lead = await getLead(id)

    if (!lead) return notFound()

    const { score, reason } = calculateLeadScore(lead)

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{lead.name}</h1>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                        {lead.company && <span>🏢 {lead.company}</span>}
                        {lead.email && <span>✉️ {lead.email}</span>}
                        {lead.phone && <span>📞 {lead.phone}</span>}
                        {lead.location && <span>📍 {lead.location}</span>}
                    </div>
                    <div className="mt-3">
                        <Badge variant="secondary" className="text-sm px-3 py-1 font-semibold flex items-center gap-2 w-fit" title={reason}>
                            <span>⭐️ AI Score: {score}/100</span>
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1 ml-1 max-w-sm">{reason}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 pb-1">
                        <SendEmailModal leadId={lead.id} leadName={lead.name} />
                        <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/10 text-primary uppercase font-bold">
                            {lead.status}
                        </Badge>
                    </div>
                    <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/10 text-primary uppercase font-bold">
                        {lead.status}
                    </Badge>
                    <div className="text-sm font-medium">Source: {lead.source}</div>
                    <div className="text-sm font-medium text-green-700">Value: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.expected_value || 0)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Lead Information</h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Assigned To</dt>
                                <dd className="font-medium">{lead.assigned_rep?.name || 'Unassigned'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Created Date</dt>
                                <dd className="font-medium">{new Date(lead.created_at).toLocaleDateString()}</dd>
                            </div>
                            {lead.tags && lead.tags.length > 0 && (
                                <div>
                                    <dt className="text-muted-foreground mb-1">Tags</dt>
                                    <dd className="flex gap-1 flex-wrap">
                                        {lead.tags.map((t: any, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px]">{t.tag_name}</Badge>
                                        ))}
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {lead.notes && (
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Initial Notes</h4>
                                <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border rounded-lg p-6 shadow-sm space-y-8">
                        <div>
                            <LeadFollowups followups={lead.followups || []} />
                        </div>
                        <div className="pt-6 border-t">
                            <LeadActivities activities={lead.activities || []} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
