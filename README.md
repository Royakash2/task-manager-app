# velloX — Task Management Platform

[![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![CI](https://github.com/your-username/vellox/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/vellox/actions/workflows/ci.yml)

> **velloX** is a task management app for teams. Built with Next.js 16 and TypeScript — real-time notifications, Kanban boards, role-based access, file uploads, and a dark/light theme. Deployed on Vercel.

---

## Screenshots

![velloX Landing Page](./public/landing-page.png)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 7 |
| **Auth** | Kinde Auth |
| **Real-time** | Ably |
| **File Uploads** | UploadThing |
| **Rich Text** | Tiptap |
| **Charts** | Recharts |
| **Tables** | TanStack Table |
| **Forms** | React Hook Form + Zod |
| **Drag & Drop** | @hello-pangea/dnd |
| **UI** | Tailwind CSS + shadcn/ui + Radix UI |
| **Animations** | Framer Motion + Swiper |
| **Theming** | next-themes |
| **Notifications** | Sonner |
| **Dates** | date-fns |

---

## Project Structure

```
app/
├── (protected)/          # Authenticated routes
│   ├── onboarding/
│   ├── create-workspace/
│   └── workspace/[workspaceId]/
│       ├── page.tsx              # Dashboard
│       ├── my-tasks/
│       ├── members/
│       ├── notifications/
│       ├── settings/
│       └── projects/[projectId]/
│           ├── page.tsx          # Project Dashboard
│           └── [taskId]/
├── actions/              # Server Actions
├── api/                  # API routes (auth, uploadthing, notifications)
├── data/                 # Database query layer
├── layout.tsx            # Root layout (metadata, fonts, providers)
└── page.tsx              # Landing page

components/
├── landing/              # Landing page sections
├── sidebar/              # App sidebar & navigation
├── project/              # Project dashboard, Kanban, table, charts
├── task/                 # Task create/edit, comments, documentation
├── workspace/            # Workspace home, settings, trash
├── members/              # Member management
├── notifications/        # Real-time notification UI
├── breadcrumb/           # Dynamic breadcrumb system
└── ui/                   # Reusable UI components (shadcn/ui)

lib/                      # Utilities (db, ably, permissions, schema)
hooks/                    # Custom hooks (file upload, mobile, notifications)
utils/                    # Shared utilities (types, file attachments, uploadthing)
prisma/                   # Schema + migrations
```

---

## Features

### Landing Page
- Full marketing site — hero, feature highlights, product showcase, testimonials carousel (Swiper), pricing, FAQ accordion, and CTA. Fully responsive.

### Authentication & Onboarding
- **Kinde Auth** handles login, register, and sessions.
- Multi-step onboarding form (name, country, industry, role, bio).
- Protected routes redirect to onboarding or workspace creation automatically.

### Workspaces
- Create and switch between multiple workspaces.
- **Email-based invites** — type someone's email, pick a role (**Admin** or **Member**), done. No invite codes.
- Three access levels: **Owner**, **Admin**, **Member**.
- Dashboard shows task stats, project progress, recent activity, and team members.
- Settings page for renaming, description, trash recovery, and permanent deletion.

### Projects
- Create projects with optional member-level access restrictions.
- **Kanban Board** — drag-and-drop between columns (Backlog, To Do, In Progress, In Review, Completed, Cancelled).
- **Table View** — sortable table with bulk delete.
- Task distribution chart (Recharts) and progress rings.
- Dashboard with activity feed and member stats.

### Tasks
- Create/edit tasks with title, description, priority (Low/Medium/High/Critical), status, dates, assignee, and file attachments.
- **File attachments** — custom drag-drop zone that keeps files as local previews until you hit submit. No orphaned uploads.
- UploadThing handles the server-side file storage and cleanup.
- **Soft delete** — tasks go to trash instead of being wiped. Recover or permanently delete from settings.
- **Rich text documentation** per task via Tiptap (headings, bold, italic, links, code blocks, lists).

### Collaboration
- **Comments** on tasks — add, edit, delete.
- **Activity feed** — chronologically logs everything happening in the workspace.
- **Members page** — manage roles, invite by email, remove people.

### Real-Time Notifications
- Powered by **Ably**.
- Instant notifications when: a task is assigned or updated, a comment is added/edited, a member joins, or a project is created.
- Dropdown in the navbar with unread count badge.
- Full notifications page with infinite scroll and read/unread/all filters.
- Plays a sound (`/notification.mp3`) on new notifications.

### UI/UX
- **Dark/Light theme** toggle via `next-themes`.
- **shadcn/ui** components — dialogs, sheets, drawers, dropdowns, accordions, tabs, tooltips.
- **Dynamic breadcrumbs** generated from the route.
- **Responsive** — works on desktop, tablet, and mobile.
- **Collapsible sidebar** with workspace selector, project list, and notification badge.
- **Toast notifications** via Sonner.
- **LoadingButton** for consistent loading states across all forms.
- **Skeleton loaders** and spinners.

### Architecture
- **Server Actions** use an RPC pattern — return `{ success, redirectTo, error }` instead of calling `redirect()` on the server.
- **Data layer** — database queries live in `app/data/`, separated by entity.
- **Permission system** — `lib/permissions.ts` has guards like `verifyAccess()`, `requireRole()`, `requireOwner()`, `requireTaskAccess()`.
- **Error handling** goes through a single `actionError()` utility.
- **Activity logging** — centralized `logActivity()` used across all server actions.

---

## Architectural Challenges & Solutions

### 1. Static generation breaking auth routes on build
**Problem:** Next.js wants to statically render everything it can. But protected routes that call `userRequired()` throw `Unauthorized` on the build server, which crashes the deployment.
**Fix:** Added `export const dynamic = 'force-dynamic'` in the protected layout to opt the whole auth-required branch out of static generation.

### 2. Next.js `redirect()` clashing with server action try/catch
**Problem:** Calling `redirect()` inside a server action throws a `NEXT_REDIRECT` error. If you have a try/catch around it (which you should), the catch thinks something went wrong and shows an error toast.
**Fix:** Server actions now return `{ success: true, redirectTo: "/workspace" }` instead of calling `redirect()`. The client side picks this up and calls `router.push()` itself.

### 3. Real-time notifications without polling
**Problem:** I wanted push notifications when stuff happens — task assigned, comment added, etc. Polling the database every few seconds felt wrong.
**How it works:**
1. When a server action creates a notification in the DB, it also publishes to an Ably channel (`notifications:{userId}`).
2. A `NotificationsProvider` wraps the protected layout, connects to Ably via a server-generated token, and listens for incoming notifications.
3. New notifications trigger a sound and bump the unread count in the sidebar.
4. There's a dedicated notifications page with infinite scroll and read/unread filtering.
5. Notifications fire from 7 places: task assignment, task updates, comments (add/edit), member joins, and project creation.

### 4. Files getting uploaded before the form was submitted
**Problem:** UploadThing's default behavior uploads files the moment you select them. If you opened the create/edit task dialog, picked a file, then closed the dialog without saving — that file was now sitting on UploadThing's servers with no task attached to it.
**How I fixed it:**
1. Replaced UploadThing's auto-upload zone with a regular `<input type="file">` that shows local previews via `URL.createObjectURL()`.
2. Files only get uploaded when you actually hit submit.
3. Extracted the file handling into a reusable `useFileUpload` hook.
4. If you remove an attachment from an existing task, it gets cleaned up from UploadThing too.



---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (recommended: [Neon](https://neon.tech/))
- Accounts: [Kinde](https://kinde.com/), [UploadThing](https://uploadthing.com/), [Ably](https://ably.com/)

### Environment Variables

```env
# Kinde Auth
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-app.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/onboarding
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000

# UploadThing
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id

# Ably
ABLY_API_KEY=your_ably_api_key

# Database
DATABASE_URL=postgresql://...
```

### Installation

```bash
git clone https://github.com/your-username/vellox.git
cd vellox
npm install
npx prisma migrate dev
npm run dev
```

---

## License

MIT
