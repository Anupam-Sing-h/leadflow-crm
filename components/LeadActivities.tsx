'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createActivity } from '@/app/actions/leads'

interface Activity {
    id: string
    type: string
    notes: string
    created_at: string
}

export function LeadActivities({ activities }: { activities: Activity[] }) {
    const params = useParams()
    const router = useRouter()
    const leadId = params.id as string

    const [loading, setLoading] = useState(false)
    const [type, setType] = useState('Note')
    const [notes, setNotes] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!notes.trim()) return

        setLoading(true)
        const formData = new FormData()
        formData.append('type', type)
        formData.append('notes', notes)

        const res = await createActivity(leadId, formData)
        setLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            setNotes('')
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Activity Log</h3>

            <div className="space-y-4">
                {activities && activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.id} className="p-4 border rounded-lg bg-card">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm text-primary">{activity.type}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(activity.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{activity.notes}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                        No activities logged yet.
                    </p>
                )}
            </div>
        </div>
    )
}
