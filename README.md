# BCALearn Platform

A modern, interactive learning platform for BCA curriculum built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Structured Learning**: Organized modules and lessons following BCA curriculum
- **Progress Tracking**: Real-time progress monitoring with detailed statistics
- **Interactive Content**: Support for PDFs, Notion documents, videos, and external resources
- **Modern UI**: Beautiful dark theme with smooth animations and responsive design
- **Authentication**: Secure email/password and Google OAuth authentication
- **Real-time Updates**: Live progress tracking with React Query

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: React Query + Zustand
- **Routing**: React Router v6
- **PDF Viewing**: react-pdf
- **Icons**: lucide-react
- **Drag & Drop**: @dnd-kit

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Google Cloud project (for OAuth, optional)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd bcalearn
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `BCALearn-Project-Plan.md` in your Supabase SQL editor
3. Enable Google OAuth in Supabase Auth settings (optional)
4. Copy your project URL and anon key

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
bcalearn/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/        # Navbar, Sidebar, Footer
│   │   ├── modules/      # ModuleAccordion, ModuleCard
│   │   ├── lessons/      # LessonItem, PDFViewer, NotionEmbed
│   │   ├── progress/     # ProgressRing, ProgressBar
│   │   ├── ui/           # Badge, SearchBar, Skeleton
│   │   └── auth/         # ProtectedRoute
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── types/            # TypeScript type definitions
│   └── store/            # State management
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

## 🗄️ Database Schema

The project uses Supabase with the following tables:

- **modules**: Course modules with metadata
- **lessons**: Individual lessons within modules
- **user_progress**: User progress tracking
- **profiles**: Extended user profiles

See `BCALearn-Project-Plan.md` for the complete SQL schema.

## 🔐 Authentication

The platform supports:

- Email/Password authentication
- Google OAuth
- Protected routes
- Profile management

## 📱 Features Overview

### Dashboard
- Overview of all modules and progress
- Search functionality
- Continue learning section
- Statistics and achievements

### Lesson Viewer
- PDF viewer with navigation
- Notion document embedding
- Progress tracking
- Next/Previous lesson navigation

### Module Detail
- Module information and statistics
- Lesson list with progress
- Accordion-style lesson organization

## 🎨 Customization

### Colors

The theme uses a custom dark palette defined in `tailwind.config.js`:

```javascript
colors: {
  bg: '#0c0f1a',        // Deep navy background
  surface: '#13172a',   // Surface color
  accent: '#5b6af0',    // Primary accent (indigo)
  green: '#4ecca3',     // Success color
  gold: '#f0b15b',      // Warning/highlight
  'text-primary': '#e8eaf6',  // Primary text
  'text-muted': '#8890b5',    // Muted text
}
```

### Components

All components are built with Tailwind CSS and can be easily customized.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚢 Deployment

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init`
3. Build the project: `npm run build`
4. Deploy: `firebase deploy`

### Other Platforms

The project can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please open an issue in the repository or contact the maintainers.

---

Built with ❤️ using React, TypeScript, and Supabase# bca-learn
