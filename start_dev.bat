@echo off
title Portfolio Startup
echo =======================================================
echo Starting Rohit Portfolio (Merged Version)
echo =======================================================
echo.
echo [1] Starting Django Backend in a new window...
start "Django Backend Server" cmd /k "cd backend && ..\..\venv\Scripts\activate.bat && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver"

echo [2] Starting React/Vite Frontend in this window...
cd frontend
npm install && npm run dev
