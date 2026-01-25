export type SkillCategoryId =
  | "software"
  | "frontend"
  | "data"
  | "db"
  | "cloud"
  | "automation";

export type SkillTier = "primary" | "secondary";

export type SkillNode = {
  id: string;
  nameEN: string;
  nameES: string;
  category: SkillCategoryId;
  iconSrc: string;
  tier: SkillTier;
  nodeType?: "skill" | "category";
};

export type SkillCategory = {
  id: SkillCategoryId;
  labelEN: string;
  labelES: string;
  anchor: { x: number; y: number }; // normalized 0..1
};

export type SkillLink = { sourceId: string; targetId: string };

export const skillCategories: SkillCategory[] = [
  { id: "software", labelEN: "Software Engineering", labelES: "Ingeniería de software", anchor: { x: 0.18, y: 0.35 } },
  { id: "frontend", labelEN: "Frontend & Product UI", labelES: "Frontend y producto UI", anchor: { x: 0.45, y: 0.22 } },
  { id: "data", labelEN: "Data & ML", labelES: "Datos e IA", anchor: { x: 0.72, y: 0.3 } },
  { id: "db", labelEN: "Databases", labelES: "Bases de datos", anchor: { x: 0.25, y: 0.7 } },
  { id: "cloud", labelEN: "Cloud & DevOps", labelES: "Cloud y DevOps", anchor: { x: 0.55, y: 0.72 } },
  { id: "automation", labelEN: "Automation & Scripting", labelES: "Automatización y scripting", anchor: { x: 0.8, y: 0.65 } },
];

