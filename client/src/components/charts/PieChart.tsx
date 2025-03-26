import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

interface PieChartProps {
  data?: any[];
}

export function PieChart({ data }: PieChartProps) {
  if (!data) return null;

  const chartData = data.reduce((acc: any, curr: any) => {
    const type = curr.incident_type;
    const existing = acc.find((item: any) => item.name === type);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#FF0080', '#7928CA', '#1A1A1A', '#404040'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
} 