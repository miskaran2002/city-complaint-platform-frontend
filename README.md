# 🏙️ Smart City — Complaint & Service Request Platform

A full-stack civic-engagement platform that lets citizens report city issues (potholes, water leakage, street-light outages, illegal dumping, mosquito outbreaks, etc.), tracks them through a structured resolution workflow across city departments, and lets citizens pay an optional emergency priority fee through **bKash** or **Stripe** to fast-track urgent issues.

Built as a 5-day full-stack assignment project: **Node.js / Express / TypeScript / PostgreSQL / Prisma** backend + **Next.js (App Router) / Tailwind CSS** frontend.

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Live Links](#-live-links)
4. [Getting Started (Local Setup)](#-getting-started-local-setup)
5. [Environment Variables](#-environment-variables)
6. [User Roles & Permissions](#-user-roles--permissions)
7. [Navbar & Sidebar Structure](#-navbar--sidebar-structure)
8. [Complete Route Map (All Pages)](#-complete-route-map-all-pages)
9. [Complaint Lifecycle / Status Workflow](#-complaint-lifecycle--status-workflow)
10. [Payment Flow (bKash + Stripe)](#-payment-flow-bkash--stripe)
11. [API Reference Summary](#-api-reference-summary)
12. [Folder Structure](#-folder-structure)
13. [Screenshots](#-screenshots)

---

## 🧭 Project Overview

Citizens currently have no centralized, trackable way to report civic issues — complaints get lost in phone calls or scattered paperwork, with no accountability for resolution time. **Smart City** digitizes this entire lifecycle:

1. A **Citizen** submits a complaint with a category, location, description, and optional photo.
2. The complaint is automatically linked to the correct **Department** based on its category.
3. A **Department Manager** or **City Admin** assigns a **Technician** / **Department Staff** member to handle it.
4. The assigned staff updates the complaint's status as work progresses (`PENDING → ASSIGNED → IN_PROGRESS → RESOLVED`).
5. Every status change is recorded in an **Audit Log**, so there is a full accountability trail.
6. Once resolved, the citizen can leave **feedback** (rating + comment).
7. At any point, a citizen can pay a one-time fee (via **bKash** or **Stripe**) to mark their complaint as **EMERGENCY** priority, fast-tracking its resolution.

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL (Prisma Postgres) |
| ORM | Prisma |
| Auth | JWT (access + refresh tokens) + Google OAuth 2.0 (Social Login) |
| Validation | Zod |
| Payments | bKash Tokenized Checkout (sandbox) + Stripe Checkout |
| File Uploads | Multer + Cloudinary |
| Security | Helmet, CORS, express-rate-limit |
| Deployment | Vercel (Serverless Functions) |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand (with persist) |
| HTTP Client | Axios (with interceptors) |
| Forms | Controlled React forms |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| **Live Backend API** | https://city-compliant-and-service.vercel.app |
| **Live Frontend** | _(add your deployed frontend URL here)_ |
| **Backend GitHub Repo** | https://github.com/miskaran2002/city-complaint-platform |
| **Postman API Documentation** | https://documenter.getpostman.com/view/54804418/2sBYAytUVw |
| **Demo Video** | _(add your video link here)_ |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+ (ideally v22.13+)
- PostgreSQL database (local or cloud — Prisma Postgres / Neon / Supabase)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/miskaran2002/city-complaint-platform.git
cd city-complaint-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` → `.env` and fill in the values (see [Environment Variables](#-environment-variables) below).

### 4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```
Backend runs on `http://localhost:5000` by default.

### 6. Frontend setup (separate repo/folder)
```bash
cd city-complaint-frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```
Frontend runs on `http://localhost:3000` by default.

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://..."

JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# Google OAuth (Social Login)
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."

# bKash Sandbox
BKASH_BASE_URL="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
BKASH_USERNAME="your_bkash_sandbox_username"
BKASH_PASSWORD="your_bkash_sandbox_password"
BKASH_APP_KEY="your_bkash_app_key"
BKASH_APP_SECRET="your_bkash_app_secret"
BKASH_CALLBACK_URL="http://localhost:5000/api/v1/payments/bkash/callback"

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Frontend URL (used for payment redirects)
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 👥 User Roles & Permissions

The system has **5 distinct roles**, each with a different dashboard, sidebar, and permission scope.

| Role | Description | Core Permissions |
|---|---|---|
| **CITIZEN** | General public user | Create complaints, view/edit own complaints, pay emergency fee, submit feedback, view own payment history |
| **TECHNICIAN** | Field worker who physically resolves issues | View assigned complaints, update complaint status (`IN_PROGRESS → RESOLVED`) |
| **DEPARTMENT_STAFF** | Department-level staff member | View & manage complaints within their department |
| **DEPARTMENT_MANAGER** | Manages a specific department | Assign technicians/staff within their department, view department reports, manage department-level complaints |
| **CITY_ADMIN** | Super-admin, full system access | Manage all users & roles, manage departments & categories, assign any complaint to any technician, view system-wide dashboard stats, view audit logs |

### Permission Matrix (high level)

| Action | Citizen | Technician | Staff | Manager | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Create complaint | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own complaints | ✅ | — | — | — | ✅ (all) |
| Update own PENDING complaint | ✅ | ❌ | ❌ | ❌ | ✅ |
| Delete complaint | ✅ (own) | ❌ | ❌ | ❌ | ✅ (any) |
| Assign technician/staff | ❌ | ❌ | ✅ | ✅ | ✅ |
| Update complaint status | ❌ | ✅ | ❌ | ❌ | ✅ |
| Submit feedback | ✅ | ❌ | ❌ | ❌ | ❌ |
| Make payment (priority fee) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage departments/categories | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage users & roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🧭 Navbar & Sidebar Structure

### Public Landing Page Navbar (unauthenticated)
[● SmartCity] Home Departments Categories About Us Legal ▾ [🌙] Sign In [Sign Up]


### Logged-in Sidebar — changes based on role

**CITIZEN MENU**

🏠 My Dashboard → /citizen/dashboard
📄 My Complaints → /citizen/complaints
💳 Payment History → /citizen/payments
👤 My Profile → /citizen/profile


**TECHNICIAN MENU**

🏠 Field Dashboard → /technician/dashboard
✅ My Tasks → /technician/tasks
👤 My Profile → /technician/profile


**DEPARTMENT STAFF MENU**

🏠 Staff Dashboard → /staff/dashboard
📋 Assigned Complaints → /staff/complaints
👤 My Profile → /staff/profile


**DEPARTMENT MANAGER MENU**

🏠 Manager Overview → /manager/dashboard
👥 Staff Management → /manager/staff
📊 Department Reports → /manager/reports
👤 My Profile → /manager/profile


**CITY ADMIN MENU**

🏠 City Overview → /admin/dashboard
🏢 Departments → /admin/departments
🏷️ Categories → /admin/categories
👥 System Users → /admin/users
📋 Assigned Complaints → /admin/complaints
👥 Staff Management → /admin/staff
👤 Citizen Management → /admin/citizens
🧾 Audit Logs → /admin/audit-logs
👤 Admin Profile → /admin/profile


Every sidebar item highlights (purple gradient) when active, and the mobile view collapses the sidebar into a slide-in drawer behind a hamburger icon.

---

## 🗺️ Complete Route Map (All Pages)

### 🔓 Public / Marketing (3 routes)
| # | Route | Description |
|---|---|---|
| 1 | `/` | Landing page — hero, mission statement, feature showcase, platform gallery |
| 2 | `/login` | Email/password login + "Continue with Google" |
| 3 | `/register` | New citizen registration |

### 👤 Citizen Portal (11 routes)
| # | Route | Description |
|---|---|---|
| 4 | `/citizen/dashboard` | Summary cards (total / in-progress / resolved complaints) + quick "New Complaint" CTA |
| 5 | `/citizen/complaints` | List of the citizen's own complaints — filter by status, paginated |
| 6 | `/citizen/complaints/new` | Complaint submission form (title, category, description, address, priority, optional image) |
| 7 | `/citizen/complaints/[id]` | Single complaint detail — status timeline, assigned technician, feedback form if resolved |
| 8 | `/citizen/payments` | Payment history table (gateway, amount, status, transaction ID, date) |
| 9 | `/citizen/payment` | Stripe checkout **success/failure callback handler** (verifies session, updates DB) |
| 10 | `/citizen/payment/bkash-result` | bKash checkout **success/failure callback handler** |
| 11 | `/citizen/profile` | View/edit profile (name, phone, email) |

### 🧰 Technician Portal (3 routes)
| # | Route | Description |
|---|---|---|
| 12 | `/technician/dashboard` | Overview of assigned workload |
| 13 | `/technician/tasks` | List of complaints assigned to this technician, with status-update controls (`IN_PROGRESS` → `RESOLVED`) |
| 14 | `/technician/profile` | View/edit profile |

### 🏢 Department Staff Portal (3 routes)
| # | Route | Description |
|---|---|---|
| 15 | `/staff/dashboard` | Department-level complaint overview |
| 16 | `/staff/complaints` | Complaints within the staff member's department |
| 17 | `/staff/profile` | View/edit profile |

### 📊 Department Manager Portal (4 routes)
| # | Route | Description |
|---|---|---|
| 18 | `/manager/dashboard` | Department performance overview |
| 19 | `/manager/staff` | Assign/manage technicians & staff within the manager's department |
| 20 | `/manager/reports` | Department-level resolution-time / volume reports |
| 21 | `/manager/profile` | View/edit profile |

### 🛡️ City Admin Portal (9 routes)
| # | Route | Description |
|---|---|---|
| 22 | `/admin/dashboard` | System-wide stats — total complaints, resolved %, revenue from priority payments, active users |
| 23 | `/admin/departments` | Create/edit/delete departments |
| 24 | `/admin/categories` | Create/edit/delete complaint categories (each linked to a department) |
| 25 | `/admin/users` | View all users, change roles, deactivate accounts |
| 26 | `/admin/complaints` | All complaints system-wide — assign any technician to any complaint |
| 27 | `/admin/staff` | Manage department staff & technicians across all departments |
| 28 | `/admin/citizens` | View/manage citizen accounts |
| 29 | `/admin/audit-logs` | Full audit trail — who changed what, when, old → new value |
| 30 | `/admin/profile` | View/edit profile |

### ⚙️ Shared / System Pages (5 routes)
| # | Route | Description |
|---|---|---|
| 31 | `/unauthorized` | Shown when a logged-in user tries to access a route outside their role |
| 32 | `/not-found` (404) | Generic not-found page |
| 33 | `/error` | Generic error boundary page |
| 34 | `/loading` | Global loading state (shown during data fetch transitions) |
| 35 | `/citizen/payment/failed` | Explicit failed-payment landing (Stripe cancel path) |

> **Total: 35 routes** across 5 roles + public pages + system pages.

---

## 🔄 Complaint Lifecycle / Status Workflow

PENDING → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
↘ REOPENED (citizen unsatisfied)
↘ REJECTED (invalid complaint)


- Every transition is written to **StatusLog** and **AuditLog** — capturing who changed it, when, and the old → new status.
- Only specific roles can trigger specific transitions (e.g. only a `TECHNICIAN` or `CITY_ADMIN` can move a complaint to `RESOLVED`).
- Complaints use **soft delete** (`deletedAt` timestamp) — nothing is physically removed from the database, preserving the audit trail.

---

## 💳 Payment Flow (bKash + Stripe)

A citizen can mark any complaint as **EMERGENCY** priority for a one-time fee. On submission, a **Payment Method modal** lets them choose between:

### Stripe (international cards)

Citizen clicks “Pay with Card”
→ POST /payments/stripe/create (complaintId)
→ Stripe Checkout Session created, redirect to Stripe’s hosted page
→ Citizen completes payment (test card: 4242 4242 4242 4242)
→ Redirect to /citizen/payment?session_id=...&complaintId=...
→ Frontend calls POST /payments/stripe/verify (sessionId, complaintId)
→ Backend verifies session with Stripe, runs a Prisma transaction:
Payment.status = PAID
Complaint.priority = EMERGENCY
→ Success page shown


### bKash (local mobile wallet)

Citizen clicks “Pay with bKash”
→ POST /payments/bkash/create (complaintId)
→ bKash Tokenized Checkout session created, redirect to bKash’s hosted page
→ Citizen completes payment (sandbox wallet + OTP + PIN)
→ bKash redirects to GET /payments/bkash/callback?paymentID=...&status=...
→ Backend calls bKash’s Execute Payment API to verify, runs a Prisma transaction:
Payment.status = PAID
Complaint.priority = EMERGENCY
→ Backend redirects to /citizen/payment/bkash-result?status=success|failed


Both flows are **idempotent** — re-verifying an already-paid payment returns a success response instead of erroring, so page reloads or duplicate calls never corrupt the Payment record.

---

## 📡 API Reference Summary

Full Postman documentation: **https://documenter.getpostman.com/view/54804418/2sBYAytUVw**

| Group | Base Path | Key Endpoints |
|---|---|---|
| Auth | `/api/v1/auth` | `/sign-up`, `/sign-in`, `/google`, `/user-me`, `/update-user` |
| Departments | `/api/v1/departments` | `GET /`, `POST /` |
| Categories | `/api/v1/categories` | `GET /`, `POST /` |
| Complaints | `/api/v1/complaints` | `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`, `PATCH /:id/status`, `POST /:id/assign`, `POST /:id/feedback` |
| Payments | `/api/v1/payments` | `POST /stripe/create`, `POST /stripe/verify`, `POST /bkash/create`, `GET /bkash/callback`, `GET /` |
| City Admin | `/api/v1/city-admin` | `/dashboard-stats`, `/get-all-users`, `/update-user-role`, `/audit-logs` |

All responses follow a consistent shape:
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```
Errors follow the same shape with `"success": false` and a Zod-powered `errors` array for validation failures.

---

## 📁 Folder Structure

city-complaint-platform/ # Backend
├── src/
│ ├── controllers/
│ ├── services/
│ ├── routes/
│ ├── middlewares/
│ ├── validations/
│ ├── utils/
│ ├── config/
│ ├── app.ts
│ └── server.ts
├── prisma/
│ └── schema.prisma
└── api/
└── index.ts # Vercel serverless entry point

city-complaint-frontend/ # Frontend
├── app/
│ ├── (auth)/ login, register
│ ├── (citizen)/ dashboard, complaints, payments, profile
│ ├── (technician)/ dashboard, tasks, profile
│ ├── (staff)/ dashboard, complaints, profile
│ ├── (manager)/ dashboard, staff, reports, profile
│ ├── (admin)/ dashboard, departments, categories, users, ...
│ ├── unauthorized/
│ └── page.tsx landing page
├── components/
│ ├── ui/ Button, Input, Card
│ ├── layout/ Navbar, Sidebar
│ ├── auth/ LoginForm, RegisterForm, GoogleLoginButton
│ ├── complaints/ ComplaintForm, ComplaintTable, StatusTimeline, PaymentMethodModal
│ ├── admin/ UserTable, DepartmentForm, DashboardStats
│ └── landing/ Hero, GlowOrb, Gallery, Showcase, FeatureCards
├── services/ API call layer (auth, complaint, payment, admin)
├── store/ useAuthStore (Zustand)
├── hooks/ useAuth, useComplaints
├── lib/ axios instance, constants, utils
└── types/ user, complaint, payment, api


---

## 📸 Screenshots

_(Add dashboard, complaint-form, and payment-flow screenshots here before submission.)_

---

## 👨‍💻 Author

**Md. Rayhan Uddin**
Computer Science and Engineering, University of Barishal
📧 mrayhan21.cse@bu.ac.bd
