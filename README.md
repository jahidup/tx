# Sankalp Digital Pathshala Test Portal

Production-ready online examination and learning platform built with Next.js 15 App Router, TypeScript, Tailwind CSS, MongoDB Atlas, JWT cookies, Gmail SMTP, Cloudinary and Gemini.

## Core Routes

- Public: `/`, `/about`, `/contact`, `/student-login`, `/admin-login`
- Admin: `/admin`, `/admin/classes`, `/admin/students`, `/admin/questions`, `/admin/tests`, `/admin/results`, `/admin/materials`, `/admin/support`, `/admin/emails`, `/admin/ai-settings`, `/admin/settings`
- Student: `/student`, `/student/upcoming-tests`, `/student/live-tests`, `/student/previous-tests`, `/student/results`, `/student/results/[testId]/review`, `/student/results/[testId]/question/[questionId]/ai`, `/student/materials`, `/student/support`, `/student/profile`

## Local Development

```bash
npm install
npm run dev
```

Demo credentials work before MongoDB is configured:

- Admin: `admin` / `Sankalp@2026`
- Student: `SDP1001` / `15-08-2010`

## Production Setup

1. Copy `.env.example` to `.env.local`.
2. Configure `MONGODB_URI`, `JWT_SECRET`, `ADMIN_ID`, `ADMIN_PASSWORD`, Gmail SMTP, Cloudinary and Gemini keys.
3. Run `npm run seed` to create the bcrypt-hashed admin and starter class/student/test records.
4. Deploy to Vercel and add the same environment variables.

## Security Notes

- JWT sessions are stored in secure HTTP-only role cookies.
- Middleware protects `/admin` and `/student` route trees.
- API routes re-check admin/student roles before data access.
- Admin-created students only; no public registration route is included.
- AI explanations are blocked during live tests and exposed only after result publication.

## Verification

```bash
npm run lint
npm run build
```
