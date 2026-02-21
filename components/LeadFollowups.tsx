'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createFollowup, updateFollowupStatus, createActivity } from '@/app/actions/leads'

interface Followup {
    id: string
    due_date: string
    status: string
    created_at: string
}

export function LeadFollowups({ followups }: { followups: Followup[] }) {
    const params = useParams()
    const router = useRouter()
    const leadId = params.id as string

    const [loading, setLoading] = useState(false)
    const [dueDate, setDueDate] = useState('')
    const [type, setType] = useState('Note')
    const [notes, setNotes] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!dueDate && !notes.trim()) return

        setLoading(true)

        // If notes are provided, create an activity
        if (notes.trim()) {
            const activityData = new FormData()
            activityData.append('type', type)
            activityData.append('notes', notes)
            await createActivity(leadId, activityData)
        }

        // If due date is provided, schedule a follow-up
        if (dueDate) {
            const followupData = new FormData()
            followupData.append('due_date', new Date(dueDate).toISOString())
            await createFollowup(leadId, followupData)
        }

        setLoading(false)
        setDueDate('')
        setNotes('')
        setType('Note')
        router.refresh()
    }

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending'
        const res = await updateFollowupStatus(id, newStatus)
        if (!res.error) {
            router.refresh()
        } else {
            alert(res.error)
        }
    }

    // Sort: Pending first, then by earliest due date
    const sortedFollowups = [...(followups || [])].sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === 'Pending' ? -1 : 1
        }
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Follow-ups</h3>

            <form onSubmit={handleSubmit} className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="Note">Note</option>
                            <option value="Call">Call</option>
                            <option value="Email">Email</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Meeting">Meeting</option>
                        </select>
                    </div>
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="due_date">Due Date & Time (Optional)</Label>
                        <input
                            type="datetime-local"
                            id="due_date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="activity_notes">Notes (Optional)</Label>
                    <Textarea
                        id="activity_notes"
                        placeholder="Log your activity or follow-up details here..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        {loading ? 'Processing...' : 'Schedule'}
                    </Button>
                </div>
            </form>

            <div className="space-y-4">
                {sortedFollowups.length > 0 ? (
                    sortedFollowups.map(followup => {
                        const isPending = followup.status === 'Pending'
                        const isOverdue = isPending && new Date(followup.due_date) < new Date()

                        return (
                            <div key={followup.id} className={`p-4 border rounded-lg flex items-start gap-4 ${isPending ? 'bg-card' : 'bg-muted/50 opacity-70'}`}>
                                <div className="mt-1">
                                    <input
                                        type="checkbox"
                                        checked={!isPending}
                                        onChange={() => toggleStatus(followup.id, followup.status)}
                                        className="w-5 h-5 cursor-pointer accent-primary"
                                        title="Mark as completed"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-primary'}`}>
                                            Schedule for: {new Date(followup.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${isPending ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                                            {followup.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                        No follow-ups scheduled.
                    </p>
                )}
            </div>
        </div>
    )
}
