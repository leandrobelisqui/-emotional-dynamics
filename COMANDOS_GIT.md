# 🚀 Comandos Git - Guia Rápido

## 📦 Primeira Vez (Setup Inicial)

### Opção 1: Script Automático (Recomendado)

```powershell
.\setup-github.ps1
```

Este script faz tudo automaticamente!

### Opção 2: Manual

```powershell
# 1. Inicializar Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "Initial commit: Emotional Dynamics v1.0"

# 4. Renomear branch para main
git branch -M main

# 5. Adicionar repositório remoto (SUBSTITUA pela SUA URL)
git remote add origin https://github.com/SEU-USUARIO/emotional-dynamics.git

# 6. Enviar para o GitHub
git push -u origin main
```

## 🔄 Uso Diário

### Salvar Alterações

```powershell
# Ver o que mudou
git status

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push
```

### Baixar Alterações

```powershell
git pull
```

## 📝 Exemplos de Commits

### Boa prática: Use prefixos

```powershell
# Nova funcionalidade
git commit -m "feat: adiciona botão de loop automático"

# Correção de bug
git commit -m "fix: corrige volume reiniciando música"

# Documentação
git commit -m "docs: atualiza README com instruções"

# Refatoração
git commit -m "refactor: melhora estrutura do useAudioPlayer"

# Estilo/formatação
git commit -m "style: ajusta espaçamento dos botões"

# Testes
git commit -m "test: adiciona testes para AudioBlock"

# Performance
git commit -m "perf: otimiza carregamento de áudios"
```

## 🔍 Comandos Úteis

### Ver Histórico

```powershell
# Histórico resumido
git log --oneline

# Histórico detalhado
git log

# Últimos 5 commits
git log -5

# Com gráfico
git log --graph --oneline --all
```

### Ver Diferenças

```powershell
# Ver o que mudou (não commitado)
git diff

# Ver o que está staged
git diff --staged

# Comparar com commit anterior
git diff HEAD~1
```

### Desfazer Mudanças

```powershell
# Desfazer mudanças em um arquivo
git checkout -- arquivo.txt

# Desfazer todas as mudanças não commitadas
git checkout .

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças)
git reset --hard HEAD~1
```

## 🌿 Trabalhando com Branches

### Criar e Usar Branches

```powershell
# Criar nova branch
git checkout -b nome-da-feature

# Listar branches
git branch

# Trocar de branch
git checkout main

# Deletar branch
git branch -d nome-da-feature
```

### Merge de Branches

```powershell
# Voltar para main
git checkout main

# Fazer merge da feature
git merge nome-da-feature

# Enviar para o GitHub
git push
```

## 🏷️ Tags e Releases

### Criar Tag

```powershell
# Tag simples
git tag v1.0.0

# Tag com mensagem
git tag -a v1.0.0 -m "Versão 1.0.0 - Release inicial"

# Enviar tag
git push origin v1.0.0

# Enviar todas as tags
git push --tags
```

### Listar Tags

```powershell
git tag
```

## 🔐 Autenticação

### Personal Access Token

1. **Criar token:**
   - https://github.com/settings/tokens
   - `Generate new token (classic)`
   - Marque `repo`
   - Copie o token

2. **Usar:**
   - Username: `seu-usuario`
   - Password: `cole-o-token`

### Salvar Credenciais (Windows)

```powershell
# Salvar credenciais
git config --global credential.helper wincred
```

## 🆘 Problemas Comuns

### "fatal: not a git repository"

```powershell
git init
```

### "remote origin already exists"

```powershell
git remote remove origin
git remote add origin URL-DO-REPO
```

### "failed to push"

```powershell
# Baixar mudanças primeiro
git pull --rebase

# Depois enviar
git push
```

### "Your branch is behind"

```powershell
git pull
```

### Conflitos de Merge

```powershell
# 1. Ver arquivos em conflito
git status

# 2. Editar arquivos e resolver conflitos
# (Procure por <<<<<<, ======, >>>>>>)

# 3. Adicionar arquivos resolvidos
git add .

# 4. Finalizar merge
git commit -m "Resolve conflitos"
```

## 📋 Workflow Recomendado

### Desenvolvimento de Feature

```powershell
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer alterações e commits
git add .
git commit -m "feat: implementa nova funcionalidade"

# 3. Voltar para main
git checkout main

# 4. Atualizar main
git pull

# 5. Fazer merge
git merge feature/nova-funcionalidade

# 6. Enviar
git push

# 7. Deletar branch (opcional)
git branch -d feature/nova-funcionalidade
```

### Correção Rápida

```powershell
# 1. Fazer alterações
git add .
git commit -m "fix: corrige bug crítico"

# 2. Enviar
git push
```

## 🎯 Boas Práticas

### Commits

- ✅ Faça commits pequenos e frequentes
- ✅ Use mensagens descritivas
- ✅ Um commit = uma mudança lógica
- ❌ Não faça commits gigantes
- ❌ Não use mensagens vagas ("fix", "update")

### Mensagens

**Bom:**
```
feat: adiciona indicador de progresso da música
fix: corrige volume reiniciando ao ajustar slider
docs: atualiza README com instruções de instalação
```

**Ruim:**
```
update
fix bug
changes
```

### Branches

- `main` - Código estável
- `develop` - Desenvolvimento
- `feature/nome` - Nova funcionalidade
- `fix/nome` - Correção de bug
- `hotfix/nome` - Correção urgente

## 📚 Recursos

- **Git Docs:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Learn Git Branching:** https://learngitbranching.js.org/

---

## ✅ Checklist Diário

- [ ] `git pull` - Baixar atualizações
- [ ] Fazer alterações
- [ ] `git status` - Ver o que mudou
- [ ] `git add .` - Adicionar mudanças
- [ ] `git commit -m "mensagem"` - Commitar
- [ ] `git push` - Enviar para GitHub

**Mantenha seu código sincronizado!** 🚀
