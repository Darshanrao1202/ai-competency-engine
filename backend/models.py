from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    CheckConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    semester = Column(Integer, nullable=False)
    specialization = Column(String(100))
    created_at = Column(DateTime, default=_utcnow)

    competencies = relationship("StudentCompetency", back_populates="student")
    assessments = relationship("Assessment", back_populates="student")
    personalized_paths = relationship("PersonalizedPath", back_populates="student")
    user = relationship("User", back_populates="student", uselist=False)


class Competency(Base):
    __tablename__ = "competencies"

    competency_id = Column(Integer, primary_key=True, autoincrement=True)
    competency_name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text)

    student_competencies = relationship("StudentCompetency", back_populates="competency")
    assessments = relationship("Assessment", back_populates="competency")
    learning_resources = relationship("LearningResource", back_populates="competency")


class StudentCompetency(Base):
    __tablename__ = "student_competencies"

    record_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.competency_id"), nullable=False)
    current_level = Column(Integer, default=1)
    target_level = Column(Integer, default=5)
    last_assessed = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint("current_level >= 1 AND current_level <= 5", name="ck_sc_current_level"),
        CheckConstraint("target_level >= 1 AND target_level <= 5", name="ck_sc_target_level"),
    )

    student = relationship("Student", back_populates="competencies")
    competency = relationship("Competency", back_populates="student_competencies")


class Assessment(Base):
    __tablename__ = "assessments"

    assessment_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    competency_id = Column(Integer, ForeignKey("competencies.competency_id"), nullable=False)
    score_percentage = Column(Float, nullable=False)
    assessment_date = Column(DateTime, default=_utcnow)
    ai_confidence_score = Column(Float)

    student = relationship("Student", back_populates="assessments")
    competency = relationship("Competency", back_populates="assessments")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    resource_id = Column(Integer, primary_key=True, autoincrement=True)
    competency_id = Column(Integer, ForeignKey("competencies.competency_id"), nullable=False)
    title = Column(String(300), nullable=False)
    resource_type = Column(String(50), nullable=False)
    difficulty_level = Column(Integer, nullable=False)
    url = Column(String(500))

    __table_args__ = (
        CheckConstraint("difficulty_level >= 1 AND difficulty_level <= 5", name="ck_lr_difficulty"),
    )

    competency = relationship("Competency", back_populates="learning_resources")
    personalized_paths = relationship("PersonalizedPath", back_populates="resource")


class PersonalizedPath(Base):
    __tablename__ = "personalized_paths"

    path_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("learning_resources.resource_id"), nullable=False)
    status = Column(String(20), default="Pending")
    ai_reason = Column(Text)
    assigned_date = Column(DateTime, default=_utcnow)
    completion_date = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="personalized_paths")
    resource = relationship("LearningResource", back_populates="personalized_paths")


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # 'student', 'faculty', 'admin'
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=True)
    created_at = Column(DateTime, default=_utcnow)

    student = relationship("Student", back_populates="user")
