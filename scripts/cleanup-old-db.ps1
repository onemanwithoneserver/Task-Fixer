# MongoDB Database Cleanup Script
Write-Host ""
Write-Host "🗑️  MongoDB Database Cleanup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Write-Host "⚠️  MongoDB is not running!" -ForegroundColor Yellow
    Write-Host "Starting MongoDB..." -ForegroundColor Yellow
    Start-Process mongod -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

Write-Host "This will help you delete your old 'Bharat Shurka' database" -ForegroundColor White
Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Run cleanup tool
Set-Location backend
Write-Host ""
Write-Host "🚀 Starting cleanup tool..." -ForegroundColor Green
Write-Host ""
node cleanup-db.js

Set-Location ..

Write-Host ""
Write-Host "✅ Done! Your Task Fixer will now use a fresh database." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
