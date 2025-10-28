# Script para configurar o ambiente MSVC para Rust/Tauri

Write-Host "=== Configuracao do Ambiente MSVC ===" -ForegroundColor Cyan
Write-Host ""

# Usar vswhere para encontrar Visual Studio
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"

if (Test-Path $vswhere) {
    Write-Host "Procurando Visual Studio com vswhere..." -ForegroundColor Yellow
    $vsPath = & $vswhere -latest -property installationPath
    
    if ($vsPath) {
        Write-Host "Visual Studio encontrado em: $vsPath" -ForegroundColor Green
        
        $vcvarsPath = Join-Path $vsPath "VC\Auxiliary\Build\vcvars64.bat"
        $vsDevCmd = Join-Path $vsPath "Common7\Tools\VsDevCmd.bat"
        
        $batFile = $null
        if (Test-Path $vcvarsPath) {
            $batFile = $vcvarsPath
        } elseif (Test-Path $vsDevCmd) {
            $batFile = $vsDevCmd
        }
        
        if ($batFile) {
            Write-Host "Executando: $batFile" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "IMPORTANTE: Este script configura apenas a sessao atual." -ForegroundColor Yellow
            Write-Host "Para usar o Tauri, execute os comandos na MESMA janela do terminal." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Execute agora:" -ForegroundColor Cyan
            Write-Host "  cmd /k `"$batFile`"" -ForegroundColor White
            Write-Host "  npm run tauri:dev" -ForegroundColor White
        } else {
            Write-Host "Nao foi possivel encontrar vcvars64.bat ou VsDevCmd.bat" -ForegroundColor Red
        }
    } else {
        Write-Host "Visual Studio nao encontrado com vswhere" -ForegroundColor Red
    }
} else {
    Write-Host "vswhere.exe nao encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solucao alternativa:" -ForegroundColor Yellow
    Write-Host "1. Abra 'Developer Command Prompt for VS 2022' do menu Iniciar" -ForegroundColor White
    Write-Host "2. Navegue ate: $PWD" -ForegroundColor White
    Write-Host "3. Execute: npm run tauri:dev" -ForegroundColor White
}
