-- ==========================================
-- LEADFLOW CRM: DATABASE SCHEMA & RLS
-- ==========================================
-- Run this script in your Supabase SQL Editor.

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'SalesRep', -- 'Admin' or 'SalesRep'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Pipeline Stages Table
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial Pipeline Stages
INSERT INTO pipeline_stages (name, order_index) VALUES
('New', 1),
('Contacted', 2),
('Qualified', 3),
('Proposal', 4),
('Negotiation', 5),
('Won', 6),
('Lost', 7)
ON CONFLICT (name) DO NOTHING;

-- 3. Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    location TEXT,
    source TEXT,
    status TEXT REFERENCES pipeline_stages(name) ON UPDATE CASCADE ON DELETE SET NULL,
    assigned_rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    expected_value NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Lead Tags
CREATE TABLE IF NOT EXISTS lead_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Lead Activities Table
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- Call, Email, WhatsApp, Meeting
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Lead Followups Table
CREATE TABLE IF NOT EXISTS lead_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'Pending', -- Pending, Completed
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    rep_id UUID REFERENCES users(id) ON DELETE SET NULL,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all relevant tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ADMIN POLICIES (Full Access to everything if role is Admin)
CREATE POLICY "Admins have full access to leads" ON leads FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to activities" ON lead_activities FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to followups" ON lead_followups FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to lead tags" ON lead_tags FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to pipeline stages" ON pipeline_stages FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to email templates" ON email_templates FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to email logs" ON email_logs FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');
CREATE POLICY "Admins have full access to users" ON users FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- SALES REP POLICIES
-- Leads
CREATE POLICY "Sales Reps can read assigned leads" ON leads FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND assigned_rep_id = auth.uid());
CREATE POLICY "Sales Reps can update assigned leads" ON leads FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND assigned_rep_id = auth.uid());
CREATE POLICY "Sales Reps can insert leads" ON leads FOR INSERT WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND assigned_rep_id = auth.uid());

-- Activities
CREATE POLICY "Sales Reps can access activities for assigned leads" ON lead_activities FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid()));

-- Followups
CREATE POLICY "Sales Reps can access followups for assigned leads" ON lead_followups FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid()));

-- Tags
CREATE POLICY "Sales Reps can access tags for assigned leads" ON lead_tags FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid()));

-- Read-only Tables for Sales Reps
CREATE POLICY "Sales Reps can read pipeline stages" ON pipeline_stages FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep');
CREATE POLICY "Sales Reps can read email templates" ON email_templates FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep');
CREATE POLICY "Sales Reps can read users" ON users FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep');
CREATE POLICY "Sales Reps can see email logs of their leads" ON email_logs FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep' AND lead_id IN (SELECT id FROM leads WHERE assigned_rep_id = auth.uid()));
CREATE POLICY "Sales Reps can insert email logs" ON email_logs FOR INSERT WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'SalesRep');
