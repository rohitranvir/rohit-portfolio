# Rohit Ranvir — Portfolio

> Python Full Stack Developer & AI/ML Engineer · B.E. Computer Science 2025

[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat&logo=react)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Django%205%20%2B%20DRF-092E20?style=flat&logo=django)](./backend)

---

## Project Structure

```
rohit-portfolio/
├── frontend/          React 19 + Vite + Tailwind CSS v4 + Framer Motion
└── backend/           Django 5 + DRF + PostgreSQL + SimpleJWT
```

---

## Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# → Edit .env with your PostgreSQL credentials and SECRET_KEY

# Run migrations
python manage.py makemigrations api
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# (Optional) Seed with sample data
python manage.py seed_data

# Start server
python manage.py runserver
# → http://localhost:8000
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects/` | Public | All visible projects |
| GET | `/api/skills/` | Public | Skills grouped by category |
| GET | `/api/experience/` | Public | Work experience |
| GET | `/api/certifications/` | Public | Certifications |
| GET | `/api/settings/` | Public | Section visibility |
| POST | `/api/messages/` | Public | Submit contact form |
| POST | `/api/auth/login/` | — | Get JWT tokens |
| POST | `/api/auth/refresh/` | — | Refresh access token |
| GET | `/api/messages/admin/` | JWT | View all messages |

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# → Set VITE_API_URL=http://localhost:8000/api
# → Add EmailJS keys from https://emailjs.com

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, Lenis, tsParticles |
| Backend | Django 5, Django REST Framework, PostgreSQL, SimpleJWT |
| Auth | JWT (access token in memory, refresh via cookie) |
| Email | EmailJS (contact form) |
| Deployment | Vercel (frontend) + Railway/Render (backend) |

---

## Deployment

### Frontend → Vercel

1. Push repo to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Set **Root Directory** → `frontend`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
5. Deploy — Vercel auto-detects Vite

### Backend → Railway

1. New project → Deploy from GitHub
2. Set **Root Directory** → `backend`
3. Add environment variables (copy from `.env.example`)
4. Set `DEBUG=False` and real `SECRET_KEY`
5. Add `CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`
6. Start command: `gunicorn portfolio_backend.wsgi`

---

## Environment Variables Reference

### frontend/.env.local

```env
VITE_API_URL=http://localhost:8000/api
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### backend/.env

```env
SECRET_KEY=your-50-char-random-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## Contact

**Rohit Ranvir** · [rohitranveer358@gmail.com](mailto:rohitranveer358@gmail.com)  
[GitHub](https://github.com/rohitranvir) · [LinkedIn](https://linkedin.com/in/rohit-ranveer)
# Rohit Ranvir — Developer Portfolio

> **Full Stack Python & AI/ML Engineer** · B.E. Computer Science 2025  
> Built with React 19 + Django 5 · JWT Auth · REST API · PostgreSQL

[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat&logo=react)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Django%205%20%2B%20DRF-092E20?style=flat&logo=django)](./backend)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](https://github.com/rohitranvir/portfolio/pulls)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [Environment Variables](#environment-variables)
9. [API Reference](#api-reference)
10. [Authentication Flow](#authentication-flow)
11. [Database Schema](#database-schema)
12. [Deployment](#deployment)
13. [Tech Stack](#tech-stack)
14. [Scripts Reference](#scripts-reference)
15. [Troubleshooting](#troubleshooting)
16. [Contributing](#contributing)
17. [Contact](#contact)

---

## Overview

A production-grade personal portfolio application featuring a **Django REST API backend** and a **React 19 single-page application** frontend. The portfolio dynamically serves project listings, skills, work experience, and certifications from a PostgreSQL database — all manageable via a Django admin panel or JWT-protected endpoints.

Key highlights:

- **Admin dashboard** — manage all portfolio content without touching code
- **Contact form** — EmailJS integration with auto-reply support
- **Smooth UX** — Framer Motion animations + Lenis smooth scroll + tsParticles background
- **Secure auth** — access tokens stored in memory, refresh tokens in HttpOnly cookies
- **Section visibility** — toggle entire portfolio sections on/off from the admin panel

---

## Features

### Public-Facing
- Animated hero section with particle background
- Projects gallery with live demo / GitHub links
- Skills grouped by category (Languages, Frameworks, Tools, etc.)
- Work experience timeline
- Certifications with verification links
- Contact form with email confirmation

### Admin / Protected
- JWT-protected admin message inbox
- Section visibility toggles (show/hide Projects, Skills, Experience, etc.)
- Full CRUD via Django admin at `/admin/`
- Seed command for quick demo data

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                    │
│  React 19 + Vite + Tailwind CSS v4 + Framer Motion  │
│            Deployed on Vercel (CDN)                 │
└───────────────────┬─────────────────────────────────┘
                    │  HTTPS / REST + JWT
┌───────────────────▼─────────────────────────────────┐
│              Django 5 + DRF Backend                 │
│    SimpleJWT · CORS · Gunicorn · WhiteNoise          │
│         Deployed on Railway / Render                │
└───────────────────┬─────────────────────────────────┘
                    │  psycopg2
┌───────────────────▼─────────────────────────────────┐
│               PostgreSQL Database                   │
│        Managed DB (Railway / Supabase / RDS)        │
└─────────────────────────────────────────────────────┘
```

