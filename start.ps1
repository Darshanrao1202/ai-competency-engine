Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Starting AI Competency Engine (Full-Stack)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }

Write-Host "Launching Backend on http://127.0.0.1:8005..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; & '$scriptDir\backend\.venv\Scripts\python.exe' -m uvicorn main:app --host 127.0.0.1 --port 8005 --reload"

Start-Sleep -Seconds 3

Write-Host "Launching Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm run dev"

Start-Sleep -Seconds 4

Write-Host "Opening http://localhost:3000 in your browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"
