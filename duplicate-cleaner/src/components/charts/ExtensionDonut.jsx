import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../utils/chartData';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700">{d.name}</p>
        <p className="text-slate-500">{d.count} archivos</p>
      </div>
    );
  }
  return null;
};

export default function ExtensionDonut({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
        Duplicados por tipo de archivo
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="count"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-slate-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
