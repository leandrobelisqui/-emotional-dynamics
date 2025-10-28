# Script para adicionar Rust ao PATH permanentemente

$cargoPath = "$env:USERPROFILE\.cargo\bin"

Write-Host "Verificando instalação do Rust..." -ForegroundColor Cyan

if (Test-Path "$cargoPath\rustc.exe") {
    Write-Host "✓ Rust encontrado em: $cargoPath" -ForegroundColor Green
    
    # Adicionar ao PATH do usuário permanentemente
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$cargoPath*") {
        Write-Host "Adicionando Rust ao PATH do usuário..." -ForegroundColor Yellow
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$cargoPath", "User")
        Write-Host "✓ PATH atualizado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANTE: Feche e reabra o terminal para aplicar as mudanças." -ForegroundColor Yellow
    } else {
        Write-Host "✓ Rust já está no PATH" -ForegroundColor Green
    }
    
    # Adicionar ao PATH da sessão atual
    $env:Path += ";$cargoPath"
    
    Write-Host ""
    Write-Host "Testando instalação..." -ForegroundColor Cyan
    rustc --version
    cargo --version
    
    Write-Host ""
    Write-Host "✓ Rust configurado com sucesso!" -ForegroundColor Green
    Write-Host "Agora você pode executar: npm run tauri:dev" -ForegroundColor Cyan
    
} else {
    Write-Host "✗ Rust não encontrado em: $cargoPath" -ForegroundColor Red
    Write-Host "Por favor, reinstale o Rust de: https://rustup.rs/" -ForegroundColor Yellow
}
