import type {
  Student,
  Dashboard,
  CompetencyFull,
  QuizData,
  SubmitResult,
  CohortAnalytics,
} from './types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchStudents(): Promise<Student[]> {
  try {
    const res = await fetch(`${API}/api/students`);
    if (!res.ok) throw new Error(`Failed to fetch students: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('fetchStudents error:', error);
    throw error;
  }
}

export async function fetchDashboard(studentId: number): Promise<Dashboard> {
  try {
    const res = await fetch(`${API}/api/students/${studentId}/dashboard`);
    if (!res.ok) throw new Error(`Failed to fetch dashboard: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('fetchDashboard error:', error);
    throw error;
  }
}

export async function fetchCompetencies(): Promise<CompetencyFull[]> {
  try {
    const res = await fetch(`${API}/api/competencies`);
    if (!res.ok) throw new Error(`Failed to fetch competencies: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('fetchCompetencies error:', error);
    throw error;
  }
}

export async function addCompetency(data: {
  competency_name: string;
  category: string;
  description: string;
}): Promise<CompetencyFull> {
  try {
    const res = await fetch(`${API}/api/competencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to add competency: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('addCompetency error:', error);
    throw error;
  }
}

export async function fetchQuiz(competencyId: number): Promise<QuizData> {
  try {
    const res = await fetch(`${API}/api/quizzes/${competencyId}`);
    if (!res.ok) throw new Error(`Failed to fetch quiz: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('fetchQuiz error:', error);
    throw error;
  }
}

export async function submitAssessment(data: {
  student_id: number;
  competency_id: number;
  answers: { question_id: string; selected_answer: string }[];
}): Promise<SubmitResult> {
  try {
    const res = await fetch(`${API}/api/assessments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to submit assessment: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('submitAssessment error:', error);
    throw error;
  }
}

export async function updatePathStatus(
  pathId: number,
  status: string
): Promise<PathEntry> {
  try {
    const res = await fetch(`${API}/api/paths/${pathId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(`Failed to update path status: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('updatePathStatus error:', error);
    throw error;
  }
}

export async function addResource(data: {
  competency_id: number;
  title: string;
  resource_type: string;
  difficulty_level: number;
  url: string;
}): Promise<{ resource_id: number; title: string }> {
  try {
    const res = await fetch(`${API}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to add resource: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('addResource error:', error);
    throw error;
  }
}

export async function fetchCohortAnalytics(): Promise<CohortAnalytics> {
  try {
    const res = await fetch(`${API}/api/analytics/cohort`);
    if (!res.ok) throw new Error(`Failed to fetch cohort analytics: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('fetchCohortAnalytics error:', error);
    throw error;
  }
}

// Re-export types for convenience
import type { PathEntry } from './types';
export type { Student, Dashboard, CompetencyFull, QuizData, SubmitResult, CohortAnalytics, PathEntry };
