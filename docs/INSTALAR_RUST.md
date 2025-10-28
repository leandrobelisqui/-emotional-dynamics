# 🦀 Como Instalar o Rust

## ❌ Erro Atual

```
failed to run 'cargo metadata' command
program not found
```

**Causa**: Rust não está instalado ou terminal não foi reiniciado.

---

## ✅ Solução: Instalar Rust

### Opção 1: Download Direto (RECOMENDADO)

1. **Acesse**: https://rustup.rs/

2. **Baixe o instalador**:
   - Clique em "DOWNLOAD RUSTUP-INIT.EXE (64-BIT)"
   - Ou link direto: https://win.rustup.rs/x86_64

3. **Execute o arquivo** `rustup-init.exe`

4. **Na tela que aparecer**:
   ```
   1) Proceed with installation (default)
   2) Customize installation
   3) Cancel installation
   ```
   - Digite `1` e pressione ENTER

5. **Aguarde a instalação** (~5 minutos)

6. **IMPORTANTE**: Quando terminar, você verá:
   ```
   Rust is installed now. Great!
   ```

7. **FECHE e REABRA o PowerShell/Terminal**
   - Isso é ESSENCIAL para o Rust funcionar!

8. **Verifique a instalação**:
   ```powershell
   rustc --version
   cargo --version
   ```
   
   Deve mostrar algo como:
   ```
   rustc 1.75.0 (...)
   cargo 1.75.0 (...)
   ```

---

### Opção 2: Via Chocolatey (Se você tem)

```powershell
choco install rust
```

---

## 🔧 Requisitos Adicionais (Windows)

O Rust precisa do **Visual Studio Build Tools** para compilar no Windows.

### Se você NÃO tem Visual Studio instalado:

1. **Acesse**: https://visualstudio.microsoft.com/downloads/

2. **Baixe**: "Build Tools for Visual Studio 2022"

3. **Execute o instalador**

4. **Selecione**: "Desktop development with C++"

5. **Instale** (~2-3 GB)

**OU** o instalador do Rust pode fazer isso automaticamente para você.

---

## 🚀 Depois de Instalar

1. **Feche TODOS os terminais/PowerShell abertos**

2. **Abra um NOVO terminal**

3. **Verifique**:
   ```powershell
   rustc --version
   cargo --version
   ```

4. **Se funcionar, rode**:
   ```powershell
   cd C:\Users\Leandro\AppData\Roaming\Claude\CascadeProjects\windsurf-project\emotional-dynamics
   npm run tauri:dev
   ```

---

## ⏱️ Primeira Compilação

**IMPORTANTE**: A primeira vez que rodar `npm run tauri:dev`:
- Vai demorar ~5-10 minutos
- Rust está compilando todas as dependências
- É normal! Seja paciente
- Próximas vezes serão rápidas (~30 segundos)

---

## 🆘 Problemas Comuns

### "rustc não é reconhecido"
**Solução**: Você NÃO reiniciou o terminal após instalar
- Feche TODOS os terminais
- Abra um novo
- Tente novamente

### "link.exe not found"
**Solução**: Falta Visual Studio Build Tools
- Instale conforme instruções acima
- Ou deixe o instalador do Rust fazer isso

### "error: linker `link.exe` not found"
**Solução**: Mesmo que acima - precisa do Visual Studio Build Tools

---

## 📋 Checklist

- [ ] Baixar rustup-init.exe de https://rustup.rs/
- [ ] Executar instalador
- [ ] Escolher opção 1 (Proceed with installation)
- [ ] Aguardar instalação completar
- [ ] **FECHAR todos os terminais**
- [ ] **ABRIR novo terminal**
- [ ] Verificar: `rustc --version`
- [ ] Verificar: `cargo --version`
- [ ] Rodar: `npm run tauri:dev`

---

## 🎯 Links Úteis

- **Rust Installer**: https://rustup.rs/
- **Visual Studio Build Tools**: https://visualstudio.microsoft.com/downloads/
- **Documentação Rust**: https://www.rust-lang.org/learn/get-started

---

## ✅ Quando Funcionar

Você verá:
```
    Finished dev [unoptimized + debuginfo] target(s) in X.XXs
     Running `target\debug\emotional-dynamics.exe`
```

E o app desktop vai abrir! 🎉

---

**Próximo passo**: Baixe e instale o Rust de https://rustup.rs/ 🚀
