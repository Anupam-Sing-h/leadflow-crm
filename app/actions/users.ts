'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Create a service role client to bypass RLS and manage auth users
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getUsers() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    const { data: users, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        return []
    }

    return users
}

export async function createUser(formData: FormData) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as string

    // Create user in auth schema
    const { error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role }
    })

    if (authError) {
        console.error('Error creating auth user:', authError)
        return { error: authError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function updateUserRole(id: string, newRole: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    // Update auth metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        user_metadata: { role: newRole }
    })

    if (authError) {
        console.error('Error updating auth metadata:', authError)
        return { error: authError.message }
    }

    // Update public.users just in case it doesn't automatically sync
    const { error: dbError } = await supabaseAdmin.from('users').update({ role: newRole }).eq('id', id)

    if (dbError) {
        console.error('Error updating public user:', dbError)
        return { error: dbError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function deleteUser(id: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    // Delete from auth (this should cascade to public.users if relations are set up, but let's be safe)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authError) {
        return { error: authError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}
