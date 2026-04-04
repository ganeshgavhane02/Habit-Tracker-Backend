@echo off
echo ========================================
echo    Habit Tracker Backend Setup
echo ========================================
echo.

echo Step 1: Installing Node.js...
echo Please download and install Node.js from: https://nodejs.org/
echo Choose the LTS version for stability
echo.
echo After installing Node.js, press any key to continue...
pause >nul

echo.
echo Step 2: Installing dependencies...
npm install

echo.
echo Step 3: Setting up environment...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your database credentials.
) else (
    echo .env file already exists.
)

echo.
echo Step 4: Setting up PostgreSQL...
echo Please ensure PostgreSQL is installed and running.
echo Create a database named 'habit_tracker'
echo Update the .env file with your database credentials.
echo.
echo Press any key to continue with database setup...
pause >nul

echo.
echo Step 5: Running database migrations...
npm run migrate

echo.
echo Step 6: Seeding sample data (optional)...
echo This will create a demo user: demo@example.com / password123
set /p choice="Do you want to seed sample data? (y/n): "
if /i "%choice%"=="y" (
    npm run seed
) else (
    echo Skipping sample data seeding.
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start the development server:
echo   npm run dev
echo.
echo API will be available at: http://localhost:3001
echo Health check: http://localhost:3001/health
echo.
echo Demo credentials (if seeded):
echo   Email: demo@example.com
echo   Password: password123
echo.
pause