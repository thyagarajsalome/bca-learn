# BCALearn Platform — Complete Project Plan & Prompt Guide
> Stack: React + TypeScript · Tailwind CSS v3 · Supabase · Firebase Hosting

---

## 📁 Project Folder Structure

```
bcalearn/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/               # fonts, icons, images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── modules/
│   │   │   ├── ModuleAccordion.tsx
│   │   │   ├── ModuleCard.tsx
│   │   │   └── LessonItem.tsx
│   │   ├── lessons/
│   │   │   ├── PDFViewer.tsx
│   │   │   ├── NotionEmbed.tsx
│   │   │   └── LessonPage.tsx
│   │   ├── progress/
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── OverallProgress.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── SearchBar.tsx
│   │       └── Skeleton.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ModuleDetail.tsx
│   │   ├── LessonViewer.tsx
│   │   └── Auth.tsx
│   ├── hooks/
│   │   ├── useModules.ts
│   │   ├── useLessons.ts
│   │   ├── useProgress.ts
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts           # All TypeScript interfaces
│   ├── store/                 # Zustand or Context
│   │   ├── authStore.ts
│   │   └── progressStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── firebase.json
```

---

## 🗄️ Supabase Database Schema

```sql
-- Modules table
create table modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,             -- emoji or icon name
  color text,            -- hex accent color
  semester int,
  order_index int not null default 0,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- Lessons table
create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete cascade,
  title text not null,
  description text,
  type text check (type in ('pdf', 'notion', 'video', 'external')),
  source_url text,       -- PDF storage URL or Notion page URL
  order_index int not null default 0,
  duration_minutes int,
  page_count int,        -- for PDFs
  is_published boolean default false,
  created_at timestamptz default now()
);

-- User progress table
create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  status text check (status in ('not_started', 'in_progress', 'completed')),
  last_accessed timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

-- Profiles table (extends Supabase auth)
create table profiles (
  id uuid primary key references auth.users(id),
  name text,
  avatar_url text,
  semester int default 1,
  created_at timestamptz default now()
);

-- Row Level Security
alter table user_progress enable row level security;
create policy "Users can manage own progress"
  on user_progress for all using (auth.uid() = user_id);

alter table profiles enable row level security;
create policy "Users can view/edit own profile"
  on profiles for all using (auth.uid() = id);
```

---

## 🔷 TypeScript Types

```typescript
// src/types/index.ts

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  semester: number;
  order_index: number;
  is_published: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  type: 'pdf' | 'notion' | 'video' | 'external';
  source_url: string;
  order_index: number;
  duration_minutes: number;
  page_count?: number;
  is_published: boolean;
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: LessonStatus;
  last_accessed: string;
  completed_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  semester: number;
}
```

---

## 🚀 Phase-by-Phase Execution Plan

### Phase 1 — Project Setup
**Estimated time: 1–2 hours**

1. Scaffold the project
2. Install all dependencies
3. Configure Tailwind v3, Supabase, env vars
4. Set up Firebase config

---

### Phase 2 — Core UI Components
**Estimated time: 4–6 hours**

Build static components first (no data):
- Navbar, Sidebar, Footer
- ModuleAccordion with open/close animation
- LessonItem (PDF / Notion badges)
- ProgressRing, ProgressBar
- SearchBar with filter logic
- Badge / Pill component
- Skeleton loaders

---

### Phase 3 — Supabase Integration
**Estimated time: 3–4 hours**

- Supabase client setup
- Custom hooks: `useModules`, `useLessons`, `useProgress`
- Seed the database with your initial modules and lessons
- Realtime subscriptions for progress updates

---

### Phase 4 — Auth Flow
**Estimated time: 2–3 hours**

- Supabase Auth (Email + Google OAuth)
- Auth context / Zustand store
- Protected routes
- Profile creation on first login

---

### Phase 5 — Lesson Viewer
**Estimated time: 3–4 hours**

- PDF viewer using `react-pdf` / `pdf.js`
- Notion embed (iframe or Notion API)
- Progress auto-marking (started / completed)
- Next/Prev lesson navigation

---

### Phase 6 — Dashboard & Progress
**Estimated time: 2–3 hours**

- Overall progress card
- Per-module progress bars
- "Continue Learning" section
- Recently accessed lessons

---

### Phase 7 — Admin Panel (optional)
**Estimated time: 3–5 hours**

- Add/Edit/Delete modules and lessons
- Toggle publish status
- Reorder via drag-and-drop
- Upload PDFs directly to Supabase Storage

---

### Phase 8 — Firebase Hosting + CI/CD
**Estimated time: 1–2 hours**

- Build with Vite
- Deploy to Firebase Hosting
- Set up GitHub Actions for auto-deploy on push

---

## 💬 Prompt 1 — Project Bootstrap

