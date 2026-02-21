'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createLead, updateLead } from '@/app/actions/leads'

interface LeadProps {
    id?: string
    name?: string
    email?: string
    phone?: string
    company?: string
    location?: string
    source?: string
    status?: string
    expected_value?: number
    notes?: string
    assigned_rep_id?: string
    tags?: { tag_name: string }[]
    created_at?: string
}

interface LeadFormProps {
    initialData?: LeadProps
    isAdmin: boolean
    salesReps: { id: string, name: string, email?: string }[]
    pipelineStages?: { id: string, name: string }[]
    onSuccess?: () => void
    onCancel?: () => void
}

export function LeadForm({ initialData, isAdmin, salesReps, pipelineStages = [], onSuccess, onCancel }: LeadFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const isEditing = !!initialData?.id

    async function onSubmit(formData: FormData) {
        setLoading(true)
        try {
            let result;
            if (isEditing) {
                result = await updateLead(initialData.id!, formData)
            } else {
                result = await createLead(formData)
            }

            if (result?.error) {
                console.error('Server error:', result.error)
                alert(`Failed to save lead: ${result.error}`)
                return // Prevent redirect on error
            }

            if (onSuccess) {
                onSuccess()
            } else {
                const redirectPath = isAdmin ? '/admin/leads' : '/rep/leads'
                router.push(redirectPath)
            }
        } catch (error) {
            console.error('Error saving lead:', error)
            alert('Failed to save lead. An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={onSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Lead Name *</Label>
                    <Input id="name" name="name" defaultValue={initialData?.name} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={initialData?.email} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={initialData?.phone} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" defaultValue={initialData?.company} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" defaultValue={initialData?.location} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="expected_value">Expected Value (₹)</Label>
                    <Input id="expected_value" name="expected_value" type="number" step="0.01" defaultValue={initialData?.expected_value} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" name="tags" defaultValue={initialData?.tags?.map(t => t.tag_name).join(', ')} placeholder="Comma-separated (e.g. VIP, Hot)" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="created_at">Created Date</Label>
                    <Input id="created_at" name="created_at" type="date" defaultValue={initialData?.created_at ? new Date(initialData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <select
                        id="source"
                        name="source"
                        defaultValue={initialData?.source || 'Website'}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Website">Website</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={initialData?.status || 'New'}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {pipelineStages && pipelineStages.length > 0 ? (
                            pipelineStages.map(stage => (
                                <option key={stage.id} value={stage.name}>{stage.name}</option>
                            ))
                        ) : (
                            <>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Proposal">Proposal</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                            </>
                        )}
                    </select>
                </div>

                {isAdmin && (
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="assigned_rep_id">Assign to Sales Rep</Label>
                        <select
                            id="assigned_rep_id"
                            name="assigned_rep_id"
                            defaultValue={initialData?.assigned_rep_id || ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Unassigned</option>
                            {salesReps.map(rep => (
                                <option key={rep.id} value={rep.id}>{rep.name || rep.email}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        defaultValue={initialData?.notes}
                        placeholder="Add any additional context or initial notes here..."
                        rows={4}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => onCancel ? onCancel() : router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update Lead' : 'Create Lead')}
                </Button>
            </div>
        </form>
    )
}
