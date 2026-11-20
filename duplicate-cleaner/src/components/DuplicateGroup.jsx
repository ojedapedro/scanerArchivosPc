import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, ShieldCheck, FileIcon } from 'lucide-react';
import { formatBytes, formatDate } from '../utils/duplicateEngine';

function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map = {
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
    mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵',
    pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊',
    zip: '🗜️', rar: '🗜️', '7z': '🗜️',
    js: '⚙️', ts: '⚙️', jsx: '⚙️', tsx: '⚙️', py: '🐍',
  };
  return map[ext] ?? '📁';
}

export default function DuplicateGroup({ group, index, onMarkDelete, onMarkKeep, markedForDelete }) {
  const [expanded, setExpanded] = useState(index < 3);
  const wastedSpace = group.files[0].size * (group.files.length - 1);
  const icon = getFileIcon(group.files[0].name);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{icon}</span>
          <div className="text-left min-w-0">
            <p className="font-semibold text-slate-800 truncate">{group.files[0].name}</p>
            <p className="text-xs text-slate-500">
              {group.files.length} copias · {formatBytes(group.files[0].size)} c/u ·{' '}
              <span className="text-green-600 font-medium">{formatBytes(wastedSpace)} recuperables</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-1 rounded-full">
            {group.files.length} duplicados
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* File list */}
      {expanded && (
        <div className="border-t border-slate-100">
          {group.files.map((file, i) => {
            const isMarked = markedForDelete.has(`${group.hash}::${file.path}`);
            return (
              <div
                key={file.path}
                className={`flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 transition-colors ${
                  isMarked ? 'bg-red-50' : i === 0 ? 'bg-green-50/50' : ''
                }`}
              >
                {/* Keep badge on first */}
                {i === 0 && !isMarked && (
                  <span className="shrink-0 text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">conservar</span>
                )}
                {isMarked && (
                  <span className="shrink-0 text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">eliminar</span>
                )}
                {!isMarked && i > 0 && <span className="w-14 shrink-0" />}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate font-mono">{file.path}</p>
                  <p className="text-xs text-slate-400">{formatDate(file.lastModified)} · {formatBytes(file.size)}</p>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onMarkKeep(group.hash, file.path)}
                    title="Marcar para conservar"
                    className="p-1.5 rounded-lg hover:bg-green-100 text-slate-400 hover:text-green-600 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onMarkDelete(group.hash, file.path)}
                    title="Marcar para eliminar"
                    className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
