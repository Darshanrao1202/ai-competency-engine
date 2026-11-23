export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  student_id: number | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Student {
  student_id: number;
  full_name: string;
  email: string;
  semester: number;
  specialization: string;
}

export interface Competency {
  competency_id: number;
  competency_name: string;
  category: string;
  current_level: number;
  target_level: number;
  gap: number;
  last_assessed: string | null;
}

export interface Assessment {
  assessment_id: number;
  competency_name: string;
  score_percentage: number;
  assessment_date: string;
  ai_confidence_score: number;
}

export interface PathEntry {
  path_id: number;
  resource_id: number;
  title: string;
  resource_type: string;
  difficulty_level: number;
  url: string;
  status: string;
  ai_reason: string;
  assigned_date: string;
  completion_date: string | null;
}

export interface DashboardSummary {
  overall_readiness_pct: number;
  active_gaps: number;
  completed_modules: number;
  avg_confidence: number;
}

export interface Dashboard {
  student: Student;
  competencies: Competency[];
  recent_assessments: Assessment[];
  learning_path: PathEntry[];
  summary: DashboardSummary;
}

export interface QuizQuestion {
  question_id: string;
  question_text: string;
  options: string[];
  difficulty: number;
}

export interface QuizData {
  competency: {
    competency_id: number;
    competency_name: string;
  };
  questions: QuizQuestion[];
}

export interface SubmitResult {
  assessment: {
    assessment_id: number;
    score_percentage: number;
    ai_confidence_score: number;
  };
  updated_competency: {
    competency_id: number;
    competency_name: string;
    current_level: number;
    target_level: number;
    gap: number;
  };
  recommendations: {
    path_id: number;
    title: string;
    resource_type: string;
    difficulty_level: number;
    ai_reason: string;
  }[];
}

export interface CohortAnalytics {
  competency_averages: {
    competency_id?: number;
    competency_name: string;
    category?: string;
    avg_current: number;
    avg_target: number;
    avg_gap: number;
  }[];
  gap_distribution: {
    no_gap: number;
    low_gap: number;
    medium_gap: number;
    high_gap: number;
  };
  at_risk_students: {
    student_id: number;
    full_name: string;
    email?: string;
    specialization?: string;
    semester?: number;
    weak_competencies: string[];
    risk_level: string;
  }[];
}

export interface CompetencyFull {
  competency_id: number;
  competency_name: string;
  category: string;
  description: string;
}
