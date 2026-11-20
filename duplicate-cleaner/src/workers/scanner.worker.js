// Web Worker v2: soporta filtros avanzados + multi-carpeta + tamaño mínimo
// Messages received: { type: 'START', dirHandles: [...], filters: {...} }

const SYSTEM_DIRS = new Set([
  'node_modules', '.git', '$recycle.bin', 'system volume information',
  'windows', 'program files', 'program files (x86)', 'appdata',
  '.trash', '__pycache__', '.cache',
]);

function shouldSkip(name, kind, filters) {
  const lower = name.toLowerCase();
  if (kind === 'directory') {
    if (filters.ignoreSystemFolders && SYSTEM_DIRS.has(lower)) return true;
    if (filters.ignoreDotfiles && name.startsWith('.')) return true;
  }
  if (kind === 'file') {
    if (filters.ignoreDotfiles && name.startsWith('.')) return true;
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    if (filters.excludedExtensions) {
      const excl = filters.excludedExtensions.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
      if (excl.includes(ext)) return true;
    }
    if (filters.allowedExtensions) {
      const incl = filters.allowedExtensions.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
      if (incl.length > 0 && !incl.includes(ext)) return true;
    }
  }
  return false;
}

async function getAllFiles(dirHandle, filters, path = '') {
  const files = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (shouldSkip(name, handle.kind, filters)) continue;
    const fullPath = path ? `${path}/${name}` : name;
    if (handle.kind === 'file') {
      const file = await handle.getFile();
      const minBytes = Number(filters.minSizeBytes) || 0;
      if (file.size < minBytes) continue;
      files.push({ name, path: fullPath, size: file.size, lastModified: file.lastModified, handle, file });
    } else if (handle.kind === 'directory') {
      const sub = await getAllFiles(handle, filters, fullPath);
      files.push(...sub);
    }
  }
  return files;
}

async function computeHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

self.onmessage = async (e) => {
  if (e.data.type !== 'START') return;
  const { dirHandles, filters } = e.data;

  try {
    self.postMessage({ type: 'STATUS', message: 'Escaneando archivos...' });
    let rawFiles = [];
    for (const dh of dirHandles) {
      const sub = await getAllFiles(dh, filters, dh.name);
      rawFiles.push(...sub);
    }

    const total = rawFiles.length;
    const files = [];

    for (let i = 0; i < rawFiles.length; i++) {
      const f = rawFiles[i];
      self.postMessage({ type: 'PROGRESS', current: i + 1, total, fileName: f.path });
      const hash = await computeHash(f.file);
      files.push({ name: f.name, path: f.path, size: f.size, lastModified: f.lastModified, hash, handle: f.handle });
    }

    self.postMessage({ type: 'DONE', files });
  } catch (err) {
    self.postMessage({ type: 'ERROR', message: err.message });
  }
};
