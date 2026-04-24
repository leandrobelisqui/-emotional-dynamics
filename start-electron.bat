@echo off
echo ========================================
echo   Emotional Dynamics - Electron
echo ========================================
echo.
echo Iniciando em 3 passos:
echo.
echo 1. Vite (servidor web do desktop)
echo 2. Build do app mobile (controle remoto)
echo 3. Electron (janela do app + servidor WS)
echo.
echo ========================================
echo.

REM Verifica se node_modules existe
if not exist "node_modules" (
    echo [!] node_modules nao encontrado. Rodando npm install...
    call npm install
    if errorlevel 1 (
        echo [x] Falha no npm install. Abortando.
        pause
        exit /b 1
    )
    echo.
)

echo [1/3] Iniciando Vite em background...
start "Vite Server" cmd /k "npm run dev"

echo.
echo Aguardando Vite iniciar (5 segundos)...
timeout /t 5 /nobreak > nul

echo.
echo [2/3] Buildando app mobile (dist-mobile)...
call npm run build:mobile
if errorlevel 1 (
    echo.
    echo [!] Build do mobile falhou. O Electron ainda vai abrir,
    echo     mas o controle remoto pelo celular nao vai funcionar.
    echo.
    timeout /t 3 /nobreak > nul
)

echo.
echo [3/3] Iniciando Electron...
echo.
echo --- Controle remoto ---
echo Apos o app abrir, clique no botao "Remoto" (icone QR)
echo na barra inferior para pareamento com o celular.
echo Celular e desktop precisam estar na mesma rede WiFi.
echo -----------------------
echo.
call npm run electron:start

echo.
echo ========================================
echo   App fechado!
echo ========================================
pause
