# 🎯 Solução: Enviar Projeto para GitHub

## 📋 Resumo do Problema

O repositório Git está com **228 MB** porque o `node_modules` foi commitado por engano.

GitHub rejeita arquivos maiores que 100 MB.

---

## ✅ Solução Rápida (RECOMENDADA)

### **Opção 1: Recomeçar do Zero (Mais Simples)**

Execute este script:

```powershell
.\limpar-git-simples.ps1
```

**O que faz:**
1. ✅ Cria backup do `.git` atual
2. ✅ Inicializa novo repositório limpo
3. ✅ Adiciona apenas arquivos necessários (respeita `.gitignore`)
4. ✅ Cria commit inicial sem `node_modules`

**Tempo:** ~30 segundos

---

### **Opção 2: Limpar Histórico (Mantém commits)**

Execute este script:

```powershell
.\limpar-git.ps1
```

**O que faz:**
1. ✅ Mantém histórico de commits
2. ✅ Remove `node_modules` de todos os commits anteriores
3. ✅ Limpa referências antigas
4. ✅ Reduz tamanho do repositório

**Tempo:** ~2-5 minutos

---

## 🚀 Após Limpar o Git

### 1. Criar Repositório no GitHub

Acesse: https://github.com/new

- **Nome:** `emotional-dynamics`
- **Descrição:** Aplicação desktop para dinâmicas de inteligência emocional
- **Visibilidade:** Público ou Privado (sua escolha)
- **NÃO** marque "Initialize with README"

Clique em **"Create repository"**

---

### 2. Conectar e Enviar

```powershell
# Adicionar remote
git remote add origin https://github.com/SEU-USUARIO/emotional-dynamics.git

# Verificar
git remote -v

# Enviar (primeira vez - use -f)
git push -f origin main

# Configurar upstream
git branch --set-upstream-to=origin/main main
```

---

### 3. Verificar no GitHub

Acesse: `https://github.com/SEU-USUARIO/emotional-dynamics`

Você deve ver:
- ✅ Código-fonte
- ✅ README.md renderizado
- ✅ Tamanho do repositório: ~2-5 MB
- ✅ Sem `node_modules/`

---

## 📊 Comparação de Tamanhos

| Item | Antes | Depois |
|------|-------|--------|
| **Repositório Git** | 228 MB | 2-5 MB |
| **node_modules/** | 220 MB | ❌ Não versionado |
| **package-lock.json** | 275 KB | ❌ Não versionado |
| **Código-fonte** | ~2 MB | ✅ Versionado |

---

## 🔄 Workflow Diário (Após Configuração)

### Fazer mudanças:

```powershell
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Enviar
git push
```

### Baixar mudanças:

```powershell
git pull
```

---

## 🛡️ Arquivos Atualizados

Os seguintes arquivos foram criados/atualizados:

### ✅ Criados:
- `limpar-git-simples.ps1` - Script de limpeza simples
- `limpar-git.ps1` - Script de limpeza completa
- `GUIA_CONTROLE_VERSAO.md` - Guia completo de Git
- `SOLUCAO_GITHUB.md` - Este arquivo
- `find-large-files.ps1` - Utilitário para encontrar arquivos grandes

### ✅ Atualizados:
- `.gitignore` - Agora ignora `node_modules/` e `package-lock.json`
- `README.md` - Atualizado com informações de Electron e Git

---

## 🆘 Se Algo Der Errado

### Restaurar backup (se usou limpar-git-simples.ps1):

```powershell
Remove-Item -Path .git -Recurse -Force
Move-Item -Path .git-backup-YYYYMMDD-HHMMSS -Destination .git
```

### Verificar arquivos grandes antes de commit:

```powershell
.\find-large-files.ps1
```

---

## 📚 Próximos Passos

1. ✅ Executar script de limpeza
2. ✅ Criar repositório no GitHub
3. ✅ Conectar e enviar
4. ✅ Verificar no GitHub
5. ✅ Continuar desenvolvendo normalmente

---

## 💡 Dicas Importantes

### ❌ NUNCA commite:
- `node_modules/` - Muito grande (220 MB)
- `package-lock.json` - Gerado automaticamente
- `dist/` - Build output
- Arquivos temporários

### ✅ SEMPRE commite:
- `src/` - Código-fonte
- `package.json` - Lista de dependências
- `.gitignore` - Configuração do Git
- `README.md` - Documentação
- Arquivos de configuração (`.ts`, `.json`, etc.)

### 🔍 Antes de cada commit:

```powershell
# Ver o que vai ser commitado
git status

# Ver diferenças
git diff

# Verificar tamanho dos arquivos
git ls-files | ForEach-Object { 
  $size = (Get-Item $_).Length / 1MB
  if ($size -gt 1) { 
    Write-Host "$_ - $([math]::Round($size, 2)) MB" -ForegroundColor Yellow
  }
}
```

---

## 🎓 Recursos de Aprendizado

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Criado em:** $(Get-Date -Format "dd/MM/yyyy HH:mm")

**Boa sorte! 🚀**
