'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function bulkInsertLeads(leadsData: Array<Record<string, string>>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const role = user.user_metadata?.role as string

    // Map properties from CSV to database columns
    const insertData = leadsData.map((row) => ({
        name: row.name || 'Unknown Lead',
        email: row.email || null,
        phone: row.phone || null,
        company: row.company || null,
        location: row.location || null,
        source: row.source || 'Import',
        status: row.status || 'New',
        expected_value: parseFloat(row.expected_value || '0'),
        notes: row.notes || null,
        // If rep, assign to themselves, if admin, unassigned unless rep name provided (we'll just use their own ID or null for MVP)
        assigned_rep_id: role === 'SalesRep' ? user.id : user.id, // For admin, just assign to admin by default or leave null if possible. 
    }))

    const { data, error } = await supabase.from('leads').insert(insertData).select()

    if (error) {
        console.error('Error during bulk insertion:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/leads')
    revalidatePath('/rep/leads')
    revalidatePath('/admin/dashboard')
    revalidatePath('/rep/dashboard')

    return { success: true, count: data?.length || 0 }
}
