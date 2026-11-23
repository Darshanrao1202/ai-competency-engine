'use client';

import React, { useState } from 'react';
import { fetchQuiz, submitAssessment } from '../lib/api';
import type { Competency, QuizData, SubmitResult } from '../lib/types';
import { useStudent } from '../context/StudentContext';
import {
  HelpCircle,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
} from 'lucide-react';

interface DiagnosticQuizProps {
  competencies: Competency[];
}

export default function DiagnosticQuiz({ competencies }: DiagnosticQuizProps) {
  const { studentId, triggerRefresh } = useStudent();
  const [selectedCompId, setSelectedCompId] = useState<number>(
    competencies.length > 0 ? competencies[0].competency_id : 1
  );
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (compId: number) => {
    try {
      setLoadingQuiz(true);
      setError(null);
      setResult(null);
      setAnswers({});
      const data = await fetchQuiz(compId);
      setQuizData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load diagnostic quiz');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!quizData) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quizData.questions.length) {
      setError(`Please answer all ${quizData.questions.length} questions before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payloadAnswers = Object.entries(answers).map(([qid, ans]) => ({
        question_id: qid,
        selected_answer: ans,
      }));

      const res = await submitAssessment({
        student_id: studentId,
        competency_id: selectedCompId,
        answers: payloadAnswers,
      });

      setResult(res);
      triggerRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to grade assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuizData(null);
    setResult(null);
    setAnswers({});
    setError(null);
  };

  const getDifficultyBadge = (level: number) => {
    const badges: Record<number, { label: string; bg: string; text: string }> = {
      1: { label: 'Level 1: Foundational', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
      2: { label: 'Level 2: Elementary', bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
      3: { label: 'Level 3: Intermediate', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
      4: { label: 'Level 4: Advanced', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
      5: { label: 'Level 5: Expert', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
    };
    const b = badges[level] || badges[1];
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${b.bg} ${b.text}`}>
        {b.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Interactive Diagnostic Assessment
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Adaptive, difficulty-weighted evaluation generating instant AI learning paths.
          </p>
        </div>

        {/* Competency Selector */}
        {!quizData && !result && (
          <div className="flex items-center space-x-3">
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {competencies.map((c) => (
                <option key={c.competency_id} value={c.competency_id}>
                  {c.competency_name} (Current: L{c.current_level} / Gap: {c.gap})
                </option>
              ))}
            </select>
            <button
              onClick={() => startQuiz(selectedCompId)}
              disabled={loadingQuiz}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{loadingQuiz ? 'Loading...' : 'Start Assessment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quiz Not Started Placeholder */}
      {!quizData && !result && (
        <div className="py-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <HelpCircle className="w-7 h-7" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Select a competency above and click &quot;Start Assessment&quot;
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Questions range from foundational concepts (Level 1) to distributed systems and advanced optimization (Level 5).
          </p>
        </div>
      )}

      {/* Active Quiz Form */}
      {quizData && !result && (
        <div className="mt-5 space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-sm font-bold text-slate-800">
              Assessing: {quizData.competency.competency_name}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Answered: {Object.keys(answers).length} / {quizData.questions.length}
            </span>
          </div>

          <div className="space-y-5">
            {quizData.questions.map((q, idx) => (
              <div
                key={q.question_id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                  {getDifficultyBadge(q.difficulty)}
                </div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed mb-4">
                  {q.question_text}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.question_id] === opt;
                    return (
                      <label
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.question_id, opt)}
                        className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all text-xs font-medium ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm'
                            : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.question_id}
                          checked={isSelected}
                          onChange={() => handleSelectAnswer(q.question_id, opt)}
                          className="mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="leading-snug">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-md disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Grading & Generating Path...' : 'Submit Assessment'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Quiz Results Section */}
      {result && (
        <div className="mt-5 space-y-5">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  <Award className="w-3.5 h-3.5" />
                  <span>Evaluation Completed</span>
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                  {result.updated_competency.competency_name}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Proficiency updated: Level {result.updated_competency.current_level} of {result.updated_competency.target_level} (Remaining Gap: {result.updated_competency.gap})
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-700">
                    {result.assessment.score_percentage}%
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Weighted Accuracy
                  </div>
                </div>
                <div className="h-10 w-px bg-blue-200" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-700">
                    {Math.round(result.assessment.ai_confidence_score * 100)}%
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    AI Confidence
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New AI Recommendations */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h5 className="text-sm font-bold text-slate-900">
                New Personalized Learning Recommendations (TF-IDF Cosine Match):
              </h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.recommendations.map((rec) => (
                <div
                  key={rec.path_id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {rec.resource_type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Diff: L{rec.difficulty_level}
                      </span>
                    </div>
                    <h6 className="text-xs font-bold text-slate-900 line-clamp-2">
                      {rec.title}
                    </h6>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 italic">
                      &quot;{rec.ai_reason}&quot;
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                    <span>Added to Path</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={resetQuiz}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Evaluate Another Subject</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
