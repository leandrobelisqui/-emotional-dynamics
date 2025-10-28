# Solução para erro "cannot open input file 'kernel32.lib'"

## Problema
O Visual Studio 2022 está instalado, mas falta o **Windows SDK** que contém as bibliotecas necessárias (kernel32.lib, etc).

## Solução: Instalar Windows SDK via Visual Studio Installer

### Passo 1: Abrir Visual Studio Installer

1. Pressione a tecla **Windows**
2. Digite: `Visual Studio Installer`
3. Abra o aplicativo

### Passo 2: Modificar a instalação

1. No Visual Studio Installer, localize **Visual Studio Community 2022**
2. Clique no botão **Modificar** (não em "Iniciar")

### Passo 3: Adicionar componentes necessários

Na aba **Workloads**:
- ✅ Marque **"Desenvolvimento para desktop com C++"** (Desktop development with C++)

Na aba **Componentes individuais** (Individual components), certifique-se que estão marcados:
- ✅ **MSVC v143 - VS 2022 C++ x64/x86 build tools** (latest)
- ✅ **Windows 11 SDK** (ou Windows 10 SDK - qualquer versão recente)
- ✅ **C++ CMake tools for Windows**
- ✅ **C++ ATL for latest v143 build tools**

### Passo 4: Instalar

1. Clique em **Modificar** no canto inferior direito
2. Aguarde a instalação (pode levar 10-30 minutos)
3. **Reinicie o computador** após a instalação

### Passo 5: Testar

Após reiniciar:

```powershell
# Execute o script batch que configura o ambiente
.\tauri-dev.bat
```

## Verificação Rápida

Para verificar se o Windows SDK está instalado:

```powershell
# Procurar por kernel32.lib
Get-ChildItem "C:\Program Files (x86)\Windows Kits" -Recurse -Filter "kernel32.lib" -ErrorAction SilentlyContinue | Select-Object -First 1 FullName
```

Se o comando acima não retornar nada, o Windows SDK não está instalado.

## Alternativa: Developer Command Prompt

Se preferir não modificar a instalação agora, você pode usar o **Developer Command Prompt**:

1. Pressione **Windows**
2. Digite: `Developer Command Prompt for VS 2022`
3. Abra o prompt
4. Navegue até o projeto:
   ```cmd
   cd C:\Users\Leandro\AppData\Roaming\Claude\CascadeProjects\windsurf-project\emotional-dynamics
   ```
5. Execute:
   ```cmd
   npm run tauri:dev
   ```

O Developer Command Prompt já vem com todas as variáveis de ambiente configuradas.
