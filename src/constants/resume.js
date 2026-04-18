export const resumeHeader = {
  name: 'Samiul Mushfik',
  phone: '(763) 238-2122',
  linkedin: { label: 'linkedin.com/in/samiulmushfik', url: 'https://www.linkedin.com/in/samiulmushfik/' },
  email: { label: 'samiulmushfik123@gmail.com', url: 'mailto:samiulmushfik123@gmail.com' },
  github: { label: 'github.com/samiul123', url: 'https://github.com/samiul123' },
  location: 'Faribault, MN',
  tagline: 'Recent: Graduate Student Researcher (2023–2025)',
};

export const resumeSkills = [
  {
    label: 'Languages',
    items: 'Java, Python, JavaScript/TypeScript, C++',
  },
  {
    label: 'Frameworks & APIs',
    items: 'Spring Boot, Node.js, React, REST, GraphQL',
  },
  {
    label: 'Data & Distributed Systems',
    items: 'MySQL, PostgreSQL, Redis, Kafka',
  },
  {
    label: 'Cloud, DevOps, Observability & Testing',
    items: 'AWS, Docker, Jenkins, Git, Kibana, JUnit, Jasmine',
  },
];

export const resumeExperience = [
  {
    company: 'Stibo DX',
    title: 'Software Engineer',
    location: 'Dhaka, Bangladesh',
    date: 'August 2022 – August 2023',
    bullets: [
      'Optimized GraphQL content retrieval, reducing latency by 20% through concurrent data fetching and Node.js clustering.',
      'Developed a unified CI/CD framework and developer workflow for 5+ presentation-layer microservices, enabling consistent cross-platform builds and simplifying developer onboarding.',
      'Expanded automated test coverage from <5% to 50% by establishing developer-driven unit tests with Jasmine.',
    ],
  },
  {
    company: 'Kona Software Lab Ltd.',
    title: 'Software Engineer',
    subtitle: 'Fintech R&D',
    location: 'Dhaka, Bangladesh',
    date: 'May 2019 – July 2022',
    bullets: [
      'Shipped a high-performance transaction processing system (12k+ RPM) over Transport-Layer Protocol (TCP) for point-of-sale (POS) systems, supporting $2.5B+ annual financial flows using Java, Spring Boot, and Apache Camel.',
      'Reduced P95 latency to sub-100ms across 1M+ daily financial transactions by optimizing distributed system bottlenecks using Redis caching, async processing, and SQL tuning.',
      'Designed a Kafka-based event-driven pipeline processing telemetry from 1K+ POS devices, improving real-time system observability and enabling faster detection of production issues.',
      'Engineered WebSocket infrastructure supporting 100K+ concurrent connections, enabling low-latency administrative operations using Nginx and Redis Pub/Sub.',
      'Owned production support for 5+ microservices, resolving critical incidents through log analysis and root cause investigation in Kibana, improving system reliability and uptime.',
      'Automated continuous integration/continuous delivery (CI/CD) failure alerts via Jenkins–Slack integration, cutting build feedback time from hours to minutes across 70+ weekly builds.',
      'Built consumer-facing web applications (React), improving rendering performance and state management for 5M+ users.',
    ],
  },
  {
    company: 'Parkspace',
    title: 'Software Engineer',
    subtitle: 'Part-Time, Voluntary',
    location: 'Remote, Bangladesh',
    date: 'August 2019 – February 2020',
    bullets: [
      'Implemented core features for a real-time parking discovery and reservation MVP (React Native, Spring Boot, and AWS).',
      'Maintained 80% test coverage through TDD and streamlined deployments using CircleCI-based CI/CD pipeline.',
    ],
  },
];

export const resumeResearch = [
  {
    institution: 'University of Minnesota',
    title: 'Graduate Student Researcher',
    location: 'Duluth, MN',
    date: 'August 2023 – Present',
    bullets: [
      'Optimized large-scale in-memory bulk R-Tree construction using AVX-512 SIMD, achieving 3x speedup on 70M records by improving memory access and parallel computation efficiency.',
    ],
  },
];

export const resumeProjects = [
  {
    name: 'QueryInsight',
    url: 'https://github.com/samiul123',
    date: 'February 2026 – Present',
    bullets: [
      'Building an AI-powered SQL query analysis platform using Next.js, FastAPI, and Ollama LLM to parse multi-dialect queries, detect performance issues, and generate automated optimization suggestions and query rewrites.',
    ],
  },
  {
    name: 'Job Application Analyzer',
    url: 'https://github.com/samiul123/Job-Application-Email-Analyzer',
    date: 'November 2024 – December 2024',
    bullets: [
      'Developed a Natural Language Processing (NLP)-based email classification model, achieving 93% accuracy by fine-tuning BERT on 2K+ recruiter emails, leveraging data augmentation and automated data extraction via the Gmail API.',
    ],
  },
];

export const resumeEducation = [
  {
    institution: 'University of Minnesota',
    degree: 'Master of Science in Computer Science',
    detail: 'GPA: 4.0',
    date: 'August 2025',
    location: 'Duluth, MN',
  },
  {
    institution: 'Bangladesh University of Engineering and Technology',
    degree: 'Bachelor of Science in Computer Science and Engineering',
    date: '',
    location: '',
  },
];

export const resumeCertifications = [
  {
    title: 'AWS Certified Developer – Associate',
    date: 'April 2025',
  },
];
