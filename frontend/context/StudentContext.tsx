'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStudents } from '../lib/api';
import { useAuth } from './AuthContext';
import type { Student } from '../lib/types';

interface StudentContextType {
  studentId: number;
  setStudentId: (id: number) => void;
  students: Student[];
  loadingStudents: boolean;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const StudentContext = createContext<StudentContextType>({
  studentId: 1,
  setStudentId: () => {},
  students: [],
  loadingStudents: true,
  refreshTrigger: 0,
  triggerRefresh: () => {},
});

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState<number>(user?.student_id || 1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Sync studentId with user when logged in as a student
  useEffect(() => {
    if (user && user.role === 'student' && user.student_id) {
      setStudentId(user.student_id);
    }
  }, [user]);

  // Load students list only if authenticated
  useEffect(() => {
    if (!user) {
      setStudents([]);
      setLoadingStudents(false);
      return;
    }

    let mounted = true;
    async function load() {
      try {
        setLoadingStudents(true);
        const data = await fetchStudents();
        if (mounted && data.length > 0) {
          setStudents(data);
          if (user?.role !== 'student' && !data.some((s) => s.student_id === studentId)) {
            setStudentId(data[0].student_id);
          }
        }
      } catch (err) {
        console.error('Failed to load students in context:', err);
      } finally {
        if (mounted) setLoadingStudents(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <StudentContext.Provider
      value={{
        studentId,
        setStudentId,
        students,
        loadingStudents,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
