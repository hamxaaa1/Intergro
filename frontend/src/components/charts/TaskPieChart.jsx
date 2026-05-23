import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const TaskPieChart = ({ data }) => {
  // Include Overdue slice
  const chartData = [
    { name: "Pending", value: data.Pending || 0 },
    { name: "In Progress", value: data["In Progress"] || 0 },
    { name: "Completed", value: data.Completed || 0 },
    { name: "Overdue", value: data.Overdue || 0 },
  ];

  const COLORS = {
    Pending: "#FBBF24",      // Yellow
    "In Progress": "#8B5CF6", // Purple
    Completed: "#10B981",    // Green
    Overdue: "#EF4444",      // Red
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={40} // donut
            labelLine={true}
            label={false} // hide inside labels
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => `${value}: ${data[value] || 0}`}
            wrapperStyle={{ fontSize: 14 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskPieChart;
