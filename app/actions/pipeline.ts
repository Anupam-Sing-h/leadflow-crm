'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPipelineStages() {
    const supabase = await createClient()

    const { data: stages, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('order_index', { ascending: true })

    if (error) {
        console.error('Error fetching pipeline stages:', error)
        return []
    }

    return stages
}

export async function createPipelineStage(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    const name = formData.get('name') as string
    const order_index = parseInt(formData.get('order_index') as string, 10) || 0

    const { error } = await supabase
        .from('pipeline_stages')
        .insert([{ name, order_index }])

    if (error) {
        console.error('Error creating pipeline stage:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/settings/pipeline')
    revalidatePath('/admin/pipeline')
    revalidatePath('/rep/pipeline')
    return { success: true }
}

export async function updatePipelineStage(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    const name = formData.get('name') as string
    const order_index = parseInt(formData.get('order_index') as string, 10) || 0

    const { error } = await supabase
        .from('pipeline_stages')
        .update({ name, order_index })
        .eq('id', id)

    if (error) {
        console.error('Error updating pipeline stage:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/settings/pipeline')
    revalidatePath('/admin/pipeline')
    revalidatePath('/rep/pipeline')
    return { success: true }
}

export async function deletePipelineStage(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata?.role !== 'Admin') {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('pipeline_stages')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting pipeline stage:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/settings/pipeline')
    revalidatePath('/admin/pipeline')
    revalidatePath('/rep/pipeline')
    return { success: true }
}
