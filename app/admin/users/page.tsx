import { getUsers } from '@/app/actions/users'
import UsersClient from './UsersClient'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'User Management | Admin',
};

export default async function AdminUsersPage() {
    const users = await getUsers()

    return (
        <UsersClient initialUsers={users || []} />
    )
}
