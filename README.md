# CookMoreBakeMore 🍳

A full-stack recipe management web app built using Lovable and Supabase.

🌐 Live: https://cookmorebakemore.lovable.app

---

## Overview

CookMoreBakeMore allows users to browse a curated collection of recipes across categories like veggies, meat, and desserts. 

Admins can manage the entire recipe catalogue directly from the UI without accessing the database.

---

## Tech Stack

- Frontend: Lovable (React-based builder)
- Backend & Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (Google OAuth + Email/Password)
- Hosting: Lovable

---

## Features

### For Visitors
- Browse recipes without logging in
- Categorised view (Veggies, Meat, Desserts)
- Clean card-based UI

### For Users
- Google OAuth login
- Email + password authentication

### For Admin
- Add recipes via UI
- Delete recipes via UI
- Role-based access control

---

## Data Pipeline

Recipe data was originally stored in Excel and transformed using Python into a structured CSV format before being inserted into the database.

Key transformations:
- Flattened multi-sheet Excel into rows
- Extracted categories and subtypes
- Normalized schema for database storage

---

## Security

- Row Level Security (RLS) policies implemented in Supabase
- Admin-only permissions for insert/update/delete
- Public read access for all users

---

## Future Improvements

- Search functionality
- Category filters
- User-specific interactions (ratings, favorites, notes)
- Mobile UI improvements

---

## Learnings

- Built a full-stack app using a low-code frontend + real backend
- Implemented authentication and role-based access control
- Designed a clean data pipeline from raw Excel to production database

---
