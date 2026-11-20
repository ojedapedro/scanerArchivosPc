/**
 * Panel de Filtros Avanzados — colapasble
 */
import { useState } from 'react';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';

const SIZE_OPTIONS = [
  { label: 'Sin mínimo', value: 0 },
  { label: '> 1 KB', value: 1024 },
  { label: '> 100 KB', value: 100 * 1024 },
  { label: '> 1 MB', value: 1024 * 1024 },
  { label: '> 10 MB', value: 10 * 1024 * 1024 },
  { label: '> 100 MB', value: 100 * 1024 * 1024 },
];

export default function FilterPanel({ filters, onChange }) {
  const [open, setOpen] = useState(false);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
          <Settings2 className="w-4 h-4" />
          Filtros avanzados
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 dark:border-slate-700 p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-sm text-slate-600 dark:text-slate-300">Ignorar carpetas del sistema</span>
              <Toggle value={filters.ignoreSystemFolders} onChange={v => set('ignoreSystemFolders', v)} />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-sm text-slate-600 dark:text-slate-300">Ignorar archivos ocultos (.)</span>
              <Toggle value={filters.ignoreDotfiles} onChange={v => set('ignoreDotfiles', v)} />
            </label>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Tamaño mínimo de archivo</p>
            <select
              value={filters.minSizeBytes}
              onChange={e => set('minSizeBytes', Number(e.target.value))}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {SIZE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Extensions */}
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Solo estas extensiones</p>
            <input
              type="text"
              placeholder="jpg, png, pdf  (vacío = todas)"
              value={filters.allowedExtensions}
              onChange={e => set('allowedExtensions', e.target.value)}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Excluir extensiones</p>
            <input
              type="text"
              placeholder="tmp, log, ds_store"
              value={filters.excludedExtensions}
              onChange={e => set('excludedExtensions', e.target.value)}
              className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
        value ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          value ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
