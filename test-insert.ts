import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    console.log('Testing Lead Insertion...')

    const newLead = {
        name: 'Direct API Test Lead',
        email: 'test@example.com',
        source: 'Website',
        status: 'New',
        expected_value: 1234,
    }

    const { data, error } = await supabase.from('leads').insert([newLead]).select()

    if (error) {
        console.error('Insert Failed:', error)
    } else {
        console.log('Insert Success:', data)
    }
}

testInsert()
