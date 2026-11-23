'use client';

import React, { useState } from 'react';
import { addResource } from '../lib/api';
import type { CompetencyFull } from '../lib/types';
import { BookPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  competencies: CompetencyFull[];
}

export default function AddResourceModal({
  isOpen,
  onClose,
  onSuccess,
  competencies,
}: AddResourceModalProps) {
  const [competencyId, setCompetencyId] = useState<number>(
    competencies.length > 0 ? competencies[0].competency_id : 1
  );
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState('Course');
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('Please provide a title and valid URL.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await addResource({
        competency_id: competencyId,
        title: title.trim(),
        resource_type: resourceType,
        difficulty_level: Number(difficultyLevel),
        url: url.trim(),
      });
      setTitle('');
      setUrl('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add learning resource');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <BookPlus className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Add Learning Resource</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Target Competency *
            </label>
            <select
              value={competencyId}
              onChange={(e) => setCompetencyId(Number(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {competencies.map((c) => (
                <option key={c.competency_id} value={c.competency_id}>
                  {c.competency_name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced PyTorch Distributed Tensor Parallelism"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Resource Type *
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Course">Course</option>
                <option value="Lab">Lab</option>
                <option value="Article">Article</option>
                <option value="Video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Difficulty Level (1-5) *
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Level 1: Foundational</option>
                <option value={2}>Level 2: Elementary</option>
                <option value={3}>Level 3: Intermediate</option>
                <option value={4}>Level 4: Advanced</option>
                <option value={5}>Level 5: Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Resource URL / Documentation Link *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/tutorials/resource-name"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-md disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Adding...' : 'Add Resource'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
