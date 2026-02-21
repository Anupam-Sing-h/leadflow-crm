'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getLeads() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role as string

    let query = supabase.from('leads').select('*, assigned_rep:users(name), tags:lead_tags(tag_name)').order('created_at', { ascending: false })

    if (role === 'SalesRep') {
        query = query.eq('assigned_rep_id', user.id)
    }

    const { data: leads, error } = await query

    if (error) {
        console.error('Error fetching leads:', error)
        return []
    }

    return leads
}

export async function getLead(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const role = user.user_metadata?.role as string

    let query = supabase
        .from('leads')
        .select('*, assigned_rep:users(name), tags:lead_tags(tag_name), activities:lead_activities(*, type, notes, created_at), followups:lead_followups(*, due_date, status, created_at)')
        .eq('id', id)

    if (role === 'SalesRep') {
        query = query.eq('assigned_rep_id', user.id)
    }

    const { data: lead, error } = await query.single()

    if (error) {
        console.error('Error fetching lead:', error)
        return null
    }

    return lead
}

export async function createLead(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string

    const assignedRepIdInput = formData.get('assigned_rep_id') as string
    const finalAssignedRepId = role === 'SalesRep' ? user.id : (assignedRepIdInput ? assignedRepIdInput : user.id)

    const newLead: any = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company: formData.get('company') as string,
        location: formData.get('location') as string,
        source: formData.get('source') as string || 'Website',
        status: formData.get('status') as string || 'New',
        assigned_rep_id: finalAssignedRepId,
        expected_value: formData.get('expected_value') ? parseFloat(formData.get('expected_value') as string) : 0,
        notes: formData.get('notes') as string,
    }

    if (formData.get('created_at')) {
        newLead.created_at = new Date(formData.get('created_at') as string).toISOString()
    }

    const { data, error } = await supabase.from('leads').insert([newLead]).select().single()

    if (error) {
        console.error('Error creating lead:', error)
        return { error: error.message }
    }

    // Tags handling
    const tagsString = formData.get('tags') as string
    if (tagsString) {
        const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean)
        if (tags.length > 0) {
            const tagsData = tags.map(tag => ({ lead_id: data.id, tag_name: tag }))
            await supabase.from('lead_tags').insert(tagsData)
        }
    }

    revalidatePath('/admin/leads')
    revalidatePath('/rep/leads')
    revalidatePath('/admin/dashboard')
    revalidatePath('/rep/dashboard')

    return { success: true, id: data.id }
}

export async function updateLead(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string

    if (role === 'SalesRep') {
        const { data: existing } = await supabase.from('leads').select('assigned_rep_id').eq('id', id).single()
        if (!existing || existing.assigned_rep_id !== user.id) {
            return { error: 'Unauthorized: You can only update your assigned leads.' }
        }
    }

    const updates: Record<string, any> = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company: formData.get('company') as string,
        location: formData.get('location') as string,
        source: formData.get('source') as string,
        status: formData.get('status') as string,
        assigned_rep_id: role === 'SalesRep' ? undefined : (formData.get('assigned_rep_id') as string || null),
        expected_value: formData.get('expected_value') ? parseFloat(formData.get('expected_value') as string) : 0,
        notes: formData.get('notes') as string,
    }

    if (formData.get('created_at')) {
        updates.created_at = new Date(formData.get('created_at') as string).toISOString()
    }

    // Remove undefined mapping
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key])

    const { error } = await supabase.from('leads').update(updates).eq('id', id)

    if (error) {
        console.error('Error updating lead:', error)
        return { error: error.message }
    }

    // Tags handling for edit
    const tagsString = formData.get('tags') as string
    if (tagsString !== null) {
        const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean)
        await supabase.from('lead_tags').delete().eq('lead_id', id)
        if (tags.length > 0) {
            const tagsData = tags.map(tag => ({ lead_id: id, tag_name: tag }))
            await supabase.from('lead_tags').insert(tagsData)
        }
    }

    revalidatePath('/admin/leads')
    revalidatePath('/rep/leads')
    revalidatePath(`/admin/leads/${id}`)
    revalidatePath(`/rep/leads/${id}`)
    revalidatePath('/admin/dashboard')
    revalidatePath('/rep/dashboard')

    return { success: true }
}

export async function updateLeadStatus(id: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string

    if (role === 'SalesRep') {
        const { data: existing } = await supabase.from('leads').select('assigned_rep_id').eq('id', id).single()
        if (!existing || existing.assigned_rep_id !== user.id) {
            return { error: 'Unauthorized: You can only update your assigned leads.' }
        }
    }

    const { error } = await supabase.from('leads').update({ status }).eq('id', id)

    if (error) {
        console.error('Error updating lead status:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/pipeline')
    revalidatePath('/rep/pipeline')
    revalidatePath('/admin/leads')
    revalidatePath('/rep/leads')
    revalidatePath('/admin/dashboard')
    revalidatePath('/rep/dashboard')

    return { success: true }
}

export async function deleteLead(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string
    if (role === 'SalesRep') {
        return { error: 'Unauthorized: Only Admins can delete leads.' }
    }

    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) {
        console.error('Error deleting lead:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/leads')
    revalidatePath('/rep/leads')
    revalidatePath('/admin/dashboard')
    revalidatePath('/rep/dashboard')

    return { success: true }
}

export async function getSalesReps() {
    const supabase = await createClient()

    // Only fetching sales reps for assignments
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'SalesRep')

    if (error) {
        console.error('Error fetching sales reps:', error)
        return []
    }

    return users
}

export async function createActivity(leadId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string
    if (role === 'SalesRep') {
        const { data: existing } = await supabase.from('leads').select('assigned_rep_id').eq('id', leadId).single()
        if (!existing || existing.assigned_rep_id !== user.id) return { error: 'Unauthorized' }
    }

    const newActivity = {
        lead_id: leadId,
        type: formData.get('type') as string,
        notes: formData.get('notes') as string
    }

    const { error } = await supabase.from('lead_activities').insert([newActivity])

    if (error) {
        console.error('Error adding activity:', error)
        return { error: error.message }
    }

    return { success: true }
}

export async function createFollowup(leadId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string
    if (role === 'SalesRep') {
        const { data: existing } = await supabase.from('leads').select('assigned_rep_id').eq('id', leadId).single()
        if (!existing || existing.assigned_rep_id !== user.id) return { error: 'Unauthorized' }
    }

    const newFollowup = {
        lead_id: leadId,
        due_date: formData.get('due_date') as string, // ISO String
        status: 'Pending'
    }

    const { error } = await supabase.from('lead_followups').insert([newFollowup])

    if (error) {
        console.error('Error adding follow-up:', error)
        return { error: error.message }
    }

    return { success: true }
}

export async function updateFollowupStatus(followupId: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string
    if (role === 'SalesRep') {
        // Need to join leads to verify ownership
        const { data: existing } = await supabase
            .from('lead_followups')
            .select('leads(assigned_rep_id)')
            .eq('id', followupId)
            .single()

        // Type safety: depending on setup leads might be an array or object. Let's assume single relation.
        if (!existing || !existing.leads || (existing.leads as any).assigned_rep_id !== user.id) {
            return { error: 'Unauthorized' }
        }
    }

    const { error } = await supabase.from('lead_followups').update({ status }).eq('id', followupId)

    if (error) {
        console.error('Error updating follow-up:', error)
        return { error: error.message }
    }

    return { success: true }
}
