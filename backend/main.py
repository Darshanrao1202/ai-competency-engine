import json
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import text
from sqlalchemy.orm import Session

from auth import (
    create_access_token,
    get_current_user,
    hash_password,
    require_faculty_or_admin,
    require_student,
    verify_password,
)
from database import Base, engine, get_db
from models import (
    Assessment,
    Competency,
    LearningResource,
    PersonalizedPath,
    Student,
    StudentCompetency,
    User,
)
from seed import seed_database

QUIZ_BANK_FILE = Path(__file__).parent / "quiz_bank.json"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def load_quiz_bank() -> List[Dict[str, Any]]:
    if not QUIZ_BANK_FILE.exists():
        return []
    with open(QUIZ_BANK_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Idempotent table creation and seed data on startup
    try:
        seed_database(engine)
    except Exception as e:
        print(f"[STARTUP WARNING] Database seeding encounter: {e}")
    yield


app = FastAPI(
    title="AI Competency Gap & Personalized Learning Engine API",
    description="REST API and Machine Learning Recommendation Engine with JWT RBAC Protection",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# PYDANTIC SCHEMAS
# ==========================================


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=200)
    email: str = Field(..., min_length=5, max_length=200)
    password: str = Field(..., min_length=6, max_length=100)
    semester: int = Field(default=1, ge=1, le=8)
    specialization: Optional[str] = "AI/ML"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: str
    student_id: Optional[int] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class StudentResponse(BaseModel):
    student_id: int
    full_name: str
    email: str
    semester: int
    specialization: Optional[str] = None

    class Config:
        from_attributes = True


class CompetencyItem(BaseModel):
    competency_id: int
    competency_name: str
    category: str
    current_level: int
    target_level: int
    gap: int
    last_assessed: Optional[str] = None


class RecentAssessmentItem(BaseModel):
    assessment_id: int
    competency_name: str
    score_percentage: float
    assessment_date: str
    ai_confidence_score: float


class LearningPathItem(BaseModel):
    path_id: int
    resource_id: int
    title: str
    resource_type: str
    difficulty_level: int
    url: Optional[str] = None
    status: str
    ai_reason: Optional[str] = None
    assigned_date: str
    completion_date: Optional[str] = None


class DashboardSummary(BaseModel):
    overall_readiness_pct: float
    active_gaps: int
    completed_modules: int
    avg_confidence: float


class DashboardResponse(BaseModel):
    student: StudentResponse
    competencies: List[CompetencyItem]
    recent_assessments: List[RecentAssessmentItem]
    learning_path: List[LearningPathItem]
    summary: DashboardSummary


class CompetencyCreate(BaseModel):
    competency_name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10)


class CompetencyResponse(BaseModel):
    competency_id: int
    competency_name: str
    category: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ResourceCreate(BaseModel):
    competency_id: int
    title: str = Field(..., min_length=3, max_length=300)
    resource_type: str = Field(..., pattern="^(Course|Lab|Article|Video)$")
    difficulty_level: int = Field(..., ge=1, le=5)
    url: Optional[str] = Field(None, max_length=500)


class ResourceResponse(BaseModel):
    resource_id: int
    competency_id: int
    title: str
    resource_type: str
    difficulty_level: int
    url: Optional[str] = None

    class Config:
        from_attributes = True


class QuizQuestionOut(BaseModel):
    question_id: str
    question_text: str
    options: List[str]
    difficulty: int


class QuizResponse(BaseModel):
    competency: Dict[str, Any]
    questions: List[QuizQuestionOut]


class AnswerSubmission(BaseModel):
    question_id: str
    selected_answer: str


class AssessmentSubmitRequest(BaseModel):
    student_id: int
    competency_id: int
    answers: List[AnswerSubmission]


class PathStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Pending|In Progress|Completed)$")


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================


