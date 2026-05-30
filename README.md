# StudyConnect - Study Group Finder

A modern study group finder for university students built with React, Vite, and Supabase.

## Features
- Browse and search study groups by course or topic
- Create study groups with location, date and max members
- Join or leave study groups with one click
- View all members in a study group
- My Groups page showing groups created and joined
- Protected routes with Supabase authentication
- Responsive design for mobile and desktop

## Tech Stack
- Frontend: React 18 + Vite
- Styling: Tailwind CSS
- Database and Auth: Supabase
- Hosting: Render

## Quick Start

### Prerequisites
- Node.js v20+
- A Supabase account (free tier)

### Installation
```bash
git clone https://github.com/omondi-ochido/studyconnect.git
cd studyconnect
npm install
cp .env.example .env
```

### Environment Variables
Fill in your .env file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a free project at https://supabase.com
2. Run the SQL in database/schema.sql in the SQL Editor
3. Go to Authentication > Providers > Email and disable Confirm email
4. Copy your URL and anon key from Settings > API Keys

### Run locally
```bash
npm run dev
```
Open http://localhost:5173

### Build for production
```bash
npm run build
```

## Project Structure
```
src/
├── components/       Navbar and ProtectedRoute
├── context/          AuthContext for global auth state
├── lib/              Supabase client
├── pages/            Landing, Login, Register, Home,
│                     CreateGroup, GroupDetails, MyGroups
├── App.jsx           Routes setup
└── main.jsx          Entry point
```

## License
MIT

Built by @omondi-ochido
