/**
 * Log de acciones realizadas (eliminar, restaurar, etc.)
 */
import { formatDate } from '../utils/duplicateEngine';
import { ClipboardList, Trash2, ShieldCheck, RotateCcw } from 'lucide-react';

const iconMap = {
  delete: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50' },
  keep:   { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
  scan:   { icon: ClipboardList, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  reset:  { icon: RotateCcw, color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function ActionLog({ logs }) {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
        <ClipboardList className="w-4 h-4" />
        Historial de acciones
      </h3>
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {[...logs].reverse().map((log, i) => {
          const cfg = iconMap[log.type] ?? iconMap.scan;
          const Icon = cfg.icon;
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${cfg.bg}`}>
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{log.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(log.ts).toLocaleTimeString('es-ES')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
