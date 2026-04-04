Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Habit Tracker Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download and install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Choose the LTS version for stability" -ForegroundColor Yellow
    Read-Host "Press Enter after installing Node.js"
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file. Please edit it with your database credentials." -ForegroundColor Yellow
} else {
    Write-Host ".env file already exists." -ForegroundColor Green
}

Write-Host ""
Write-Host "PostgreSQL Setup Instructions:" -ForegroundColor Yellow
Write-Host "- Ensure PostgreSQL is installed and running" -ForegroundColor White
Write-Host "- Create a database named 'habit_tracker'" -ForegroundColor White
Write-Host "- Update the .env file with your database credentials" -ForegroundColor White
Read-Host "Press Enter after setting up PostgreSQL"

Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
npm run migrate

Write-Host ""
$seedChoice = Read-Host "Do you want to seed sample data? (y/n)"
if ($seedChoice -eq "y" -or $seedChoice -eq "Y") {
    Write-Host "Seeding sample data..." -ForegroundColor Yellow
    npm run seed
    Write-Host ""
    Write-Host "Demo credentials:" -ForegroundColor Green
    Write-Host "  Email: demo@example.com" -ForegroundColor White
    Write-Host "  Password: password123" -ForegroundColor White
} else {
    Write-Host "Skipping sample data seeding." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development server:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "API will be available at: http://localhost:3001" -ForegroundColor White
Write-Host "Health check: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"