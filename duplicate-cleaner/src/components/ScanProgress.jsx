import { Loader2, FileSearch } from 'lucide-react';

export default function ScanProgress({ progress }) {
  const { current, total, fileName, status } = progress;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 text-indigo-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-semibold">{status || 'Procesando archivos...'}</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>{current.toLocaleString()} / {total.toLocaleString()} archivos</span>
          <span className="font-medium text-indigo-600">{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Current file */}
      {fileName && (
        <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
          <FileSearch className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
}
