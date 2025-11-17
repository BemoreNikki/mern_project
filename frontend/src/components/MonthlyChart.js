import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Charts.css";

function MonthlyChart({ data }) {
  const chartData = data.dailyBreakdown.map((item) => ({
    date: item.date,
    completed: item.completed ? 1 : 0,
    count: item.count,
  }));

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10B981"
            name="Daily Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;
