import { FolderOpen, HardDrive, AlertCircle } from 'lucide-react';

export default function FolderPicker({ onSelect, isScanning }) {
  const isSupported = 'showDirectoryPicker' in window;

  const handleClick = async () => {
    if (!isSupported || isScanning) return;
    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      onSelect(dirHandle);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error seleccionando carpeta:', err);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm">
          Tu navegador no soporta la File System Access API. Usa <strong>Chrome</strong> o <strong>Edge</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3 text-slate-500 text-sm">
        <HardDrive className="w-4 h-4" />
        <span>Compatible con unidades internas y externas (USB, SSD, HDD)</span>
      </div>
      <button
        onClick={handleClick}
        disabled={isScanning}
        className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200 hover:scale-105 active:scale-95 text-lg"
      >
        <FolderOpen className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        {isScanning ? 'Escaneando...' : 'Seleccionar Carpeta o Unidad'}
      </button>
      <p className="text-xs text-slate-400 text-center max-w-xs">
        Todo ocurre <strong>localmente</strong> en tu navegador. Ningún archivo se sube a internet.
      </p>
    </div>
  );
}
