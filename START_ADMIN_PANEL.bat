@echo off
setlocal
cd /d "%~dp0"
echo.
echo =========================================
echo   ASML-ERP Admin Dashboard ^(Demo Only^)
echo =========================================
echo.
echo Starting local web server on port 8000...
echo Demo login: admin@asml-erp.com / admin123
echo Close this window or press Ctrl+C to stop the server.
echo.
where py >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "" "http://localhost:8000/login.html"
    py -3 -m http.server 8000
    goto :end
)
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "" "http://localhost:8000/login.html"
    python -m http.server 8000
    goto :end
)
echo Python 3 is required. Install it from https://www.python.org/downloads/
echo Alternatively, use a local web-server extension in VS Code.
pause
:end
endlocal