```
Create a new Vite + React + TypeScript project called "bcalearn".

Install and configure:
- Tailwind CSS v3 (with tailwind.config.js using a custom dark theme)
- react-router-dom v6 for routing
- @supabase/supabase-js for backend
- zustand for state management
- react-pdf for PDF viewing
- lucide-react for icons

Custom Tailwind theme should include:
- bg: #0c0f1a (deep navy dark background)
- surface: #13172a
- accent: #5b6af0 (indigo)
- green: #4ecca3
- gold: #f0b15b
- text-primary: #e8eaf6
- text-muted: #8890b5

Also create .env.local with placeholders for:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Set up src/lib/supabase.ts to initialize the Supabase client from env vars.

Create the full folder structure as described:
src/components/layout, src/components/modules, src/components/ui,
src/pages, src/hooks, src/types, src/store
```

---

## 💬 Prompt 2 — TypeScript Types & Supabase Schema

```
Create the file src/types/index.ts with the following TypeScript interfaces:

- Module: id, title, description, icon (emoji string), color (hex),
  semester (number), order_index, is_published, optional lessons array
- Lesson: id, module_id, title, description, type ('pdf'|'notion'|'video'|'external'),
  source_url, order_index, duration_minutes, optional page_count, is_published
- LessonStatus: union type 'not_started' | 'in_progress' | 'completed'
- UserProgress: id, user_id, lesson_id, status (LessonStatus),
  last_accessed, optional completed_at
- Profile: id, name, avatar_url, semester

Also create src/lib/supabase.ts that exports a typed Supabase client.
Use the Database generic type pattern from @supabase/supabase-js.
Export helper types: Tables<'modules'>, Tables<'lessons'>, Tables<'user_progress'>
```

---

## 💬 Prompt 3 — ModuleAccordion Component

```
Build a React TypeScript component: src/components/modules/ModuleAccordion.tsx

It receives props:
- modules: Module[]           (from types/index.ts)
- progressMap: Record<string, { completed: number; total: number }>
- onLessonClick: (lesson: Lesson) => void

Each module renders as a collapsible card with:
- Header row: icon (emoji in colored rounded box), module title,
  lesson count, status pill (New/In Progress/Complete),
  animated circular progress ring (SVG), animated chevron
- Smooth max-height CSS transition for expand/collapse (no JS animation libs)
- Lessons list inside: lesson number, title, source type badge (PDF 📄 / Notion 📋),
  completion status icon (✓ green / ▶ accent / — muted)
- Active lesson highlighted with accent background

Use Tailwind v3 utility classes only. No inline styles except for dynamic
values like progress ring stroke-dashoffset calculated from percentage.
Only one module can be expanded at a time (accordion behaviour).

Color tokens should reference CSS variables defined in tailwind.config.js.
```

---

## 💬 Prompt 4 — Custom Hooks (Data Layer)

```
Create three custom React hooks in TypeScript under src/hooks/:

1. useModules.ts
   - Fetches all published modules from Supabase ordered by order_index
   - Also fetches their lessons (nested or separate query)
   - Returns: { modules, loading, error }

2. useProgress.ts
   - Accepts userId: string
   - Fetches all user_progress rows for that user from Supabase
   - Returns:
     - progressMap: Record<lessonId, LessonStatus>
     - moduleProgress: Record<moduleId, { completed: number, total: number }>
     - overallPercent: number
     - markComplete: (lessonId: string) => Promise<void>
     - markInProgress: (lessonId: string) => Promise<void>

3. useAuth.ts
   - Wraps Supabase auth
   - Returns: { user, profile, signInWithGoogle, signInWithEmail, signOut, loading }
   - On first login, auto-creates a row in the profiles table

All hooks must handle loading and error states.
Use React Query or plain useEffect+useState — your choice, keep it clean.
```

---

## 💬 Prompt 5 — Dashboard Page

```
Build src/pages/Dashboard.tsx in React TypeScript with Tailwind v3.

Layout: two-column grid (main content left, sidebar right).
Responsive: single column on mobile.

Left side:
- Search bar (filters modules by title/lesson name in real-time)
- Section header: "All Modules" + count of visible modules
- <ModuleAccordion> using live data from useModules() hook
- Progress loaded from useProgress(user.id) hook
- Skeleton loaders while data is loading

Right sidebar:
- "Overall Progress" card with large percentage number + gradient progress bar
- "By Subject" card: each module with a colored mini bar showing % complete
- "Continue Learning" card: top 3 in-progress or next unstarted lessons,
  clickable to navigate to lesson viewer

Use the dark theme color tokens. Add subtle entrance animations
(Tailwind animate-fadeIn with staggered delay on each module card).
```

---

## 💬 Prompt 6 — Lesson Viewer Page

