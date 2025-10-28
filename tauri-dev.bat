@echo off
echo === Iniciando Tauri com ambiente MSVC ===
echo.

REM Configurar ambiente MSVC
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"

echo.
echo === Ambiente MSVC configurado ===
echo.

REM Executar tauri dev
npm run tauri:dev
