/**
 * Exporta la lista de duplicados a CSV usando papaparse
 */
import Papa from 'papaparse';
import { formatBytes, formatDate } from './duplicateEngine';

export function exportDuplicatesCSV(duplicateGroups, fileName = 'duplicados.csv') {
  const rows = [];

  for (const group of duplicateGroups) {
    for (let i = 0; i < group.files.length; i++) {
      const f = group.files[i];
      rows.push({
        'Hash SHA-256': group.hash,
        'Rol': i === 0 ? 'Original (conservar)' : 'Duplicado',
        'Nombre': f.name,
        'Ruta': f.path,
        'Tamaño': formatBytes(f.size),
        'Tamaño (bytes)': f.size,
        'Última modificación': formatDate(f.lastModified),
        'Copias en grupo': group.files.length,
      });
    }
    // Blank separator row between groups
    rows.push({});
  }

  const csv = Papa.unparse(rows);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSummaryJSON(stats, duplicateGroups) {
  const data = {
    generado: new Date().toISOString(),
    resumen: stats,
    grupos: duplicateGroups.map(g => ({
      hash: g.hash,
      archivos: g.files.map(f => ({ nombre: f.name, ruta: f.path, tamaño: f.size, modificado: f.lastModified })),
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reporte_duplicados.json';
  a.click();
  URL.revokeObjectURL(url);
}
