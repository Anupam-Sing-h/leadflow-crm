-- Run these commands in your Supabase SQL Editor to enforce Database-Level Security (RLS)
-- Note: It assumes 'role' is stored in auth.jwt() -> 'user_metadata' ->> 'role'

-- 1. Enable RLS on all relevant tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Create Admin Access Policies (Full Access to everything if role is Admin)

-- Admins can do everything on leads
CREATE POLICY "Admins have full access to leads" ON leads FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

CREATE POLICY "Admins have full access to activities" ON lead_activities FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

CREATE POLICY "Admins have full access to followups" ON lead_followups FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

CREATE POLICY "Admins have full access to lead tags" ON lead_tags FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

CREATE POLICY "Admins have full access to pipeline stages" ON pipeline_stages FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

CREATE POLICY "Admins have full access to email templates" ON email_templates FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

CREATE POLICY "Admins have full access to users" ON users FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

-- 3. Create Sales Rep Access Policies
-- Sales Reps can read and update leads assigned to them. They can also create leads (which via server action will be assigned to them).
CREATE POLICY "Sales Reps can read assigned leads" ON leads FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND assigned_rep_id = auth.uid()
);

CREATE POLICY "Sales Reps can update assigned leads" ON leads FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND assigned_rep_id = auth.uid()
);

CREATE POLICY "Sales Reps can insert leads" ON leads FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND assigned_rep_id = auth.uid()
);

-- Sales Reps can read/insert/update activities for their leads
CREATE POLICY "Sales Reps can access activities for assigned leads" ON lead_activities FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND
    lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid())
);

-- Sales Reps can read/insert/update followups for their leads
CREATE POLICY "Sales Reps can access followups for assigned leads" ON lead_followups FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND
    lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid())
);

-- Sales Reps can read/insert/update tags for their leads
CREATE POLICY "Sales Reps can access tags for assigned leads" ON lead_tags FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND
    lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid())
);

-- Sales Reps only need read access to pipeline stages and email templates
CREATE POLICY "Sales Reps can read pipeline stages" ON pipeline_stages FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep'
);

CREATE POLICY "Sales Reps can read email templates" ON email_templates FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep'
);

-- Sales Reps only need read access to users (to see names of other reps, if necessary, or just themselves)
CREATE POLICY "Sales Reps can read users" ON users FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep'
);
