'use server'

import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function updateProfile(userId: string, formData: FormData) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || (user.id !== userId && user.user_metadata?.role !== 'Admin')) {
        return { error: 'Unauthorized to update this profile' }
    }

    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const file = formData.get('avatar') as File | null

    let avatarUrl = undefined

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError)
            return { error: 'Failed to upload avatar: ' + uploadError.message }
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(fileName)

        avatarUrl = publicUrlData.publicUrl
    }

    // Permission check for fields
    const isSelf = user.id === userId
    const isAdmin = user.user_metadata?.role === 'Admin'

    // Prepare updates
    const metadataUpdate: any = {}
    if (name && isSelf) metadataUpdate.name = name
    if (avatarUrl && isSelf) metadataUpdate.avatar_url = avatarUrl
    if (role && isAdmin) metadataUpdate.role = role

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: metadataUpdate
    })

    if (authError) {
        console.error('Error updating auth metadata:', authError)
        return { error: authError.message }
    }

    const dbUpdate: any = {}
    if (name && isSelf) dbUpdate.name = name
    if (avatarUrl && isSelf) dbUpdate.avatar_url = avatarUrl
    if (role && isAdmin) dbUpdate.role = role

    if (Object.keys(dbUpdate).length > 0) {
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .update(dbUpdate)
            .eq('id', userId)

        if (dbError) {
            console.error('Error updating public user:', dbError)
            return { error: dbError.message }
        }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
