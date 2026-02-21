'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendEmail(leadId: string, subject: string, body: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Call Resend API directly via fetch
    // Next.js server actions sometimes have stale closures for process.env.
    // Using simple assignment but adding a fallback to the public env or a hardcoded string just for testing if needed.
    const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY
    const resendFromEmail = process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev'

    if (!resendApiKey) {
        return { error: "Resend API key not configured." }
    }

    try {
        // Fetch the lead's email
        const { data: leadData } = await supabase.from('leads').select('email').eq('id', leadId).single()
        if (!leadData || !leadData.email) return { error: "Lead does not have an email address." }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: resendFromEmail,
                to: [leadData.email],
                subject: subject,
                html: `<p>${body.replace(/\n/g, '<br/>')}</p>`
            })
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Resend API Error Body:', errorText)

            try {
                const errorJson = JSON.parse(errorText)
                return { error: `Resend Error: ${errorJson.message || errorJson.name || errorText}` }
            } catch (e) {
                return { error: `Failed to send email via Resend: ${res.status} ${res.statusText}` }
            }
        }
    } catch (e: any) {
        console.error('Email send network/parsing error:', e)
        return { error: `Failed to send email: ${e.message}` }
    }

    // Log it to email_logs and create an activity:
    const newLog = {
        lead_id: leadId,
        subject,
        body,
        sent_by: user.id
    }

    const { error: logError } = await supabase.from('email_logs').insert([newLog])
    if (logError) return { error: logError.message }

    // Also create an activity for better visibility in the timeline
    const newActivity = {
        lead_id: leadId,
        type: 'Email',
        notes: `Sent Email: ${subject}`
    }

    await supabase.from('lead_activities').insert([newActivity])

    revalidatePath(`/admin/leads/${leadId}`)
    revalidatePath(`/rep/leads/${leadId}`)

    return { success: true }
}