### Request Lifecycle

1. Browser fetches the React SPA from Vercel's CDN.
2. React app calls `VITE_API_URL` (Django backend) for data on mount.
3. Django validates the request, queries PostgreSQL, and returns JSON.
4. For admin routes the browser sends an `Authorization: Bearer <token>` header.
5. Refresh tokens are stored in an HttpOnly cookie — never exposed to JavaScript.

---

## Project Structure

```
rohit-portfolio/
│
├── frontend/                        # React SPA
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                     # Axios instance + API helpers
│   │   │   └── index.js
│   │   ├── assets/                  # Images, fonts
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Certifications.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── useScrollSpy.js
│   │   ├── pages/                   # Route-level components
│   │   │   ├── Home.jsx
│   │   │   └── Admin.jsx
│   │   ├── store/                   # Global state (Context / Zustand)
│   │   ├── styles/                  # Global CSS / Tailwind config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── .env.local                   # ← git-ignored, you create this
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # Django REST API
│   ├── api/                         # Main Django app
│   │   ├── migrations/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_data.py     # Demo data seeder
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── portfolio_backend/           # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── .env.example
│   ├── .env                         # ← git-ignored, you create this
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile                     # For Railway / Render
│
└── README.md
```

---

## Prerequisites

Make sure the following are installed before continuing:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Python | 3.11+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| PostgreSQL | 14+ | `psql --version` |
| Git | any | `git --version` |

