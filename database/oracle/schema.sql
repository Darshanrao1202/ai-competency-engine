-- ============================================================================
-- AI-Enabled Competency Gap Identification & Personalized Learning Engine
-- Oracle Database Schema DDL
-- ============================================================================

-- ===================== SEQUENCES =====================

CREATE SEQUENCE students_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE competencies_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE student_competencies_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE assessments_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE learning_resources_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE personalized_paths_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- ===================== TABLES =====================

-- 1. Students
CREATE TABLE students (
    student_id      NUMBER          PRIMARY KEY,
    full_name       VARCHAR2(200)   NOT NULL,
    email           VARCHAR2(200)   NOT NULL UNIQUE,
    semester        NUMBER          NOT NULL,
    specialization  VARCHAR2(100),
    created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP
);

-- 2. Competencies
CREATE TABLE competencies (
    competency_id   NUMBER          PRIMARY KEY,
    competency_name VARCHAR2(200)   NOT NULL,
    category        VARCHAR2(100)   NOT NULL,
    description     CLOB
);

-- 3. Student Competencies (tracks each student's level per competency)
CREATE TABLE student_competencies (
    record_id       NUMBER          PRIMARY KEY,
    student_id      NUMBER          NOT NULL,
    competency_id   NUMBER          NOT NULL,
    current_level   NUMBER          DEFAULT 1,
    target_level    NUMBER          DEFAULT 5,
    last_assessed   TIMESTAMP,
    CONSTRAINT fk_sc_student    FOREIGN KEY (student_id)    REFERENCES students(student_id),
    CONSTRAINT fk_sc_competency FOREIGN KEY (competency_id) REFERENCES competencies(competency_id),
    CONSTRAINT chk_current_level CHECK (current_level BETWEEN 1 AND 5),
    CONSTRAINT chk_target_level  CHECK (target_level  BETWEEN 1 AND 5)
);

-- 4. Assessments
CREATE TABLE assessments (
    assessment_id       NUMBER          PRIMARY KEY,
    student_id          NUMBER          NOT NULL,
    competency_id       NUMBER          NOT NULL,
    score_percentage    NUMBER(5,2)     NOT NULL,
    assessment_date     TIMESTAMP       DEFAULT SYSTIMESTAMP,
    ai_confidence_score NUMBER(4,3),
    CONSTRAINT fk_assess_student    FOREIGN KEY (student_id)    REFERENCES students(student_id),
    CONSTRAINT fk_assess_competency FOREIGN KEY (competency_id) REFERENCES competencies(competency_id)
);

-- 5. Learning Resources
CREATE TABLE learning_resources (
    resource_id     NUMBER          PRIMARY KEY,
    competency_id   NUMBER          NOT NULL,
    title           VARCHAR2(300)   NOT NULL,
    resource_type   VARCHAR2(50)    NOT NULL,
    difficulty_level NUMBER         NOT NULL,
    url             VARCHAR2(500),
    CONSTRAINT fk_lr_competency FOREIGN KEY (competency_id) REFERENCES competencies(competency_id),
    CONSTRAINT chk_resource_type CHECK (resource_type IN ('Course','Lab','Article','Video')),
    CONSTRAINT chk_difficulty    CHECK (difficulty_level BETWEEN 1 AND 5)
);

-- 6. Personalized Paths
CREATE TABLE personalized_paths (
    path_id         NUMBER          PRIMARY KEY,
    student_id      NUMBER          NOT NULL,
    resource_id     NUMBER          NOT NULL,
    status          VARCHAR2(20)    DEFAULT 'Pending',
    ai_reason       CLOB,
    assigned_date   TIMESTAMP       DEFAULT SYSTIMESTAMP,
    completion_date TIMESTAMP,
    CONSTRAINT fk_pp_student  FOREIGN KEY (student_id)  REFERENCES students(student_id),
    CONSTRAINT fk_pp_resource FOREIGN KEY (resource_id) REFERENCES learning_resources(resource_id),
    CONSTRAINT chk_path_status CHECK (status IN ('Pending','In Progress','Completed'))
);

-- 7. Users (JWT Role-Based Authentication)
CREATE TABLE users (
    user_id         NUMBER          PRIMARY KEY,
    full_name       VARCHAR2(200)   NOT NULL,
    email           VARCHAR2(200)   NOT NULL UNIQUE,
    password_hash   VARCHAR2(255)   NOT NULL,
    role            VARCHAR2(50)    NOT NULL,
    student_id      NUMBER,
    created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_users_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT chk_user_role    CHECK (role IN ('student', 'faculty', 'admin'))
);

-- ===================== AUTO-PK TRIGGERS =====================

CREATE OR REPLACE TRIGGER trg_students_pk
BEFORE INSERT ON students
FOR EACH ROW
BEGIN
    IF :NEW.student_id IS NULL THEN
        :NEW.student_id := students_seq.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_competencies_pk
BEFORE INSERT ON competencies
FOR EACH ROW
BEGIN
    IF :NEW.competency_id IS NULL THEN
        :NEW.competency_id := competencies_seq.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_student_competencies_pk
BEFORE INSERT ON student_competencies
FOR EACH ROW
BEGIN
    IF :NEW.record_id IS NULL THEN
        :NEW.record_id := student_competencies_seq.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_assessments_pk
BEFORE INSERT ON assessments
FOR EACH ROW
BEGIN
    IF :NEW.assessment_id IS NULL THEN
        :NEW.assessment_id := assessments_seq.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_learning_resources_pk
BEFORE INSERT ON learning_resources
FOR EACH ROW
BEGIN
    IF :NEW.resource_id IS NULL THEN
        :NEW.resource_id := learning_resources_seq.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_personalized_paths_pk
BEFORE INSERT ON personalized_paths
FOR EACH ROW
BEGIN
    IF :NEW.path_id IS NULL THEN
        :NEW.path_id := personalized_paths_seq.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_users_pk
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF :NEW.user_id IS NULL THEN
        :NEW.user_id := users_seq.NEXTVAL;
    END IF;
END;
/
