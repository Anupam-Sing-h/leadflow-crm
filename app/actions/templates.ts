'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTemplates() {
    const supabase = await createClient()
    const { data: templates, error } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false })
    if (error) console.error('Error fetching templates:', error)
    return templates || []
}

export async function getTemplate(id: string) {
    const supabase = await createClient()
    const { data: template, error } = await supabase.from('email_templates').select('*').eq('id', id).single()
    if (error) console.error('Error fetching template:', error)
    return template
}

export async function createTemplate(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Only Admin should theoretically be able to do this based on RLS, but we'll let RLS handle security.
    const newTemplate = {
        name: formData.get('name') as string,
        subject: formData.get('subject') as string,
        body: formData.get('body') as string
    }

    const { error } = await supabase.from('email_templates').insert([newTemplate])
    if (error) return { error: error.message }

    revalidatePath('/admin/templates')
    return { success: true }
}

export async function updateTemplate(id: string, formData: FormData) {
    const supabase = await createClient()
    const updates = {
        name: formData.get('name') as string,
        subject: formData.get('subject') as string,
        body: formData.get('body') as string,
    }

    const { error } = await supabase.from('email_templates').update(updates).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin/templates')
    revalidatePath(`/admin/templates/${id}/edit`)
    return { success: true }
}

export async function deleteTemplate(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('email_templates').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin/templates')
    return { success: true }
}
