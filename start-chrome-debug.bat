@echo off
echo Starting Chrome with remote debugging on port 9222...
echo.
echo If Chrome is already running, close it first or use a different user data directory.
echo.

REM Close any existing Chrome instances (optional)
REM taskkill /F /IM chrome.exe 2>nul

REM Start Chrome with remote debugging
start chrome.exe --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile"

echo.
echo Chrome started with remote debugging enabled.
echo You can now use the "Attach to Chrome (9222)" debug configuration in VS Code.
echo.
pause