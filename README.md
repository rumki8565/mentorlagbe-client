# MentorLagbe - Smart Tuition & Mentorship Platform

MentorLagbe is a full-stack, role-based tuition management platform. Tutors post tuition batches, students search, apply and track applications, and admins moderate listings, users and Pro subscription payments.

**Purpose:** Students and parents struggle to find verified tutors by subject, class level, mode and budget, while tutors lack a structured place to showcase batches. MentorLagbe solves both problems in one place.

## Live Links

- **Live Site:** https://mentorlagbe-client-tau.vercel.app
- **Client Repository:** https://github.com/rumki8565/mentorlagbe-client
- **Server Repository:** https://github.com/rumki8565/mentorlagbe-server

## Admin Credentials

- **Email:** admin@mentorlagbe.com
- **Password:** zxasqw

Test tutor: demo.tutor@mentorlagbe.com / 123456

Test student: demo.student@mentorlagbe.com / asdfgh

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key Features

- Role-based authentication (Student, Tutor, Admin) with BetterAuth, JWT and Google sign-in
- Browse tuitions with server-side search, filters (subject, class level, mode) and pagination
- Tuition details page with a student-only apply form and duplicate application prevention
- Tutor dashboard: post tuitions (free plan limit of 2), full CRUD, Active/Closed toggle, manage applicants (accept or reject)
- Student dashboard: stats, my applications with cancel while pending, saved (bookmarked) tuitions
- Student review and rating system (1 to 5 stars) for accepted applications
- Admin dashboard: platform stats, user role management, tuition approval flow, transactions table
- Stripe Checkout for Pro plans (Tutor $15, Student $10) with payment verification and webhook, and automatic plan upgrade
- ImgBB image upload for profile pictures and tuition banners
- Dark and light theme toggle across the site and dashboard
- Collapsible, responsive dashboard layout with loading skeletons, custom 404 and error pages
- Toast notifications for all actions
- Seed script with realistic connected demo data
- Saved tuitions (free students up to 5, Pro unlimited), verified badge for Pro tutors and priority applications for Pro students

## Tech Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Server:** Node.js, Express.js, MongoDB, TypeScript
- **Auth and Payments:** BetterAuth (MongoDB adapter), JWT, Stripe
- **Media:** ImgBB API

## NPM Packages Used

- **Client:** next, react, react-dom, better-auth, sonner, lucide-react, tailwindcss, shadcn/ui (Radix UI), class-variance-authority, clsx, tailwind-merge, typescript
- **Server:** express, cors, dotenv, mongodb, jsonwebtoken, better-auth, stripe, typescript, tsx

## Run Locally

```bash
npm install
npm run dev
```

Create a `.env.local` file in the client root:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

The client needs the server running (see the server repository).
