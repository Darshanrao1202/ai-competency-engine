from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from database import Base, SessionLocal
from models import Student, Competency, StudentCompetency, Assessment, LearningResource, PersonalizedPath


def _now(offset_days: int = 0) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=offset_days)


def seed_database(engine):
    """
    Creates tables if they don't exist and idempotently seeds initial data
    if the students table is currently empty.
    """
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Student).count() > 0:
            print("[INFO] Database already contains student records. Skipping initial seeding.")
            return

        print("[INFO] Seeding initial data into database...")

        # 1. 8 MCA Students
        students_data = [
            {"full_name": "Aarav Sharma", "email": "aarav.sharma@university.edu", "semester": 3, "specialization": "AI/ML"},
            {"Priya Patel": ("priya.patel@university.edu", 3, "Data Science")},
            {"full_name": "Priya Patel", "email": "priya.patel@university.edu", "semester": 3, "specialization": "Data Science"},
            {"full_name": "Rohan Gupta", "email": "rohan.gupta@university.edu", "semester": 4, "specialization": "AI/ML"},
            {"full_name": "Sneha Reddy", "email": "sneha.reddy@university.edu", "semester": 2, "specialization": "Cloud Computing"},
            {"full_name": "Vikram Singh", "email": "vikram.singh@university.edu", "semester": 4, "specialization": "Cybersecurity"},
            {"full_name": "Ananya Nair", "email": "ananya.nair@university.edu", "semester": 3, "specialization": "AI/ML"},
            {"full_name": "Karthik Iyer", "email": "karthik.iyer@university.edu", "semester": 2, "specialization": "Data Science"},
            {"full_name": "Meera Joshi", "email": "meera.joshi@university.edu", "semester": 4, "specialization": "Full Stack"},
        ]
        # Clean list of 8 students
        student_records = [
            Student(full_name="Aarav Sharma", email="aarav.sharma@university.edu", semester=3, specialization="AI/ML"),
            Student(full_name="Priya Patel", email="priya.patel@university.edu", semester=3, specialization="Data Science"),
            Student(full_name="Rohan Gupta", email="rohan.gupta@university.edu", semester=4, specialization="AI/ML"),
            Student(full_name="Sneha Reddy", email="sneha.reddy@university.edu", semester=2, specialization="Cloud Computing"),
            Student(full_name="Vikram Singh", email="vikram.singh@university.edu", semester=4, specialization="Cybersecurity"),
            Student(full_name="Ananya Nair", email="ananya.nair@university.edu", semester=3, specialization="AI/ML"),
            Student(full_name="Karthik Iyer", email="karthik.iyer@university.edu", semester=2, specialization="Data Science"),
            Student(full_name="Meera Joshi", email="meera.joshi@university.edu", semester=4, specialization="Full Stack"),
        ]
        db.add_all(student_records)
        db.flush()

        # 2. 10 Core Competencies
        competency_records = [
            Competency(
                competency_name="Python for Machine Learning",
                category="Programming",
                description="Proficiency in Python for ML including NumPy arrays, Pandas data manipulation, Scikit-learn pipelines, and data preprocessing workflows."
            ),
            Competency(
                competency_name="Data Structures & Algorithms",
                category="CS Fundamentals",
                description="Mastery of arrays, trees, graphs, sorting algorithms, dynamic programming, and computational time-space complexity analysis."
            ),
            Competency(
                competency_name="Oracle SQL & PL/SQL",
                category="Database Management",
                description="Writing complex Oracle SQL queries, window functions, PL/SQL stored procedures, triggers, packages, and database index optimization."
            ),
            Competency(
                competency_name="Deep Learning",
                category="AI & ML",
                description="Neural network architectures including CNNs, RNNs, Transformers, attention mechanisms, loss functions, and PyTorch training optimization."
            ),
            Competency(
                competency_name="Natural Language Processing",
                category="AI & ML",
                description="Text preprocessing, tokenization, word embeddings, subword segmentation, Transformer language models, and text generation."
            ),
            Competency(
                competency_name="MLOps",
                category="DevOps & ML",
                description="ML model deployment, monitoring data/concept drift, CI/CD automated retraining pipelines, experiment tracking, and model registries."
            ),
            Competency(
                competency_name="System Design",
                category="Software Engineering",
                description="Designing scalable distributed systems, microservices communication, load balancing, Redis caching strategies, and database sharding."
            ),
            Competency(
                competency_name="Cloud Deployment",
                category="Cloud Computing",
                description="Deploying applications on AWS/GCP/Azure, containerization with Docker, Kubernetes orchestration, ingress routing, and IaC with Terraform."
            ),
            Competency(
                competency_name="Full-Stack Web Engineering",
                category="Software Engineering",
                description="Building full-stack web applications with Next.js App Router, React client/server components, RESTful APIs, and relational databases."
            ),
            Competency(
                competency_name="Cybersecurity",
                category="Security",
                description="Network security, public key cryptography, vulnerability assessment, OWASP Top 10 mitigation, mutual TLS, and zero-trust architecture."
            ),
        ]
        db.add_all(competency_records)
        db.flush()

        # 3. 35+ Curated Learning Resources across difficulty levels 1 to 5
        resource_data = [
            # Competency 1: Python for ML
            (1, "Python Data Science Handbook: NumPy & Pandas", "Course", 1, "https://jakevdp.github.io/PythonDataScienceHandbook/"),
            (1, "Scikit-Learn Preprocessing Pipelines Lab", "Lab", 2, "https://scikit-learn.org/stable/modules/compose.html"),
            (1, "Feature Engineering & High-Dimensional Scaling", "Article", 3, "https://towardsdatascience.com/feature-engineering-guide"),
            (1, "Vectorized High-Performance Computing in Python", "Video", 4, "https://youtube.com/watch?v=vectorized-python"),
            
            # Competency 2: DSA
            (2, "Essential Data Structures and Complexity Foundations", "Course", 1, "https://algs4.cs.princeton.edu/lectures/"),
            (2, "Graph Traversal & Shortest Path Algorithms Lab", "Lab", 3, "https://visualgo.net/en/sssp"),
            (2, "Dynamic Programming: Knapsack to String Alignment", "Article", 4, "https://cp-algorithms.com/dynamic_programming/intro-to-dp.html"),
            (2, "Advanced Disjoint-Set & Segment Tree Mastery", "Course", 5, "https://cp-algorithms.com/data_structures/segment_tree.html"),

            # Competency 3: Oracle SQL & PL/SQL
            (3, "Oracle SQL Query Tuning & Indexing Fundamentals", "Course", 2, "https://oracle-base.com/articles/misc/sql-tuning-introduction"),
            (3, "Hands-On PL/SQL Stored Procedures & Triggers Workshop", "Lab", 3, "https://docs.oracle.com/en/database/oracle/oracle-database/plsql/"),
            (3, "Analytic Functions & Hierarchical Queries in Oracle", "Article", 4, "https://oracle-base.com/articles/misc/analytic-functions"),
            (3, "High-Concurrency Autonomous Transactions in Oracle", "Video", 5, "https://youtube.com/watch?v=oracle-plsql-deep"),

            # Competency 4: Deep Learning
            (4, "Deep Learning Foundations: Perceptrons to Backpropagation", "Course", 2, "https://deeplearning.ai/deep-learning-specialization/"),
            (4, "PyTorch Convolutional Neural Networks for Vision Lab", "Lab", 3, "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html"),
            (4, "Understanding Transformer Attention & Positional Encoding", "Article", 4, "https://jalammar.github.io/illustrated-transformer/"),
            (4, "FlashAttention & Distributed Tensor Parallelism Implementation", "Lab", 5, "https://github.com/Dao-AILab/flash-attention"),

            # Competency 5: NLP
            (5, "NLP Fundamentals: Lemmatization, TF-IDF & Word2Vec", "Course", 2, "https://web.stanford.edu/class/cs224n/"),
            (5, "Subword Tokenization (BPE & WordPiece) Hands-On Lab", "Lab", 3, "https://huggingface.co/learn/nlp-course/chapter2"),
            (5, "Fine-Tuning LLMs with LoRA & QLoRA Parameter-Efficient Tuning", "Course", 4, "https://huggingface.co/blog/lora"),
            (5, "Rotary Position Embeddings and Context Extension", "Article", 5, "https://arxiv.org/abs/2104.09864"),

            # Competency 6: MLOps
            (6, "Introduction to Experiment Tracking with MLflow", "Video", 1, "https://mlflow.org/docs/latest/tutorials/index.html"),
            (6, "Production Model Drift Detection & Evidently AI Lab", "Lab", 3, "https://evidentlyai.com/tutorials"),
            (6, "Canary Deployment Pipelines for ML Models", "Article", 4, "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning"),
            (6, "High-Throughput LLM Serving Architecture with vLLM", "Course", 5, "https://vllm.ai/"),

            # Competency 7: System Design
            (7, "Distributed Systems Basics: Latency, Throughput & Caching", "Article", 1, "https://github.com/donnemartin/system-design-primer"),
            (7, "Designing Scalable Cache Layers with Redis & Memcached", "Course", 2, "https://redis.io/university/"),
            (7, "Consistent Hashing & Partitioning in Distributed Storage", "Article", 3, "https://medium.com/system-designing/consistent-hashing-explained"),
            (7, "Raft Consensus and Fault-Tolerant State Machine Replication", "Video", 5, "https://raft.github.io/"),

            # Competency 8: Cloud Deployment
            (8, "Docker Containerization for Modern Web Services", "Course", 1, "https://docs.docker.com/get-started/"),
            (8, "Kubernetes Core Architecture: Pods, Services & Ingress Lab", "Lab", 2, "https://kubernetes.io/docs/tutorials/"),
            (8, "Infrastructure-as-Code with Terraform on Public Cloud", "Course", 3, "https://developer.hashicorp.com/terraform/tutorials"),
            (8, "Zero-Trust Service Mesh & Mutual TLS with Istio", "Lab", 4, "https://istio.io/latest/docs/tasks/security/authentication/mtls-migration/"),

            # Competency 9: Full-Stack Web Engineering
            (9, "Next.js App Router & Server Components Architecture", "Course", 2, "https://nextjs.org/learn"),
            (9, "FastAPI High-Performance REST APIs with SQLAlchemy Lab", "Lab", 2, "https://fastapi.tiangolo.com/tutorial/"),
            (9, "Recharts & Responsive Data Visualization Patterns", "Article", 3, "https://recharts.org/en-US/examples"),
            (9, "Production Next.js Caching, ISR & Edge Middleware", "Course", 4, "https://nextjs.org/docs/app/building-your-application/caching"),

            # Competency 10: Cybersecurity
            (10, "OWASP Top 10 Web Application Security Fundamentals", "Course", 1, "https://owasp.org/www-project-top-ten/"),
            (10, "SQL Injection & Cross-Site Scripting Mitigation Lab", "Lab", 2, "https://portswigger.net/web-security/sql-injection"),
            (10, "Applied Modern Cryptography: TLS 1.3, ECDH & Digital Signatures", "Article", 4, "https://cryptopals.com/"),
            (10, "Zero-Trust Identity and Access Management in Cloud Native", "Video", 5, "https://csrc.nist.gov/publications/detail/sp/800-207/final"),
        ]

        resource_records = [
            LearningResource(
                competency_id=cid,
                title=title,
                resource_type=rtype,
                difficulty_level=diff,
                url=url
            )
            for (cid, title, rtype, diff, url) in resource_data
        ]
        db.add_all(resource_records)
        db.flush()

        # 4. Student Competency Profiles (Initial level mapping for 8 students across 10 competencies)
        # Profiles:
        # Aarav (AI/ML): High in Python/DL/NLP, Low in Cloud/Cybersecurity
        # Priya (Data Science): High in Python/SQL, Moderate in DL, Low in System Design
        # Rohan (AI/ML): High in Python/DL/MLOps, Low in Web/Cybersecurity
        # Sneha (Cloud): High in Cloud/Cybersecurity/System Design, Low in DL/NLP/ML
        # Vikram (Cybersecurity): High in Security/SQL/Cloud, Low in ML/DL/NLP (At-risk in AI/ML subjects)
        # Ananya (AI/ML): High in Python/DSA, Low in MLOps/Cloud/Security
        # Karthik (Data Science): High in Python/SQL/DSA, Low in Cloud/DevOps
        # Meera (Full Stack): High in Web/SQL/System Design, Low in DL/NLP/MLOps

        student_levels = [
            # Aarav
            [4, 4, 3, 4, 3, 2, 3, 2, 3, 1],
            # Priya
            [4, 3, 4, 3, 3, 2, 2, 2, 3, 2],
            # Rohan
            [5, 4, 3, 4, 4, 4, 3, 2, 2, 1],
            # Sneha (Cloud specialist - weak in DL, NLP, ML)
            [2, 3, 3, 1, 1, 2, 4, 4, 3, 3],
            # Vikram (Security specialist - weak in ML, DL, NLP)
            [2, 3, 4, 1, 1, 2, 3, 4, 2, 5],
            # Ananya
            [4, 4, 3, 3, 3, 2, 2, 1, 3, 1],
            # Karthik
            [3, 4, 4, 2, 2, 2, 2, 2, 3, 2],
            # Meera (Full Stack specialist - weak in DL, NLP, MLOps)
            [3, 4, 4, 2, 1, 1, 4, 3, 5, 3],
        ]

        student_comp_records = []
        for s_idx, student in enumerate(student_records):
            for c_idx, comp in enumerate(competency_records):
                curr = student_levels[s_idx][c_idx]
                target = 5  # Standard target level
                student_comp_records.append(
                    StudentCompetency(
                        student_id=student.student_id,
                        competency_id=comp.competency_id,
                        current_level=curr,
                        target_level=target,
                        last_assessed=_now(offset_days=(s_idx * 2 + c_idx))
                    )
                )
        db.add_all(student_comp_records)
        db.flush()

        # 5. Historical Assessments (16 records)
        historical_assessments = [
            # Aarav
            Assessment(student_id=student_records[0].student_id, competency_id=1, score_percentage=85.0, assessment_date=_now(10), ai_confidence_score=0.92),
            Assessment(student_id=student_records[0].student_id, competency_id=4, score_percentage=82.5, assessment_date=_now(5), ai_confidence_score=0.88),
            # Priya
            Assessment(student_id=student_records[1].student_id, competency_id=1, score_percentage=78.0, assessment_date=_now(12), ai_confidence_score=0.86),
            Assessment(student_id=student_records[1].student_id, competency_id=3, score_percentage=84.0, assessment_date=_now(6), ai_confidence_score=0.90),
            # Rohan
            Assessment(student_id=student_records[2].student_id, competency_id=4, score_percentage=90.0, assessment_date=_now(8), ai_confidence_score=0.95),
            Assessment(student_id=student_records[2].student_id, competency_id=6, score_percentage=81.0, assessment_date=_now(3), ai_confidence_score=0.87),
            # Sneha
            Assessment(student_id=student_records[3].student_id, competency_id=8, score_percentage=88.0, assessment_date=_now(14), ai_confidence_score=0.91),
            Assessment(student_id=student_records[3].student_id, competency_id=4, score_percentage=32.0, assessment_date=_now(4), ai_confidence_score=0.74),
            # Vikram
            Assessment(student_id=student_records[4].student_id, competency_id=10, score_percentage=96.0, assessment_date=_now(15), ai_confidence_score=0.98),
            Assessment(student_id=student_records[4].student_id, competency_id=1, score_percentage=44.0, assessment_date=_now(7), ai_confidence_score=0.79),
            # Ananya
            Assessment(student_id=student_records[5].student_id, competency_id=2, score_percentage=86.0, assessment_date=_now(9), ai_confidence_score=0.89),
            Assessment(student_id=student_records[5].student_id, competency_id=8, score_percentage=28.0, assessment_date=_now(2), ai_confidence_score=0.72),
            # Karthik
            Assessment(student_id=student_records[6].student_id, competency_id=3, score_percentage=82.0, assessment_date=_now(11), ai_confidence_score=0.85),
            Assessment(student_id=student_records[6].student_id, competency_id=6, score_percentage=38.0, assessment_date=_now(3), ai_confidence_score=0.76),
            # Meera
            Assessment(student_id=student_records[7].student_id, competency_id=9, score_percentage=94.0, assessment_date=_now(13), ai_confidence_score=0.96),
            Assessment(student_id=student_records[7].student_id, competency_id=5, score_percentage=30.0, assessment_date=_now(1), ai_confidence_score=0.70),
        ]
        db.add_all(historical_assessments)
        db.flush()

        # 6. Initial Personalized Paths (16 records: Pending, In Progress, Completed)
        path_records = [
            # Aarav Sharma
            PersonalizedPath(
                student_id=student_records[0].student_id,
                resource_id=resource_records[21].resource_id,  # MLOps Drift Lab (diff 3)
                status="In Progress",
                ai_reason="Recommended to elevate your MLOps skill from Level 2 to Level 3 through practical drift monitoring.",
                assigned_date=_now(7)
            ),
            PersonalizedPath(
                student_id=student_records[0].student_id,
                resource_id=resource_records[29].resource_id,  # Kubernetes Ingress (diff 2)
                status="Pending",
                ai_reason="Targeted to bridge Cloud Deployment gap (Level 2 -> 3) supporting your AI deployment pipeline.",
                assigned_date=_now(5)
            ),
            PersonalizedPath(
                student_id=student_records[0].student_id,
                resource_id=resource_records[1].resource_id,  # Scikit-Learn Pipelines (diff 2)
                status="Completed",
                ai_reason="Foundational reinforcement for machine learning preprocessing completed with high proficiency.",
                assigned_date=_now(20),
                completion_date=_now(12)
            ),

            # Priya Patel
            PersonalizedPath(
                student_id=student_records[1].student_id,
                resource_id=resource_records[25].resource_id,  # Redis Caching (diff 2)
                status="In Progress",
                ai_reason="Recommended based on System Design gap (Level 2 -> 3) for handling high-volume feature queries.",
                assigned_date=_now(4)
            ),
            PersonalizedPath(
                student_id=student_records[1].student_id,
                resource_id=resource_records[8].resource_id,  # Oracle SQL Tuning (diff 2)
                status="Completed",
                ai_reason="Mastered SQL query tuning techniques and index utilization.",
                assigned_date=_now(18),
                completion_date=_now(8)
            ),

            # Sneha Reddy (Cloud specialist, learning ML/DL)
            PersonalizedPath(
                student_id=student_records[3].student_id,
                resource_id=resource_records[12].resource_id,  # Deep Learning Foundations (diff 2)
                status="In Progress",
                ai_reason="Critical path item to elevate Deep Learning proficiency from Level 1 to Level 2.",
                assigned_date=_now(6)
            ),
            PersonalizedPath(
                student_id=student_records[3].student_id,
                resource_id=resource_records[0].resource_id,  # Python DS Handbook (diff 1)
                status="Completed",
                ai_reason="Completed core Python data structures for scientific computing.",
                assigned_date=_now(15),
                completion_date=_now(5)
            ),
            PersonalizedPath(
                student_id=student_records[3].student_id,
                resource_id=resource_records[16].resource_id,  # NLP Fundamentals (diff 2)
                status="Pending",
                ai_reason="Recommended to address Natural Language Processing gap (Level 1 -> 2).",
                assigned_date=_now(2)
            ),

            # Vikram Singh (Cybersecurity, learning ML)
            PersonalizedPath(
                student_id=student_records[4].student_id,
                resource_id=resource_records[0].resource_id,  # Python DS Handbook (diff 1)
                status="In Progress",
                ai_reason="Recommended to build foundational Python skills required for AI security analysis.",
                assigned_date=_now(8)
            ),
            PersonalizedPath(
                student_id=student_records[4].student_id,
                resource_id=resource_records[12].resource_id,  # DL Foundations (diff 2)
                status="Pending",
                ai_reason="Essential for understanding adversarial neural network vulnerabilities.",
                assigned_date=_now(3)
            ),

            # Ananya Nair
            PersonalizedPath(
                student_id=student_records[5].student_id,
                resource_id=resource_records[28].resource_id,  # Docker Containerization (diff 1)
                status="In Progress",
                ai_reason="Recommended to bridge Cloud Deployment gap (Level 1 -> 2) for containerizing ML models.",
                assigned_date=_now(5)
            ),

            # Meera Joshi (Full Stack, learning DL/NLP)
            PersonalizedPath(
                student_id=student_records[7].student_id,
                resource_id=resource_records[16].resource_id,  # NLP Fundamentals (diff 2)
                status="In Progress",
                ai_reason="Recommended to bridge Natural Language Processing gap (Level 1 -> 2) for AI chat integrations.",
                assigned_date=_now(4)
            ),
            PersonalizedPath(
                student_id=student_records[7].student_id,
                resource_id=resource_records[32].resource_id,  # Next.js App Router (diff 2)
                status="Completed",
                ai_reason="Full-stack Next.js web application architecture mastered with distinction.",
                assigned_date=_now(25),
                completion_date=_now(10)
            ),
        ]
        db.add_all(path_records)
        db.commit()

        print(f"[SUCCESS] Database seeding complete: 8 students, 10 competencies, {len(resource_records)} resources, {len(student_comp_records)} student competencies, {len(historical_assessments)} assessments, {len(path_records)} personalized paths.")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {e}")
        raise e
    finally:
        db.close()
