"use client"

import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { updateFollowupStatusAction } from '@/app/actions/followups'
import { useRouter } from 'next/navigation'

interface Followup {
    id: string
    due_date: string
    status: string
    lead_id: string
    created_at: string
    leads: {
        name: string
        company: string
        email: string
        phone: string
    }
}

interface FollowupsTableProps {
    followups: Followup[]
}

export default function FollowupsTable({ followups }: FollowupsTableProps) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleStatusChange = async (id: string, newStatus: string) => {
        setLoadingId(id)
        const res = await updateFollowupStatusAction(id, newStatus)
        setLoadingId(null)

        if (res.error) {
            alert(res.error)
        } else {
            router.refresh()
        }
    }

    if (!followups || followups.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card mt-6">
                No follow-ups scheduled. Check your leads to add new follow-ups.
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-card mt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Lead</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {followups.map((f) => {
                        const dueDate = new Date(f.due_date)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)

                        let dateStatus = 'upcoming'
                        if (dueDate.getTime() < today.getTime() && f.status === 'Pending') {
                            dateStatus = 'overdue'
                        } else if (dueDate.getTime() === today.getTime() && f.status === 'Pending') {
                            dateStatus = 'today'
                        }

                        return (
                            <TableRow key={f.id}>
                                <TableCell>
                                    <div className="font-medium">{f.leads?.name}</div>
                                    <div className="text-sm text-muted-foreground">{f.leads?.company || '-'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{f.leads?.email}</div>
                                    <div className="text-sm text-muted-foreground">{f.leads?.phone}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span>{dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {dateStatus === 'overdue' && (
                                            <Badge variant="destructive" className="text-[10px]">Overdue</Badge>
                                        )}
                                        {dateStatus === 'today' && (
                                            <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px]">Today</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={f.status === 'Completed' ? 'default' : 'outline'} className={f.status === 'Completed' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-100 text-yellow-800'}>
                                        {f.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {f.status === 'Pending' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={loadingId === f.id}
                                                onClick={() => handleStatusChange(f.id, 'Completed')}
                                                className="text-green-600 border-green-600 hover:bg-green-50"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Complete
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={loadingId === f.id}
                                                onClick={() => handleStatusChange(f.id, 'Pending')}
                                            >
                                                <Clock className="h-4 w-4 mr-1" />
                                                Reopen
                                            </Button>
                                        )}
                                        <Link href={`/rep/leads/${f.lead_id}`}>
                                            <Button variant="ghost" size="icon" title="View Lead">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
