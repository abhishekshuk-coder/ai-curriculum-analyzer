"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { careerTrajectory as mockTrajectory } from "@/lib/student-mock-data";

const series = [
  { key: "withRoadmap", label: "Following Your Roadmap", id: "with-roadmap", color: "#10B981" },
  { key: "withoutRoadmap", label: "Staying On Current Path", id: "without-roadmap", color: "#9AA6B8" },
];

export interface CareerTrajectoryEntry {
  milestone: string;
  withRoadmap: number;
  withoutRoadmap: number;
}

interface CareerTrajectoryChartProps {
  data?: CareerTrajectoryEntry[];
}

export default function CareerTrajectoryChart({ data }: CareerTrajectoryChartProps = {}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data ?? mockTrajectory} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient id={`grad-${s.id}`} key={s.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
        <XAxis dataKey="milestone" tick={{ fill: "#5B677A", fontSize: 12 }} axisLine={{ stroke: "#E5E9F0" }} tickLine={false} />
        <YAxis tick={{ fill: "#5B677A", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #E5E9F0", boxShadow: "0 8px 30px -8px rgba(16,42,86,0.2)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#5B677A" }} />
        {series.map((s, i) => (
          <Area
            key={s.id}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            fill={`url(#grad-${s.id})`}
            animationDuration={1200}
            animationBegin={i * 150}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
