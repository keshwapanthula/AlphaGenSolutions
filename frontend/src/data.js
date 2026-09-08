export const SERVICES = [
  {
    slug: 'cloud-solutions', icon: 'cloud',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop',
    title: 'Cloud Solutions',
    desc: 'Scalable cloud infrastructure and migration services on AWS, Azure, and GCP.',
    detail: 'We architect, migrate, and optimise cloud environments across AWS, Azure, and GCP. From lift-and-shift migrations to fully cloud-native greenfield builds, our certified engineers ensure high availability, security, and cost efficiency. Services include VPC design, auto-scaling, managed databases, serverless functions, and 24/7 monitoring.',
  },
  {
    slug: 'ai-machine-learning', icon: 'ai',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80&auto=format&fit=crop',
    title: 'AI & Machine Learning',
    desc: 'Intelligent systems powered by advanced AI and machine learning algorithms.',
    detail: 'From predictive analytics to large language model integrations, we build AI systems that deliver measurable business value. Our ML engineers design and deploy custom models, fine-tune LLMs, and integrate generative AI into your existing products using Python, TensorFlow, PyTorch, and Azure OpenAI / AWS Bedrock.',
  },
  {
    slug: 'custom-development', icon: 'code',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80&auto=format&fit=crop',
    title: 'Custom Development',
    desc: 'Full-stack web and mobile applications tailored to your business needs.',
    detail: 'Our full-stack teams build responsive web apps and mobile applications using React, Next.js, Java Spring Boot, .NET, and Node.js. We follow agile delivery, CI/CD best practices, and rigorous code review so you get production-ready software on schedule.',
  },
  {
    slug: 'cybersecurity', icon: 'security',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80&auto=format&fit=crop',
    title: 'Cybersecurity',
    desc: 'Comprehensive security solutions to protect your digital assets.',
    detail: 'We provide end-to-end security services including penetration testing, vulnerability assessments, SOC 2 compliance consulting, identity & access management, and incident response planning. Our certified security engineers protect applications, infrastructure, and data from modern threats.',
  },
  {
    slug: 'data-analytics', icon: 'analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
    title: 'Data Analytics',
    desc: 'Transform your data into actionable insights with advanced analytics.',
    detail: 'We design and implement modern data platforms using Snowflake, Databricks, BigQuery, and Azure Synapse. From data pipeline engineering and ETL/ELT to interactive Power BI and Tableau dashboards, we help you turn raw data into decisions that drive revenue.',
  },
  {
    slug: 'devops-automation', icon: 'automation',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop',
    title: 'DevOps & Automation',
    desc: 'Streamline your development pipeline with modern DevOps practices.',
    detail: 'We accelerate delivery cycles with fully automated CI/CD pipelines using GitHub Actions, Jenkins, and Azure DevOps. Our DevOps engineers containerise applications with Docker and Kubernetes, automate infrastructure with Terraform, and embed security into every stage of the pipeline.',
  },
];

export const JOB_BENEFITS = [
  { icon: '💼', title: 'W2 Employment',    desc: 'Full W2 employment with health insurance, PTO, and 401(k) eligibility.' },
  { icon: '🌐', title: 'Remote & Hybrid',  desc: 'Work from anywhere — remote and hybrid positions across the US.' },
  { icon: '🎓', title: 'Visa Sponsorship', desc: 'H1B and OPT STEM extension sponsorship for eligible candidates.' },
  { icon: '🚀', title: 'Career Growth',    desc: 'Mentorship, upskilling, and a clear path to promotion.' },
  { icon: '📋', title: 'Interview Prep',   desc: 'Resume review, mock interviews, and end-to-end coaching.' },
  { icon: '🤝', title: 'Job Placement',    desc: 'Direct placement with Fortune 500 clients nationwide.' },
];

