'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStudent } from '../context/StudentContext';
import { AlertCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface AtRiskStudent {
  student_id: number;
  full_name: string;
  email?: string;
  specialization?: string;
  semester?: number;
  weak_competencies: string[];
  risk_level: string;
}

interface AtRiskTableProps {
  students: AtRiskStudent[];
}

export default function AtRiskTable({ students }: AtRiskTableProps) {
  const router = useRouter();
  const { setStudentId } = useStudent();

  const handleInspect = (id: number) => {
    setStudentId(id);
    router.push('/student');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              At-Risk Student Intervention Roster
            </h3>
            <p className="text-xs text-slate-500">
              Students identified with significant skill gaps (&ge; 2 levels) across multiple core subjects.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          {students.length} Students Requiring Intervention
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Specialization</th>
              <th className="py-3 px-4">Identified Weak Competencies</th>
              <th className="py-3 px-4">Risk Severity</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.student_id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <div>{student.full_name}</div>
                  <div className="text-[11px] text-slate-400 font-normal">
                    {student.email || `student_${student.student_id}@university.edu`}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {student.specialization || 'MCA AI/ML'} (Sem {student.semester || 3})
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-md">
                    {student.weak_competencies.map((wc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        {wc}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      student.risk_level === 'Critical'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{student.risk_level} Risk</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleInspect(student.student_id)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <span>Inspect Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
