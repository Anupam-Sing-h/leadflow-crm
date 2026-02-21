import { getLeads } from '@/app/actions/leads'
import LeadsTable from '@/components/LeadsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { ImportExportButtons } from '@/components/ImportExportButtons'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
    const leads = await getLeads()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
                    <p className="text-muted-foreground mt-1">View and manage all company leads.</p>
                </div>
                <div className="flex items-center gap-2">
                    <ImportExportButtons leads={leads || []} />
                    <Link href="/admin/leads/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Lead
                        </Button>
                    </Link>
                </div>
            </div>

            <LeadsTable leads={leads || []} basePath="/admin" />
        </div>
    )
}
