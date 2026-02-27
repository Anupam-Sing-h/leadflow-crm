'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser, updateUserRole, deleteUser } from '@/app/actions/users'
import Modal from '@/components/ui/Modal'
import { Plus, Edit, Trash2, User } from 'lucide-react'
import ProfileSection from '@/components/ProfileSection'

export default function UsersClient({ initialUsers, currentUser }: { initialUsers: any[], currentUser: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editUser, setEditUser] = useState<any | null>(null)
    const [viewUser, setViewUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleCreate(formData: FormData) {
        setIsLoading(true)
        const res = await createUser(formData)
        setIsLoading(false)
        if (res.error) alert(res.error)
        else setIsCreateOpen(false)
    }

    async function handleUpdate(formData: FormData) {
        if (!editUser) return
        setIsLoading(true)
        const role = formData.get('role') as string
        const res = await updateUserRole(editUser.id, role)
        setIsLoading(false)
        if (res.error) alert(res.error)
        else setEditUser(null)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this user?')) return
        setIsLoading(true)
        const res = await deleteUser(id)
        setIsLoading(false)
        if (res.error) alert(res.error)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage system access and roles for sales representatives.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create User
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {initialUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3 flex items-center gap-3">
                                    <div
                                        className="relative h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all flex items-center justify-center text-primary"
                                        onClick={() => setViewUser(user)}
                                        title="View Profile"
                                    >
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <User size={16} />
                                        )}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setEditUser(user)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(user.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {initialUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New User">
                <form action={handleCreate} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            name="role"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="SalesRep">Sales Rep</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>Create</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User Role">
                {editUser && (
                    <form action={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={editUser.name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <select
                                id="edit-role"
                                name="role"
                                defaultValue={editUser.role}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            >
                                <option value="SalesRep">Sales Rep</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setEditUser(null)} disabled={isLoading}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Profile">
                {viewUser && (
                    <div className="pt-2">
                        <ProfileSection user={viewUser} currentUser={currentUser} />
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                            <Button variant="outline" onClick={() => setViewUser(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
