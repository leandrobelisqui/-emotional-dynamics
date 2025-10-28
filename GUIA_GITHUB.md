# 📦 Guia: Enviar Projeto para o GitHub

## 🎯 Objetivo

Enviar o projeto **Emotional Dynamics** para o GitHub e manter sincronizado.

## 📋 Pré-requisitos

1. **Conta no GitHub** - [Criar conta](https://github.com/signup) se não tiver
2. **Git instalado** - Verificar se está instalado

## ✅ Passo 1: Verificar se o Git Está Instalado

Abra o PowerShell e execute:

```powershell
git --version
```

### Se o Git NÃO estiver instalado:

1. **Baixe o Git:**
   - Acesse: https://git-scm.com/download/win
   - Baixe e instale (use as opções padrão)

2. **Configure seu nome e email:**
```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

## 🚀 Passo 2: Criar Repositório no GitHub

1. **Acesse:** https://github.com/new

2. **Preencha:**
   - **Repository name:** `emotional-dynamics`
   - **Description:** `Sistema de dinâmicas emocionais com áudio e texto`
   - **Visibilidade:** 
     - ✅ **Public** (público - qualquer um pode ver)
     - ⬜ **Private** (privado - só você vê)

3. **NÃO marque:**
   - ⬜ Add a README file
   - ⬜ Add .gitignore
   - ⬜ Choose a license

4. **Clique em:** `Create repository`

5. **Copie a URL** que aparece (algo como):
   ```
   https://github.com/seu-usuario/emotional-dynamics.git
   ```

## 📝 Passo 3: Preparar o Projeto

### 3.1 Criar arquivo .gitignore

No PowerShell, na pasta do projeto:

```powershell
cd C:\Users\Leandro\AppData\Roaming\Claude\CascadeProjects\windsurf-project\emotional-dynamics
```

Crie o arquivo `.gitignore`:

```powershell
@"
# Dependências
node_modules/
package-lock.json

# Build
dist/
dist-ssr/
*.local

# Electron
out/
build/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Sistema
Thumbs.db
desktop.ini

# Temporários
*.tmp
*.temp
.cache/

# Rust (Tauri)
src-tauri/target/
src-tauri/Cargo.lock

# Arquivos de teste
*.test.js
*.spec.js
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

### 3.2 Criar README.md

```powershell
@"
# 🎵 Emotional Dynamics

Sistema de dinâmicas emocionais com reprodução de áudio e texto sincronizados.

## 🚀 Funcionalidades

- ✅ Editor de blocos de texto e áudio
- ✅ Reprodução com crossfade entre músicas
- ✅ Controle de volume em tempo real
- ✅ Indicador de tempo e progresso
- ✅ Loop automático configurável
- ✅ Salvar e carregar scripts
- ✅ Carregamento automático de áudios (Electron)

## 🛠️ Tecnologias

- **React** + **TypeScript**
- **Vite** - Build tool
- **Electron** - Desktop app
- **TailwindCSS** - Estilização
- **Font Awesome** - Ícones

## 📦 Instalação

\`\`\`bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (web)
npm run dev

# Executar com Electron
npm run electron:start
\`\`\`

## 🎯 Como Usar

### Modo Web
\`\`\`bash
npm run dev
\`\`\`
Abra http://localhost:5173

### Modo Electron (Recomendado)
\`\`\`bash
# Opção 1: Script automático (Windows)
.\start-electron.bat

# Opção 2: Manual
npm run dev          # Terminal 1
npm run electron:start  # Terminal 2
\`\`\`

## 📝 Estrutura do Projeto

\`\`\`
emotional-dynamics/
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilitários
│   └── types.ts        # Tipos TypeScript
├── public/             # Arquivos estáticos
├── electron-simple.js  # Configuração Electron
└── package.json
\`\`\`

## 🎨 Funcionalidades Principais

### Editor
- Adicionar blocos de texto e áudio
- Reordenar blocos (arrastar e soltar)
- Configurar pasta base de áudios
- Salvar scripts em JSON

### Visualização
- Reprodução sequencial
- Controles flutuantes (play/pause/stop/loop)
- Barra de progresso interativa
- Ajuste de volume e crossfade em tempo real

## 📄 Licença

MIT

## 👤 Autor

Leandro
"@ | Out-File -FilePath README.md -Encoding utf8
```

## 🔄 Passo 4: Inicializar Git e Fazer Primeiro Commit

```powershell
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: Emotional Dynamics v1.0"

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Adicionar o repositório remoto (SUBSTITUA pela SUA URL)
git remote add origin https://github.com/SEU-USUARIO/emotional-dynamics.git

# Enviar para o GitHub
git push -u origin main
```

### ⚠️ Se pedir autenticação:

O GitHub não aceita mais senha. Use **Personal Access Token**:

1. **Criar token:**
   - Acesse: https://github.com/settings/tokens
   - Clique em: `Generate new token` → `Generate new token (classic)`
   - **Note:** `emotional-dynamics`
   - **Expiration:** `No expiration` ou escolha um período
   - **Scopes:** Marque `repo` (todas as opções)
   - Clique em: `Generate token`
   - **COPIE O TOKEN** (você não verá novamente!)

2. **Usar o token como senha:**
   - Username: `seu-usuario`
   - Password: `cole-o-token-aqui`

## 🔄 Passo 5: Comandos para Manter Sincronizado

### Após Fazer Alterações

```powershell
# Ver o que mudou
git status

# Adicionar arquivos modificados
git add .

# Fazer commit com mensagem descritiva
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push
```

### Exemplos de Mensagens de Commit

```powershell
git commit -m "feat: adiciona indicador de tempo"
git commit -m "fix: corrige problema de volume reiniciando música"
git commit -m "docs: atualiza README com instruções"
git commit -m "refactor: melhora estrutura do código"
```

### Baixar Alterações do GitHub

```powershell
git pull
```

## 📋 Comandos Úteis

### Ver histórico de commits
```powershell
git log --oneline
```

### Ver diferenças
```powershell
git diff
```

### Desfazer mudanças não commitadas
```powershell
git checkout .
```

### Criar nova branch
```powershell
git checkout -b nome-da-branch
```

### Voltar para main
```powershell
git checkout main
```

## 🎯 Workflow Recomendado

### Desenvolvimento Diário

1. **Antes de começar:**
```powershell
git pull  # Baixa últimas mudanças
```

2. **Durante o desenvolvimento:**
   - Faça suas alterações
   - Teste tudo

3. **Ao terminar uma funcionalidade:**
```powershell
git add .
git commit -m "feat: descrição da funcionalidade"
git push
```

4. **Commits frequentes:**
   - Faça commits pequenos e frequentes
   - Cada commit = uma funcionalidade ou correção

## 🔐 Dicas de Segurança

### ❌ NUNCA commite:
- Senhas
- API Keys
- Tokens
- Informações pessoais
- Arquivos grandes (vídeos, áudios de exemplo)

### ✅ Use .gitignore para:
- `node_modules/`
- Arquivos de configuração local
- Builds
- Logs

## 📦 Criar Release

Quando quiser marcar uma versão:

```powershell
# Criar tag
git tag -a v1.0.0 -m "Versão 1.0.0 - Release inicial"

# Enviar tag
git push origin v1.0.0
```

No GitHub:
1. Vá em `Releases`
2. Clique em `Create a new release`
3. Escolha a tag `v1.0.0`
4. Adicione descrição das mudanças
5. Publique

## 🆘 Problemas Comuns

### Erro: "fatal: not a git repository"
```powershell
git init
```

### Erro: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin URL-DO-SEU-REPO
```

### Erro: "failed to push"
```powershell
git pull --rebase
git push
```

### Desfazer último commit (antes do push)
```powershell
git reset --soft HEAD~1
```

## 📚 Recursos

- **Documentação Git:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---

## ✅ Checklist Final

- [ ] Git instalado e configurado
- [ ] Repositório criado no GitHub
- [ ] `.gitignore` criado
- [ ] `README.md` criado
- [ ] Primeiro commit feito
- [ ] Push para GitHub realizado
- [ ] Repositório visível no GitHub

**Seu projeto está no GitHub!** 🎉