```
Build src/pages/LessonViewer.tsx in React TypeScript.

Route: /lesson/:lessonId

Behaviour:
- Fetch lesson details from Supabase by lessonId
- If type === 'pdf': render using react-pdf <Document> + <Page> components.
  Show page navigation controls (Prev / Next / page X of Y).
  On open, call markInProgress(lessonId).
  Show a "Mark as Complete ✓" button — calls markComplete(lessonId).
- If type === 'notion': render an iframe pointing to source_url
- Show lesson title, module breadcrumb at the top
- Bottom bar: Previous Lesson / Next Lesson navigation buttons
  (fetched from ordered lessons in same module)

Full dark theme, Tailwind v3 only.
```

---

## 💬 Prompt 7 — Auth Page

```
Build src/pages/Auth.tsx — a clean login/signup page.

Features:
- Email + password login and signup (toggle between the two)
- "Continue with Google" button using Supabase OAuth
- Form validation with inline error messages
- On successful auth, redirect to /dashboard
- Loading spinner on submit

Design: centered card on the dark background, logo at top,
subtle background glow effect using Tailwind's ring and shadow utilities.
Tailwind v3 only, TypeScript, uses the useAuth() hook.
```

---

## 💬 Prompt 8 — Firebase Hosting Setup

```
Set up Firebase Hosting for a Vite + React project:

1. Create firebase.json configured for SPA (all routes → index.html):
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}

2. Create .firebaserc with the project ID placeholder.

3. Create a GitHub Actions workflow at .github/workflows/deploy.yml that:
   - Triggers on push to main branch
   - Runs: npm ci → npm run build → firebase deploy
   - Uses secrets: FIREBASE_TOKEN, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

4. Update vite.config.ts to set base: '/' for Firebase hosting.

5. Add npm scripts to package.json:
   "deploy": "npm run build && firebase deploy"
```

---

## 💬 Prompt 9 — Admin Panel (Add Modules/Lessons)

```
Build a simple admin panel at src/pages/Admin.tsx.
Protect it with a check: only show if profile.role === 'admin'
(add a role column to the profiles table).

Features:
1. Module Manager:
   - List all modules (published + drafts)
   - Add new module form: title, description, icon (emoji), color, semester
   - Edit / Delete module
   - Toggle is_published

2. Lesson Manager (inside each module):
   - List lessons with order_index
   - Add lesson form: title, type (pdf/notion), source_url, duration, page_count
   - Edit / Delete lesson
   - Toggle is_published
   - Drag to reorder (use @dnd-kit/sortable)

3. PDF Upload:
   - Upload PDF to Supabase Storage bucket 'lesson-pdfs'
   - After upload, auto-fill source_url in the lesson form

All Tailwind v3, TypeScript, uses the Supabase client directly.
```

---

## 📦 Dependencies Reference

```bash
# Core
npm create vite@latest bcalearn -- --template react-ts
cd bcalearn

# Styling
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# Routing
npm install react-router-dom

# Supabase
npm install @supabase/supabase-js

# State
npm install zustand

# PDF Viewer
npm install react-pdf

# Icons
npm install lucide-react

# Drag and drop (admin panel)
npm install @dnd-kit/core @dnd-kit/sortable

# (Optional) Data fetching
npm install @tanstack/react-query

# Firebase CLI (global)
npm install -g firebase-tools
```

---

## ✅ Execution Checklist

### Setup
- [ ] Create Vite project
- [ ] Install all dependencies
- [ ] Configure Tailwind v3 with custom theme
- [ ] Create Supabase project and run schema SQL
- [ ] Add .env.local with Supabase keys
- [ ] Create Firebase project

### Frontend
- [ ] Types (src/types/index.ts)
- [ ] Supabase client (src/lib/supabase.ts)
- [ ] Navbar, Footer, Layout components
- [ ] ModuleAccordion + LessonItem
- [ ] ProgressRing + ProgressBar + OverallProgress
- [ ] SearchBar
- [ ] Skeleton loaders
- [ ] Dashboard page
- [ ] Lesson Viewer (PDF + Notion)
- [ ] Auth page
- [ ] Protected routes

### Backend / Data
- [ ] Seed initial modules and lessons in Supabase
- [ ] Upload PDFs to Supabase Storage
- [ ] useModules hook
- [ ] useProgress hook
- [ ] useAuth hook

### Deploy
- [ ] firebase.json + .firebaserc
- [ ] GitHub Actions workflow
- [ ] npm run build → firebase deploy
- [ ] Set env vars in GitHub Secrets

### Later
- [ ] Admin panel
- [ ] Supabase Realtime for live progress sync
- [ ] Dark/light theme toggle
- [ ] Mobile responsive polish
- [ ] PWA support (offline PDF caching)
```

---

## 🧩 How to Use These Prompts

1. Give **Prompt 1** to Claude (or Claude Code) to bootstrap the project.
2. Then give prompts **2, 3, 4...** one at a time in order.
3. Each prompt is self-contained — paste it directly into Claude Code or your AI editor.
4. After each prompt, test the output before moving to the next.
5. Use the **Checklist** above to track your progress.

> Tip: When using Claude Code in terminal, you can run `claude` in your project folder and paste these prompts directly for agentic file creation.