export const JOB_LISTINGS = [
  {
    slug: 'java-fullstack-developer',
    title: 'Java Full Stack Developer', location: 'Remote', type: 'Full-time',
    skills: 'Java · Spring Boot · React · AWS',
    detail: 'Design and build enterprise-grade web applications end-to-end. You will own backend REST APIs using Java 17 + Spring Boot, develop responsive React frontends, and deploy to AWS using CI/CD pipelines. Strong OOP, SQL, and system design skills required.',
    requirements: ['3+ years Java / Spring Boot', 'React or Angular experience', 'AWS or cloud fundamentals', 'SQL & relational databases'],
  },
  {
    slug: 'cloud-solutions-architect',
    title: 'Cloud Solutions Architect', location: 'Remote', type: 'Contract',
    skills: 'AWS · Azure · GCP · Terraform',
    detail: 'Architect multi-cloud solutions for Fortune 500 clients. You will lead infrastructure design, perform cloud cost optimisation, and mentor engineering teams on cloud-native best practices using Terraform, CDK, and Kubernetes.',
    requirements: ['5+ years cloud architecture', 'AWS/Azure/GCP certifications preferred', 'Terraform or Pulumi IaC', 'Strong communication skills'],
  },
  {
    slug: 'react-nextjs-developer',
    title: 'React / Next.js Developer', location: 'Hybrid', type: 'Full-time',
    skills: 'React · TypeScript · Node.js',
    detail: 'Build pixel-perfect, performant user interfaces for our clients\' consumer and enterprise products. You will work closely with designers and backend engineers delivering accessible, well-tested components using React 18, Next.js 14, and TypeScript.',
    requirements: ['2+ years React experience', 'TypeScript proficiency', 'State management (Redux/Zustand)', 'REST & GraphQL APIs'],
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer', location: 'Remote', type: 'Contract',
    skills: 'Jenkins · Docker · Kubernetes · CI/CD',
    detail: 'Own and evolve CI/CD pipelines, Kubernetes clusters, and observability stacks for high-traffic systems. You will implement GitOps workflows, harden security posture, and collaborate cross-functionally to increase deployment frequency and reliability.',
    requirements: ['3+ years DevOps / SRE', 'Kubernetes (CKA preferred)', 'Jenkins / GitHub Actions', 'Prometheus / Grafana monitoring'],
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst', location: 'Remote', type: 'Full-time',
    skills: 'Python · SQL · Power BI · Tableau',
    detail: 'Translate complex datasets into clear, actionable business insights. You will build dashboards in Power BI and Tableau, write advanced SQL queries, automate reporting with Python, and partner with stakeholders to define KPIs and metrics strategy.',
    requirements: ['2+ years data analysis', 'Advanced SQL', 'Power BI or Tableau', 'Python (pandas, matplotlib)'],
  },
  {
    slug: 'dotnet-developer',
    title: '.NET Developer', location: 'Remote', type: 'Full-time',
    skills: 'C# · .NET Core · Azure · SQL Server',
    detail: 'Develop and maintain enterprise .NET applications integrated with Azure services. You will build robust APIs using ASP.NET Core, manage data with Entity Framework and SQL Server, and ship features via Azure DevOps CI/CD pipelines.',
    requirements: ['3+ years C# / .NET Core', 'Azure fundamentals', 'Entity Framework / Dapper', 'REST API design'],
  },
  {
    slug: 'embedded-systems-engineer',
    title: 'Embedded Systems Engineer', location: 'Michigan / Hybrid', type: 'Full-time',
    industry: 'Automotive',
    skills: 'C · C++ · AUTOSAR · CAN Bus · ISO 26262',
    detail: 'Develop and maintain embedded software for automotive ECUs following AUTOSAR architecture and MISRA-C guidelines. You will collaborate with hardware and systems engineers to implement CAN/LIN/Ethernet communication stacks and ensure ISO 26262 functional safety compliance across the vehicle platform.',
    requirements: ['3+ years embedded C/C++', 'AUTOSAR Classic or Adaptive', 'CAN, LIN, or Automotive Ethernet protocols', 'ISO 26262 functional safety awareness'],
  },
  {
    slug: 'adas-software-engineer',
    title: 'ADAS Software Engineer', location: 'Detroit, MI / Remote', type: 'Full-time',
    industry: 'Automotive',
    skills: 'C++ · Python · ROS2 · Sensor Fusion',
    detail: 'Build perception, planning, and control algorithms for advanced driver-assistance systems. You will work with camera, radar, and LiDAR sensor fusion pipelines, implement object detection models, and validate algorithms in SIL and HIL test environments.',
    requirements: ['3+ years C++ or Python for ADAS/AV', 'ROS / ROS2 experience', 'Sensor fusion — camera, radar, or LiDAR', 'Familiarity with AUTOSAR Adaptive or POSIX RTOS'],
  },
];

