# Task Fixer - Start Script

Write-Host "🚀 Starting Task Fixer Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is installed
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue
if (-not $mongoInstalled) {
    Write-Host "⚠️  MongoDB not found!" -ForegroundColor Yellow
    Write-Host "Installing MongoDB using Chocolatey..." -ForegroundColor Yellow
    Write-Host ""
    choco install mongodb -y
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install MongoDB" -ForegroundColor Red
        Write-Host "Please install manually from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or skip MongoDB and use LocalStorage only (press Enter to continue)" -ForegroundColor Yellow
        Read-Host
    }
}

# Start MongoDB if available
if (Get-Command mongod -ErrorAction SilentlyContinue) {
    Write-Host "📊 Starting MongoDB..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "mongod" -WindowStyle Minimized
    Start-Sleep -Seconds 3
}

# Check if backend dependencies are installed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Green  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Green
Set-Location Main
npm run dev

Write-Host ""
Write-Host "✅ Task Fixer is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
