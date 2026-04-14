# Aura - Premium Task Management Platform

Aura is a full-stack, comprehensive task management platform designed to bring clarity and speed to team workflows. Built with Next.js 15, Prisma, and Kinde Auth, it emphasizes a modern, dynamic user experience with robust authenticated routing.

## 🚀 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Database & ORM:** PostgreSQL (Neon) & Prisma
* **Authentication:** Kinde Auth
* **UI & Styling:** Tailwind CSS, Radix UI, shadcn/ui, Recharts
* **Forms & Validation:** React Hook Form & Zod

---

## 🧠 Architectural Challenges & Solutions

While building this application for production deployment on Vercel, several complex edge cases were encountered and resolved. These reflect production-grade architectural and defensive programming decisions:

### 1. Vercel Static Generation vs. Dynamic Auth Routes
**Challenge:** Next.js aggressively attempts to statically prerender (bake into HTML) all pages during the `npm run build` process on Vercel. Because the `(protected)` routes evaluate a `userRequired()` server function to verify Kinde authentication, the build server—which has no active user session—encountered `Unauthorized` exceptions, immediately crashing the deployment.
**Solution:** Implemented the officially recommended Next.js Route Segment configuration (`export const dynamic = 'force-dynamic';`) within the `(protected)/layout.tsx`. This successfully opted the entire protected route branch out of static generation, ensuring user authentication checks strictly occur on-demand at request time.

### 2. The Next.js Server Action `NEXT_REDIRECT` Error
**Challenge:** When submitting forms managed by `react-hook-form` (with complex loading states and `toast` error handling), utilizing the Next.js `redirect()` function inside a Server Action threw hidden `NEXT_REDIRECT` exceptions. This caused the form's `try...catch` blocks to mistakenly catch the redirect as a fatal error, rendering an artificial "Something went wrong" toast just before page transition.
**Solution:** Transitioned to the "RPC (Remote Procedure Call) Pattern". Server actions were refactored to simply return a payload (`{ success: true, redirectTo: "/workspace" }`) instead of initiating redirects themselves. The client securely intercepts this success object and manages the routing natively via `useRouter().push()`. This achieves optimal separation of concerns between server-side data mutation and client-side transition management.

### 3. Defensive Programming: SVG NaN Exceptions
**Challenge:** In specific edge cases—such as a newly created project containing zero tasks—the task competition calculation (`completed / total`) yielded `NaN`. Passing `NaN` into the `<circle>` SVG `strokeDashoffset` property provoked a fatal, unhandled rendering error that crashed the entire dashboard component.
**Solution:** Enforced strict Defensive Programming within the UI leaf components. A `Number.isFinite()` fallback evaluation was strapped to all mathematical inputs before rendering. This guarantees bulletproof UI component lifecycle stability, enabling the app to gracefully degrade to `0%` progress rather than crashing the React tree.

### 4. Prisma Build Output & Kinde Callback Routing
**Challenge:** Vercel's build instances lacked the generated Prisma Client, and initial Kinde configuration referenced localhost, resulting in `404 NOT_FOUND` errors upon post-login redirects.
**Solution:** Configured `postinstall: "prisma generate"` within the absolute build stream to dynamically generate SDK typings on Vercel's serverless edge. Synchronized Vercel environment variables securely with strict Kinde Auth callback definitions targeting the exact assigned production domain.
