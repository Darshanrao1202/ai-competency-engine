'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import { fetchDashboard } from '../../lib/api';
import type { Dashboard } from '../../lib/types';
import KPICards from '../../components/KPICards';
import CompetencyRadar from '../../components/CompetencyRadar';
import GapBarChart from '../../components/GapBarChart';
import DiagnosticQuiz from '../../components/DiagnosticQuiz';
import LearningPath from '../../components/LearningPath';
import { GraduationCap, Mail, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';

export default function StudentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { studentId, setStudentId, students, refreshTrigger } = useStudent();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Determine effective student ID: strictly user.student_id for student role
  const effectiveStudentId = user?.role === 'student' ? user.student_id : studentId;

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!effectiveStudentId || authLoading || !user) return;

    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboard(effectiveStudentId!);
        if (mounted) {
          setDashboard(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load student dashboard');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [effectiveStudentId, refreshTrigger, authLoading, user]);

  if (authLoading || (loading && !dashboard)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          Loading student competency profile from Neon PostgreSQL...
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Access Denied or Failed to Load</h4>
            <p className="text-xs mt-1 text-red-700">{error || 'Unable to retrieve dashboard data.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { student, competencies, summary, learning_path } = dashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Faculty Inspection Notice (if faculty/admin is inspecting a student) */}
      {user?.role !== 'student' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">
              Faculty Inspection Mode: You are viewing individual performance data for {student.full_name}.
            </span>
          </div>

          {students.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="font-bold">Switch Student:</span>
              <select
                value={studentId}
                onChange={(e) => setStudentId(Number(e.target.value))}
                className="bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.full_name} ({s.specialization})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Student Profile Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20">
            {student.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                {student.full_name}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Semester {student.semester}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{student.specialization || 'MCA AI/ML Program'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{student.email}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-700">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>JWT Protected Student Session</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KPICards summary={summary} />

      {/* Charts Row: Radar & Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Competency Radar Profile
            </h3>
            <p className="text-xs text-slate-500">
              Multi-axial visualization comparing current proficiency to target mastery.
            </p>
          </div>
          <CompetencyRadar competencies={competencies} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Proficiency & Gap Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Horizontal breakdown of current level vs target level per competency.
            </p>
          </div>
          <GapBarChart competencies={competencies} />
        </div>
      </div>

      {/* Interactive Diagnostic Quiz */}
      <DiagnosticQuiz competencies={competencies} />

      {/* Personalized Learning Path */}
      <LearningPath paths={learning_path} />
    </div>
  );
}
