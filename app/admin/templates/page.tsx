import { getTemplates, deleteTemplate } from '@/app/actions/templates'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function TemplatesPage() {
    const templates = await getTemplates()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
                    <p className="text-muted-foreground mt-1">Manage reusable email templates for your sales reps.</p>
                </div>
                <Link href="/admin/templates/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Preview</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates.length > 0 ? (
                            templates.map((tmpl) => (
                                <TableRow key={tmpl.id}>
                                    <TableCell className="font-medium">{tmpl.name}</TableCell>
                                    <TableCell>{tmpl.subject}</TableCell>
                                    <TableCell className="text-muted-foreground max-w-md truncate">
                                        {tmpl.body}
                                    </TableCell>
                                    <TableCell>{new Date(tmpl.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/templates/${tmpl.id}/edit`}>
                                                <Button variant="ghost" size="icon" title="Edit Template">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await deleteTemplate(tmpl.id);
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900" title="Delete Template" type="submit">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No templates found. Create your first email template.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
