# 🎯 AI-Enabled Competency Gap Identification & Personalized Learning Engine

A full-stack, AI-driven academic learning engine designed for Master of Computer Applications (MCA) programs. The platform automatically assesses student skill proficiencies through difficulty-weighted diagnostic evaluations, pinpoints multi-dimensional competency gaps, and deploys a Scikit-Learn TF-IDF + Adaptive Difficulty recommendation engine to generate tailored, personalized learning trajectories.

---

## 🌐 Live Production Deployments

- 🚀 **Live Frontend Dashboard (Vercel)**: [https://frontend-nine-ebon-6a0yn3q5z4.vercel.app](https://frontend-nine-ebon-6a0yn3q5z4.vercel.app)
- ⚡ **Live Backend REST API (Render)**: [https://competency-gap-api.onrender.com](https://competency-gap-api.onrender.com)
- 📖 **Interactive Swagger API Docs**: [https://competency-gap-api.onrender.com/docs](https://competency-gap-api.onrender.com/docs)
- 🐘 **Database**: Neon Serverless PostgreSQL (Singapore Region, SSL-enforced)

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (Next.js 14 App Router)"]
        SP["🎓 Student Portal\n- KPI Dashboard\n- Recharts Radar & Gap Bars\n- Diagnostic Assessments\n- Learning Path Tracker"]
        FP["👥 Faculty / Admin Portal\n- Cohort Proficiency Heatmap\n- At-Risk Interventions Roster\n- Competency & Resource Modals"]
        RS["🔄 1-Click Role Switcher\n- Student Context Switcher (8 MCA Students)"]
    end

    subgraph Server["Backend Layer (FastAPI REST API)"]
        API["⚡ FastAPI Application\n- Auto-CORS & Pydantic Validation\n- Lifespan Idempotent Seeder"]
        AI["🤖 AI Recommendation Engine\n- TF-IDF Vectorization\n- Cosine Similarity Matching\n- Adaptive Difficulty Heuristics"]
        QUIZ["📝 Diagnostic Engine\n- Difficulty-Weighted Scoring\n- Consistency-Calibrated Confidence"]
    end

    subgraph Data["Persistence Layer"]
        NEON[("🐘 Neon Serverless PostgreSQL\n- Pooled Connection\n- 6 Relational Entities")]
        ORACLE[("🏛️ Oracle Academic Database\n- DDL Schema & Sequences\n- PL/SQL Auto-Recalculation Trigger\n- Comprehensive Seed Script")]
    end

    SP -->|REST API Calls| API
    FP -->|REST API Calls| API
    API -->|Scikit-Learn ML| AI
    API -->|Grading & Confidence| QUIZ
    API -->|SQLAlchemy ORM| NEON
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts (Radar & Bar Charts), Lucide Icons |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic v2 |
| **Machine Learning** | Scikit-Learn (TF-IDF Vectorizer, Cosine Similarity), NumPy |
| **Production Database** | Neon Serverless PostgreSQL (with connection pooling & SSL) |
| **Academic Database** | Oracle Database 19c/21c (Sequences, Triggers, DDL, PL/SQL) |
| **Deployment** | Render (Backend Web Service Blueprint), Vercel (Next.js Frontend) |

---

## 📁 Repository Structure

```
├── backend/
│   ├── .env                     # Neon PostgreSQL credentials & CORS settings
│   ├── .env.example             # Template environment file
│   ├── database.py              # SQLAlchemy engine with SSL & postgresql:// normalization
│   ├── models.py                # 6 Relational models (Students, Competencies, Paths, etc.)
│   ├── quiz_bank.json           # 50 MCQs across 10 competencies & 5 difficulty tiers
│   ├── seed.py                  # Idempotent startup seeder (8 students, 10 competencies, 40 resources)
│   ├── main.py                  # FastAPI application with REST endpoints & AI engine
│   ├── test_api.py              # Automated test suite exercising all endpoints
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Global root layout with StudentContext & Navbar
│   │   ├── page.tsx             # Root redirect to /student
│   │   ├── globals.css          # Tailwind directives & styles
│   │   ├── student/page.tsx     # Student Dashboard
│   │   └── faculty/page.tsx     # Faculty & Admin Portal
│   ├── components/
│   │   ├── Navbar.tsx           # 1-Click Role Switcher & Student Selector dropdown
│   │   ├── KPICards.tsx         # 4 Key Performance Indicator metric cards
│   │   ├── CompetencyRadar.tsx  # Recharts multi-axial Radar profile
│   │   ├── GapBarChart.tsx      # Recharts horizontal current vs. target gap breakdown
│   │   ├── DiagnosticQuiz.tsx   # Interactive MCQ assessment & live grading
│   │   ├── LearningPath.tsx     # Interactive learning path cards & status transitions
│   │   ├── CohortAnalytics.tsx  # Aggregated cohort charts & gap distributions
│   │   ├── AtRiskTable.tsx      # Roster of at-risk students requiring intervention
│   │   ├── AddCompetencyModal.tsx # Interactive form to register new competencies
│   │   └── AddResourceModal.tsx   # Interactive form to catalog learning resources
│   ├── context/
│   │   └── StudentContext.tsx   # React Context managing active student state
│   ├── lib/
│   │   ├── api.ts               # Clean async fetch clients with error handling
│   │   └── types.ts             # TypeScript interfaces for all payloads
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── database/oracle/
│   ├── schema.sql               # Oracle DDL with SEQUENCES, TABLES & BEFORE INSERT triggers
│   ├── triggers.sql             # PL/SQL AFTER INSERT trigger auto-recalculating student level
│   └── seed.sql                 # Academic seed script with 8 students, 10 competencies, resources
│
├── render.yaml                  # Render Blueprint definition for backend deployment
├── .gitignore                   # Strict Git ignore for node_modules, .venv, .env, .next
└── README.md                    # Comprehensive documentation
```

---

## 🧠 Core Algorithms & AI Capabilities

### 1. Difficulty-Weighted Scoring
Rather than equal-weight scoring, each question is assigned an integer difficulty $w_i \in [1, 5]$:
$$\text{Score \%} = \frac{\sum_{i \in \text{Correct}} w_i}{\sum_{i=1}^N w_i} \times 100$$

### 2. Consistency-Calibrated AI Confidence Score
Measures test reliability by evaluating accuracy consistency across foundational ($w_i \le 2$) versus advanced ($w_i \ge 3$) questions:
$$\text{Inconsistency} = \max(0, \text{Accuracy}_{\text{hard}} - \text{Accuracy}_{\text{easy}})$$
$$\text{Confidence} = \text{clip}(1.0 - 0.4 \times \text{Inconsistency}, 0.68, 0.98)$$
A student who answers Level 5 questions correctly while missing Level 1 questions triggers an inconsistency penalty, detecting random guessing.

### 3. TF-IDF + Adaptive Difficulty Recommendation Engine
When a student completes an assessment:
1. **Semantic Similarity**: Computes TF-IDF vector representations of competency curricula descriptions and calculates cosine similarity $\text{Sim}(c_{\text{assessed}}, c_{\text{candidate}})$.
2. **Adaptive Target Difficulty**: Sets target resource difficulty $\text{TargetDiff} = \min(5, \text{CurrentLevel} + 1)$.
3. **Difficulty Proximity Penalty**: Computes difficulty match score:
   $$\text{DiffScore} = \max(0, 1.0 - 0.25 \times |\text{ResourceDiff} - \text{TargetDiff}|)$$
4. **Composite Recommendation Metric**:
   $$\text{RankScore} = 0.65 \times \text{Sim}_{\text{content}} + 0.35 \times \text{DiffScore}$$
5. Top non-duplicate resources are inserted into `personalized_paths` with transparent, human-readable AI rationales.

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (.env)
# DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
# ALLOWED_ORIGINS=*

# Launch FastAPI server (seeds database automatically on startup)
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Verifies runtime status & Neon PostgreSQL connection |
| `GET` | `/api/students` | Returns list of all 8 enrolled MCA students |
| `GET` | `/api/students/{id}/dashboard` | Returns full dashboard, competencies, radar metrics, and learning path |
| `GET` | `/api/competencies` | Returns all 10 academic competencies |
| `POST` | `/api/competencies` | Registers a new competency and initializes student baselines |
| `GET` | `/api/quizzes/{competency_id}` | Returns diagnostic questions (sanitized, answers excluded) |
| `POST` | `/api/assessments/submit` | Grades submission, calculates AI confidence, and triggers recommendation engine |
| `PATCH` | `/api/paths/{path_id}` | Transitions path status (`Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`) |
| `POST` | `/api/resources` | Adds a new learning resource |
| `GET` | `/api/analytics/cohort` | Returns cohort averages, gap distribution, and at-risk students |

---

## 🌐 Cloud Deployment

### 1. Backend on Render
1. Connect your GitHub repository to [Render](https://render.com).
2. Choose **New Blueprint Instance** and select `render.yaml`.
3. Set the `DATABASE_URL` environment variable with your Neon PostgreSQL connection string.
4. Deploy the service.

### 2. Frontend on Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add environment variable `NEXT_PUBLIC_API_URL` pointing to your deployed Render URL.
4. Deploy with zero configuration.

---

## 📄 Academic Integrity & License
Built as an autonomous production-grade reference architecture for AI-driven competency gap identification and adaptive learning personalization.
Licensed under the **MIT License**.