@app.post("/api/auth/register", response_model=AuthResponse, status_code=201, tags=["Authentication"])
def register_student(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new student, automatically creating both a Student profile
    (with baseline student_competencies initialized to level 1 for all competencies)
    and an authenticated User record with role='student'. Returns a signed JWT token.
    """
    clean_email = payload.email.strip().lower()

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Check if student with this email already exists
    existing_student = db.query(Student).filter(Student.email == clean_email).first()
    if existing_student:
        student = existing_student
    else:
        # Create student profile
        student = Student(
            full_name=payload.full_name.strip(),
            email=clean_email,
            semester=payload.semester,
            specialization=payload.specialization or "AI/ML",
            created_at=_utcnow(),
        )
        db.add(student)
        db.flush()

        # Initialize student_competencies across all existing competencies
        all_comps = db.query(Competency).all()
        for c in all_comps:
            sc = StudentCompetency(
                student_id=student.student_id,
                competency_id=c.competency_id,
                current_level=1,
                target_level=5,
                last_assessed=None,
            )
            db.add(sc)
        db.flush()

    # Create User account
    pwd_hash = hash_password(payload.password)
    new_user = User(
        full_name=payload.full_name.strip(),
        email=clean_email,
        password_hash=pwd_hash,
        role="student",
        student_id=student.student_id,
        created_at=_utcnow(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue 24-hour access token
    token = create_access_token(
        {
            "sub": str(new_user.user_id),
            "email": new_user.email,
            "role": new_user.role,
            "student_id": new_user.student_id,
        }
    )

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(new_user),
    )


@app.post("/api/auth/login", response_model=AuthResponse, tags=["Authentication"])
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Verifies email and password credentials, returning an access_token and user profile.
    Supports students, faculty, and administrators.
    """
    clean_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        {
            "sub": str(user.user_id),
            "email": user.email,
            "role": user.role,
            "student_id": user.student_id,
        }
    )

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@app.get("/api/auth/me", response_model=UserOut, tags=["Authentication"])
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user profile based on Bearer token."""
    return UserOut.model_validate(current_user)


# ==========================================
# SYSTEM & CORE API ENDPOINTS
# ==========================================


@app.get("/health", tags=["System"])
def health_check(db: Session = Depends(get_db)):
    """Verifies backend runtime, database connectivity, and auth state."""
    try:
        db.execute(text("SELECT 1"))
        user_count = db.query(User).count()
        return {
            "status": "ok",
            "database": "connected",
            "users_count": user_count,
            "timestamp": _utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}",
        )


@app.get("/api/students", response_model=List[StudentResponse], tags=["Students"])
def get_students(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns registered MCA students. Accessible by authenticated users."""
    students = db.query(Student).order_by(Student.student_id).all()
    return students


