-- ============================================================================
-- AI-Enabled Competency Gap Identification & Personalized Learning Engine
-- PL/SQL Trigger: Auto-update competency level after assessment
-- ============================================================================

CREATE OR REPLACE TRIGGER trg_update_competency_level
AFTER INSERT ON assessments
FOR EACH ROW
DECLARE
    v_new_level NUMBER;
BEGIN
    -- Determine new competency level from assessment score
    IF :NEW.score_percentage BETWEEN 0 AND 20 THEN
        v_new_level := 1;
    ELSIF :NEW.score_percentage BETWEEN 21 AND 40 THEN
        v_new_level := 2;
    ELSIF :NEW.score_percentage BETWEEN 41 AND 60 THEN
        v_new_level := 3;
    ELSIF :NEW.score_percentage BETWEEN 61 AND 80 THEN
        v_new_level := 4;
    ELSIF :NEW.score_percentage BETWEEN 81 AND 100 THEN
        v_new_level := 5;
    END IF;

    -- Update the student's competency record with the recalculated level
    UPDATE student_competencies
    SET current_level = v_new_level,
        last_assessed = :NEW.assessment_date
    WHERE student_id   = :NEW.student_id
      AND competency_id = :NEW.competency_id;
END;
/