export const skillNodes: SkillNode[] = [
  // Software (primary then secondary; alpha by nameEN)
  { id: "cpp", nameEN: "C++", nameES: "C++", category: "software", iconSrc: "/logos/c++.svg", tier: "primary" },
  { id: "git", nameEN: "Git", nameES: "Git", category: "software", iconSrc: "/logos/git.svg", tier: "primary" },
  { id: "github", nameEN: "GitHub", nameES: "GitHub", category: "software", iconSrc: "/logos/github.svg", tier: "primary" },
  { id: "java", nameEN: "Java", nameES: "Java", category: "software", iconSrc: "/logos/java.svg", tier: "primary" },
  { id: "javascript", nameEN: "JavaScript", nameES: "JavaScript", category: "software", iconSrc: "/logos/javascript.svg", tier: "primary" },
  { id: "python", nameEN: "Python", nameES: "Python", category: "software", iconSrc: "/logos/python.svg", tier: "primary" },
  { id: "rest", nameEN: "REST APIs", nameES: "APIs REST", category: "software", iconSrc: "/logos/restapi.svg", tier: "primary" },
  { id: "typescript", nameEN: "TypeScript", nameES: "TypeScript", category: "software", iconSrc: "/logos/typescript.svg", tier: "primary" },
  { id: "bash", nameEN: "Bash", nameES: "Bash", category: "software", iconSrc: "/logos/bash.svg", tier: "secondary" },
  { id: "c", nameEN: "C", nameES: "C", category: "software", iconSrc: "/logos/c.svg", tier: "secondary" },
  { id: "cmake", nameEN: "CMake", nameES: "CMake", category: "software", iconSrc: "/logos/cmake.svg", tier: "secondary" },
  { id: "gitbash", nameEN: "Git Bash", nameES: "Git Bash", category: "software", iconSrc: "/logos/gitbash.svg", tier: "secondary" },
  { id: "github-actions", nameEN: "GitHub Actions", nameES: "GitHub Actions", category: "software", iconSrc: "/logos/githubactions.svg", tier: "secondary" },
  { id: "latex", nameEN: "LaTeX", nameES: "LaTeX", category: "software", iconSrc: "/logos/latex.svg", tier: "secondary" },
  { id: "powershell", nameEN: "PowerShell", nameES: "PowerShell", category: "software", iconSrc: "/logos/powershell.svg", tier: "secondary" },
  { id: "yaml", nameEN: "YAML", nameES: "YAML", category: "software", iconSrc: "/logos/yaml.svg", tier: "secondary" },

  // Frontend & Product UI
  { id: "css", nameEN: "CSS", nameES: "CSS", category: "frontend", iconSrc: "/logos/css.svg", tier: "primary" },
  { id: "figma", nameEN: "Figma", nameES: "Figma", category: "frontend", iconSrc: "/logos/figma.svg", tier: "primary" },
  { id: "html", nameEN: "HTML", nameES: "HTML", category: "frontend", iconSrc: "/logos/html.svg", tier: "primary" },
  { id: "react", nameEN: "React", nameES: "React", category: "frontend", iconSrc: "/logos/react.svg", tier: "primary" },
  { id: "tailwind", nameEN: "Tailwind CSS", nameES: "Tailwind CSS", category: "frontend", iconSrc: "/logos/tailwind.svg", tier: "primary" },
  { id: "adobecreativecloud", nameEN: "Creative Cloud", nameES: "Creative Cloud", category: "frontend", iconSrc: "/logos/adobecreativecloud.svg", tier: "secondary" },
  { id: "adobeillustrator", nameEN: "Illustrator", nameES: "Illustrator", category: "frontend", iconSrc: "/logos/adobeillustrator.svg", tier: "secondary" },
  { id: "adobelightroom", nameEN: "Lightroom", nameES: "Lightroom", category: "frontend", iconSrc: "/logos/adobelightroom.svg", tier: "secondary" },
  { id: "adobephotoshop", nameEN: "Photoshop", nameES: "Photoshop", category: "frontend", iconSrc: "/logos/adobephotoshop.svg", tier: "secondary" },
  { id: "adobepremier", nameEN: "Premiere", nameES: "Premiere", category: "frontend", iconSrc: "/logos/adobepremier.svg", tier: "secondary" },
  { id: "prettier", nameEN: "Prettier", nameES: "Prettier", category: "frontend", iconSrc: "/logos/prettier.svg", tier: "secondary" },

  // Data & ML
  { id: "huggingface", nameEN: "Hugging Face", nameES: "Hugging Face", category: "data", iconSrc: "/logos/huggingface.svg", tier: "primary" },
  { id: "openai", nameEN: "OpenAI", nameES: "OpenAI", category: "data", iconSrc: "/logos/openai-2.svg", tier: "primary" },
  { id: "pandas", nameEN: "Pandas", nameES: "Pandas", category: "data", iconSrc: "/logos/pandas.svg", tier: "primary" },
  { id: "pytorch", nameEN: "PyTorch", nameES: "PyTorch", category: "data", iconSrc: "/logos/pytorch.svg", tier: "primary" },
  { id: "scikit", nameEN: "scikit-learn", nameES: "scikit-learn", category: "data", iconSrc: "/logos/scikit-learn.svg", tier: "primary" },
  { id: "apache-spark", nameEN: "Apache Spark", nameES: "Apache Spark", category: "data", iconSrc: "/logos/apachespark.svg", tier: "secondary" },
  { id: "deepseek", nameEN: "DeepSeek", nameES: "DeepSeek", category: "data", iconSrc: "/logos/deepseek.svg", tier: "secondary" },
  { id: "gemini", nameEN: "Gemini", nameES: "Gemini", category: "data", iconSrc: "/logos/googlebard.svg", tier: "secondary" },
  { id: "gensim", nameEN: "Gensim", nameES: "Gensim", category: "data", iconSrc: "/logos/gensim.svg", tier: "secondary" },
  { id: "numpy", nameEN: "NumPy", nameES: "NumPy", category: "data", iconSrc: "/logos/numpy.svg", tier: "secondary" },
  { id: "ollama", nameEN: "Ollama", nameES: "Ollama", category: "data", iconSrc: "/logos/ollama-icon.svg", tier: "secondary" },
  { id: "opencv", nameEN: "OpenCV", nameES: "OpenCV", category: "data", iconSrc: "/logos/opencv.svg", tier: "secondary" },
  { id: "openai-api", nameEN: "OpenAI API", nameES: "OpenAI API", category: "data", iconSrc: "/logos/openai-logo-1.svg", tier: "secondary" },
  { id: "spacy", nameEN: "spaCy", nameES: "spaCy", category: "data", iconSrc: "/logos/spacy.svg", tier: "secondary" },
  { id: "tensorflow", nameEN: "TensorFlow", nameES: "TensorFlow", category: "data", iconSrc: "/logos/tensorflow.svg", tier: "secondary" },

  // Databases
  { id: "mysql", nameEN: "MySQL", nameES: "MySQL", category: "db", iconSrc: "/logos/mysql.svg", tier: "primary" },
  { id: "postgres", nameEN: "PostgreSQL", nameES: "PostgreSQL", category: "db", iconSrc: "/logos/postgressql.svg", tier: "primary" },
  { id: "redis", nameEN: "Redis", nameES: "Redis", category: "db", iconSrc: "/logos/redis.svg", tier: "primary" },
  { id: "mongodb", nameEN: "MongoDB", nameES: "MongoDB", category: "db", iconSrc: "/logos/mongodb.svg", tier: "secondary" },
  { id: "sqlite", nameEN: "SQLite", nameES: "SQLite", category: "db", iconSrc: "/logos/sqlite.svg", tier: "secondary" },

  // Cloud & DevOps
  { id: "aws", nameEN: "AWS", nameES: "AWS", category: "cloud", iconSrc: "/logos/aws.svg", tier: "primary" },
  { id: "azure", nameEN: "Azure", nameES: "Azure", category: "cloud", iconSrc: "/logos/azure.svg", tier: "primary" },
  { id: "docker", nameEN: "Docker", nameES: "Docker", category: "cloud", iconSrc: "/logos/docker.svg", tier: "primary" },
  { id: "kubernetes", nameEN: "Kubernetes", nameES: "Kubernetes", category: "cloud", iconSrc: "/logos/kubernetes.svg", tier: "primary" },
  { id: "terraform", nameEN: "Terraform", nameES: "Terraform", category: "cloud", iconSrc: "/logos/terraform.svg", tier: "primary" },
  { id: "ansible", nameEN: "Ansible", nameES: "Ansible", category: "cloud", iconSrc: "/logos/ansible.svg", tier: "secondary" },
  { id: "cloudflare", nameEN: "Cloudflare", nameES: "Cloudflare", category: "cloud", iconSrc: "/logos/cloudflare.svg", tier: "secondary" },
  { id: "grafana", nameEN: "Grafana", nameES: "Grafana", category: "cloud", iconSrc: "/logos/grafana.svg", tier: "secondary" },
  { id: "linux", nameEN: "Linux", nameES: "Linux", category: "cloud", iconSrc: "/logos/linux.svg", tier: "secondary" },
  { id: "nginx", nameEN: "Nginx", nameES: "Nginx", category: "cloud", iconSrc: "/logos/nginx.svg", tier: "secondary" },
  { id: "prometheus", nameEN: "Prometheus", nameES: "Prometheus", category: "cloud", iconSrc: "/logos/prometheus.svg", tier: "secondary" },

  // Automation & Scripting
  { id: "fastapi", nameEN: "FastAPI", nameES: "FastAPI", category: "automation", iconSrc: "/logos/fastapi.svg", tier: "primary" },
  { id: "nodejs", nameEN: "Node.js", nameES: "Node.js", category: "automation", iconSrc: "/logos/nodejs.svg", tier: "primary" },
  { id: "playwright", nameEN: "Playwright", nameES: "Playwright", category: "automation", iconSrc: "/logos/Playwrite.svg", tier: "primary" },
  { id: "django", nameEN: "Django", nameES: "Django", category: "automation", iconSrc: "/logos/django.svg", tier: "secondary" },
  { id: "flask", nameEN: "Flask", nameES: "Flask", category: "automation", iconSrc: "/logos/flask.svg", tier: "secondary" },
  { id: "pytest", nameEN: "pytest", nameES: "pytest", category: "automation", iconSrc: "/logos/pytest.svg", tier: "secondary" },
  { id: "selenium", nameEN: "Selenium", nameES: "Selenium", category: "automation", iconSrc: "/logos/selenium.svg", tier: "secondary" },
  { id: "streamlit", nameEN: "Streamlit", nameES: "Streamlit", category: "automation", iconSrc: "/logos/streamlit.svg", tier: "secondary" },
];

export const skillCrossLinks: SkillLink[] = [
  { sourceId: "python", targetId: "pandas" },
  { sourceId: "python", targetId: "numpy" },
  { sourceId: "python", targetId: "pytorch" },
  { sourceId: "python", targetId: "flask" },
  { sourceId: "fastapi", targetId: "docker" },
  { sourceId: "nodejs", targetId: "docker" },
  { sourceId: "docker", targetId: "kubernetes" },
  { sourceId: "terraform", targetId: "aws" },
  { sourceId: "terraform", targetId: "azure" },
  { sourceId: "aws", targetId: "cloudflare" },
  { sourceId: "prometheus", targetId: "grafana" },
  { sourceId: "postgres", targetId: "redis" },
  { sourceId: "pandas", targetId: "scikit" },
  { sourceId: "pytorch", targetId: "tensorflow" },
  { sourceId: "react", targetId: "tailwind" },
  { sourceId: "react", targetId: "typescript" },
  { sourceId: "github-actions", targetId: "docker" },
];