> **Tip:** Use [pyenv](https://github.com/pyenv/pyenv) to manage Python versions and [nvm](https://github.com/nvm-sh/nvm) for Node.js.

---

## Backend Setup

### 1. Clone and Navigate

```bash
git clone https://github.com/rohitranvir/portfolio.git
cd portfolio/backend
```

### 2. Create a Virtual Environment

```bash
python -m venv venv

# Activate (Linux / macOS)
source venv/bin/activate

# Activate (Windows PowerShell)
venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Create a PostgreSQL Database

```sql
-- Run in psql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

### 5. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` — see the [Environment Variables](#environment-variables) section for every key.

### 6. Run Migrations

```bash
python manage.py makemigrations api
python manage.py migrate
```

### 7. Create a Superuser (Admin Access)

```bash
python manage.py createsuperuser
```

Follow the prompts. You'll use these credentials at `http://localhost:8000/admin/`.

### 8. (Optional) Seed Sample Data

```bash
python manage.py seed_data
```

This populates the database with demo projects, skills, experience entries, and certifications so you can preview the portfolio immediately.

### 9. Start the Development Server

```bash
python manage.py runserver
```

The API is now live at **http://localhost:8000**.  
Admin panel: **http://localhost:8000/admin/**

---

## Frontend Setup

### 1. Navigate to the Frontend Directory

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — set your API URL and EmailJS credentials. See [Environment Variables](#environment-variables).

> **EmailJS setup:** Create a free account at [emailjs.com](https://emailjs.com), add an email service and two templates (contact + auto-reply), then copy the IDs into `.env.local`.

### 4. Start the Dev Server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 5. Production Build (Local Preview)

```bash
npm run build        # Outputs to dist/
npm run preview      # Serves dist/ at http://localhost:4173
```

---

## Environment Variables

### `frontend/.env.local`

```env
# Backend API base URL — no trailing slash
VITE_API_URL=http://localhost:8000/api

# EmailJS — https://emailjs.com
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_contact_template_id
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### `backend/.env`

```env
# Django
SECRET_KEY=your-50-char-random-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# CORS — comma-separated list of allowed frontend origins
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Cookie settings (set to True in production with HTTPS)
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

> **Generating a SECRET_KEY:**
> ```bash
> python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
> ```

---

## API Reference

### Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:8000/api` |
| Production | `https://your-backend.railway.app/api` |

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/projects/` | All visible projects | Array of project objects |
| `GET` | `/skills/` | Skills grouped by category | Object keyed by category |
| `GET` | `/experience/` | Work experience entries | Array of experience objects |
| `GET` | `/certifications/` | Certifications list | Array of certification objects |
| `GET` | `/settings/` | Section visibility flags | Object with boolean flags |
| `POST` | `/messages/` | Submit a contact message | `201 Created` |

### Auth Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login/` | `{ username, password }` | Returns access + refresh tokens |
| `POST` | `/auth/refresh/` | Refresh token (cookie) | Returns new access token |
| `POST` | `/auth/logout/` | — | Clears refresh token cookie |

### Protected Endpoints (JWT Required)

Send `Authorization: Bearer <access_token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/messages/admin/` | Fetch all contact messages |
| `DELETE` | `/messages/admin/<id>/` | Delete a message |

### Sample Response — `GET /projects/`

```json
[
  {
    "id": 1,
    "title": "AI Resume Screener",
    "description": "NLP-powered tool that ranks resumes against a job description.",
    "tech_stack": ["Python", "spaCy", "FastAPI", "React"],
    "github_url": "https://github.com/rohitranvir/ai-screener",
    "live_url": "https://ai-screener.vercel.app",
    "thumbnail": "/media/projects/ai-screener.png",
    "is_visible": true,
    "order": 1
  }
]
```

### Sample Response — `GET /skills/`

```json
{
  "Languages": ["Python", "JavaScript", "TypeScript", "SQL"],
  "Frameworks": ["Django", "React", "FastAPI"],
  "AI/ML": ["TensorFlow", "PyTorch", "scikit-learn", "LangChain"],
  "Tools": ["Git", "Docker", "PostgreSQL", "Redis"]
}
```

---

## Authentication Flow

This project uses a **dual-token strategy** for security:

```
1. POST /auth/login/ → { access_token, refresh_token }
                         ↓                  ↓
               Stored in JS memory    HttpOnly cookie
                                      (never in JS)

2. Access token expires in 15 minutes.
   Before expiry, client calls POST /auth/refresh/
   Cookie is sent automatically → new access token returned.

3. On logout, POST /auth/logout/ clears the cookie server-side.
```

This prevents XSS attacks from stealing the refresh token (it's never accessible via `document.cookie`).

---

## Database Schema

### Key Models

```
Project
  ├── title (CharField)
  ├── description (TextField)
  ├── tech_stack (ArrayField / JSONField)
  ├── github_url (URLField)
  ├── live_url (URLField)
  ├── thumbnail (ImageField)
  ├── is_visible (BooleanField)
  └── order (IntegerField)

Skill
  ├── name (CharField)
  ├── category (CharField)  ← used for grouping
  └── order (IntegerField)

Experience
  ├── company (CharField)
  ├── role (CharField)
  ├── start_date (DateField)
  ├── end_date (DateField, nullable)
  ├── description (TextField)
  └── is_current (BooleanField)

Certification
  ├── title (CharField)
  ├── issuer (CharField)
  ├── issued_date (DateField)
  ├── credential_url (URLField)
  └── is_visible (BooleanField)

ContactMessage
  ├── name (CharField)
  ├── email (EmailField)
  ├── message (TextField)
  ├── created_at (DateTimeField, auto)
  └── is_read (BooleanField)

SiteSettings
  ├── show_projects (BooleanField)
  ├── show_skills (BooleanField)
  ├── show_experience (BooleanField)
  └── show_certifications (BooleanField)
```

---

## Deployment

### Frontend → Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
3. Set **Root Directory** to `frontend`.
4. Add these environment variables in the Vercel dashboard:

   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```

5. Click **Deploy**. Vercel auto-detects Vite — no extra config needed.
6. Your site is live at `https://your-project.vercel.app`.

> **Custom domain:** In Vercel → **Settings → Domains**, add your domain and follow the DNS instructions.

---

### Backend → Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Select your repo. Set **Root Directory** to `backend`.
3. Add a **PostgreSQL** service to the same project (Railway will inject `DATABASE_URL` automatically, or set individual DB variables).
4. Add environment variables:

   ```
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-backend.railway.app
   DB_NAME=...
   DB_USER=...
   DB_PASSWORD=...
   DB_HOST=...
   DB_PORT=5432
   CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   ```

5. Set the **Start Command** to:

   ```bash
   gunicorn portfolio_backend.wsgi --bind 0.0.0.0:$PORT
   ```

6. Trigger a deployment from the Railway dashboard.
7. Run migrations via Railway's shell tab:

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

> **Alternative:** Use [Render.com](https://render.com) — same steps, free tier available.

---

### Post-Deployment Checklist

- [ ] `DEBUG=False` in production
- [ ] `SECRET_KEY` is a fresh 50-char random string (not the dev key)
- [ ] `ALLOWED_HOSTS` includes your Railway/Render domain
- [ ] `CORS_ALLOWED_ORIGINS` includes your Vercel domain
- [ ] `SESSION_COOKIE_SECURE=True` and `CSRF_COOKIE_SECURE=True`
- [ ] Run `python manage.py collectstatic` if serving media files
- [ ] PostgreSQL database is provisioned and migrations applied
- [ ] Superuser created for admin access

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | Component-based UI |
| | Vite | Lightning-fast dev server + bundler |
| | Tailwind CSS v4 | Utility-first styling |
| | Framer Motion | Scroll and mount animations |
| | Lenis | Smooth scrolling |
| | tsParticles | Hero background effects |
| | Axios | HTTP client with interceptors |
| **Backend** | Django 5 | Web framework + ORM + admin |
| | Django REST Framework | API serialization and views |
| | SimpleJWT | JWT access + refresh tokens |
| | Gunicorn | WSGI production server |
| | WhiteNoise | Static file serving |
| **Database** | PostgreSQL 14+ | Primary data store |
| | psycopg2 | Python PostgreSQL adapter |
| **Email** | EmailJS | Contact form (no backend SMTP needed) |
| **Auth** | JWT (dual-token) | Access token in memory, refresh in cookie |
| **Deployment** | Vercel | Frontend CDN + CI/CD |
| | Railway / Render | Backend hosting |

---

## Scripts Reference

### Backend

```bash
# Run development server
python manage.py runserver

# Create and apply migrations
python manage.py makemigrations api
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Load demo data
python manage.py seed_data

# Open Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic --noinput
```

### Frontend

```bash
# Start development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint

# Format
npm run format
```

---

## Troubleshooting

### `django.db.OperationalError: could not connect to server`
- Confirm PostgreSQL is running: `sudo service postgresql start`
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env`
- Ensure the database exists: `psql -l | grep portfolio_db`

### CORS errors in the browser console
- Add your frontend origin to `CORS_ALLOWED_ORIGINS` in `.env`
- Make sure there's no trailing slash: `http://localhost:5173` ✓ `http://localhost:5173/` ✗
- Restart the Django server after changing `.env`

### JWT `401 Unauthorized` on admin endpoints
- Access tokens expire in 15 minutes — call `/auth/refresh/` to get a new one
- Make sure the `Authorization` header is formatted as `Bearer <token>` (capital B)

### `npm install` fails with Node version errors
- Check required Node version: `cat frontend/package.json | grep engines`
- Switch version with nvm: `nvm use 18`

### EmailJS contact form not sending
- Verify all four `VITE_EMAILJS_*` variables are set in `.env.local`
- Check your EmailJS dashboard for daily send limit (free tier: 200/month)
- Ensure the template variables match what the frontend sends

### Vite env variables not loading
- Variables must start with `VITE_` to be exposed to the browser
- Restart `npm run dev` after changing `.env.local`
- Do not commit `.env.local` — it's in `.gitignore`

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

---

## Contact

**Rohit Ranvir**

- Email: [rohitranveer358@gmail.com](mailto:rohitranveer358@gmail.com)
- GitHub: [@rohitranvir](https://github.com/rohitranvir)
- LinkedIn: [rohit-ranveer](https://linkedin.com/in/rohit-ranveer)

---

<p align="center">Made with ☕ and Python by Rohit Ranvir</p>