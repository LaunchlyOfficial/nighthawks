import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface LineChartProps {
  data?: any[];
}

export function LineChart({ data }: LineChartProps) {
  if (!data) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <XAxis dataKey="created_at" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="id" stroke="#FF0080" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
} 