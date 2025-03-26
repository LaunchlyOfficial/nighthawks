import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface BarChartProps {
  data?: any;
}

export function BarChart({ data }: BarChartProps) {
  if (!data) return null;

  const chartData = [
    { name: 'Pending', value: data.pending_reports },
    { name: 'Investigating', value: data.investigating_reports },
    { name: 'Resolved', value: data.resolved_reports },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#FF0080" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 