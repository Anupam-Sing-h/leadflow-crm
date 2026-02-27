'use client'

import React, { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import ProfileSection from '@/components/ProfileSection'
import { createClient } from '@/utils/supabase/client'

interface DashboardHeaderProps {
    title: string
    description?: string
    userProfile: {
        id: string
        name: string
        email: string
        role: string
        avatar_url?: string | null
    }
}

export default function DashboardHeader({ title, description, userProfile }: DashboardHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/50 transition-all focus:outline-none"
                >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 border flex items-center justify-center text-primary shadow-sm hover:shadow-md transition-all">
                        {userProfile.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={userProfile.avatar_url} alt={userProfile.name} className="object-cover w-full h-full" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="py-1 border rounded-md" role="menu" aria-orientation="vertical">
                            <div className="px-4 py-2 border-b text-sm">
                                <p className="font-semibold text-foreground truncate">{userProfile.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false)
                                    setIsProfileModalOpen(true)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                My Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors border-t"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="My Profile">
                <div className="pt-2">
                    {/* The ProfileSection itself has a Card wrapper, but inside a modal it's fine. We pass currentUser correctly to allow self-editing */}
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <ProfileSection
                            user={userProfile}
                            currentUser={{ id: userProfile.id, role: userProfile.role }}
                        />
                    </div>
                    <div className="flex justify-end mt-4 pt-4 border-t">
                        <button
                            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
                            onClick={() => setIsProfileModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
