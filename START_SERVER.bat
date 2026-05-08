@echo off
echo ========================================
echo Starting Edu Fairuzullah LMS Server
echo ========================================
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Starting server...
echo Please wait...
echo.
node server.js
pause


