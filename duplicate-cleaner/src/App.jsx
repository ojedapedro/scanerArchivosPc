import { useState, useRef, useCallback } from 'react';
import {
  ScanSearch, RotateCcw, Trash2, CheckCheck,
  BarChart3, List, Sun, Moon,
} from 'lucide-react';
import MultiFolderPicker from './components/MultiFolderPicker';
import FilterPanel from './components/FilterPanel';
import ScanProgress from './components/ScanProgress';
import StatsBar from './components/StatsBar';
import DuplicateGroup from './components/DuplicateGroup';
import DeleteModal from './components/DeleteModal';
import SimulationBanner from './components/SimulationBanner';
import Dashboard from './components/Dashboard';
import { findDuplicates, calcStats, formatBytes } from './utils/duplicateEngine';
import { useDarkMode } from './hooks/useDarkMode';
import { DEFAULT_FILTERS } from './hooks/useFilters';

const STATE = { IDLE: 'idle', SCANNING: 'scanning', RESULTS: 'results' };
const TAB   = { LIST: 'list', DASHBOARD: 'dashboard' };

function addLog(setLogs, type, message) {
  setLogs(prev => [...prev, { type, message, ts: Date.now() }]);
}

export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [appState, setAppState] = useState(STATE.IDLE);
  const [folders, setFolders] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [simMode, setSimMode] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, fileName: '', status: '' });
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [stats, setStats] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [markedForDelete, setMarkedForDelete] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB.LIST);
  const [actionLogs, setActionLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const workerRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Multi-folder management ── */
  const handleAddFolder = (dh) => setFolders(prev => [...prev, dh]);
  const handleRemoveFolder = (i) => setFolders(prev => prev.filter((_, idx) => idx !== i));

  /* ── Scan ── */
  const handleScan = useCallback(() => {
    if (folders.length === 0) return;
    setAppState(STATE.SCANNING);
    setMarkedForDelete(new Set());
    setProgress({ current: 0, total: 0, fileName: '', status: 'Escaneando archivos…' });

    if (workerRef.current) workerRef.current.terminate();
    const worker = new Worker(
      new URL('./workers/scanner.worker.js', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type } = e.data;
      if (type === 'PROGRESS') {
        setProgress({
          current: e.data.current,
          total: e.data.total,
          fileName: e.data.fileName,
          status: 'Calculando hashes SHA-256…',
        });
      } else if (type === 'STATUS') {
        setProgress(p => ({ ...p, status: e.data.message }));
      } else if (type === 'DONE') {
        const files = e.data.files;
        const groups = findDuplicates(files);
        const s = calcStats(files, groups);
        setAllFiles(files);
        setDuplicateGroups(groups);
        setStats(s);
        setAppState(STATE.RESULTS);
        setActiveTab(groups.length > 0 ? TAB.LIST : TAB.DASHBOARD);
        addLog(setActionLogs, 'scan',
          `Escaneo completado en ${folders.map(f => f.name).join(', ')} · ${files.length} archivos · ${groups.length} grupos · ${formatBytes(s.wastedSpace)} recuperables`
        );
        worker.terminate();
      } else if (type === 'ERROR') {
        showToast(`Error: ${e.data.message}`, 'error');
        setAppState(STATE.IDLE);
        worker.terminate();
      }
    };

    worker.postMessage({ type: 'START', dirHandles: folders, filters });
  }, [folders, filters]);

  /* ── Mark / unmark ── */
  const handleMarkDelete = useCallback((hash, path) => {
    setMarkedForDelete(prev => {
      const next = new Set(prev);
      const key = `${hash}::${path}`;
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const handleMarkKeep = useCallback((hash, path) => {
    setMarkedForDelete(prev => {
      const next = new Set(prev);
      next.delete(`${hash}::${path}`);
      return next;
    });
  }, []);

  const handleAutoSelect = () => {
    const next = new Set();
    for (const group of duplicateGroups)
      for (let i = 1; i < group.files.length; i++)
        next.add(`${group.hash}::${group.files[i].path}`);
    setMarkedForDelete(next);
    showToast(`${next.size} archivos seleccionados automáticamente`);
  };

  /* ── Delete list ── */
  const toDeleteList = [...markedForDelete].map(key => {
    const [hash, ...rest] = key.split('::');
    const path = rest.join('::');
    const group = duplicateGroups.find(g => g.hash === hash);
    const file = group?.files.find(f => f.path === path);
    return file ? { ...file, hash } : null;
  }).filter(Boolean);

  /* ── Confirm delete / simulation ── */
  const handleConfirmDelete = async () => {
    if (simMode) {
      // DRY RUN — just log, don't delete
      const freed = toDeleteList.reduce((s, f) => s + f.size, 0);
      setShowModal(false);
      setMarkedForDelete(new Set());
      addLog(setActionLogs, 'scan',
        `[SIMULACIÓN] Se habrían eliminado ${toDeleteList.length} archivos · ${formatBytes(freed)} liberados`
      );
      showToast(`🧪 Simulación: ${toDeleteList.length} archivos · ${formatBytes(freed)}`);
      return;
    }

    let deleted = 0;
    let freed = 0;
    for (const file of toDeleteList) {
      try {
        await file.handle.remove();
        freed += file.size;
        deleted++;
      } catch (err) {
        console.warn('No se pudo eliminar:', file.path, err.message);
      }
    }
    setShowModal(false);

    const deletedPaths = new Set(toDeleteList.map(f => f.path));
    const updatedGroups = duplicateGroups
      .map(g => ({ ...g, files: g.files.filter(f => !deletedPaths.has(f.path)) }))
      .filter(g => g.files.length > 1);
    const updatedFiles = allFiles.filter(f => !deletedPaths.has(f.path));

    setDuplicateGroups(updatedGroups);
    setAllFiles(updatedFiles);
    setStats(calcStats(updatedFiles, updatedGroups));
    setMarkedForDelete(new Set());
    addLog(setActionLogs, 'delete',
      `${deleted} archivos eliminados · ${formatBytes(freed)} liberados`
    );
    showToast(`✅ ${deleted} archivos eliminados · ${formatBytes(freed)} liberados`);
  };

  /* ── Reset ── */
  const handleReset = () => {
    if (workerRef.current) workerRef.current.terminate();
    setAppState(STATE.IDLE);
    setFolders([]);
    setDuplicateGroups([]);
    setStats(null);
    setAllFiles([]);
    setMarkedForDelete(new Set());
    setActionLogs([]);
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-800 font-sans transition-colors">

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <DeleteModal
          toDelete={toDeleteList}
          simMode={simMode}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <ScanSearch className="w-5 h-5 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">DuplicateCleaner</h1>
              {folders.length > 0 && appState !== STATE.IDLE && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {folders.map(f => f.name).join(' · ')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {appState !== STATE.IDLE && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors"
                aria-label="Iniciar nueva búsqueda"
              >
                <RotateCcw className="w-4 h-4" />
                Nueva búsqueda
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* ── IDLE ── */}
        {appState === STATE.IDLE && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                Detecta y elimina<br />
                <span className="text-indigo-600">archivos duplicados</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg mx-auto">
                Libera espacio en tus unidades internas y externas eliminando copias exactas de archivos.
              </p>
            </div>

            <MultiFolderPicker
              folders={folders}
              onAdd={handleAddFolder}
              onRemove={handleRemoveFolder}
              onScan={handleScan}
              isScanning={false}
            />

            <FilterPanel filters={filters} onChange={setFilters} />

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {['🔒 100% local', '⚡ SHA-256', '🗂 Multi-carpeta', '📊 Dashboard', '📥 CSV/JSON', '🧪 Modo simulación', '🌙 Tema oscuro', '📱 PWA'].map(f => (
                <span key={f} className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full shadow-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── SCANNING ── */}
        {appState === STATE.SCANNING && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Escaneando…</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Calculando hashes SHA-256 de cada archivo</p>
            </div>
            <ScanProgress progress={progress} />
          </div>
        )}

        {/* ── RESULTS ── */}
        {appState === STATE.RESULTS && stats && (
          <div className="space-y-6">
            <StatsBar stats={stats} />
            <SimulationBanner enabled={simMode} onToggle={() => setSimMode(s => !s)} />

            {duplicateGroups.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-5xl">🎉</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">¡Sin duplicados!</h3>
                <p className="text-slate-500 dark:text-slate-400">Tu unidad está limpia.</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl w-fit" role="tablist">
                  {[
                    { id: TAB.LIST, label: 'Lista de duplicados', icon: List, badge: duplicateGroups.length },
                    { id: TAB.DASHBOARD, label: 'Dashboard', icon: BarChart3 },
                  ].map(({ id, label, icon: Icon, badge }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activeTab === id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                        activeTab === id
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden />
                      {label}
                      {badge && (
                        <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* TAB LIST */}
                {activeTab === TAB.LIST && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4">
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {duplicateGroups.length} grupos de duplicados
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {markedForDelete.size} seleccionados
                          {simMode && <span className="ml-2 text-amber-600 font-medium">· Modo simulación activo</span>}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleAutoSelect}
                          className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-medium px-4 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                          <CheckCheck className="w-4 h-4" aria-hidden />
                          Seleccionar extras
                        </button>
                        <button
                          onClick={() => setShowModal(true)}
                          disabled={markedForDelete.size === 0}
                          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${
                            simMode
                              ? 'bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white'
                              : 'bg-red-600 hover:bg-red-700 disabled:bg-red-200 text-white'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden />
                          {simMode ? '🧪 Simular' : 'Eliminar'} ({markedForDelete.size})
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3" role="list" aria-label="Grupos de archivos duplicados">
                      {duplicateGroups.map((group, i) => (
                        <DuplicateGroup
                          key={group.hash}
                          group={group}
                          index={i}
                          onMarkDelete={handleMarkDelete}
                          onMarkKeep={handleMarkKeep}
                          markedForDelete={markedForDelete}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* TAB DASHBOARD */}
                {activeTab === TAB.DASHBOARD && (
                  <Dashboard
                    stats={stats}
                    duplicateGroups={duplicateGroups}
                    actionLogs={actionLogs}
                    onExportCSV={() => addLog(setActionLogs, 'scan', 'Lista de duplicados exportada a CSV')}
                    onExportJSON={() => addLog(setActionLogs, 'scan', 'Reporte completo exportado a JSON')}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-400 dark:text-slate-600">
        DuplicateCleaner · 100% local · Sin servidores · Código abierto
      </footer>
    </div>
  );
}
