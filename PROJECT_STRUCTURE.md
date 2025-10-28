# Estrutura do Projeto - Emotional Dynamics

## 📁 Estrutura de Diretórios

```
emotional-dynamics/
├── 📄 README.md                    # Documentação principal
├── 📄 CHANGELOG.md                 # Registro de mudanças da limpeza
├── 📄 PROJECT_STRUCTURE.md         # Este arquivo
├── 📄 package.json                 # Dependências (Tauri apenas)
├── 📄 vite.config.ts               # Configuração Vite otimizada para Tauri
├── 📄 tailwind.config.js           # Configuração TailwindCSS
├── 📄 tsconfig.json                # Configuração TypeScript
├── 📄 .gitignore                   # Ignorar arquivos (inclui Tauri)
│
├── 📂 docs/                        # 📚 Documentação centralizada
│   ├── README.md                   # Índice da documentação
│   ├── INSTALAR_RUST.md            # Como instalar Rust
│   ├── GUIA_TAURI_RAPIDO.md        # Guia rápido Tauri
│   ├── PROXIMOS_PASSOS_TAURI.md    # Próximos passos
│   ├── CAMINHOS_AUDIO.md           # Gerenciamento de caminhos
│   ├── COMO_USAR_PASTA_BASE.md     # Uso de pasta base
│   ├── SOLUCAO_CAMINHOS.md         # Soluções para caminhos
│   ├── SOLUCAO_FINAL.md            # Solução implementada
│   ├── IMPORTANTE_LEIA.md          # Informações importantes
│   └── ALTERNATIVAS_DESKTOP.md     # Alternativas consideradas
│
├── 📂 src/                         # 🎨 Frontend React
│   ├── 📄 main.tsx                 # Ponto de entrada (React)
│   ├── 📄 App.tsx                  # ✨ 174 linhas (refatorado)
│   ├── 📄 index.css                # Estilos globais
│   ├── 📄 types.ts                 # Definições de tipos
│   │
│   ├── 📂 components/              # Componentes React
│   │   ├── BlockItem.tsx           # ✨ 64 linhas (refatorado)
│   │   ├── TextBlock.tsx           # 🆕 29 linhas
│   │   ├── AudioBlock.tsx          # 🆕 157 linhas
│   │   ├── BlockList.tsx           # 57 linhas
│   │   ├── EditTab.tsx             # 120 linhas
│   │   ├── ViewTab.tsx             # 130 linhas
│   │   ├── PlayerControls.tsx      # 60 linhas
│   │   └── FloatingControls.tsx    # 92 linhas
│   │
│   ├── 📂 hooks/                   # 🪝 Hooks customizados
│   │   ├── useBlockManager.ts      # 🆕 38 linhas
│   │   ├── useAudioPlayer.ts       # 🆕 157 linhas
│   │   ├── usePlaybackControls.ts  # 🆕 67 linhas
│   │   └── useScriptManager.ts     # 🆕 182 linhas
│   │
│   └── 📂 utils/                   # Utilitários
│       ├── platform.ts             # Detecção de plataforma
│       ├── tauriFilePicker.ts      # Seletor de arquivos Tauri
│       ├── tauriAudioLoader.ts     # Carregador de áudio Tauri
│       └── tauriScriptManager.ts   # Gerenciador de scripts Tauri
│
├── 📂 src-tauri/                   # 🦀 Backend Tauri (Rust)
│   ├── 📄 Cargo.toml               # Dependências Rust
│   ├── 📄 tauri.conf.json          # Configuração Tauri
│   ├── 📄 build.rs                 # Build script
│   │
│   ├── 📂 src/
│   │   ├── main.rs                 # Entry point Rust
│   │   └── lib.rs                  # Biblioteca principal
│   │
│   ├── 📂 capabilities/
│   │   └── default.json            # Permissões padrão
│   │
│   └── 📂 icons/                   # Ícones da aplicação
│       ├── 32x32.png
│       ├── 128x128.png
│       ├── icon.ico
│       └── icon.icns
│
└── 📂 dist/                        # Build de produção (gerado)
```

## 📊 Estatísticas de Refatoração

### Arquivos Refatorados

| Arquivo | Antes | Depois | Redução | Status |
|---------|-------|--------|---------|--------|
| `App.tsx` | 500 linhas | 174 linhas | 65% ↓ | ✅ |
| `BlockItem.tsx` | 216 linhas | 64 linhas | 70% ↓ | ✅ |

### Novos Arquivos Criados

#### Hooks (4 arquivos)
- ✅ `useBlockManager.ts` - 38 linhas
- ✅ `useAudioPlayer.ts` - 157 linhas
- ✅ `usePlaybackControls.ts` - 67 linhas
- ✅ `useScriptManager.ts` - 182 linhas

#### Componentes (2 arquivos)
- ✅ `TextBlock.tsx` - 29 linhas
- ✅ `AudioBlock.tsx` - 157 linhas

#### Documentação (1 arquivo)
- ✅ `docs/README.md` - Índice da documentação

## 🎯 Princípios de Organização

### 1. **Separação de Responsabilidades**
- **Hooks**: Lógica de negócio reutilizável
- **Components**: Apresentação e UI
- **Utils**: Funções auxiliares e integrações

### 2. **Limite de Linhas**
- ✅ Todos os arquivos com **menos de 200 linhas**
- ✅ Código mais legível e manutenível
- ✅ Facilita testes e debugging

### 3. **Modularidade**
- ✅ Componentes pequenos e focados
- ✅ Hooks reutilizáveis
- ✅ Fácil de estender e modificar

### 4. **Documentação Centralizada**
- ✅ Pasta `docs/` com toda documentação
- ✅ README como índice
- ✅ Guias específicos por tópico

## 🚀 Como Navegar no Projeto

### Para Desenvolvedores Frontend
1. Comece em `src/App.tsx` - ponto de entrada
2. Explore `src/hooks/` - lógica de negócio
3. Veja `src/components/` - componentes UI

### Para Desenvolvedores Backend
1. Comece em `src-tauri/src/lib.rs`
2. Configure em `src-tauri/tauri.conf.json`
3. Veja `src/utils/tauri*.ts` - integrações

### Para Documentação
1. Leia `README.md` - visão geral
2. Explore `docs/` - documentação detalhada
3. Veja `CHANGELOG.md` - histórico de mudanças

## 📝 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (ex: `BlockItem.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useBlockManager.ts`)
- **Utils**: camelCase (ex: `platform.ts`)
- **Tipos**: PascalCase (ex: `Block`, `BlockType`)

### Estrutura de Arquivos
- **Componentes**: Um componente por arquivo
- **Hooks**: Um hook por arquivo
- **Exports**: Default export para componentes, named exports para hooks

### Comentários
- Use comentários para lógica complexa
- Documente funções públicas
- Explique decisões de design quando necessário

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Vite dev server (web)
npm run tauri:dev        # Tauri dev (desktop)

# Build
npm run build            # Build web
npm run tauri:build      # Build desktop

# Outros
npm run preview          # Preview do build
```

## ✨ Próximas Melhorias Sugeridas

1. **Testes**
   - Adicionar testes unitários para hooks
   - Testes de integração para componentes
   - Testes E2E com Playwright

2. **Performance**
   - Lazy loading de componentes
   - Memoização de cálculos pesados
   - Otimização de re-renders

3. **Acessibilidade**
   - Adicionar ARIA labels
   - Suporte a navegação por teclado
   - Melhorar contraste de cores

4. **Internacionalização**
   - Suporte a múltiplos idiomas
   - Formatação de datas/números por região
