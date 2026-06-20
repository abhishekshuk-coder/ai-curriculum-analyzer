"use client";

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, ResponsiveContainer, Tooltip,
} from "recharts";
import { skillGapRadar as mockSkillGapRadar } from "@/lib/mock-data";

export interface SkillGapEntry {
  skill: string;
  [key: string]: string | number;
}

interface SkillGapRadarChartProps {
  data?: SkillGapEntry[];
  seriesAKey?: string;
  seriesALabel?: string;
  seriesAColor?: string;
  seriesBKey?: string;
  seriesBLabel?: string;
  seriesBColor?: string;
}

export default function SkillGapRadarChart({
  data,
  seriesAKey = "curriculum",
  seriesALabel = "Your Curriculum",
  seriesAColor = "#1E3A8A",
  seriesBKey = "industry",
  seriesBLabel = "Industry Demand",
  seriesBColor = "#10B981",
}: SkillGapRadarChartProps = {}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data ?? mockSkillGapRadar} outerRadius="75%">
        <PolarGrid stroke="#E5E9F0" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: "#5B677A", fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9AA6B8", fontSize: 10 }} />
        <Radar
          name={seriesALabel}
          dataKey={seriesAKey}
          stroke={seriesAColor}
          fill={seriesAColor}
          fillOpacity={0.28}
          animationDuration={1100}
        />
        <Radar
          name={seriesBLabel}
          dataKey={seriesBKey}
          stroke={seriesBColor}
          fill={seriesBColor}
          fillOpacity={0.22}
          animationDuration={1300}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #E5E9F0", boxShadow: "0 8px 30px -8px rgba(16,42,86,0.2)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#5B677A" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
