/**
 * Barra visual de espacio: usado / recuperable / libre
 */
import { formatBytes } from '../../utils/duplicateEngine';

export default function SpaceBar({ totalSize, wastedSpace }) {
  const pctWasted = totalSize > 0 ? (wastedSpace / totalSize) * 100 : 0;
  const pctUsed = 100 - pctWasted;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
        Espacio analizado
      </h3>

      {/* Stacked bar */}
      <div className="w-full h-7 rounded-full overflow-hidden flex bg-slate-100">
        <div
          className="bg-indigo-500 h-full transition-all duration-700 flex items-center justify-center"
          style={{ width: `${pctUsed}%` }}
        >
          {pctUsed > 15 && (
            <span className="text-white text-xs font-medium px-2 truncate">
              Archivos únicos
            </span>
          )}
        </div>
        <div
          className="bg-red-400 h-full transition-all duration-700 flex items-center justify-center"
          style={{ width: `${pctWasted}%` }}
        >
          {pctWasted > 8 && (
            <span className="text-white text-xs font-medium px-2 truncate">
              Duplicados
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-slate-600">Únicos: <strong>{formatBytes(totalSize - wastedSpace)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-slate-600">Recuperable: <strong className="text-green-600">{formatBytes(wastedSpace)}</strong></span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400">Total analizado:</span>
          <strong className="text-slate-700">{formatBytes(totalSize)}</strong>
        </div>
      </div>
    </div>
  );
}
