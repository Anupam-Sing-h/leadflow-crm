import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Not logged in" })
        }

        // Test reading users table for this user
        const { data: dbUser, error: userErr } = await supabase.from('users').select('*').eq('id', user.id).single()

        // Test inserting a dummy lead to see exact error
        const dummyLead = {
            name: "Test RLS",
            email: "test@test.com",
            company: "Test Corp",
            source: "Website",
            status: "New",
            assigned_rep_id: null,
            expected_value: 0
        }

        const { data: insertData, error: insertErr } = await supabase.from('leads').insert([dummyLead]).select()

        return NextResponse.json({
            user_auth: user,
            dbUser: dbUser,
            userErr: userErr,
            insertErr: insertErr
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message })
    }
}
