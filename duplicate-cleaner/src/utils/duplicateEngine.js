/**
 * Groups scanned files by SHA-256 hash.
 * Returns only groups with 2+ files (true duplicates).
 */
export function findDuplicates(files) {
  const map = new Map();
  for (const file of files) {
    if (!map.has(file.hash)) map.set(file.hash, []);
    map.get(file.hash).push(file);
  }

  const duplicateGroups = [];
  for (const [hash, group] of map.entries()) {
    if (group.length > 1) {
      duplicateGroups.push({ hash, files: group });
    }
  }

  // Sort by wasted space desc (size * (count-1))
  duplicateGroups.sort((a, b) => {
    const wasteA = a.files[0].size * (a.files.length - 1);
    const wasteB = b.files[0].size * (b.files.length - 1);
    return wasteB - wasteA;
  });

  return duplicateGroups;
}

export function calcStats(files, duplicateGroups) {
  const totalFiles = files.length;
  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const duplicateFiles = duplicateGroups.reduce((s, g) => s + g.files.length, 0);
  const wastedSpace = duplicateGroups.reduce(
    (s, g) => s + g.files[0].size * (g.files.length - 1),
    0
  );
  return { totalFiles, totalSize, duplicateFiles, wastedSpace, duplicateGroups: duplicateGroups.length };
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
