# Script para limpar o histórico do Git e remover node_modules
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Limpeza do Repositório Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se há mudanças não commitadas
Write-Host "[1/6] Verificando mudanças não commitadas..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "❌ Há mudanças não commitadas!" -ForegroundColor Red
    Write-Host "Por favor, commit ou descarte as mudanças antes de continuar." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Nenhuma mudança pendente" -ForegroundColor Green
Write-Host ""

# 2. Criar backup do branch atual
Write-Host "[2/6] Criando backup..." -ForegroundColor Yellow
$backupBranch = "backup-antes-limpeza-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupBranch
Write-Host "✅ Backup criado: $backupBranch" -ForegroundColor Green
Write-Host ""

# 3. Remover node_modules e package-lock.json do histórico
Write-Host "[3/6] Removendo node_modules do histórico..." -ForegroundColor Yellow
Write-Host "⚠️  Isso pode demorar alguns minutos..." -ForegroundColor Yellow

git filter-branch --force --index-filter `
  "git rm -rf --cached --ignore-unmatch node_modules package-lock.json" `
  --prune-empty --tag-name-filter cat -- --all

Write-Host "✅ Arquivos removidos do histórico" -ForegroundColor Green
Write-Host ""

# 4. Limpar referências antigas
Write-Host "[4/6] Limpando referências antigas..." -ForegroundColor Yellow
Remove-Item -Path .git/refs/original -Recurse -Force -ErrorAction SilentlyContinue
git reflog expire --expire=now --all
git gc --prune=now --aggressive
Write-Host "✅ Referências limpas" -ForegroundColor Green
Write-Host ""

# 5. Verificar tamanho do repositório
Write-Host "[5/6] Verificando novo tamanho..." -ForegroundColor Yellow
git count-objects -vH
Write-Host ""

# 6. Instruções finais
Write-Host "[6/6] Próximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para enviar ao GitHub, execute:" -ForegroundColor Cyan
Write-Host "  git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git" -ForegroundColor White
Write-Host "  git push -f origin main" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Use -f (force) apenas na primeira vez!" -ForegroundColor Red
Write-Host "⚠️  Se o repositório já existe no GitHub, isso sobrescreverá o histórico!" -ForegroundColor Red
Write-Host ""
Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Se algo der errado, você pode restaurar o backup:" -ForegroundColor Yellow
Write-Host "  git checkout $backupBranch" -ForegroundColor White
Write-Host ""
