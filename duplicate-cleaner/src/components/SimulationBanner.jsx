/**
 * Banner de modo simulación (dry-run)
 */
import { FlaskConical, AlertTriangle } from 'lucide-react';

export default function SimulationBanner({ enabled, onToggle }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 border transition-colors ${
        enabled
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <FlaskConical className={`w-5 h-5 shrink-0 ${enabled ? 'text-amber-500' : 'text-slate-400'}`} />
        <div>
          <p className={`font-semibold text-sm ${enabled ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
            Modo simulación {enabled ? '— ACTIVO' : ''}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {enabled
              ? 'Los archivos NO se eliminarán. Solo verás qué pasaría.'
              : 'Activa para ver el resultado sin eliminar nada (dry-run).'}
          </p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 shrink-0 ${
          enabled ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1.5'
          }`}
        />
      </button>
    </div>
  );
}
