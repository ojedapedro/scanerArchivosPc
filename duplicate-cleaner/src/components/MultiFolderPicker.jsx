/**
 * Panel multi-carpeta: lista de carpetas seleccionadas
 * Permite agregar y eliminar carpetas antes de escanear
 */
import { FolderOpen, FolderPlus, X, HardDrive } from 'lucide-react';

export default function MultiFolderPicker({ folders, onAdd, onRemove, onScan, isScanning }) {
  const isSupported = 'showDirectoryPicker' in window;

  const handleAdd = async () => {
    if (!isSupported) return;
    try {
      const dh = await window.showDirectoryPicker({ mode: 'readwrite' });
      // Avoid duplicates by name
      if (!folders.find(f => f.name === dh.name)) {
        onAdd(dh);
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Folder list */}
      {folders.length > 0 && (
        <div className="space-y-2">
          {folders.map((dh, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3"
            >
              <HardDrive className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                📁 {dh.name}
              </span>
              <button
                onClick={() => onRemove(i)}
                className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
                aria-label={`Eliminar ${dh.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleAdd}
          disabled={isScanning}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium px-5 py-3 rounded-xl shadow-sm transition-all"
          aria-label="Agregar carpeta"
        >
          <FolderPlus className="w-5 h-5 text-indigo-500" />
          {folders.length === 0 ? 'Seleccionar carpeta / unidad' : 'Agregar otra carpeta'}
        </button>

        {folders.length > 0 && (
          <button
            onClick={onScan}
            disabled={isScanning}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
            aria-label="Iniciar escaneo"
          >
            <FolderOpen className="w-5 h-5" />
            {isScanning ? 'Escaneando…' : `Escanear ${folders.length > 1 ? `${folders.length} carpetas` : folders[0].name}`}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
        🔒 Todo ocurre <strong>localmente</strong>. Ningún dato sale de tu dispositivo.
      </p>
    </div>
  );
}
