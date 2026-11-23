'use client';

import React, { useEffect, useState } from 'react';
import { fetchCohortAnalytics, fetchCompetencies } from '../../lib/api';
import type { CohortAnalytics as CohortAnalyticsType, CompetencyFull } from '../../lib/types';
import CohortAnalytics from '../../components/CohortAnalytics';
import AtRiskTable from '../../components/AtRiskTable';
import AddCompetencyModal from '../../components/AddCompetencyModal';
import AddResourceModal from '../../components/AddResourceModal';
import { Users, PlusCircle, BookPlus, AlertCircle, RefreshCw } from 'lucide-react';

export default function FacultyPage() {
  const [analytics, setAnalytics] = useState<CohortAnalyticsType | null>(null);
  const [competencies, setCompetencies] = useState<CompetencyFull[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [isResModalOpen, setIsResModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsData, compsData] = await Promise.all([
        fetchCohortAnalytics(),
        fetchCompetencies(),
      ]);
      setAnalytics(analyticsData);
      setCompetencies(compsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load cohort analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Faculty & Curriculum Administration Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cohort-wide academic diagnostics, targeted interventions, and curriculum catalog management.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCompModalOpen(true)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Competency</span>
          </button>

          <button
            onClick={() => setIsResModalOpen(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            <BookPlus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>

          <button
            onClick={loadData}
            title="Refresh Cohort Data"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !analytics ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Computing cohort-wide analytics and skill gap distributions...
          </p>
        </div>
      ) : analytics ? (
        <>
          {/* Cohort Proficiency vs Target Charts & Distribution */}
          <CohortAnalytics analytics={analytics} />

          {/* At-Risk Intervention Table */}
          <AtRiskTable students={analytics.at_risk_students} />
        </>
      ) : null}

      {/* Interactive Modals */}
      <AddCompetencyModal
        isOpen={isCompModalOpen}
        onClose={() => setIsCompModalOpen(false)}
        onSuccess={loadData}
      />

      <AddResourceModal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        onSuccess={loadData}
        competencies={competencies}
      />
    </div>
  );
}
