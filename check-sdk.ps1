$sdkPath = "C:\Program Files (x86)\Windows Kits\10"

if (Test-Path $sdkPath) {
    Write-Host "Windows SDK encontrado em: $sdkPath" -ForegroundColor Green
    
    $libPath = Join-Path $sdkPath "Lib"
    if (Test-Path $libPath) {
        Write-Host "Versoes disponiveis:" -ForegroundColor Cyan
        Get-ChildItem $libPath | ForEach-Object { Write-Host "  - $($_.Name)" }
    }
} else {
    Write-Host "Windows SDK NAO encontrado!" -ForegroundColor Red
    Write-Host "Voce precisa instalar o Windows SDK via Visual Studio Installer" -ForegroundColor Yellow
}
