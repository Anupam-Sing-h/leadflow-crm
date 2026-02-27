import { getUsers } from '@/app/actions/users'
import UsersClient from './UsersClient'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'User Management | Admin',
};

export default async function AdminUsersPage() {
    const users = await getUsers()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const currentUser = user ? { id: user.id, role: user.user_metadata?.role || 'Admin' } : null

    return (
        <UsersClient initialUsers={users || []} currentUser={currentUser} />
    )
}
