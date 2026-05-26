"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Mon", mentions: 120 },
  { name: "Tue", mentions: 180 },
  { name: "Wed", mentions: 150 },
  { name: "Thu", mentions: 220 },
  { name: "Fri", mentions: 280 },
  { name: "Sat", mentions: 190 },
  { name: "Sun", mentions: 160 },
];

export function MentionsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="mentions" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
