# Mega Medical Academy - Professional Medical Website

A modern, professional medical website built with Next.js 15.1.2, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## ✨ Features

- 🏥 **Professional Medical Design** - Clean, modern UI with medical-themed colors
- 🔐 **Authentication** - Email/password auth with role-based access (admin/doctor)
- 📢 **Announcements** - Create, edit, publish/unpublish announcements
- 🎓 **Lectures** - YouTube video integration with downloadable resources
- 🌓 **Dark Mode** - Full dark mode support
- 📱 **Responsive** - Works on all devices
- 🔍 **SEO Optimized** - Sitemap, robots.txt, JSON-LD structured data
- ⚡ **Fast Loading** - Server components, lazy-loaded YouTube, image optimization

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)

### 2. Clone and Install

```bash
cd MedicalWebsite
npm install
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready

### 4. Create Database Tables

In your Supabase SQL Editor, run:

```sql
-- Profiles table
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'doctor' CHECK (role IN ('admin', 'doctor')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Lectures table
CREATE TABLE public.lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  download_label TEXT DEFAULT 'Download resources',
  download_url TEXT,
  download_path TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

### 5. Apply RLS Policies

Run the SQL from `supabase/migrations/001_rls_policies.sql` in the SQL Editor.

### 6. Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `lecture-downloads`
4. Private: **Yes** (unchecked public)

### 7. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Update with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find your credentials in **Supabase > Settings > API**.

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 9. Create Admin User

1. Sign up at `/auth/sign-up`
2. In Supabase SQL Editor, run:

```sql
-- Find your user ID
SELECT id, email FROM auth.users;

-- Make yourself admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = 'YOUR_USER_ID';
```

3. Sign out and sign in again to access `/admin`

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard (protected)
│   │   ├── announcements/
│   │   └── lectures/
│   ├── auth/            # Authentication pages
│   ├── lectures/        # Public lectures page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── sitemap.ts       # Dynamic sitemap
│   └── robots.ts        # Robots.txt
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   └── ...
├── lib/
│   ├── supabase/        # Supabase clients
│   └── utils.ts
├── hooks/
│   └── use-toast.ts
└── middleware.ts        # Auth & route protection
```

## 🛡️ Security

- Row Level Security (RLS) enabled on all tables
- Admin-only access to create/edit/delete content
- Protected admin routes via middleware
- Signed URLs for file downloads (10-minute expiry)

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the medical color palette:

```ts
medical: {
  500: "#0ea5e9", // Primary blue
  600: "#0284c7",
  ...
}
```

### Doctor Profile

Update the Hero component in `src/components/hero.tsx` with the actual doctor's information.

## 📝 License

MIT

---

Built with ❤️ using Next.js, Tailwind CSS, shadcn/ui, and Supabase
