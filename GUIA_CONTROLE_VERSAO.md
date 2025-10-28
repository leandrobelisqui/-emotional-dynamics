# 🔧 Guia de Controle de Versão - Emotional Dynamics

## 🚨 Problema Identificado

O repositório Git está com **228 MB** porque o `node_modules` foi commitado por engano.

### Arquivos grandes encontrados:
- `node_modules/electron/dist/electron.exe` - 200 MB
- `node_modules/` completo - ~220 MB
- `package-lock.json` - ~275 KB

---

## ✅ Solução em 3 Passos

### **Passo 1: Limpar o Histórico do Git**

Execute o script de limpeza:

```powershell
.\limpar-git.ps1
```

Este script irá:
1. ✅ Verificar se há mudanças pendentes
2. ✅ Criar um backup de segurança
3. ✅ Remover `node_modules` e `package-lock.json` do histórico
4. ✅ Limpar referências antigas
5. ✅ Reduzir o tamanho do repositório

**Tempo estimado:** 2-5 minutos

---

### **Passo 2: Configurar o GitHub**

#### **Opção A: Criar novo repositório**

1. Acesse: https://github.com/new
2. Nome: `emotional-dynamics`
3. **NÃO** inicialize com README
4. Clique em "Create repository"

#### **Opção B: Usar repositório existente**

Se já tem um repositório, você vai sobrescrever o histórico (use com cuidado!)

---

### **Passo 3: Enviar para o GitHub**

```powershell
# Adicionar o remote (se ainda não tiver)
git remote add origin https://github.com/SEU-USUARIO/emotional-dynamics.git

# Verificar o remote
git remote -v

# Enviar (force push - APENAS NA PRIMEIRA VEZ!)
git push -f origin main

# Configurar upstream
git branch --set-upstream-to=origin/main main
```

---

## 📊 Tamanho Esperado Após Limpeza

- **Antes:** ~228 MB
- **Depois:** ~2-5 MB (apenas código-fonte)

---

## 🔄 Workflow Diário (Após Configuração)

### **Fazer mudanças:**

```powershell
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Enviar para GitHub
git push
```

### **Baixar mudanças:**

```powershell
git pull
```

---

## 📁 O que DEVE ser versionado

✅ **Código-fonte:**
- `src/` - Código React/TypeScript
- `electron/` - Código Electron
- `src-tauri/` - Código Tauri (exceto `target/`)

✅ **Configurações:**
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.js`
- `.gitignore`

✅ **Documentação:**
- `README.md`
- `*.md` (guias e documentação)

✅ **Assets pequenos:**
- Ícones (`.ico`, `.png` pequenos)
- `index.html`

---

## 🚫 O que NÃO deve ser versionado

❌ **Dependências:**
- `node_modules/` - Instalado com `npm install`
- `package-lock.json` - Gerado automaticamente

❌ **Build outputs:**
- `dist/`
- `dist-electron/`
- `out/`
- `release/`

❌ **Tauri build:**
- `src-tauri/target/`
- `src-tauri/Cargo.lock`

❌ **Temporários:**
- `*.log`
- `.DS_Store`
- Scripts de teste temporários

---

## 🛡️ Boas Práticas

### **1. Commits semânticos:**

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
test: adiciona testes
chore: tarefas de manutenção
```

### **2. Branches:**

```powershell
# Criar branch para nova feature
git checkout -b feature/nome-da-feature

# Trabalhar na feature...
git add .
git commit -m "feat: implementa feature X"

# Voltar para main
git checkout main

# Merge da feature
git merge feature/nome-da-feature

# Deletar branch
git branch -d feature/nome-da-feature
```

### **3. Antes de cada commit:**

```powershell
# Verificar o que vai ser commitado
git status
git diff

# Evitar commitar arquivos grandes
git ls-files --cached | ForEach-Object { 
  $size = (Get-Item $_).Length / 1MB
  if ($size -gt 1) { 
    Write-Host "$_ - $([math]::Round($size, 2)) MB" -ForegroundColor Yellow
  }
}
```

---

## 🆘 Problemas Comuns

### **Erro: "file too large"**

```powershell
# Verificar arquivos grandes
git ls-files | ForEach-Object { 
  $size = (Get-Item $_).Length / 1MB
  if ($size -gt 1) { 
    Write-Host "$_ - $([math]::Round($size, 2)) MB" -ForegroundColor Red
  }
}

# Remover do staging
git reset HEAD arquivo-grande.exe

# Adicionar ao .gitignore
echo "arquivo-grande.exe" >> .gitignore
```

### **Commitei node_modules por engano**

```powershell
# Remover do último commit (se ainda não fez push)
git reset --soft HEAD~1
git reset HEAD node_modules/
git commit -m "sua mensagem original"
```

### **Já fiz push com node_modules**

Execute o script `limpar-git.ps1` novamente.

---

## 📦 Instalação em Outro Computador

Quando clonar o repositório em outro PC:

```powershell
# Clonar
git clone https://github.com/SEU-USUARIO/emotional-dynamics.git
cd emotional-dynamics

# Instalar dependências
npm install

# Rodar o app
.\start-electron.bat
```

---

## 🔍 Verificações Úteis

```powershell
# Tamanho do repositório
git count-objects -vH

# Histórico de commits
git log --oneline -10

# Ver branches
git branch -a

# Ver remotes
git remote -v

# Ver arquivos rastreados
git ls-files
```

---

## 📚 Recursos Adicionais

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ✅ Checklist Final

Antes de enviar para o GitHub:

- [ ] `.gitignore` configurado corretamente
- [ ] `node_modules/` não está no repositório
- [ ] Repositório tem menos de 10 MB
- [ ] Todos os commits têm mensagens descritivas
- [ ] Código está funcionando
- [ ] README.md está atualizado

---

**Criado em:** $(Get-Date -Format "dd/MM/yyyy HH:mm")
