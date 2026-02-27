'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/app/actions/profile'
import { User, Camera, Loader2 } from 'lucide-react'

interface ProfileSectionProps {
    user: {
        id: string
        name: string
        email: string
        role: string
        avatar_url?: string | null
    }
    currentUser: {
        id: string
        role: string
    }
}

export default function ProfileSection({ user, currentUser }: ProfileSectionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(user.name || '')
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url || null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const isSelf = currentUser.id === user.id
    const isAdmin = currentUser.role === 'Admin'
    const canEditNameAvatar = isSelf
    const canEditRole = !isSelf && isAdmin
    const canEditAnything = canEditNameAvatar || canEditRole

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canEditNameAvatar) return
        const file = e.target.files?.[0]
        if (file) {
            const tempUrl = URL.createObjectURL(file)
            setAvatarPreview(tempUrl)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const res = await updateProfile(user.id, formData)

        setIsLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            setIsEditing(false)
        }
    }

    const renderAvatar = (url: string | null | undefined, size: 'sm' | 'lg' = 'lg') => {
        const dimensions = size === 'lg' ? 'h-24 w-24' : 'h-10 w-10'
        if (url) {
            return (
                <div className={`relative ${dimensions} rounded-full overflow-hidden bg-muted flex-shrink-0 border shadow-sm`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={user.name} className="object-cover w-full h-full" />
                </div>
            )
        }
        return (
            <div className={`relative ${dimensions} rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border shadow-sm`}>
                <User size={size === 'lg' ? 40 : 20} />
            </div>
        )
    }

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Profile</CardTitle>
                {!isEditing && canEditAnything && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        {canEditRole && !canEditNameAvatar ? 'Edit Role' : 'Edit Profile'}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {!isEditing ? (
                    <div className="flex items-center gap-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderAvatar(user.avatar_url, 'lg')}
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">{user.name}</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary mt-2">
                                {user.role}
                            </span>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 py-2 animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-col items-center gap-3">
                                <Label className="text-muted-foreground">Profile Picture</Label>
                                <div
                                    className={`relative group ${canEditNameAvatar ? 'cursor-pointer' : ''}`}
                                    onClick={() => canEditNameAvatar && fileInputRef.current?.click()}
                                >
                                    {renderAvatar(avatarPreview, 'lg')}
                                    {canEditNameAvatar && (
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    disabled={!canEditNameAvatar}
                                />
                                {canEditNameAvatar && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                                        Upload Photo
                                    </Button>
                                )}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={!canEditNameAvatar}
                                        className={!canEditNameAvatar ? "bg-muted" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user.email} disabled className="bg-muted" />
                                    {canEditNameAvatar && <p className="text-xs text-muted-foreground">Contact support to change email.</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    {canEditRole ? (
                                        <select
                                            id="role"
                                            name="role"
                                            defaultValue={user.role}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <option value="SalesRep">Sales Rep</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    ) : (
                                        <Input id="role" name="role" value={user.role} disabled className="bg-muted" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false)
                                    setAvatarPreview(user.avatar_url ?? null)
                                    setName(user.name)
                                }}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
