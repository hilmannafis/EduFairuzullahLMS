@echo off
echo ========================================
echo Starting Server (Clean Start)
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Killing any existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Checking if port 3000 is free...
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo Port 3000 is still in use. Finding and killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        echo Killing process ID: %%a
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo Step 3: Starting server...
echo.
node server.js

pause


