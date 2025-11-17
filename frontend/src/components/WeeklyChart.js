import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Charts.css";

function WeeklyChart({ data }) {
  const chartData = data.map((item) => ({
    day: item.day,
    completed: item.completed ? 1 : 0,
    completions: item.completions,
  }));

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completions" fill="#3B82F6" name="Completions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyChart;
