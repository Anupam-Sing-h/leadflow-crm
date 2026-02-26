# 🚀 LeadFlow CRM

A full-stack, role-based Customer Relationship Management (CRM) platform built to track leads, manage sales pipelines, and analyze performance. Designed and developed during a "Vibe Coding" sprint using Next.js and Supabase.

## 🔗 Live Demo & Test Credentials

- **Live URL:** [ https://leadflow-crm-ltxn.vercel.app/ ]
- **Admin Test Account:** `admin1@gmail.com`, `admin2@gmail.com` / `654321`
- **Sales Rep Test Account:** `sales1@gmail.com`, `sales2@gmail.com` / `123456`

---

## 📄 Additional Documentation

Please refer to the following files included in the root of this repository for further details:
- **`SUBMISSION.md`**: Contains additional information regarding the assignment submission, design decisions, and the agentic AI workflows utilized during the 24-hour sprint.
- [cite_start]**`database-schema.sql`**: Contains the raw PostgreSQL schema used to build the Supabase backend, complete with tables and relations.

---

## ✨ Core Features

### 🔐 Role-Based Access Control (RBAC)
- [cite_start]Strict routing and data isolation between **Administrators** and **Sales Representatives** [cite: 12-32, 137].
- Reps only see and interact with their explicitly assigned leads.

### 📊 Interactive Pipeline Board
- [cite_start]Full Kanban-style drag-and-drop interface to move leads through customizable pipeline stages (New, Contacted, Qualified, etc.) [cite: 53-56].
- [cite_start]Dynamic stage value calculations and quick-edit functionality [cite: 55-56].

### 📇 Comprehensive Lead Management
- [cite_start]Full CRUD operations for lead tracking [cite: 34-36, 136].
- [cite_start]Activity logging (Calls, Emails, Meetings) and follow-up scheduling with overdue reminders [cite: 57-62].
- [cite_start]Global search by name/email/company and advanced filtering by stage, rep, and tags [cite: 66-73].
- [cite_start]Bulk CSV Import and Export capabilities [cite: 63-65, 138].

### 📈 Analytics Dashboards
- [cite_start]**Admin View:** High-level metrics including total pipeline value, conversion rates, won/lost ratios, and top-performing reps [cite: 80-86].
- [cite_start]**Rep View:** Individual performance tracking, assigned leads, and daily follow-up task lists [cite: 87-91].

### 🤖 AI Lead Scoring (Bonus Feature)
- [cite_start]Intelligent 0-100 scoring system evaluating lead quality based on data completeness (email, phone, company), source origin, and pipeline velocity [cite: 143-152].

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **UI Components:** Shadcn UI, `@dnd-kit/core` (for Kanban drag-and-drop).
- **Backend & Database:** Supabase (PostgreSQL), Server Actions.
- **Authentication:** Supabase Auth.
- **Deployment:** Vercel.

---

## 🗄️ Database Architecture

The PostgreSQL database (hosted on Supabase) utilizes Row Level Security (RLS). [cite_start]**For the exact table definitions, constraints, and relationships, please view the `database-schema.sql` file included in this repository.** The core tables consist of [cite: 115-124]:
- `users` (id, name, email, role)
- `leads` (id, fields, assigned_rep_id, status, expected_value)
- `pipeline_stages`
- `lead_tags` & `lead_activities`
- `lead_followups`
- `email_templates` & `email_logs`

---

## 🚀 Getting Started (Local Development)

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/leadflow-crm.git](https://github.com/yourusername/leadflow-crm.git)
   cd leadflow-crm
   
2. **Install dependencies:**
   ```bash
   npm install

3. **create .env file:**
   ```bash
    NEXT_PUBLIC_SUPABASE_URL = ""
    NEXT_PUBLIC_SUPABASE_ANON_KEY = ""
    SUPABASE_SERVICE_ROLE_KEY = ""

    RESEND_API_KEY= ""
    RESEND_EMAIL_FROM= "onboarding@resend.dev"

4. **Run:**
   ```bash
   npm run dev
