"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface TicketStatusChartProps {
  userId?: string
  serviceId?: string
}

export function TicketStatusChart({ userId, serviceId }: TicketStatusChartProps) {
  // In a real application, you would fetch this data from an API based on the props
  const data = [
    { name: "Open", count: 40 },
    { name: "In Progress", count: 30 },
    { name: "Waiting for User", count: 20 },
    { name: "Resolved", count: 15 },
    { name: "Closed", count: 10 },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="count" fill="#00697F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

