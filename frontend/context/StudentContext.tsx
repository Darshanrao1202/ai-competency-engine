'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStudents } from '../lib/api';
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
  const [studentId, setStudentId] = useState<number>(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoadingStudents(true);
        const data = await fetchStudents();
        if (mounted && data.length > 0) {
          setStudents(data);
          // Keep current studentId if valid, else default to first student
          if (!data.some((s) => s.student_id === studentId)) {
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
  }, []);

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
