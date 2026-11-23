import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

def post(endpoint, data, token=None):
    body = json.dumps(data).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{BASE_URL}{endpoint}", data=body, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def get(endpoint, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(f"{BASE_URL}{endpoint}", headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

print("=== RUNNING JWT RBAC VERIFICATION SUITE ===")

# 1. Test Seeded Student Login (Aarav Sharma)
print("\n1. Testing Student Login (aarav.sharma@university.edu / Student@123)...")
status, res = post("/api/auth/login", {
    "email": "aarav.sharma@university.edu",
    "password": "Student@123"
})
assert status == 200, f"Expected 200, got {status}: {res}"
assert "access_token" in res, "Missing access_token"
assert res["user"]["role"] == "student"
aarav_token = res["access_token"]
aarav_student_id = res["user"]["student_id"]
print(f"   [PASS] Student Logged In: {res['user']['full_name']} (role: {res['user']['role']}, student_id: {aarav_student_id})")

# 2. Test /api/auth/me for student
print("\n2. Testing GET /api/auth/me with Student token...")
status, me = get("/api/auth/me", aarav_token)
assert status == 200, f"Expected 200, got {status}: {me}"
assert me["email"] == "aarav.sharma@university.edu"
print(f"   [PASS] /api/auth/me verified: {me['email']}")

# 3. Test Student 1 accessing Student 1 dashboard (Should succeed)
print(f"\n3. Testing Student {aarav_student_id} accessing own dashboard (/api/students/{aarav_student_id}/dashboard)...")
status, dash = get(f"/api/students/{aarav_student_id}/dashboard", aarav_token)
assert status == 200, f"Expected 200, got {status}: {dash}"
print(f"   [PASS] Own Dashboard Access: OK (Readiness: {dash['summary']['overall_readiness_pct']}%)")

# 4. Test Student 1 accessing Student 2 dashboard (MUST RETURN 403 FORBIDDEN)
print("\n4. Testing Student 1 accessing Student 2 dashboard (/api/students/2/dashboard)...")
status, err = get("/api/students/2/dashboard", aarav_token)
assert status == 403, f"SECURITY BREACH: Expected 403 Forbidden, got {status}: {err}"
print(f"   [PASS] Cross-student access blocked with 403 Forbidden: {err['detail']}")

# 5. Test Student attempting to access Faculty Cohort Analytics (MUST RETURN 403 FORBIDDEN)
print("\n5. Testing Student attempting to access /api/analytics/cohort...")
status, err = get("/api/analytics/cohort", aarav_token)
assert status == 403, f"SECURITY BREACH: Expected 403 Forbidden, got {status}: {err}"
print(f"   [PASS] Student blocked from faculty analytics with 403 Forbidden: {err['detail']}")

# 6. Test Faculty Login (faculty@rvitm.edu.in / Faculty@123)
print("\n6. Testing Faculty Login (faculty@rvitm.edu.in / Faculty@123)...")
status, res = post("/api/auth/login", {
    "email": "faculty@rvitm.edu.in",
    "password": "Faculty@123"
})
assert status == 200, f"Expected 200, got {status}: {res}"
assert res["user"]["role"] == "faculty"
faculty_token = res["access_token"]
print(f"   [PASS] Faculty Logged In: {res['user']['full_name']} (role: {res['user']['role']})")

# 7. Test Faculty accessing /api/analytics/cohort (Should succeed with 200)
print("\n7. Testing Faculty accessing /api/analytics/cohort with Faculty token...")
status, cohort = get("/api/analytics/cohort", faculty_token)
assert status == 200, f"Expected 200, got {status}: {cohort}"
assert "competency_averages" in cohort
print(f"   [PASS] Faculty Cohort Analytics Access: 200 OK ({len(cohort['competency_averages'])} competencies)")

# 8. Test Admin Login (admin@rvitm.edu.in / Admin@123)
print("\n8. Testing Admin Login (admin@rvitm.edu.in / Admin@123)...")
status, res = post("/api/auth/login", {
    "email": "admin@rvitm.edu.in",
    "password": "Admin@123"
})
assert status == 200, f"Expected 200, got {status}: {res}"
assert res["user"]["role"] == "admin"
admin_token = res["access_token"]
print(f"   [PASS] Admin Logged In: {res['user']['full_name']} (role: {res['user']['role']})")

# 9. Test Student Registration (POST /api/auth/register)
import time
unique_email = f"new.mca.student_{int(time.time())}@university.edu"
print(f"\n9. Testing Student Registration ({unique_email})...")
status, reg_res = post("/api/auth/register", {
    "full_name": "Devansh Malhotra",
    "email": unique_email,
    "password": "Student@456",
    "semester": 1,
    "specialization": "AI/ML Systems"
})
assert status == 201, f"Expected 201, got {status}: {reg_res}"
assert "access_token" in reg_res
new_user = reg_res["user"]
assert new_user["role"] == "student"
assert new_user["student_id"] is not None
print(f"   [PASS] Registration Successful: user_id={new_user['user_id']}, student_id={new_user['student_id']}")

# Verify new student can view their newly initialized dashboard
status, new_dash = get(f"/api/students/{new_user['student_id']}/dashboard", reg_res["access_token"])
assert status == 200
assert len(new_dash["competencies"]) == 10
print(f"   [PASS] New student auto-initialized with {len(new_dash['competencies'])} competencies at Level 1.")

# 10. Test Invalid Password Login Rejection (401 Unauthorized)
print("\n10. Testing Invalid Password Login Rejection...")
status, err = post("/api/auth/login", {
    "email": "admin@rvitm.edu.in",
    "password": "WrongPassword!999"
})
assert status == 401, f"Expected 401, got {status}: {err}"
print(f"   [PASS] Invalid login rejected with 401: {err['detail']}")

print("\n>>> ALL 10 RBAC AUTH SECURITY TESTS PASSED WITH 100% SUCCESS! <<<")
