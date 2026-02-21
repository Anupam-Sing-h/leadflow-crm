"use client"

import React, { useState, useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteLead } from '@/app/actions/leads'

interface Lead {
    id: string
    name: string
    email: string
    company: string
    phone: string
    status: string
    source: string
    expected_value: number
    created_at: string
    assigned_rep: { name: string } | null
    tags: { tag_name: string }[]
}

interface LeadsTableProps {
    leads: Lead[]
    basePath: string // e.g., '/admin' or '/rep'
}

export default function LeadsTable({ leads, basePath }: LeadsTableProps) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [stageFilter, setStageFilter] = useState('All')
    const [repFilter, setRepFilter] = useState('All')
    const [sourceFilter, setSourceFilter] = useState('All')
    const [tagFilter, setTagFilter] = useState('All')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    // Derive filter options based on available data
    const stages = ['All', ...Array.from(new Set(leads.map(l => l.status)))]
    const sources = ['All', ...Array.from(new Set(leads.map(l => l.source)))]
    const reps = ['All', ...Array.from(new Set(leads.map(l => l.assigned_rep?.name).filter(Boolean))) as string[]]
    const uniqueTags = ['All', ...Array.from(new Set(leads.flatMap(l => l.tags?.map(t => t.tag_name) || [])))]

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch = (lead.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
                (lead.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
                (lead.company?.toLowerCase() || '').includes(search.toLowerCase())

            const matchesStage = stageFilter === 'All' || lead.status === stageFilter
            const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter
            const matchesRep = repFilter === 'All' || lead.assigned_rep?.name === repFilter
            const matchesTag = tagFilter === 'All' || lead.tags?.some(t => t.tag_name === tagFilter)

            let matchesDate = true
            if (dateFrom) {
                matchesDate = matchesDate && new Date(lead.created_at) >= new Date(dateFrom)
            }
            if (dateTo) {
                const toDate = new Date(dateTo)
                toDate.setHours(23, 59, 59, 999)
                matchesDate = matchesDate && new Date(lead.created_at) <= toDate
            }

            return matchesSearch && matchesStage && matchesSource && matchesRep && matchesTag && matchesDate
        })
    }, [leads, search, stageFilter, sourceFilter, repFilter, tagFilter, dateFrom, dateTo])

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            const res = await deleteLead(id)
            if (res.error) {
                alert(res.error)
            } else {
                router.refresh()
            }
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return 'bg-blue-100 text-blue-800'
            case 'contacted': return 'bg-yellow-100 text-yellow-800'
            case 'qualified': return 'bg-purple-100 text-purple-800'
            case 'proposal': return 'bg-orange-100 text-orange-800'
            case 'won': return 'bg-green-100 text-green-800'
            case 'lost': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                <Input
                    placeholder="Search by name, email, company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    title="Filter by Stage"
                >
                    {stages.map(s => <option key={s} value={s}>{s === 'All' ? 'All Stages' : s}</option>)}
                </select>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={repFilter}
                    onChange={(e) => setRepFilter(e.target.value)}
                    title="Filter by Assigned Rep"
                >
                    {reps.map(r => <option key={r} value={r}>{r === 'All' ? 'All Reps' : r}</option>)}
                </select>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    title="Filter by Source"
                >
                    {sources.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sources' : s}</option>)}
                </select>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    title="Filter by Tags"
                >
                    {uniqueTags.map(t => <option key={t} value={t}>{t === 'All' ? 'All Tags' : t}</option>)}
                </select>
                <div className="flex gap-2 items-center">
                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-[120px] text-xs h-10" title="From Date" />
                    <span className="text-muted-foreground">-</span>
                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-[120px] text-xs h-10" title="To Date" />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rep</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.length > 0 ? (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell>
                                        <div className="font-medium">{lead.name}</div>
                                        <div className="text-sm text-gray-500">{lead.email}</div>
                                    </TableCell>
                                    <TableCell>{lead.company || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(lead.status)}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{lead.assigned_rep?.name || 'Unassigned'}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.expected_value || 0)}
                                    </TableCell>
                                    <TableCell>{lead.source || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {lead.tags?.map((t, i) => (
                                                <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">{t.tag_name}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`${basePath}/leads/${lead.id}`}>
                                                <Button variant="ghost" size="icon" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`${basePath}/leads/${lead.id}/edit`}>
                                                <Button variant="ghost" size="icon" title="Edit Lead">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {basePath === '/admin' && (
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900" onClick={() => handleDelete(lead.id)} title="Delete Lead">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    No leads found. Use the filters or create a new lead.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
