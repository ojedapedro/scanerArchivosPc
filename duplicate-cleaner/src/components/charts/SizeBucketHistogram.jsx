import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-indigo-600">{payload[0].value} archivos duplicados</p>
      </div>
    );
  }
  return null;
};

export default function SizeBucketHistogram({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
        Duplicados por tamaño de archivo
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
