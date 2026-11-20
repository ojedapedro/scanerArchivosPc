import { Files, Copy, HardDrive, Trash2 } from 'lucide-react';
import { formatBytes } from '../utils/duplicateEngine';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Files} label="Archivos totales" value={stats.totalFiles.toLocaleString()} color="bg-blue-500" />
      <StatCard icon={HardDrive} label="Tamaño total" value={formatBytes(stats.totalSize)} color="bg-purple-500" />
      <StatCard icon={Copy} label="Archivos duplicados" value={stats.duplicateFiles.toLocaleString()} color="bg-amber-500" />
      <StatCard icon={Trash2} label="Espacio recuperable" value={formatBytes(stats.wastedSpace)} color="bg-green-500" />
    </div>
  );
}
