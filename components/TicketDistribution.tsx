"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Technical', value: 400 },
  { name: 'Billing', value: 300 },
  { name: 'General', value: 200 },
  { name: 'Feature Request', value: 100 },
  { name: 'Other', value: 50 },
];

const COLORS = ['#00697F', '#DF6F2A', '#35C2DE', '#0D9181', '#1FDEC6'];

export function TicketDistribution() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

