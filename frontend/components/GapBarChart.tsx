'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Competency } from '../lib/types';

interface GapBarChartProps {
  competencies: Competency[];
}

export default function GapBarChart({ competencies }: GapBarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        Loading Gap Analysis Chart...
      </div>
    );
  }

  const data = competencies.map((c) => ({
    name: c.competency_name.length > 15 ? c.competency_name.slice(0, 14) + '…' : c.competency_name,
    fullName: c.competency_name,
    current: c.current_level,
    target: c.target_level,
    gap: c.gap,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#94a3b8" />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fill: '#475569', fontSize: 11 }}
            stroke="#cbd5e1"
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
                    <p className="text-amber-600 font-bold">
                      Skill Gap: {item.gap} {item.gap >= 2 ? '(Priority Focus)' : ''}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar
            dataKey="current"
            name="Current Level"
            fill="#3b82f6"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
          <Bar
            dataKey="target"
            name="Target Level"
            fill="#e2e8f0"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