@app.get("/api/students/{student_id}/dashboard", response_model=DashboardResponse, tags=["Dashboard"])
def get_student_dashboard(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns complete dashboard details for a given student.
    Enforces RBAC: Students can only access their own dashboard; Faculty/Admin can view any.
    """
    if current_user.role == "student" and current_user.student_id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You may only view your own student dashboard.",
        )

    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    sc_records = (
        db.query(StudentCompetency, Competency)
        .join(Competency, StudentCompetency.competency_id == Competency.competency_id)
        .filter(StudentCompetency.student_id == student_id)
        .order_by(Competency.competency_id)
        .all()
    )

    competencies_list: List[CompetencyItem] = []
    readiness_ratios: List[float] = []
    active_gaps_count = 0

    for sc, comp in sc_records:
        curr = sc.current_level or 1
        target = sc.target_level or 5
        gap = max(0, target - curr)
        if gap > 0:
            active_gaps_count += 1
        readiness_ratios.append(min(1.0, curr / target))

        competencies_list.append(
            CompetencyItem(
                competency_id=comp.competency_id,
                competency_name=comp.competency_name,
                category=comp.category,
                current_level=curr,
                target_level=target,
                gap=gap,
                last_assessed=sc.last_assessed.isoformat() if sc.last_assessed else None,
            )
        )

    assessments_query = (
        db.query(Assessment, Competency.competency_name)
        .join(Competency, Assessment.competency_id == Competency.competency_id)
        .filter(Assessment.student_id == student_id)
        .order_by(Assessment.assessment_date.desc())
        .limit(10)
        .all()
    )

    recent_assessments: List[RecentAssessmentItem] = []
    confidence_values: List[float] = []
    for ass, comp_name in assessments_query:
        confidence = ass.ai_confidence_score or 0.85
        confidence_values.append(confidence)
        recent_assessments.append(
            RecentAssessmentItem(
                assessment_id=ass.assessment_id,
                competency_name=comp_name,
                score_percentage=round(ass.score_percentage, 1),
                assessment_date=ass.assessment_date.isoformat(),
                ai_confidence_score=round(confidence, 3),
            )
        )

    paths_query = (
        db.query(PersonalizedPath, LearningResource)
        .join(LearningResource, PersonalizedPath.resource_id == LearningResource.resource_id)
        .filter(PersonalizedPath.student_id == student_id)
        .order_by(
            PersonalizedPath.status.desc(),
            PersonalizedPath.assigned_date.desc(),
        )
        .all()
    )

    learning_paths: List[LearningPathItem] = []
    completed_modules_count = 0
    for p, res in paths_query:
        if p.status == "Completed":
            completed_modules_count += 1
        learning_paths.append(
            LearningPathItem(
                path_id=p.path_id,
                resource_id=res.resource_id,
                title=res.title,
                resource_type=res.resource_type,
                difficulty_level=res.difficulty_level,
                url=res.url,
                status=p.status,
                ai_reason=p.ai_reason,
                assigned_date=p.assigned_date.isoformat(),
                completion_date=p.completion_date.isoformat() if p.completion_date else None,
            )
        )

    overall_readiness = (
        round(float(np.mean(readiness_ratios)) * 100, 1) if readiness_ratios else 0.0
    )
    avg_conf = (
        round(float(np.mean(confidence_values)) * 100, 1) if confidence_values else 88.0
    )

    return DashboardResponse(
        student=StudentResponse.model_validate(student),
        competencies=competencies_list,
        recent_assessments=recent_assessments,
        learning_path=learning_paths,
        summary=DashboardSummary(
            overall_readiness_pct=overall_readiness,
            active_gaps=active_gaps_count,
            completed_modules=completed_modules_count,
            avg_confidence=avg_conf,
        ),
    )


@app.get("/api/competencies", response_model=List[CompetencyResponse], tags=["Competencies"])
def get_competencies(db: Session = Depends(get_db)):
    """Returns all registered academic competencies."""
    return db.query(Competency).order_by(Competency.competency_id).all()


@app.post("/api/competencies", response_model=CompetencyResponse, status_code=201, tags=["Competencies"])
def create_competency(
    comp_in: CompetencyCreate,
    current_user: User = Depends(require_faculty_or_admin),
    db: Session = Depends(get_db),
):
    """
    Creates a new competency and auto-initializes student_competency records.
    Restricted to Faculty and Admin roles (403 for students).
    """
    new_comp = Competency(
        competency_name=comp_in.competency_name,
        category=comp_in.category,
        description=comp_in.description,
    )
    db.add(new_comp)
    db.flush()

    students = db.query(Student).all()
    for s in students:
        sc = StudentCompetency(
            student_id=s.student_id,
            competency_id=new_comp.competency_id,
            current_level=1,
            target_level=5,
            last_assessed=None,
        )
        db.add(sc)

    db.commit()
    db.refresh(new_comp)
    return new_comp


@app.get("/api/quizzes/{competency_id}", response_model=QuizResponse, tags=["Assessments"])
def get_diagnostic_quiz(
    competency_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetches diagnostic quiz questions for the specified competency.
    Correct answer keys are stripped from the response payload.
    """
    comp = db.query(Competency).filter(Competency.competency_id == competency_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")

    bank = load_quiz_bank()
    matching_questions = [q for q in bank if q.get("competency_id") == competency_id]

    if not matching_questions:
        matching_questions = [
            {
                "question_id": f"gen_{competency_id}_1",
                "question_text": f"Explain the core architectural principles of {comp.competency_name}.",
                "options": [
                    f"Foundational concepts in {comp.category}",
                    f"Intermediate application of {comp.competency_name}",
                    f"Advanced synthesis and optimization",
                    f"None of the above",
                ],
                "difficulty": 1,
            }
        ]

    sanitized_questions = [
        QuizQuestionOut(
            question_id=q["question_id"],
            question_text=q["question_text"],
            options=q["options"],
            difficulty=q.get("difficulty", 1),
        )
        for q in matching_questions
    ]

    return QuizResponse(
        competency={
            "competency_id": comp.competency_id,
            "competency_name": comp.competency_name,
            "category": comp.category,
        },
        questions=sanitized_questions,
    )


@app.post("/api/assessments/submit", tags=["Assessments"])
def submit_assessment(
    payload: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Grades diagnostic quiz submissions with difficulty-weighted scoring,
    computes response consistency metrics (AI confidence score),
    updates current_level and competency gap, and executes the
    Scikit-Learn TF-IDF + Adaptive Difficulty recommendation engine.
    Restricted: Students can only submit assessments for their own profile.
    """
    if current_user.role == "student" and current_user.student_id != payload.student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You may only submit assessments for your own student profile.",
        )

    student = db.query(Student).filter(Student.student_id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    comp = db.query(Competency).filter(Competency.competency_id == payload.competency_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")

    quiz_bank = load_quiz_bank()
    q_map = {q["question_id"]: q for q in quiz_bank}

    earned_weight = 0.0
    total_weight = 0.0
    easy_correct, easy_total = 0, 0
    hard_correct, hard_total = 0, 0

    for ans in payload.answers:
        q = q_map.get(ans.question_id)
        if not q:
            continue
        difficulty = q.get("difficulty", 1)
        total_weight += difficulty

        is_correct = ans.selected_answer.strip() == q.get("correct_answer", "").strip()
        if is_correct:
            earned_weight += difficulty

        if difficulty <= 2:
            easy_total += 1
            if is_correct:
                easy_correct += 1
        else:
            hard_total += 1
            if is_correct:
                hard_correct += 1

    if total_weight > 0:
        score_percentage = round((earned_weight / total_weight) * 100, 1)
    else:
        score_percentage = 50.0

    easy_acc = (easy_correct / easy_total) if easy_total > 0 else 1.0
    hard_acc = (hard_correct / hard_total) if hard_total > 0 else 0.5
    inconsistency = max(0.0, hard_acc - easy_acc)
    ai_confidence = float(np.clip(1.0 - (inconsistency * 0.4), 0.68, 0.98))
    ai_confidence = round(ai_confidence, 3)

    if score_percentage < 25.0:
        new_level = 1
    elif score_percentage < 45.0:
        new_level = 2
    elif score_percentage < 65.0:
        new_level = 3
    elif score_percentage < 85.0:
        new_level = 4
    else:
        new_level = 5

    sc = (
        db.query(StudentCompetency)
        .filter(
            StudentCompetency.student_id == payload.student_id,
            StudentCompetency.competency_id == payload.competency_id,
        )
        .first()
    )

    if not sc:
        sc = StudentCompetency(
            student_id=payload.student_id,
            competency_id=payload.competency_id,
            current_level=new_level,
            target_level=5,
            last_assessed=_utcnow(),
        )
        db.add(sc)
    else:
        sc.current_level = new_level
        sc.last_assessed = _utcnow()

    assessment_record = Assessment(
        student_id=payload.student_id,
        competency_id=payload.competency_id,
        score_percentage=score_percentage,
        assessment_date=_utcnow(),
        ai_confidence_score=ai_confidence,
    )
    db.add(assessment_record)
    db.flush()

    gap = max(0, (sc.target_level or 5) - new_level)

    # Scikit-Learn TF-IDF + Adaptive Difficulty
    all_competencies = db.query(Competency).all()
    comp_descriptions = [c.description or c.competency_name for c in all_competencies]
    comp_id_to_idx = {c.competency_id: idx for idx, c in enumerate(all_competencies)}

    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform(comp_descriptions)
    target_idx = comp_id_to_idx.get(payload.competency_id, 0)
    sim_scores = cosine_similarity(tfidf_matrix[target_idx], tfidf_matrix).flatten()

    target_diff = min(5, new_level + 1)

    existing_resource_ids = {
        p.resource_id
        for p in db.query(PersonalizedPath.resource_id)
        .filter(PersonalizedPath.student_id == payload.student_id)
        .all()
    }

    all_resources = db.query(LearningResource).all()
    scored_candidates = []

    for res in all_resources:
        if res.resource_id in existing_resource_ids:
            continue

        c_idx = comp_id_to_idx.get(res.competency_id)
        if res.competency_id == payload.competency_id:
            content_sim = 1.0
        elif c_idx is not None:
            content_sim = float(sim_scores[c_idx])
        else:
            content_sim = 0.1

        diff_gap = abs(res.difficulty_level - target_diff)
        diff_score = max(0.0, 1.0 - (diff_gap * 0.25))

        total_rec_score = (content_sim * 0.65) + (diff_score * 0.35)
        scored_candidates.append((total_rec_score, res))

    scored_candidates.sort(key=lambda x: x[0], reverse=True)
    top_candidates = scored_candidates[:3]

    new_recommendations = []
    for score, res in top_candidates:
        reason = (
            f"Assigned after diagnostic scoring {score_percentage}%. "
            f"Level {new_level} proficiency mapped to difficulty {res.difficulty_level} "
            f"{res.resource_type} to close your skill gap toward target mastery."
        )
        new_path = PersonalizedPath(
            student_id=payload.student_id,
            resource_id=res.resource_id,
            status="Pending",
            ai_reason=reason,
            assigned_date=_utcnow(),
        )
        db.add(new_path)
        db.flush()

        new_recommendations.append(
            {
                "path_id": new_path.path_id,
                "resource_id": res.resource_id,
                "title": res.title,
                "resource_type": res.resource_type,
                "difficulty_level": res.difficulty_level,
                "url": res.url,
                "ai_reason": reason,
            }
        )

    db.commit()

    return {
        "assessment": {
            "assessment_id": assessment_record.assessment_id,
            "score_percentage": score_percentage,
            "ai_confidence_score": ai_confidence,
            "earned_weight": earned_weight,
            "total_weight": total_weight,
        },
        "updated_competency": {
            "competency_id": comp.competency_id,
            "competency_name": comp.competency_name,
            "current_level": new_level,
            "target_level": sc.target_level,
            "gap": gap,
        },
        "recommendations": new_recommendations,
    }


@app.patch("/api/paths/{path_id}", tags=["Learning Paths"])
def update_path_status(
    path_id: int,
    payload: PathStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Updates learning path status (Pending -> In Progress -> Completed).
    Enforces that students can only update their own learning path items.
    """
    path_record = (
        db.query(PersonalizedPath).filter(PersonalizedPath.path_id == path_id).first()
    )
    if not path_record:
        raise HTTPException(status_code=404, detail="Learning path entry not found")

    if current_user.role == "student" and path_record.student_id != current_user.student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You may only update learning paths assigned to you.",
        )

    path_record.status = payload.status
    if payload.status == "Completed":
        path_record.completion_date = _utcnow()
    elif payload.status in ["Pending", "In Progress"]:
        path_record.completion_date = None

    db.commit()
    db.refresh(path_record)

    return {
        "path_id": path_record.path_id,
        "status": path_record.status,
        "completion_date": (
            path_record.completion_date.isoformat()
            if path_record.completion_date
            else None
        ),
    }


@app.post("/api/resources", response_model=ResourceResponse, status_code=201, tags=["Resources"])
def create_resource(
    res_in: ResourceCreate,
    current_user: User = Depends(require_faculty_or_admin),
    db: Session = Depends(get_db),
):
    """Creates a new learning resource. Restricted to Faculty and Admin roles."""
    comp = db.query(Competency).filter(Competency.competency_id == res_in.competency_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")

    new_res = LearningResource(
        competency_id=res_in.competency_id,
        title=res_in.title,
        resource_type=res_in.resource_type,
        difficulty_level=res_in.difficulty_level,
        url=res_in.url,
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return new_res


@app.get("/api/analytics/cohort", tags=["Analytics"])
def get_cohort_analytics(
    current_user: User = Depends(require_faculty_or_admin),
    db: Session = Depends(get_db),
):
    """
    Computes cohort-wide academic analytics.
    Strictly restricted to Faculty and Administrator roles (403 Forbidden for students).
    """
    competencies = db.query(Competency).order_by(Competency.competency_id).all()
    all_sc = db.query(StudentCompetency).all()

    comp_averages = []
    for c in competencies:
        records = [sc for sc in all_sc if sc.competency_id == c.competency_id]
        if records:
            avg_curr = round(float(np.mean([r.current_level for r in records])), 2)
            avg_tgt = round(float(np.mean([r.target_level for r in records])), 2)
            avg_g = round(float(np.mean([max(0, r.target_level - r.current_level) for r in records])), 2)
        else:
            avg_curr, avg_tgt, avg_g = 1.0, 5.0, 4.0

        comp_averages.append(
            {
                "competency_id": c.competency_id,
                "competency_name": c.competency_name,
                "category": c.category,
                "avg_current": avg_curr,
                "avg_target": avg_tgt,
                "avg_gap": avg_g,
            }
        )

    distribution = {"no_gap": 0, "low_gap": 0, "medium_gap": 0, "high_gap": 0}
    for sc in all_sc:
        g = max(0, sc.target_level - sc.current_level)
        if g == 0:
            distribution["no_gap"] += 1
        elif g == 1:
            distribution["low_gap"] += 1
        elif g == 2:
            distribution["medium_gap"] += 1
        else:
            distribution["high_gap"] += 1

    students = db.query(Student).order_by(Student.student_id).all()
    at_risk_list = []
    comp_name_map = {c.competency_id: c.competency_name for c in competencies}

    for s in students:
        s_records = [sc for sc in all_sc if sc.student_id == s.student_id]
        weak_comps = []
        max_gap = 0
        for sc in s_records:
            g = max(0, sc.target_level - sc.current_level)
            if g >= 2:
                weak_comps.append(comp_name_map.get(sc.competency_id, "Subject"))
            if g > max_gap:
                max_gap = g

        if len(weak_comps) >= 2:
            risk_level = "Critical" if max_gap >= 3 else "High"
            at_risk_list.append(
                {
                    "student_id": s.student_id,
                    "full_name": s.full_name,
                    "email": s.email,
                    "specialization": s.specialization,
                    "semester": s.semester,
                    "weak_competencies": weak_comps,
                    "risk_level": risk_level,
                }
            )

    return {
        "competency_averages": comp_averages,
        "gap_distribution": distribution,
        "at_risk_students": at_risk_list,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
