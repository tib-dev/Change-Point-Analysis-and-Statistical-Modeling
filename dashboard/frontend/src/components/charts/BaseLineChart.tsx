import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BaseLineChart = ({
  data,
  dataKey,
  color,
}: {
  data: any[];
  dataKey: string;
  color: string;
}) => (
  <ResponsiveContainer height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey={dataKey} stroke={color} />
    </LineChart>
  </ResponsiveContainer>
);

export default BaseLineChart;
