# Script para configurar e enviar projeto para o GitHub
# Execute: .\setup-github.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup GitHub - Emotional Dynamics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está instalado
Write-Host "[1/6] Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git instalado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o Git:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Baixe e instale" -ForegroundColor White
    Write-Host "3. Execute este script novamente" -ForegroundColor White
    pause
    exit
}

Write-Host ""

# Verificar se já é um repositório Git
Write-Host "[2/6] Verificando repositório Git..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
    
    # Verificar se tem remote
    $hasRemote = git remote -v
    if ($hasRemote) {
        Write-Host "✅ Remote configurado:" -ForegroundColor Green
        Write-Host $hasRemote -ForegroundColor White
        Write-Host ""
        $continuar = Read-Host "Deseja reconfigurar? (s/N)"
        if ($continuar -ne "s" -and $continuar -ne "S") {
            Write-Host "Abortado pelo usuário" -ForegroundColor Yellow
            pause
            exit
        }
    }
} else {
    Write-Host "⚠️  Repositório Git não existe. Criando..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositório Git criado" -ForegroundColor Green
}

Write-Host ""

# Configurar usuário Git (se necessário)
Write-Host "[3/6] Configurando usuário Git..." -ForegroundColor Yellow
$gitUser = git config user.name
$gitEmail = git config user.email

if (-not $gitUser) {
    Write-Host "⚠️  Nome de usuário não configurado" -ForegroundColor Yellow
    $nome = Read-Host "Digite seu nome"
    git config --global user.name "$nome"
    Write-Host "✅ Nome configurado: $nome" -ForegroundColor Green
} else {
    Write-Host "✅ Nome: $gitUser" -ForegroundColor Green
}

if (-not $gitEmail) {
    Write-Host "⚠️  Email não configurado" -ForegroundColor Yellow
    $email = Read-Host "Digite seu email"
    git config --global user.email "$email"
    Write-Host "✅ Email configurado: $email" -ForegroundColor Green
} else {
    Write-Host "✅ Email: $gitEmail" -ForegroundColor Green
}

Write-Host ""

# Solicitar URL do repositório
Write-Host "[4/6] Configurando repositório remoto..." -ForegroundColor Yellow
Write-Host ""
Write-Host "INSTRUÇÕES:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/new" -ForegroundColor White
Write-Host "2. Crie um repositório chamado: emotional-dynamics" -ForegroundColor White
Write-Host "3. NÃO marque 'Add a README file'" -ForegroundColor White
Write-Host "4. Copie a URL do repositório" -ForegroundColor White
Write-Host ""
Write-Host "Exemplo de URL:" -ForegroundColor Yellow
Write-Host "https://github.com/seu-usuario/emotional-dynamics.git" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "Cole a URL do seu repositório GitHub"

if (-not $repoUrl) {
    Write-Host "❌ URL não fornecida!" -ForegroundColor Red
    pause
    exit
}

# Remover remote existente se houver
try {
    git remote remove origin 2>$null
} catch {}

# Adicionar novo remote
git remote add origin $repoUrl
Write-Host "✅ Remote configurado: $repoUrl" -ForegroundColor Green

Write-Host ""

# Adicionar arquivos
Write-Host "[5/6] Preparando arquivos..." -ForegroundColor Yellow
git add .
Write-Host "✅ Arquivos adicionados" -ForegroundColor Green

Write-Host ""

# Fazer commit
Write-Host "[6/6] Criando commit inicial..." -ForegroundColor Yellow
$commitMsg = "Initial commit: Emotional Dynamics v1.0

Funcionalidades:
- Editor de blocos de texto e áudio
- Reprodução com crossfade
- Controle de volume e tempo
- Loop automático
- Salvar/carregar scripts
- Suporte Electron e Tauri"

git commit -m "$commitMsg"
Write-Host "✅ Commit criado" -ForegroundColor Green

Write-Host ""

# Renomear branch para main
Write-Host "Renomeando branch para 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Branch renomeada" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Pronto para enviar!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRÓXIMO PASSO:" -ForegroundColor Yellow
Write-Host "Execute o comando:" -ForegroundColor White
Write-Host ""
Write-Host "  git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "Se pedir autenticação:" -ForegroundColor Yellow
Write-Host "- Username: seu-usuario-github" -ForegroundColor White
Write-Host "- Password: use um Personal Access Token" -ForegroundColor White
Write-Host "  (Crie em: https://github.com/settings/tokens)" -ForegroundColor White
Write-Host ""

$push = Read-Host "Deseja fazer o push agora? (s/N)"
if ($push -eq "s" -or $push -eq "S") {
    Write-Host ""
    Write-Host "Enviando para o GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   ✅ SUCESSO!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Seu projeto está no GitHub!" -ForegroundColor Green
        Write-Host "Acesse: $repoUrl" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
        Write-Host ""
        Write-Host "Tente manualmente:" -ForegroundColor Yellow
        Write-Host "  git push -u origin main" -ForegroundColor White
    }
}

Write-Host ""
pause
