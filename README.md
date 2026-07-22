# velloX — Task Management Platform

[![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **velloX** is a full-stack, production-grade task management platform designed for team collaboration. Built with Next.js 16 and TypeScript, it features real-time notifications, Kanban boards, role-based access control, file attachments, and a polished dark/light theme — all deployed on Vercel.

---

## 📸 Screenshots

![velloX Landing Page](./public/landing-page.png)

---

## 🚀 Tech Stack

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

## ✨ Features

### 🖥️ Landing Page
- Hero section with a bold typography-focused headline, feature highlights, product showcase, testimonials carousel (Swiper), pricing tiers, FAQ accordion, and a CTA section — all fully responsive.

### 🔐 Authentication & Onboarding
- **Kinde Auth** integration — login, register, and session management out of the box.
- Multi-step onboarding form capturing user profile (name, country, industry, role, bio).
- Protected route layout with automatic redirect to onboarding or workspace creation.

### 📂 Workspaces
- Create and manage multiple workspaces.
- Invite team members by email with role selection (**Admin** or **Member**).
- Role-based access: **Owner**, **Admin**, and **Member**.
- Workspace-level dashboard showing task stats, project progress, recent activities, and team members.
- Workspace settings — rename, update description, soft-delete task recovery, permanent deletion.

### 📊 Projects
- Create projects within a workspace with optional member-level access restrictions.
- **Kanban Board** — drag-and-drop columns (Backlog, To Do, In Progress, In Review, Completed, Cancelled) powered by `@hello-pangea/dnd`.
- **Table View** — sortable data table powered by TanStack Table with bulk delete actions.
- Task distribution chart (Recharts) and completion progress rings.
- Project dashboard with activity feed and member stats.

### ✅ Tasks
- Rich task creation/editing with title, description, priority (Low/Medium/High/Critical), status, start/due dates, assignee selection, and file attachments.
- **File attachments** — custom drag-drop zone with `useFileUpload` hook. Files stay local as previews until the form is submitted, preventing orphaned uploads.
- UploadThing integration for server-side file management with cleanup on delete.
- **Soft delete** — tasks are trashed instead of permanently removed, with recover/delete options in workspace settings.
- **Rich text documentation** per task via Tiptap editor (heading, bold, italic, links, code blocks, bullet lists).

### 💬 Collaboration
- **Comments** — add, edit, and delete comments on tasks and projects.
- **Activity feed** — chronological log of all workspace/project events.
- **Members page** — manage team members, change roles, invite by email, remove members.

### 🔔 Real-Time Notifications
- Powered by **Ably** real-time messaging.
- Instant push notifications for: task assigned, task updated, comment added/edited, member joined, project created.
- Notification dropdown in the workspace navbar with unread count badge.
- Dedicated notifications page with infinite scroll filtering (read/unread/all).
- Sound alert on new notification (`/notification.mp3`).

### 🎨 UI/UX
- **Dark/Light theme** via `next-themes` with theme toggle.
- **shadcn/ui** component library — dialog, sheet, drawer, dropdown, accordion, tabs, tooltip, etc.
- **Dynamic breadcrumbs** — auto-generated from route structure.
- **Fully responsive** layout works seamlessly across desktop, tablet, and mobile.
- **Responsive sidebar** — collapsible navigation with workspace selector, project list, and notification badge.
- **Toast notifications** via Sonner for action feedback.
- **LoadingButton** — consistent loading state across all forms and dialogs.
- **Skeleton loaders** and spinner components throughout.

### 🧱 Reusable Architecture
- **Server Actions** with RPC pattern (return `{ success, redirectTo, error }` instead of calling `redirect()` on the server).
- **Data layer** — separated database queries in `app/data/` with dedicated getter files.
- **Permission system** — `lib/permissions.ts` with `verifyAccess()`, `requireRole()`, `requireOwner()`, `requireTaskAccess()` guards.
- **Consistent error handling** via `actionError()` utility.
- **Activity logging** — centralized `logActivity()` utility used across all server actions.

---

## 🧠 Architectural Challenges & Solutions

### 1. Vercel Static Generation vs. Dynamic Auth Routes
**Challenge:** Next.js aggressively tries to statically prerender all pages during build. Protected routes calling `userRequired()` throw `Unauthorized` on the build server, crashing the deployment.
**Solution:** Used `export const dynamic = 'force-dynamic'` in `(protected)/layout.tsx` to opt the entire protected route branch out of static generation.

### 2. The Next.js Server Action `NEXT_REDIRECT` Error
**Challenge:** Using Next.js `redirect()` inside a Server Action throws a `NEXT_REDIRECT` exception caught by form `try...catch` blocks, causing false error toasts.
**Solution:** Implemented the **RPC Pattern** — server actions return `{ success: true, redirectTo: "/workspace" }` instead of calling `redirect()`. The client intercepts this and manages routing via `useRouter().push()`.

### 3. SVG NaN Exceptions in Progress Rings
**Challenge:** New projects with zero tasks caused `completed / total = NaN`, crashing the SVG circle progress component.
**Solution:** Enforced `Number.isFinite()` fallback on all mathematical inputs before rendering, gracefully degrading to `0%`.

### 4. Real-Time Notifications with Ably
**Challenge:** Building a real-time notification system that works across server actions (database writes) and client-side subscriptions without polling or excessive complexity.
**Solution:**
1. **Server-side publishing** — A centralized `createNotification()` server action creates the DB record and publishes to an Ably channel (`notifications:{userId}`).
2. **Client-side subscription** — A `NotificationsProvider` wraps the protected layout, establishes an Ably real-time connection via a server-generated token request, and listens for new notifications.
3. **Sound & count** — On receiving a notification, the provider plays an audio alert and increments the unread badge count in the sidebar.
4. **Dedicated page** — A notifications page with infinite scroll, read/unread filters, and individual mark-as-read / delete actions.
5. **Scope** — Notifications are triggered from 7 different action points: task assignment, task updates, comments (add/edit), member joins, and project creation.

### 5. Orphaned Uploads on Dialog Cancel
**Challenge:** Files selected in task dialogs were immediately uploaded to UploadThing. Closing the dialog without submitting left orphaned files on the server.
**Solution:**
1. **Custom drag-drop zone** — Replaced UploadThing's auto-upload dropzone with a native `<input type="file">` + `URL.createObjectURL()` previews.
2. **`useFileUpload` hook** — Extracted file validation, preview management, and drag state into a reusable hook.
3. **`uploadPendingAttachments` utility** — Centralized upload logic to remove duplication between create and edit dialogs.
4. **Server-side cleanup** — Removed attachments are also deleted from UploadThing via `UTApi.deleteFiles()`.

### 6. Prisma Build Output & Kinde Callback Routing
**Challenge:** Vercel build instances lacked the generated Prisma Client, and initial Kinde configuration referenced localhost.
**Solution:** Configured `postinstall: "prisma generate"` and synchronized Vercel environment variables with Kinde Auth callback definitions.

---

## 🏗️ Project Structure

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

## 🛠️ Getting Started

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

## 📄 License

MIT
