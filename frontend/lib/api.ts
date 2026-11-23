import type {
  Student,
  Dashboard,
  CompetencyFull,
  QuizData,
  SubmitResult,
  CohortAnalytics,
  PathEntry,
  AuthResponse,
  User,
} from './types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If unauthorized and not already on /login, redirect
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
  }

  return res;
}

// ========================
// AUTHENTICATION APIS
// ========================

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed. Please check credentials.');
  }
  return await res.json();
}

export async function registerApi(data: {
  full_name: string;
  email: string;
  password: string;
  semester: number;
  specialization?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed.');
  }
  return await res.json();
}

export async function getMeApi(token?: string): Promise<User> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    Object.assign(headers, getAuthHeader());
  }

  const res = await fetch(`${API}/api/auth/me`, { headers });
  if (!res.ok) {
    throw new Error('Failed to retrieve user profile');
  }
  return await res.json();
}

// ========================
// CORE CURRICULUM APIS
// ========================

export async function fetchStudents(): Promise<Student[]> {
  try {
    const res = await authFetch(`${API}/api/students`);
    if (!res.ok) throw new Error(`Failed to fetch students: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('fetchStudents error:', error);
    throw error;
  }
}

export async function fetchDashboard(studentId: number): Promise<Dashboard> {
  try {
    const res = await authFetch(`${API}/api/students/${studentId}/dashboard`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to fetch dashboard: ${res.statusText}`);
    }
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
    const res = await authFetch(`${API}/api/competencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to add competency: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('addCompetency error:', error);
    throw error;
  }
}

export async function fetchQuiz(competencyId: number): Promise<QuizData> {
  try {
    const res = await authFetch(`${API}/api/quizzes/${competencyId}`);
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
    const res = await authFetch(`${API}/api/assessments/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to submit assessment: ${res.statusText}`);
    }
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
    const res = await authFetch(`${API}/api/paths/${pathId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to update path status: ${res.statusText}`);
    }
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
    const res = await authFetch(`${API}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to add resource: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('addResource error:', error);
    throw error;
  }
}

export async function fetchCohortAnalytics(): Promise<CohortAnalytics> {
  try {
    const res = await authFetch(`${API}/api/analytics/cohort`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to fetch cohort analytics: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('fetchCohortAnalytics error:', error);
    throw error;
  }
}

export type { Student, Dashboard, CompetencyFull, QuizData, SubmitResult, CohortAnalytics, PathEntry, User, AuthResponse };
