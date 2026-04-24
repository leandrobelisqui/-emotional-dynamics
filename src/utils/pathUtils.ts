/**
 * Helpers para manipulação de paths (cross-platform: Windows \ e POSIX /).
 */

/** Extrai o nome do arquivo (última parte após / ou \). */
export function getBasename(path: string): string {
  if (!path) return '';
  const parts = path.split(/[/\\]/);
  return parts[parts.length - 1] || path;
}

/** Extrai a pasta (tudo antes do nome do arquivo). Preserva o separador usado. */
export function getDirname(path: string): string {
  if (!path) return '';
  // Detecta separador dominante
  const sep = path.includes('\\') ? '\\' : '/';
  const parts = path.split(/[/\\]/);
  parts.pop();
  return parts.join(sep);
}

/** Junta basePath + fileName usando o separador adequado. */
export function joinPath(basePath: string, fileName: string): string {
  if (!basePath) return fileName;
  if (!fileName) return basePath;
  const sep = basePath.includes('\\') ? '\\' : '/';
  const trimmedBase = basePath.replace(/[/\\]+$/, '');
  const trimmedName = fileName.replace(/^[/\\]+/, '');
  return `${trimmedBase}${sep}${trimmedName}`;
}

/**
 * Retorna o caminho relativo de `fullPath` a partir de `basePath`.
 * - Se o arquivo está diretamente em `basePath` → retorna só o nome ("musica.mp3")
 * - Se está em subpasta → preserva a hierarquia ("Ansiedade\intro.mp3")
 * - Se está FORA do basePath (ou basePath vazio) → retorna só o nome do arquivo
 *
 * Comparação case-insensitive (Windows). Separadores normalizados internamente,
 * mas a string de retorno usa o separador de `fullPath`.
 */
export function getRelativePath(basePath: string, fullPath: string): string {
  if (!fullPath) return '';
  if (!basePath) return getBasename(fullPath);

  const trimmedBase = basePath.replace(/[/\\]+$/, '');
  const normBase = trimmedBase.replace(/\\/g, '/').toLowerCase();
  const normFull = fullPath.replace(/\\/g, '/').toLowerCase();

  if (normFull === normBase || !normFull.startsWith(normBase + '/')) {
    // Arquivo não está dentro de basePath → só o nome
    return getBasename(fullPath);
  }

  // Corta o prefixo preservando o case original do fullPath
  const relative = fullPath.substring(trimmedBase.length);
  // Remove separador inicial
  return relative.replace(/^[/\\]+/, '');
}

/** Deriva o `audioBasePath` comum a partir dos paths dos blocos de áudio. */
export function deriveCommonBasePath(paths: string[]): string {
  const valid = paths.filter(Boolean);
  if (valid.length === 0) return '';

  // Pega a pasta de cada arquivo
  const dirs = valid.map(getDirname).filter(Boolean);
  if (dirs.length === 0) return '';

  // Prefixo comum entre todas as pastas (char-a-char)
  let commonPrefix = dirs[0];
  for (let i = 1; i < dirs.length; i++) {
    while (commonPrefix && !dirs[i].startsWith(commonPrefix)) {
      // Reduz o prefixo até o último separador
      const lastSep = Math.max(commonPrefix.lastIndexOf('\\'), commonPrefix.lastIndexOf('/'));
      if (lastSep <= 0) {
        commonPrefix = '';
        break;
      }
      commonPrefix = commonPrefix.substring(0, lastSep);
    }
    if (!commonPrefix) break;
  }

  return commonPrefix;
}
