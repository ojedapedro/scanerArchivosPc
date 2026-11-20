import { useState } from 'react';
import { Trash2, AlertTriangle, X, FlaskConical } from 'lucide-react';
import { formatBytes } from '../utils/duplicateEngine';

export default function DeleteModal({ toDelete, simMode, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  const count = toDelete.length;
  const totalSize = toDelete.reduce((s, f) => s + f.size, 0);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${simMode ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-red-100 dark:bg-red-900/40'}`}>
              {simMode
                ? <FlaskConical className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                : <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              }
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-800 dark:text-white">
                {simMode ? 'Simulación de eliminación' : 'Confirmar eliminación'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {simMode ? 'No se eliminará nada (dry-run)' : 'Esta acción no se puede deshacer'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cerrar"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`rounded-2xl p-4 space-y-1 ${
          simMode ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <p className={`text-sm font-medium ${simMode ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}>
            {simMode ? '🧪' : '⚠️'} {count} archivos {simMode ? 'se habrían eliminado' : 'serán eliminados permanentemente'}
          </p>
          <p className={`text-sm ${simMode ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-400'}`}>
            Espacio {simMode ? 'que se liberaría' : 'liberado'}: <strong>{formatBytes(totalSize)}</strong>
          </p>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
          {toDelete.map(f => (
            <p key={f.path} className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{f.path}</p>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className={`flex-1 py-3 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 ${
              simMode
                ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-300'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
            }`}
          >
            {simMode ? <FlaskConical className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? 'Procesando…' : simMode ? 'Ejecutar simulación' : 'Eliminar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}
