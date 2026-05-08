@echo off
echo ========================================
echo Opening Edu Fairuzullah LMS
echo ========================================
echo.
echo Opening http://localhost:3000 in your browser...
echo.

REM Check if server is running
netstat -ano | findstr :3000 >nul
if %errorlevel% neq 0 (
    echo Server is not running! Starting server...
    echo.
    start /B node server.js
    timeout /t 3 /nobreak >nul
)

REM Open browser
start http://localhost:3000

echo.
echo Browser should open now!
echo If it doesn't work, make sure the server is running.
echo.
pause


