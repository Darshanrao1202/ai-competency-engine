'use client';

import React, { useState } from 'react';
import { updatePathStatus } from '../lib/api';
import type { PathEntry } from '../lib/types';
import { useStudent } from '../context/StudentContext';
import {
  BookOpen,
  CheckCircle2,
  Play,
  ExternalLink,
  Clock,
  Sparkles,
  FileText,
  Video,
  Code,
  GraduationCap,
} from 'lucide-react';

interface LearningPathProps {
  paths: PathEntry[];
}

export default function LearningPath({ paths }: LearningPathProps) {
  const { triggerRefresh } = useStudent();
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Pending' | 'Completed'>('All');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const completedCount = paths.filter((p) => p.status === 'Completed').length;
  const totalCount = paths.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredPaths = paths.filter((p) => {
    if (filter === 'All') return true;
    return p.status === filter;
  });

  const handleStatusUpdate = async (pathId: number, nextStatus: string) => {
    try {
      setUpdatingId(pathId);
      await updatePathStatus(pathId, nextStatus);
      triggerRefresh();
    } catch (err) {
      console.error('Failed to update path status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'Course':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Lab':
        return <Code className="w-3.5 h-3.5" />;
      case 'Article':
        return <FileText className="w-3.5 h-3.5" />;
      case 'Video':
        return <Video className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const getResourceTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      Course: 'bg-blue-50 text-blue-700 border-blue-200',
      Lab: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Article: 'bg-purple-50 text-purple-700 border-purple-200',
      Video: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          styles[type] || 'bg-slate-50 text-slate-700 border-slate-200'
        }`}
      >
        {getResourceTypeIcon(type)}
        <span>{type}</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      {/* Title & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Personalized Learning Path
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curated modules dynamically prioritized to close identified skill gaps.
          </p>
        </div>

        {/* Progress & Stats */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Curriculum Progress
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {completedCount} of {totalCount} completed ({progressPct}%)
            </div>
          </div>
          <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mt-4">
        {(['All', 'In Progress', 'Pending', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Path List */}
      <div className="mt-5 space-y-3.5">
        {filteredPaths.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No modules match the selected filter.
          </div>
        ) : (
          filteredPaths.map((path) => (
            <div
              key={path.path_id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {getResourceTypeBadge(path.resource_type)}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Difficulty Level {path.difficulty_level}
                    </span>
                    {getStatusBadge(path.status)}
                  </div>

                  <a
                    href={path.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{path.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  {path.ai_reason && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="italic leading-relaxed">{path.ai_reason}</span>
                    </div>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center space-x-2 sm:self-center">
                  {path.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusUpdate(path.path_id, 'In Progress')}
                      disabled={updatingId === path.path_id}
                      className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{updatingId === path.path_id ? 'Updating...' : 'Start'}</span>
                    </button>
                  )}

                  {path.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusUpdate(path.path_id, 'Completed')}
                      disabled={updatingId === path.path_id}
                      className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{updatingId === path.path_id ? 'Updating...' : 'Mark Done'}</span>
                    </button>
                  )}

                  {path.status === 'Completed' && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mastered</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
