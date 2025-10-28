# Windows Setup Guide for Tauri Development

## Issue Summary
The Rust compiler cannot find the MSVC linker (`link.exe`) which is required to compile Tauri applications on Windows.

## Solution: Install Visual Studio Build Tools

### Option 1: Visual Studio Build Tools (Recommended - Smaller Download)

1. **Download Visual Studio Build Tools**
   - Visit: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "Tools for Visual Studio"
   - Download "Build Tools for Visual Studio 2022"

2. **Install with C++ Build Tools**
   - Run the installer
   - Select "Desktop development with C++"
   - Make sure these components are checked:
     - MSVC v143 - VS 2022 C++ x64/x86 build tools (Latest)
     - Windows 10 SDK or Windows 11 SDK
     - C++ CMake tools for Windows
   - Click Install (requires ~7GB disk space)

3. **Restart Your Terminal**
   - Close all PowerShell/Command Prompt windows
   - Open a new terminal
   - The build tools should now be in your PATH

### Option 2: Full Visual Studio (Larger but includes IDE)

1. **Download Visual Studio Community**
   - Visit: https://visualstudio.microsoft.com/downloads/
   - Download "Visual Studio Community 2022" (free)

2. **Install with C++ Workload**
   - Run the installer
   - Select "Desktop development with C++"
   - Click Install

## Verify Installation

After installation, verify the tools are available:

```powershell
# Check if link.exe is available
where.exe link.exe

# Should show path like:
# C:\Program Files\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\...\bin\Hostx64\x64\link.exe
```

## Next Steps

Once the build tools are installed:

1. **Close and reopen your terminal**
2. **Run the development server:**
   ```powershell
   npm run tauri:dev
   ```

## What Was Fixed

✅ Added Tauri fs and dialog plugins to `Cargo.toml`
✅ Registered plugins in `src-tauri/src/lib.rs`
✅ Updated TypeScript imports to use `@tauri-apps/plugin-fs` and `@tauri-apps/plugin-dialog`
✅ Installed npm plugin packages

⏳ **Pending:** Install MSVC build tools (manual step required)

## Additional Resources

- [Tauri Prerequisites - Windows](https://tauri.app/v1/guides/getting-started/prerequisites#windows)
- [Rust Windows Prerequisites](https://rust-lang.github.io/rustup/installation/windows.html)