export const TRAININGS = [
  {
    slug: 'java-fullstack', icon: '☕',
    title: 'Java Full Stack', duration: '12 Weeks', level: 'Beginner → Advanced',
    desc: 'Java, Spring Boot, React, Microservices, and AWS deployment.',
    detail: 'A comprehensive bootcamp covering Java core, OOP, Spring Boot REST APIs, React 18, SQL databases, microservices architecture, Docker, and deployment on AWS. Includes real-world capstone project and job placement support.',
    curriculum: ['Java Core & OOP', 'Spring Boot & REST APIs', 'React 18 & TypeScript', 'SQL & JPA', 'Microservices & Docker', 'AWS Deployment & CI/CD'],
  },
  {
    slug: 'cloud-architecture', icon: '☁️',
    title: 'Cloud Architecture', duration: '8 Weeks', level: 'Intermediate',
    desc: 'AWS, Azure, GCP — design, deploy, and operate cloud-native systems.',
    detail: 'Deep-dive into all three major cloud platforms. Learn to design resilient, scalable architectures, manage cost, implement security best practices, and use Terraform for infrastructure-as-code. Exam prep for AWS Solutions Architect Associate included.',
    curriculum: ['AWS Core Services', 'Azure Fundamentals', 'GCP Essentials', 'Terraform IaC', 'Cloud Security', 'Cost Optimisation'],
  },
  {
    slug: 'devops-cicd', icon: '⚙️',
    title: 'DevOps & CI/CD', duration: '6 Weeks', level: 'Intermediate',
    desc: 'Docker, Kubernetes, Jenkins, GitHub Actions, and IaC with Terraform.',
    detail: 'Hands-on training in modern DevOps tooling. Build and deploy containerised applications, orchestrate with Kubernetes, create automated CI/CD pipelines, and practise GitOps workflows on real cloud environments.',
    curriculum: ['Docker & Containerisation', 'Kubernetes Orchestration', 'Jenkins & GitHub Actions', 'Terraform IaC', 'Monitoring & Logging', 'Security in DevOps'],
  },
  {
    slug: 'data-analytics-bi', icon: '📊',
    title: 'Data Analytics & BI', duration: '8 Weeks', level: 'Beginner → Advanced',
    desc: 'SQL, Python, Power BI, Tableau — turn raw data into decisions.',
    detail: 'From data wrangling with pandas to advanced Power BI dashboards, this program teaches end-to-end analytics workflows. You will work with real datasets, build interactive reports, and present findings to stakeholder audiences.',
    curriculum: ['SQL Fundamentals & Advanced', 'Python & pandas', 'Power BI Dashboards', 'Tableau Visualisations', 'Statistical Analysis', 'Storytelling with Data'],
  },
  {
    slug: 'ai-machine-learning', icon: '🤖',
    title: 'AI & Machine Learning', duration: '10 Weeks', level: 'Advanced',
    desc: 'Python, TensorFlow, LLMs, and applied AI for real-world projects.',
    detail: 'An advanced program covering supervised and unsupervised learning, deep neural networks, NLP, and LLM fine-tuning. Projects include building a sentiment analysis API and integrating GPT-4 into a production application.',
    curriculum: ['Python for AI', 'ML Algorithms', 'Deep Learning & CNNs', 'NLP & Transformers', 'LLM Integration', 'MLOps & Deployment'],
  },
  {
    slug: 'dotnet-development', icon: '🖥️',
    title: '.NET Development', duration: '12 Weeks', level: 'Beginner → Advanced',
    desc: 'C#, ASP.NET Core, Entity Framework, and Azure integration.',
    detail: 'Start from C# basics and progress to building production-grade ASP.NET Core APIs, Blazor frontends, and Azure-hosted microservices. Covers EF Core, SQL Server, Azure DevOps CI/CD, and real-world enterprise patterns.',
    curriculum: ['C# & OOP Fundamentals', 'ASP.NET Core APIs', 'Entity Framework Core', 'Blazor Frontend', 'Azure Services', 'CI/CD with Azure DevOps'],
  },
];
