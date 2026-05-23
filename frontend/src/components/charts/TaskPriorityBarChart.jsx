// components/charts/TaskPriorityBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TaskPriorityBarChart = ({ data }) => {
  // Ensure all keys exist and map to chart-friendly array
  const chartData = [
    { priority: "Low", value: data.Low || 0 },
    { priority: "Medium", value: data.Medium || 0 },
    { priority: "High", value: data.High || 0 },
  ];

  const COLORS = {
    Low: "#3B82F6",     // Blue
    Medium: "#F97316",  // Orange
    High: "#EF4444",    // Red
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar
            dataKey="value"
            name="Tasks"
            fill="#3B82F6"
            // Dynamically set colors
            shape={(props) => {
              const { x, y, width, height, index } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={COLORS[chartData[index].priority]}
                  rx={4} // rounded corners
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskPriorityBarChart;
