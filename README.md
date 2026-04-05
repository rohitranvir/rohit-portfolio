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
