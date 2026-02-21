'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPipelineStage, updatePipelineStage, deletePipelineStage } from '@/app/actions/pipeline'
import Modal from '@/components/ui/Modal'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function PipelineStagesClient({ initialStages }: { initialStages: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editStage, setEditStage] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleCreate(formData: FormData) {
        setIsLoading(true)
        const res = await createPipelineStage(formData)
        setIsLoading(false)
        if (res.error) alert(res.error)
        else setIsCreateOpen(false)
    }

    async function handleUpdate(formData: FormData) {
        if (!editStage) return
        setIsLoading(true)
        const res = await updatePipelineStage(editStage.id, formData)
        setIsLoading(false)
        if (res.error) alert(res.error)
        else setEditStage(null)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this stage? Leads in this stage might lose their correct status representation.')) return
        setIsLoading(true)
        const res = await deletePipelineStage(id)
        setIsLoading(false)
        if (res.error) alert(res.error)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Stage
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Order Index</th>
                            <th className="px-4 py-3 font-medium">Stage Name</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {initialStages.map((stage) => (
                            <tr key={stage.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3">{stage.order_index}</td>
                                <td className="px-4 py-3 font-medium p-1">{stage.name}</td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setEditStage(stage)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(stage.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {initialStages.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                    No pipeline stages found. Add some to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Pipeline Stage">
                <form action={handleCreate} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Stage Name</Label>
                        <Input id="name" name="name" required placeholder="e.g. Needs Analysis" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order_index">Order Index</Label>
                        <Input id="order_index" name="order_index" type="number" required defaultValue={(initialStages.length + 1) * 10} />
                        <p className="text-xs text-muted-foreground">Used to sort columns on the board (e.g., 10, 20, 30).</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>Save</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!editStage} onClose={() => setEditStage(null)} title="Edit Pipeline Stage">
                {editStage && (
                    <form action={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Stage Name</Label>
                            <Input id="edit-name" name="name" required defaultValue={editStage.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-order_index">Order Index</Label>
                            <Input id="edit-order_index" name="order_index" type="number" required defaultValue={editStage.order_index} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setEditStage(null)} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    )
}
