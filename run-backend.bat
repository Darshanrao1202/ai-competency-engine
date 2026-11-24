@echo off
title AI Competency Engine - FastAPI Backend
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0backend"
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
) else (
    echo [ERROR] Python virtual environment not found in backend\.venv!
    pause
)
