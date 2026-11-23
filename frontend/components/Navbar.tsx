'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStudent } from '../context/StudentContext';
import { GraduationCap, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { studentId, setStudentId, students, loadingStudents } = useStudent();

  const isStudentPortal = pathname.startsWith('/student') || pathname === '/';
  const isFacultyPortal = pathname.startsWith('/faculty');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                AI Competency Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">
                MCA Adaptive Learning & Gap Identification
              </span>
            </div>
          </div>

          {/* 1-Click Demo Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <Link
              href="/student"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isStudentPortal
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </Link>

            <Link
              href="/faculty"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isFacultyPortal
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty & Admin Portal</span>
            </Link>
          </div>

          {/* Right Section: Student Switcher Dropdown (when on student portal) & DB status */}
          <div className="flex items-center space-x-3">
            {isStudentPortal && (
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Student:
                </span>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(Number(e.target.value))}
                  disabled={loadingStudents}
                  className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.full_name} ({s.specialization} - Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Neon PostgreSQL Connected</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
