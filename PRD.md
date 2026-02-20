Product Requirements Document (PRD): LeadFlow CRM
1. Project Overview

Goal: Develop a fully functional, web-based Customer Relationship Management (CRM) application that enables a company to store leads, assign them to sales representatives, track pipeline progression, schedule follow-ups, and view analytics dashboards . The application must feature a clean user interface and enforce strict role-based access control.
+1

2. User Roles & Permissions
The system requires two distinct user roles with specific permissions:

2.1 Administrator (Admin)
Manage user accounts (sales reps).

Import and export lead data.

Assign leads to specific sales representatives.

View all company pipelines and comprehensive analytics.

Edit and configure pipeline stages.

Create and configure system-wide email templates.

2.2 Sales Representative (Sales Rep)
View only their explicitly assigned leads.

Update lead statuses and progress them through the pipeline.

Add notes and log activities on assigned leads.

Schedule upcoming follow-ups.

Send template-based emails to leads.

Mark leads as finalized (Won/Lost).

3. Core Functional Requirements (Must Have)
3.1 Authentication & Routing
Standard signup and login flows.

"Forgot password" functionality.

Strict role-based routing to separate Admin and Sales Rep views.

3.2 Leads Management Module
Full CRUD functionality (Create, Edit, Delete, View details) for leads .


Required Lead Fields: Name, Email, Phone, Company, Location, Source (LinkedIn, Website, Referral, etc.), Status (New, Contacted, Qualified, Proposal, Negotiation, Won, Lost), Assigned Rep, Expected Value, Notes, Tags, and Created date .

3.3 Pipeline Board (Kanban)
Interactive drag-and-drop interface to move leads between stages.

Automatic calculation and display of total lead counts and cumulative value per stage.

"Quick edit" functionality for leads directly on the board.

3.4 Activities & Follow-ups
Capability to log notes and specific activities (Call, Email, WhatsApp, Meeting) inside a lead's profile .

Ability to set a follow-up date and time.

Auto-generated reminder lists categorized by "Today", "Upcoming", and "Overdue".

3.5 Search, Filters, & Data Management

Global Search: Query by name, company, or email.


Filters: Filter views by Stage, Assigned rep, Source, Date range, and Tags .


Data I/O: Import leads via CSV file and export leads based on active filters.

3.6 Communication (Email)
Admins can create reusable email templates.

Sales reps can utilize these templates to send emails to leads.

System must store an email log per lead. (Note for MVP: If real sending via Resend/SendGrid is not feasible in 24 hours, strictly log the "sent" action in the database ).
+1

3.7 Analytics Dashboards

Admin Dashboard: Displays total leads, leads by stage, won/lost counts, conversion rates, total pipeline value, and a top-performing reps leaderboard .


Sales Rep Dashboard: Displays personal assigned leads, follow-ups due today, personal won deals, and individual conversion rate .

4. User Interface (UI) Requirements
The application must include the following mapped pages:


Public Views: Landing page, Login, Signup, Forgot password .


Admin App: Dashboard, Leads List, Lead Details, Pipeline Board, Users management, Templates, Settings (for Pipeline stages) .


Sales Rep App: Dashboard, Assigned Leads List, Lead Details, Assigned Pipeline Board, Follow-ups list .

5. Technical Requirements & Database Schema

Frontend Stack: Next.js + Tailwind CSS.


Backend & Database: Supabase (PostgreSQL).


Authentication & Storage: Supabase Auth and Supabase Storage.
+1


Hosting: Vercel.


Minimum Database Tables: users, leads, lead_tags, lead_activities, lead_followups, pipeline_stages, email_templates, email_logs, and optionally files .

6. Acceptance Criteria (Definition of Done)
The project is considered complete when the following non-negotiable criteria are met:

No dead buttons or broken routes.

All CRUD operations are fully functional.

Role-based access is strictly enforced.

CSV import and Kanban drag-and-drop operate flawlessly.

Filters and search functions return accurate results.

The application is deployed with a live URL, admin test login credentials provided, and the database schema documented.

7. Optional Enhancement: AI Lead Scoring
To add impressive functionality, implement an AI scoring mechanism (0-100 scale) for leads .


Scoring Criteria: Points awarded if the lead has an email, phone number, company associated, a high-quality source, and based on their current pipeline stage .


UI Requirement: Display the calculated score and a brief reason for the score on the Lead Details page.