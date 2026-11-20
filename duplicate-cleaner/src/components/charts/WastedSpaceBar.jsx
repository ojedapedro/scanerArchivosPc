import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { formatBytes } from '../../utils/duplicateEngine';
import { CHART_COLORS } from '../../utils/chartData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-sm space-y-1">
        <p className="font-semibold text-slate-700 truncate max-w-[200px]">{label}</p>
        <p className="text-red-500">🗑 {formatBytes(payload[0].value)} desperdiciados</p>
        <p className="text-slate-500">{payload[0].payload.copies} copias</p>
      </div>
    );
  }
  return null;
};

export default function WastedSpaceBar({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
        Top grupos — espacio desperdiciado
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={(v) => formatBytes(v)}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="wasted" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
