@echo off
echo.
echo ========================================
echo    Task Fixer - Quick Start
echo ========================================
echo.

echo [1/3] Starting MongoDB...
start "MongoDB" mongod
timeout /t 3 >nul

echo [2/3] Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 >nul

echo [3/3] Starting Frontend...
cd Main
npm run dev

echo.
echo ========================================
echo   Task Fixer is running!
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:5000
echo ========================================
