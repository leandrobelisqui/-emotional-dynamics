@echo off
echo === Instalando Electron ===
echo.
echo Isso pode levar alguns minutos...
echo.

npm install --save-dev electron@latest electron-builder@latest concurrently@latest wait-on@latest cross-env@latest

echo.
echo === Instalacao concluida! ===
echo.
echo Para rodar o app:
echo   npm run electron:dev
echo.
pause
