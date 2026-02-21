'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getRepFollowups() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'SalesRep') {
        redirect('/login')
    }

    // RLS automatically restricts this to the rep's assigned leads.
    const { data: followups, error } = await supabase
        .from('lead_followups')
        .select(`
            id, due_date, status, lead_id, created_at,
            leads!inner (name, company, email, phone)
        `)
        .order('due_date', { ascending: true })

    if (error) {
        console.error('Error fetching rep followups:', error)
        return []
    }

    return followups
}

export async function updateFollowupStatusAction(followupId: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string
    if (role === 'SalesRep') {
        const { data: existing } = await supabase
            .from('lead_followups')
            .select('leads!inner(assigned_rep_id)')
            .eq('id', followupId)
            .single()

        if (!existing || !existing.leads || (existing.leads as any).assigned_rep_id !== user.id) {
            return { error: 'Unauthorized' }
        }
    }

    const { error } = await supabase.from('lead_followups').update({ status }).eq('id', followupId)

    if (error) {
        console.error('Error updating follow-up:', error)
        return { error: error.message }
    }

    revalidatePath('/rep/followups')
    revalidatePath('/rep/dashboard')

    return { success: true }
}
