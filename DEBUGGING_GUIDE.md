# Debugging Setup Guide

## Problem
You encountered the error: "Cannot connect to the target at localhost:9222: Could not connect to debug target at http://localhost:9222: Could not find any debuggable target"

## Root Cause
The debug configuration was trying to attach to Chrome on port 9222, but Chrome wasn't running with remote debugging enabled.

## Solution Implemented

### 1. Updated Launch Configurations
Modified `.vscode/launch.json` to include multiple debugging options:

- **Launch Frontend (Chrome)**: Starts Chrome with remote debugging enabled and opens http://localhost:3000
- **Attach to Chrome (9222)**: Attaches to an existing Chrome instance with remote debugging on port 9222
- **Launch Backend (Node.js)**: Starts the backend server with Node.js inspector
- **Attach to Node.js**: Attaches to a running Node.js process on port 9229
- **Launch Full Stack**: Starts both backend and frontend with integrated debugging
- **Full Stack Debug**: Compound configuration for simultaneous debugging

### 2. Created Chrome Debug Helper
Created `start-chrome-debug.bat` to start Chrome with remote debugging:
```bash
start chrome.exe --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile"
```

## How to Debug

### Option 1: Simple Frontend Debugging
1. Ensure your frontend dev server is running (port 3000)
2. In VS Code, select "Launch Frontend (Chrome)" from the debug dropdown
3. Click the green play button (F5)
4. Chrome will open with debugging enabled

### Option 2: Attach to Existing Chrome
1. Start Chrome with remote debugging:
   - Run `start-chrome-debug.bat` OR
   - Manually: `chrome.exe --remote-debugging-port=9222`
2. Navigate to http://localhost:3000
3. In VS Code, select "Attach to Chrome (9222)"
4. Click the green play button

### Option 3: Backend Debugging
1. In VS Code, select "Launch Backend (Node.js)"
2. Click the green play button
3. Set breakpoints in `server.js` or any backend files
4. The backend will start on port 3001 with debugging enabled

### Option 4: Full Stack Debugging
1. In VS Code, select "Full Stack Debug"
2. Click the green play button
3. Both backend and frontend will start with integrated debugging

## Port Configuration
- Frontend: 3000 (Vite dev server)
- Backend: 3001 (Express server)
- Chrome Debug: 9222 (Remote debugging)
- Node.js Debug: 9229 (Inspector)

## Troubleshooting

### "Cannot connect to the target at localhost:9222"
- Ensure Chrome is running with `--remote-debugging-port=9222`
- Close all Chrome instances and restart with the debug flag
- Check if port 9222 is in use: `netstat -ano | findstr :9222`

### "Could not find any debuggable target"
- Make sure Chrome has at least one tab open
- Navigate to a page (e.g., http://localhost:3000)
- The page must be served from a local server

### Node.js debugging not working
- Ensure Node.js is installed and in PATH
- Check if port 9229 is available
- Verify the backend server starts successfully

## Notes
- The frontend must be built/bundled for source maps to work correctly
- For React component debugging, ensure source maps are enabled in Vite
- Backend debugging works best with the "Launch Backend (Node.js)" configuration

## Quick Start
1. Open VS Code
2. Go to the Run and Debug view (Ctrl+Shift+D)
3. Select "Launch Frontend (Chrome)" 
4. Press F5 to start debugging