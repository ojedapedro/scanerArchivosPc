/**
 * Panel completo del Dashboard — Fase 4
 * Muestra: SpaceBar + donut de extensiones + bar de mayor desperdicio + histograma
 * + botones de exportación + log de acciones
 */
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import SpaceBar from './charts/SpaceBar';
import ExtensionDonut from './charts/ExtensionDonut';
import WastedSpaceBar from './charts/WastedSpaceBar';
import SizeBucketHistogram from './charts/SizeBucketHistogram';
import ActionLog from './ActionLog';
import { getExtensionData, getTopWastedGroups, getSizeBuckets } from '../utils/chartData';
import { exportDuplicatesCSV, exportSummaryJSON } from '../utils/exporter';
import { formatBytes } from '../utils/duplicateEngine';

export default function Dashboard({ stats, duplicateGroups, actionLogs, onExportCSV, onExportJSON }) {
  const extData = getExtensionData(duplicateGroups);
  const wastedData = getTopWastedGroups(duplicateGroups);
  const bucketData = getSizeBuckets(duplicateGroups);

  const handleCSV = () => {
    exportDuplicatesCSV(duplicateGroups);
    onExportCSV?.();
  };

  const handleJSON = () => {
    exportSummaryJSON(stats, duplicateGroups);
    onExportJSON?.();
  };

  return (
    <div className="space-y-5">
      {/* Export buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div>
          <p className="font-semibold text-slate-700">Dashboard de análisis</p>
          <p className="text-sm text-slate-500">
            {duplicateGroups.length} grupos · {formatBytes(stats.wastedSpace)} recuperables
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCSV}
            className="flex items-center gap-2 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar CSV
          </button>
          <button
            onClick={handleJSON}
            className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <FileJson className="w-4 h-4" />
            Exportar JSON
          </button>
        </div>
      </div>

      {/* Space bar */}
      <SpaceBar totalSize={stats.totalSize} wastedSpace={stats.wastedSpace} />

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {extData.length > 0 && <ExtensionDonut data={extData} />}
        {wastedData.length > 0 && <WastedSpaceBar data={wastedData} />}
      </div>

      {bucketData.length > 0 && <SizeBucketHistogram data={bucketData} />}

      {/* Action log */}
      <ActionLog logs={actionLogs} />
    </div>
  );
}
