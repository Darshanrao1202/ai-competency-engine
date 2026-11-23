'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Users, Sparkles, LogOut, LogIn, Shield, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isStudentPortal = pathname.startsWith('/student');
  const isFacultyPortal = pathname.startsWith('/faculty');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
            <Users className="w-3 h-3" />
            <span>Faculty</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
            <GraduationCap className="w-3 h-3" />
            <span>Student</span>
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link href={user ? (user.role === 'student' ? '/student' : '/faculty') : '/login'} className="flex items-center space-x-3">
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
          </Link>

          {/* Navigation links based on role */}
          {user && (
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {user.role === 'student' ? (
                <Link
                  href="/student"
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isStudentPortal
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>My Student Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/faculty"
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isFacultyPortal
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Faculty & Admin Portal</span>
                  </Link>

                  <Link
                    href="/student"
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isStudentPortal
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Inspector</span>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/80 py-1.5 px-3 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {user.full_name}
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors border border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </Link>
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
