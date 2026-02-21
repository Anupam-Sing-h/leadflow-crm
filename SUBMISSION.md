# Submission Details: LeadFlow CRM

## Deployed URLs
- **Live CRM URL:** `[INSERT VERCEL URL HERE]`

## Admin Test Login Credentials
- **Email:** `admin@example.com`
- **Password:** `password123`

*(Note: Please ensure you actually create this user in your Supabase Auth dashboard and manually update their `role` to `'Admin'` in the `users` table via the SQL Editor before submitting!)*

## Database Schema
The comprehensive database schema required to deploy LeadFlow CRM, including all table formations, foreign keys, enums, pipeline stage seed data, and Row Level Security (RLS) policies, has been meticulously documented and provided in the root directory file `database-schema.sql`.

## Included Functionalities:
- **Role-Based Access Control:** Strict Separation of Admin and Sales Rep functionalities.
- **Pipeline Kanban Board:** Drag and drop interactive visual board for lead progression.
- **Lead Tracking:** Follow-ups scheduling, activities logging, and comprehensive filters/search.
- **Data Export & Import:** CSV Import and exports based on applied filters.
- **Security:** Strict Supabase RLS implemented for data privacy.
