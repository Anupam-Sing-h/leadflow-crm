'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getAdminDashboardMetrics() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata?.role !== 'Admin') {
        redirect('/login')
    }

    // Fetch all leads
    const { data: leads, error } = await supabase.from('leads').select('status, expected_value, assigned_rep:users(name), assigned_rep_id')

    let totalLeads = 0;
    let won = 0;
    let lost = 0;
    let pipelineValue = 0;
    const stageCounts: Record<string, number> = {}
    const repWonCounts: Record<string, { id: string, name: string, wonCount: number }> = {}

    if (leads && !error) {
        totalLeads = leads.length;
        leads.forEach((lead: any) => {
            // Count by stage
            stageCounts[lead.status] = (stageCounts[lead.status] || 0) + 1;

            // Won/Lost and Pipeline value
            pipelineValue += Number(lead.expected_value || 0);
            if (lead.status === 'Won') {
                won++;
                // Track top reps
                const repId = lead.assigned_rep_id;
                const repName = lead.assigned_rep?.name || 'Unknown Rep';
                if (repId) {
                    if (!repWonCounts[repId]) {
                        repWonCounts[repId] = { id: repId, name: repName, wonCount: 0 }
                    }
                    repWonCounts[repId].wonCount++;
                }
            }
            if (lead.status === 'Lost') {
                lost++;
            }
        })
    }

    const leadsByStage = Object.entries(stageCounts).map(([name, value]) => ({ name, value }))
    const conversionRate = totalLeads ? ((won / totalLeads) * 100).toFixed(1) : '0.0'
    const topReps = Object.values(repWonCounts).sort((a, b) => b.wonCount - a.wonCount).slice(0, 5)

    return {
        totalLeads,
        wonContacts: won,
        lostContacts: lost,
        pipelineValue,
        conversionRate,
        leadsByStage,
        topReps
    }
}

export async function getRepDashboardMetrics() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata?.role !== 'SalesRep') {
        redirect('/login')
    }

    const userId = user.id;

    const { data: myLeads } = await supabase.from('leads').select('status').eq('assigned_rep_id', userId)
    let totalAssigned = 0;
    let won = 0;
    if (myLeads) {
        totalAssigned = myLeads.length;
        myLeads.forEach(lead => {
            if (lead.status === 'Won') won++;
        })
    }

    const conversionRate = totalAssigned ? ((won / totalAssigned) * 100).toFixed(1) : '0.0'

    // Fetch followups. RLS automatically restricts this to the rep's assigned leads.
    const { data: followups, error } = await supabase
        .from('lead_followups')
        .select(`
            id, due_date, status, lead_id,
            leads!inner (name, company)
        `)
        .eq('status', 'Pending')
        .order('due_date', { ascending: true })

    if (error) {
        console.error('Error fetching followups:', error)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayReminders: any[] = []
    const upcomingReminders: any[] = []
    const overdueReminders: any[] = []

    if (followups) {
        followups.forEach((f: any) => {
            const dueDate = new Date(f.due_date)
            dueDate.setHours(0, 0, 0, 0)

            if (dueDate.getTime() < today.getTime()) {
                overdueReminders.push(f)
            } else if (dueDate.getTime() === today.getTime()) {
                todayReminders.push(f)
            } else {
                upcomingReminders.push(f)
            }
        })
    }

    return {
        assignedLeadsCount: totalAssigned,
        wonDeals: won,
        conversionRate,
        reminders: {
            today: todayReminders,
            upcoming: upcomingReminders,
            overdue: overdueReminders
        }
    }
}
