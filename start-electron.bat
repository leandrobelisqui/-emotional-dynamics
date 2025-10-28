@echo off
echo ========================================
echo   Emotional Dynamics - Electron
echo ========================================
echo.
echo Iniciando em 2 passos:
echo.
echo 1. Vite (servidor web)
echo 2. Electron (janela do app)
echo.
echo ========================================
echo.

echo [1/2] Iniciando Vite...
start "Vite Server" cmd /k "npm run dev"

echo.
echo Aguardando Vite iniciar (5 segundos)...
timeout /t 5 /nobreak > nul

echo.
echo [2/2] Iniciando Electron...
npm run electron:start

echo.
echo ========================================
echo   App fechado!
echo ========================================
pause
