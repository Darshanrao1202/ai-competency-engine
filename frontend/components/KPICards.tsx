'use client';

import React from 'react';
import type { DashboardSummary } from '../lib/types';
import { TrendingUp, AlertTriangle, CheckCircle2, Brain } from 'lucide-react';

interface KPICardsProps {
  summary: DashboardSummary;
}

export default function KPICards({ summary }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Readiness */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Readiness
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {summary.overall_readiness_pct}%
          </span>
          <span className="text-xs text-slate-500">target mastery</span>
        </div>
        <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, summary.overall_readiness_pct))}%` }}
          />
        </div>
      </div>

      {/* 2. Active Skill Gaps */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Skill Gaps
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {summary.active_gaps}
          </span>
          <span className="text-xs text-amber-600 font-medium">subjects needing uplift</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span>Targeting Level 5 across 10 competencies</span>
        </div>
      </div>

      {/* 3. Completed Modules */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Completed Modules
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {summary.completed_modules}
          </span>
          <span className="text-xs text-emerald-600 font-medium">certified resources</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span>Continuous personalized progression</span>
        </div>
      </div>

      {/* 4. AI Evaluation Confidence */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            AI Assessment Confidence
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {summary.avg_confidence}%
          </span>
          <span className="text-xs text-purple-600 font-medium">reliability index</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <span>Calibrated against question difficulty</span>
        </div>
      </div>
    </div>
  );
}
