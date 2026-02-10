import * as React from "react";
import { Card, CardContent, Title } from "react-admin";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5000/prices")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <Card>
      <Title title="Brent Oil Price Dashboard" />
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1976d2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
