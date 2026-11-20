/**
 * Hook: filtros avanzados de escaneo
 */
import { useState } from 'react';

export const DEFAULT_FILTERS = {
  ignoreSystemFolders: true,   // node_modules, .git, System Volume, $Recycle.Bin …
  ignoreDotfiles: true,         // archivos que empiezan con punto
  minSizeBytes: 0,              // 0 = sin mínimo
  allowedExtensions: '',        // vacío = todas; "jpg,png" = solo esas
  excludedExtensions: '',       // "tmp,log" = ignorar esas
};

const SYSTEM_DIRS = new Set([
  'node_modules', '.git', '$recycle.bin', 'system volume information',
  'windows', 'program files', 'program files (x86)', 'appdata',
  '.trash', '__pycache__', '.cache', 'thumbs.db',
]);

export function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  function shouldSkipEntry(name, kind) {
    const lower = name.toLowerCase();
    if (kind === 'directory') {
      if (filters.ignoreSystemFolders && SYSTEM_DIRS.has(lower)) return true;
      if (filters.ignoreDotfiles && name.startsWith('.')) return true;
    }
    if (kind === 'file') {
      if (filters.ignoreDotfiles && name.startsWith('.')) return true;
      const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
      if (filters.excludedExtensions) {
        const excl = filters.excludedExtensions.split(',').map(e => e.trim().toLowerCase());
        if (excl.includes(ext)) return true;
      }
      if (filters.allowedExtensions) {
        const incl = filters.allowedExtensions.split(',').map(e => e.trim().toLowerCase());
        if (!incl.includes(ext)) return true;
      }
    }
    return false;
  }

  return { filters, setFilters, shouldSkipEntry };
}
