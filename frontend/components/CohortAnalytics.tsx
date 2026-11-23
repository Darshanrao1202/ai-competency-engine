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
import type { CohortAnalytics as CohortAnalyticsType } from '../lib/types';
import { BarChart3, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface CohortAnalyticsProps {
  analytics: CohortAnalyticsType;
}

export default function CohortAnalytics({ analytics }: CohortAnalyticsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = analytics.competency_averages.map((c) => ({
    name: c.competency_name.length > 14 ? c.competency_name.slice(0, 13) + '…' : c.competency_name,
    fullName: c.competency_name,
    avgCurrent: c.avg_current,
    avgTarget: c.avg_target,
    avgGap: c.avg_gap,
  }));

  const { gap_distribution } = analytics;

  return (
    <div className="space-y-6">
      {/* Gap Distribution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>No Gap (Mastered)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {gap_distribution.no_gap}
          </div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Level 5 attained</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Low Gap (Level 4)</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {gap_distribution.low_gap}
          </div>
          <p className="text-xs text-blue-600 mt-1 font-medium">1 level to target</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Moderate Gap</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {gap_distribution.medium_gap}
          </div>
          <p className="text-xs text-amber-600 mt-1 font-medium">2 levels to target</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>High Gap (Priority)</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {gap_distribution.high_gap}
          </div>
          <p className="text-xs text-red-600 mt-1 font-medium">3+ levels to target</p>
        </div>
      </div>

      {/* Cohort Competency Averages Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Cohort Average Proficiency vs Target
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated student performance across all 10 academic competencies.
            </p>
          </div>
        </div>

        {mounted ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
                          <p className="font-bold text-slate-900">{item.fullName}</p>
                          <p className="text-blue-600 font-semibold">
                            Cohort Avg Level: {item.avgCurrent} / 5.0
                          </p>
                          <p className="text-slate-500">Target Level: {item.avgTarget} / 5.0</p>
                          <p className="text-amber-600 font-bold">
                            Average Gap: {item.avgGap}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  dataKey="avgCurrent"
                  name="Cohort Current Avg"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="avgTarget"
                  name="Target Benchmark"
                  fill="#e2e8f0"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-slate-400">
            Loading Cohort Chart...
          </div>
        )}
      </div>
    </div>
  );
}
