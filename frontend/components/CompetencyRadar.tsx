'use client';

import React, { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { Competency } from '../lib/types';

interface CompetencyRadarProps {
  competencies: Competency[];
}

export default function CompetencyRadar({ competencies }: CompetencyRadarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        Loading Competency Radar...
      </div>
    );
  }

  // Format data for radar
  const data = competencies.map((c) => ({
    subject: c.competency_name.length > 18 ? c.competency_name.slice(0, 16) + '…' : c.competency_name,
    fullName: c.competency_name,
    current: c.current_level,
    target: c.target_level,
    fullMark: 5,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Radar
            name="Target Level (5.0)"
            dataKey="target"
            stroke="#94a3b8"
            strokeDasharray="4 4"
            fill="#cbd5e1"
            fillOpacity={0.15}
          />
          <Radar
            name="Current Proficiency"
            dataKey="current"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.45}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{item.fullName}</p>
                    <p className="text-blue-600 font-semibold">
                      Current Level: {item.current} / 5
                    </p>
                    <p className="text-slate-500">Target Level: {item.target} / 5</p>
                    <p className="text-amber-600 font-medium">
                      Skill Gap: {item.target - item.current}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
