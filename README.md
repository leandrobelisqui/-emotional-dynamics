# 🎭 Emotional Dynamics

Aplicação desktop para criação e execução de dinâmicas de inteligência emocional com blocos de texto e áudio.

## ✨ Recursos

- ✅ **Blocos de Texto**: Adicione e edite textos com formatação preservada
- 🎵 **Blocos de Áudio**: Upload de arquivos MP3 com reprodução integrada
- 🔄 **Crossfade Ajustável**: Transição suave entre músicas (0.5s a 5s)
- 🎚️ **Controle de Volume**: Ajuste o volume do áudio em tempo real
- 💾 **Salvar/Carregar**: Exporte e importe suas dinâmicas em formato JSON
- 📂 **Caminhos Automáticos**: No Electron, caminhos de áudio são salvos automaticamente
- 👁️ **Visualização Completa**: Todos os blocos visíveis em sequência
- ▶️ **Reprodução Contínua**: Áudio continua tocando enquanto você navega
- 📑 **Sistema de Abas**: Aba de Edição e aba de Visualização separadas
- 🖥️ **Desktop App**: Disponível em Electron (recomendado) e Tauri

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** (v16 ou superior)

### Instalação

```bash
npm install
```

### Executar o App (Recomendado - Electron)

**Opção 1: Usando o .bat (mais fácil)**
```bash
.\start-electron.bat
```

**Opção 2: Via npm**
```bash
npm run electron:dev
```

### Outras Opções de Execução

**Versão Web (navegador)**
```bash
npm run dev
# Acesse: http://localhost:5173
```

**Versão Tauri (requer Rust instalado)**
```bash
npm run tauri:dev
# Veja docs/INSTALAR_RUST.md para instalar o Rust
```

### Build para Produção

**Electron**
```bash
npm run electron:build
# Executável em: dist-electron/
```

**Tauri**
```bash
npm run tauri:build
# Executável em: src-tauri/target/release/
```

## Funcionalidades

### Sistema de Abas

A aplicação possui duas abas principais:

1. **Aba de Edição**: Onde você cria e edita os blocos
   - Adicionar blocos de texto e áudio
   - Editar conteúdo dos blocos
   - Remover blocos
   - Salvar e carregar scripts
   - Controlar volume

2. **Aba de Visualização**: Onde você visualiza e executa a dinâmica
   - Ver todos os blocos em sequência
   - Controles de reprodução (Play/Pause, Stop, Anterior/Próximo)
   - Ajustar velocidade do crossfade (0.5s a 5s)
   - Tocar blocos de áudio específicos

### Adicionar Blocos (Aba de Edição)

1. **Bloco de Texto**: Clique em "+ Texto" e digite ou cole seu conteúdo
2. **Bloco de Áudio**: Clique em "+ Áudio" e selecione um arquivo MP3

### Reprodução (Aba de Visualização)

- Use o botão **Play/Pause** para iniciar/pausar a dinâmica
- Use os botões **Anterior/Próximo** para navegar entre blocos
- Use o botão **Stop** para parar completamente
- Clique em **Tocar** em qualquer bloco de áudio para reproduzi-lo diretamente
- Ajuste o **slider de Crossfade** para controlar a duração da transição entre áudios

### Crossfade

Quando você troca de um áudio para outro (clicando em "Tocar" ou navegando), a aplicação:
- Diminui gradualmente o volume do áudio atual
- Aumenta gradualmente o volume do novo áudio
- Transição suave configurável (padrão: 2 segundos)
- Ajuste a velocidade usando o slider na aba de Visualização

### Salvar e Carregar (Aba de Edição)

- **Salvar**: Clique no botão "Salvar" para exportar sua dinâmica como arquivo JSON
  - ✅ Salva: textos, estrutura dos blocos, configurações (volume, crossfade)
  - ✅ Salva: caminhos absolutos dos arquivos de áudio (quando disponível)
  - ⚠️ **Importante**: Os arquivos de áudio em si não são salvos no JSON
  
- **Carregar**: Clique no botão "Carregar" e selecione um arquivo JSON previamente salvo
  - ✅ Carrega: toda a estrutura e configurações
  - ✅ Mostra: lista com os caminhos dos áudios que precisam ser recarregados
  - ⚠️ **Você precisa**: Fazer upload dos arquivos de áudio novamente
  - 💡 **Dica**: Os blocos mostram avisos amarelos indicando quais áudios precisam ser recarregados

## Tecnologias

- **React 18** com TypeScript
- **Tauri 2.x** - Framework para aplicações desktop
- **Vite** para build e desenvolvimento
- **TailwindCSS** para estilização
- **Rust** - Backend do Tauri
- **UUID** para geração de IDs únicos

## Estrutura do Projeto

```
emotional-dynamics/
├── src/                       # Frontend React
│   ├── components/
│   │   ├── BlockList.tsx      # Lista de blocos
│   │   ├── BlockItem.tsx      # Item individual de bloco
│   │   ├── PlayerControls.tsx # Controles de reprodução
│   │   ├── EditTab.tsx        # Aba de edição
│   │   └── ViewTab.tsx        # Aba de visualização
│   ├── App.tsx                # Componente principal
│   ├── types.ts               # Definições de tipos
│   ├── main.tsx               # Ponto de entrada
│   └── index.css              # Estilos globais
├── src-tauri/                 # Backend Tauri (Rust)
│   ├── src/
│   │   └── main.rs            # Código Rust principal
│   ├── tauri.conf.json        # Configuração do Tauri
│   ├── Cargo.toml             # Dependências Rust
│   └── icons/                 # Ícones da aplicação
├── docs/                      # Documentação adicional
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 📚 Documentação Adicional

### Guias Principais
- **[GUIA_CONTROLE_VERSAO.md](GUIA_CONTROLE_VERSAO.md)** - Como versionar o projeto no GitHub
- **[ELECTRON_GUIDE.md](ELECTRON_GUIDE.md)** - Guia completo do Electron
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Estrutura do projeto

### Pasta docs/
- `GUIA_TAURI_RAPIDO.md` - Guia rápido de uso do Tauri
- `INSTALAR_RUST.md` - Como instalar o Rust
- `PROXIMOS_PASSOS_TAURI.md` - Próximos passos e melhorias

## 🔧 Desenvolvimento

### Clonar o Repositório

```bash
git clone https://github.com/SEU-USUARIO/emotional-dynamics.git
cd emotional-dynamics
npm install
```

### Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Commits Semânticos

Use o padrão de commits semânticos:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

## 📝 Licença

MIT

---

**Desenvolvido com ❤️ para facilitar dinâmicas de inteligência emocional**
