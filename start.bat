@echo off
title AI Competency Engine Launcher
echo ===================================================
echo  Starting AI Competency Engine (Full-Stack)
echo ===================================================
echo.
echo Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo Launching Next.js Frontend on http://localhost:3000 ...
start "Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for frontend to start...
timeout /t 4 /nobreak > nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ===================================================
echo  Both services are running!
echo  - Frontend: http://localhost:3000
echo  - Backend API: http://127.0.0.1:8000
echo  - Swagger Docs: http://127.0.0.1:8000/docs
echo ===================================================
