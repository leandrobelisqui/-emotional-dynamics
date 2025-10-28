# Script SIMPLES para limpar Git - Recomeçar do zero
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Limpeza SIMPLES do Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Este script vai RECRIAR o repositório Git do zero" -ForegroundColor Yellow
Write-Host "⚠️  Você perderá o histórico de commits anterior" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Deseja continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# 1. Backup do .git atual
Write-Host "[1/5] Criando backup..." -ForegroundColor Yellow
if (Test-Path ".git") {
    $backupName = ".git-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Move-Item -Path ".git" -Destination $backupName
    Write-Host "✅ Backup criado: $backupName" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nenhum repositório Git encontrado" -ForegroundColor Yellow
}
Write-Host ""

# 2. Inicializar novo repositório
Write-Host "[2/5] Inicializando novo repositório..." -ForegroundColor Yellow
git init
git branch -M main
Write-Host "✅ Repositório inicializado" -ForegroundColor Green
Write-Host ""

# 3. Adicionar arquivos (respeitando .gitignore)
Write-Host "[3/5] Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host "✅ Arquivos adicionados" -ForegroundColor Green
Write-Host ""

# 4. Primeiro commit
Write-Host "[4/5] Criando commit inicial..." -ForegroundColor Yellow
git commit -m "chore: repositório limpo - sem node_modules"
Write-Host "✅ Commit criado" -ForegroundColor Green
Write-Host ""

# 5. Verificar tamanho
Write-Host "[5/5] Verificando tamanho do repositório..." -ForegroundColor Yellow
git count-objects -vH
Write-Host ""

# Instruções finais
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Limpeza Concluída!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Criar repositório no GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Adicionar remote:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/SEU-USUARIO/emotional-dynamics.git" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Enviar para GitHub:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "Se algo der errado, restaure o backup:" -ForegroundColor Yellow
Write-Host "   Remove-Item -Path .git -Recurse -Force" -ForegroundColor Gray
Write-Host "   Move-Item -Path $backupName -Destination .git" -ForegroundColor Gray
Write-Host ""
