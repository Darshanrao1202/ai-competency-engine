-- ============================================================================
-- AI-Enabled Competency Gap Identification & Personalized Learning Engine
-- Oracle Database Seed Data for Academic Submission
-- ============================================================================

-- 1. Insert 8 MCA Students
INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (1, 'Aarav Sharma', 'aarav.sharma@university.edu', 3, 'AI/ML', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (2, 'Priya Patel', 'priya.patel@university.edu', 3, 'Data Science', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (3, 'Rohan Gupta', 'rohan.gupta@university.edu', 4, 'AI/ML', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (4, 'Sneha Reddy', 'sneha.reddy@university.edu', 2, 'Cloud Computing', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (5, 'Vikram Singh', 'vikram.singh@university.edu', 4, 'Cybersecurity', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (6, 'Ananya Nair', 'ananya.nair@university.edu', 3, 'AI/ML', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (7, 'Karthik Iyer', 'karthik.iyer@university.edu', 2, 'Data Science', SYSTIMESTAMP);

INSERT INTO students (student_id, full_name, email, semester, specialization, created_at)
VALUES (8, 'Meera Joshi', 'meera.joshi@university.edu', 4, 'Full Stack', SYSTIMESTAMP);

-- 2. Insert 10 Core Competencies
INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (1, 'Python for Machine Learning', 'Programming', 'Proficiency in Python for ML including NumPy, Pandas, Scikit-learn, and data preprocessing pipelines.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (2, 'Data Structures & Algorithms', 'CS Fundamentals', 'Mastery of arrays, trees, graphs, sorting, dynamic programming, and algorithmic complexity analysis.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (3, 'Oracle SQL & PL/SQL', 'Database Management', 'Writing complex Oracle SQL queries, PL/SQL stored procedures, triggers, and database optimization.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (4, 'Deep Learning', 'AI & ML', 'Neural network architectures including CNNs, RNNs, Transformers, GANs, and training optimization techniques.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (5, 'Natural Language Processing', 'AI & ML', 'Text preprocessing, word embeddings, sequence models, attention mechanisms, and large language models.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (6, 'MLOps', 'DevOps & ML', 'ML model deployment, monitoring, CI/CD pipelines, experiment tracking, and model versioning with MLflow.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (7, 'System Design', 'Software Engineering', 'Designing scalable distributed systems, microservices, load balancing, caching, and database sharding.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (8, 'Cloud Deployment', 'Cloud Computing', 'Deploying applications on AWS/GCP/Azure, containerization with Docker, Kubernetes orchestration.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (9, 'Full-Stack Web Engineering', 'Software Engineering', 'Building web apps with React/Next.js frontends, REST APIs, authentication, and database integration.');

INSERT INTO competencies (competency_id, competency_name, category, description)
VALUES (10, 'Cybersecurity', 'Security', 'Network security, cryptography, vulnerability assessment, ethical hacking, and secure coding practices.');

-- 3. Insert 35+ Curated Learning Resources
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (1, 1, 'Python Data Science Handbook: NumPy & Pandas', 'Course', 1, 'https://jakevdp.github.io/PythonDataScienceHandbook/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (2, 1, 'Scikit-Learn Preprocessing Pipelines Lab', 'Lab', 2, 'https://scikit-learn.org/stable/modules/compose.html');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (3, 1, 'Feature Engineering & High-Dimensional Scaling', 'Article', 3, 'https://towardsdatascience.com/feature-engineering-guide');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (4, 1, 'Vectorized High-Performance Computing in Python', 'Video', 4, 'https://youtube.com/watch?v=vectorized-python');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (5, 2, 'Essential Data Structures and Complexity Foundations', 'Course', 1, 'https://algs4.cs.princeton.edu/lectures/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (6, 2, 'Graph Traversal & Shortest Path Algorithms Lab', 'Lab', 3, 'https://visualgo.net/en/sssp');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (7, 2, 'Dynamic Programming: Knapsack to String Alignment', 'Article', 4, 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (8, 2, 'Advanced Disjoint-Set & Segment Tree Mastery', 'Course', 5, 'https://cp-algorithms.com/data_structures/segment_tree.html');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (9, 3, 'Oracle SQL Query Tuning & Indexing Fundamentals', 'Course', 2, 'https://oracle-base.com/articles/misc/sql-tuning-introduction');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (10, 3, 'Hands-On PL/SQL Stored Procedures & Triggers Workshop', 'Lab', 3, 'https://docs.oracle.com/en/database/oracle/oracle-database/plsql/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (11, 3, 'Analytic Functions & Hierarchical Queries in Oracle', 'Article', 4, 'https://oracle-base.com/articles/misc/analytic-functions');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (12, 3, 'High-Concurrency Autonomous Transactions in Oracle', 'Video', 5, 'https://youtube.com/watch?v=oracle-plsql-deep');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (13, 4, 'Deep Learning Foundations: Perceptrons to Backpropagation', 'Course', 2, 'https://deeplearning.ai/deep-learning-specialization/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (14, 4, 'PyTorch Convolutional Neural Networks for Vision Lab', 'Lab', 3, 'https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (15, 4, 'Understanding Transformer Attention & Positional Encoding', 'Article', 4, 'https://jalammar.github.io/illustrated-transformer/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (16, 4, 'FlashAttention & Distributed Tensor Parallelism Implementation', 'Lab', 5, 'https://github.com/Dao-AILab/flash-attention');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (17, 5, 'NLP Fundamentals: Lemmatization, TF-IDF & Word2Vec', 'Course', 2, 'https://web.stanford.edu/class/cs224n/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (18, 5, 'Subword Tokenization (BPE & WordPiece) Hands-On Lab', 'Lab', 3, 'https://huggingface.co/learn/nlp-course/chapter2');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (19, 5, 'Fine-Tuning LLMs with LoRA & QLoRA Parameter-Efficient Tuning', 'Course', 4, 'https://huggingface.co/blog/lora');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (20, 5, 'Rotary Position Embeddings and Context Extension', 'Article', 5, 'https://arxiv.org/abs/2104.09864');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (21, 6, 'Introduction to Experiment Tracking with MLflow', 'Video', 1, 'https://mlflow.org/docs/latest/tutorials/index.html');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (22, 6, 'Production Model Drift Detection & Evidently AI Lab', 'Lab', 3, 'https://evidentlyai.com/tutorials');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (23, 6, 'Canary Deployment Pipelines for ML Models', 'Article', 4, 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (24, 6, 'High-Throughput LLM Serving Architecture with vLLM', 'Course', 5, 'https://vllm.ai/');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (25, 7, 'Distributed Systems Basics: Latency, Throughput & Caching', 'Article', 1, 'https://github.com/donnemartin/system-design-primer');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (26, 7, 'Designing Scalable Cache Layers with Redis & Memcached', 'Course', 2, 'https://redis.io/university/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (27, 7, 'Consistent Hashing & Partitioning in Distributed Storage', 'Article', 3, 'https://medium.com/system-designing/consistent-hashing-explained');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (28, 7, 'Raft Consensus and Fault-Tolerant State Machine Replication', 'Video', 5, 'https://raft.github.io/');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (29, 8, 'Docker Containerization for Modern Web Services', 'Course', 1, 'https://docs.docker.com/get-started/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (30, 8, 'Kubernetes Core Architecture: Pods, Services & Ingress Lab', 'Lab', 2, 'https://kubernetes.io/docs/tutorials/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (31, 8, 'Infrastructure-as-Code with Terraform on Public Cloud', 'Course', 3, 'https://developer.hashicorp.com/terraform/tutorials');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (32, 8, 'Zero-Trust Service Mesh & Mutual TLS with Istio', 'Lab', 4, 'https://istio.io/latest/docs/tasks/security/authentication/mtls-migration/');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (33, 9, 'Next.js App Router & Server Components Architecture', 'Course', 2, 'https://nextjs.org/learn');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (34, 9, 'FastAPI High-Performance REST APIs with SQLAlchemy Lab', 'Lab', 2, 'https://fastapi.tiangolo.com/tutorial/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (35, 9, 'Recharts & Responsive Data Visualization Patterns', 'Article', 3, 'https://recharts.org/en-US/examples');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (36, 9, 'Production Next.js Caching, ISR & Edge Middleware', 'Course', 4, 'https://nextjs.org/docs/app/building-your-application/caching');

INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (37, 10, 'OWASP Top 10 Web Application Security Fundamentals', 'Course', 1, 'https://owasp.org/www-project-top-ten/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (38, 10, 'SQL Injection & Cross-Site Scripting Mitigation Lab', 'Lab', 2, 'https://portswigger.net/web-security/sql-injection');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (39, 10, 'Applied Modern Cryptography: TLS 1.3, ECDH & Digital Signatures', 'Article', 4, 'https://cryptopals.com/');
INSERT INTO learning_resources (resource_id, competency_id, title, resource_type, difficulty_level, url)
VALUES (40, 10, 'Zero-Trust Identity and Access Management in Cloud Native', 'Video', 5, 'https://csrc.nist.gov/publications/detail/sp/800-207/final');

-- 4. Insert Student Competency Records (8 students x 10 competencies)
-- Student 1 (Aarav Sharma - AI/ML)
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (1, 1, 1, 4, 5, SYSTIMESTAMP - 10);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (2, 1, 2, 4, 5, SYSTIMESTAMP - 8);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (3, 1, 3, 3, 5, SYSTIMESTAMP - 7);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (4, 1, 4, 4, 5, SYSTIMESTAMP - 5);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (5, 1, 5, 3, 5, SYSTIMESTAMP - 6);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (6, 1, 6, 2, 5, SYSTIMESTAMP - 4);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (7, 1, 7, 3, 5, SYSTIMESTAMP - 3);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (8, 1, 8, 2, 5, SYSTIMESTAMP - 2);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (9, 1, 9, 3, 5, SYSTIMESTAMP - 1);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (10, 1, 10, 1, 5, SYSTIMESTAMP - 12);

-- Student 2 (Priya Patel - Data Science)
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (11, 2, 1, 4, 5, SYSTIMESTAMP - 12);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (12, 2, 2, 3, 5, SYSTIMESTAMP - 10);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (13, 2, 3, 4, 5, SYSTIMESTAMP - 6);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (14, 2, 4, 3, 5, SYSTIMESTAMP - 5);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (15, 2, 5, 3, 5, SYSTIMESTAMP - 4);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (16, 2, 6, 2, 5, SYSTIMESTAMP - 3);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (17, 2, 7, 2, 5, SYSTIMESTAMP - 2);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (18, 2, 8, 2, 5, SYSTIMESTAMP - 1);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (19, 2, 9, 3, 5, SYSTIMESTAMP - 8);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (20, 2, 10, 2, 5, SYSTIMESTAMP - 9);

-- Student 4 (Sneha Reddy - Cloud Computing, weak in ML/DL)
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (31, 4, 1, 2, 5, SYSTIMESTAMP - 14);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (32, 4, 2, 3, 5, SYSTIMESTAMP - 10);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (33, 4, 3, 3, 5, SYSTIMESTAMP - 8);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (34, 4, 4, 1, 5, SYSTIMESTAMP - 4);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (35, 4, 5, 1, 5, SYSTIMESTAMP - 3);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (36, 4, 6, 2, 5, SYSTIMESTAMP - 5);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (37, 4, 7, 4, 5, SYSTIMESTAMP - 7);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (38, 4, 8, 4, 5, SYSTIMESTAMP - 14);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (39, 4, 9, 3, 5, SYSTIMESTAMP - 6);
INSERT INTO student_competencies (record_id, student_id, competency_id, current_level, target_level, last_assessed) VALUES (40, 4, 10, 3, 5, SYSTIMESTAMP - 9);

-- 5. Insert Historical Assessments
INSERT INTO assessments (assessment_id, student_id, competency_id, score_percentage, assessment_date, ai_confidence_score)
VALUES (1, 1, 1, 85.00, SYSTIMESTAMP - 10, 0.920);

INSERT INTO assessments (assessment_id, student_id, competency_id, score_percentage, assessment_date, ai_confidence_score)
VALUES (2, 1, 4, 82.50, SYSTIMESTAMP - 5, 0.880);

INSERT INTO assessments (assessment_id, student_id, competency_id, score_percentage, assessment_date, ai_confidence_score)
VALUES (3, 2, 1, 78.00, SYSTIMESTAMP - 12, 0.860);

INSERT INTO assessments (assessment_id, student_id, competency_id, score_percentage, assessment_date, ai_confidence_score)
VALUES (4, 2, 3, 84.00, SYSTIMESTAMP - 6, 0.900);

INSERT INTO assessments (assessment_id, student_id, competency_id, score_percentage, assessment_date, ai_confidence_score)
VALUES (5, 4, 8, 88.00, SYSTIMESTAMP - 14, 0.910);

INSERT INTO assessments (assessment_id, student_id, competency_id, score_percentage, assessment_date, ai_confidence_score)
VALUES (6, 4, 4, 32.00, SYSTIMESTAMP - 4, 0.740);

-- 6. Insert Personalized Paths
INSERT INTO personalized_paths (path_id, student_id, resource_id, status, ai_reason, assigned_date, completion_date)
VALUES (1, 1, 22, 'In Progress', 'Recommended to elevate your MLOps skill from Level 2 to Level 3 through practical drift monitoring.', SYSTIMESTAMP - 7, NULL);

INSERT INTO personalized_paths (path_id, student_id, resource_id, status, ai_reason, assigned_date, completion_date)
VALUES (2, 1, 30, 'Pending', 'Targeted to bridge Cloud Deployment gap (Level 2 -> 3) supporting your AI deployment pipeline.', SYSTIMESTAMP - 5, NULL);

INSERT INTO personalized_paths (path_id, student_id, resource_id, status, ai_reason, assigned_date, completion_date)
VALUES (3, 1, 2, 'Completed', 'Foundational reinforcement for machine learning preprocessing completed with high proficiency.', SYSTIMESTAMP - 20, SYSTIMESTAMP - 12);

INSERT INTO personalized_paths (path_id, student_id, resource_id, status, ai_reason, assigned_date, completion_date)
VALUES (4, 4, 13, 'In Progress', 'Critical path item to elevate Deep Learning proficiency from Level 1 to Level 2.', SYSTIMESTAMP - 6, NULL);

INSERT INTO personalized_paths (path_id, student_id, resource_id, status, ai_reason, assigned_date, completion_date)
VALUES (5, 4, 1, 'Completed', 'Completed core Python data structures for scientific computing.', SYSTIMESTAMP - 15, SYSTIMESTAMP - 5);

COMMIT;
