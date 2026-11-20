/**
 * Prepara los datos de gráficas a partir de los grupos de duplicados
 */
import { formatBytes } from './duplicateEngine';

/** Distribución por extensión (donut chart) */
export function getExtensionData(duplicateGroups) {
  const map = new Map();
  for (const group of duplicateGroups) {
    for (const file of group.files) {
      const ext = file.name.includes('.')
        ? file.name.split('.').pop().toLowerCase()
        : 'sin extensión';
      const prev = map.get(ext) ?? { count: 0, size: 0 };
      map.set(ext, { count: prev.count + 1, size: prev.size + file.size });
    }
  }
  return [...map.entries()]
    .map(([ext, v]) => ({ name: `.${ext}`, count: v.count, size: v.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

/** Top 10 grupos por espacio desperdiciado (bar chart) */
export function getTopWastedGroups(duplicateGroups, limit = 10) {
  return duplicateGroups
    .slice(0, limit)
    .map((g, i) => ({
      name: g.files[0].name.length > 22
        ? g.files[0].name.slice(0, 20) + '…'
        : g.files[0].name,
      wasted: g.files[0].size * (g.files.length - 1),
      wastedLabel: formatBytes(g.files[0].size * (g.files.length - 1)),
      copies: g.files.length,
    }));
}

/** Distribución por tamaño de archivo (bucket histogram) */
export function getSizeBuckets(duplicateGroups) {
  const buckets = [
    { label: '< 1 KB',  min: 0,              max: 1024,            count: 0 },
    { label: '1–100 KB',min: 1024,            max: 100*1024,        count: 0 },
    { label: '100 KB–1 MB', min: 100*1024,   max: 1024*1024,       count: 0 },
    { label: '1–50 MB', min: 1024*1024,       max: 50*1024*1024,    count: 0 },
    { label: '50–500 MB',min: 50*1024*1024,   max: 500*1024*1024,   count: 0 },
    { label: '> 500 MB', min: 500*1024*1024,  max: Infinity,        count: 0 },
  ];
  for (const group of duplicateGroups) {
    for (const file of group.files) {
      const b = buckets.find(bk => file.size >= bk.min && file.size < bk.max);
      if (b) b.count++;
    }
  }
  return buckets.filter(b => b.count > 0);
}

export const CHART_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#f97316','#14b8a6',
];
