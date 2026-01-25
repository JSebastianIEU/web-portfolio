"use client";

export type SkillCategoryId =
  | "software"
  | "frontend"
  | "data"
  | "db"
  | "cloud"
  | "automation";

export type SkillNode = {
  id: string;
  nameEN: string;
  nameES: string;
  category: SkillCategoryId;
  iconSrc: string;
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
  // Software Engineering
  { id: "python", nameEN: "Python", nameES: "Python", category: "software", iconSrc: "/logos/python-5.svg" },
  { id: "java", nameEN: "Java", nameES: "Java", category: "software", iconSrc: "/logos/java.svg" },
  { id: "c", nameEN: "C", nameES: "C", category: "software", iconSrc: "/logos/c-1.svg" },
  { id: "cpp", nameEN: "C++", nameES: "C++", category: "software", iconSrc: "/logos/c++.svg" },
  { id: "typescript", nameEN: "TypeScript", nameES: "TypeScript", category: "software", iconSrc: "/logos/typescript.svg" },
  { id: "javascript", nameEN: "JavaScript", nameES: "JavaScript", category: "software", iconSrc: "/logos/javascript.svg" },
  { id: "bash", nameEN: "Bash", nameES: "Bash", category: "software", iconSrc: "/logos/bash.svg" },
  { id: "powershell", nameEN: "PowerShell", nameES: "PowerShell", category: "software", iconSrc: "/logos/powershell.svg" },
  { id: "yaml", nameEN: "YAML", nameES: "YAML", category: "software", iconSrc: "/logos/yaml.svg" },
  { id: "rest", nameEN: "REST APIs", nameES: "APIs REST", category: "software", iconSrc: "/logos/rest-api-icon.svg" },
  { id: "git", nameEN: "Git", nameES: "Git", category: "software", iconSrc: "/logos/git-icon.svg" },
  { id: "gitbash", nameEN: "Git Bash", nameES: "Git Bash", category: "software", iconSrc: "/logos/gitbash.svg" },
  { id: "github", nameEN: "GitHub", nameES: "GitHub", category: "software", iconSrc: "/logos/github-icon-1.svg" },
  { id: "github-actions", nameEN: "GitHub Actions", nameES: "GitHub Actions", category: "software", iconSrc: "/logos/githubactions.svg" },
  { id: "cmake", nameEN: "CMake", nameES: "CMake", category: "software", iconSrc: "/logos/CMake.svg" },

  // Frontend & Product UI
  { id: "html", nameEN: "HTML", nameES: "HTML", category: "frontend", iconSrc: "/logos/html.svg" },
  { id: "css", nameEN: "CSS", nameES: "CSS", category: "frontend", iconSrc: "/logos/css.svg" },
  { id: "tailwind", nameEN: "Tailwind CSS", nameES: "Tailwind CSS", category: "frontend", iconSrc: "/logos/tailwind.svg" },
  { id: "figma", nameEN: "Figma", nameES: "Figma", category: "frontend", iconSrc: "/logos/figma.svg" },
  { id: "illustrator", nameEN: "Illustrator", nameES: "Illustrator", category: "frontend", iconSrc: "/logos/adobeillustrator.svg" },
  { id: "photoshop", nameEN: "Photoshop", nameES: "Photoshop", category: "frontend", iconSrc: "/logos/adobephotoshop.svg" },
  { id: "premiere", nameEN: "Premiere Pro", nameES: "Premiere Pro", category: "frontend", iconSrc: "/logos/adobepremierpro.svg" },

  // Data & ML
  { id: "pandas", nameEN: "Pandas", nameES: "Pandas", category: "data", iconSrc: "/logos/pandas.svg" },
  { id: "numpy", nameEN: "NumPy", nameES: "NumPy", category: "data", iconSrc: "/logos/python-5.svg" },
  { id: "scikit", nameEN: "scikit-learn", nameES: "scikit-learn", category: "data", iconSrc: "/logos/scikit-learn.svg" },
  { id: "pytorch", nameEN: "PyTorch", nameES: "PyTorch", category: "data", iconSrc: "/logos/pytorch.svg" },
  { id: "tensorflow", nameEN: "TensorFlow", nameES: "TensorFlow", category: "data", iconSrc: "/logos/tensorflow.svg" },
  { id: "spacy", nameEN: "spaCy", nameES: "spaCy", category: "data", iconSrc: "/logos/spacy.svg" },
  { id: "gensim", nameEN: "Gensim", nameES: "Gensim", category: "data", iconSrc: "/logos/gensim.svg" },
  { id: "huggingface", nameEN: "Hugging Face", nameES: "Hugging Face", category: "data", iconSrc: "/logos/huggingface.svg" },
  { id: "openai", nameEN: "OpenAI", nameES: "OpenAI", category: "data", iconSrc: "/logos/openai-2.svg" },
  { id: "ollama", nameEN: "Ollama", nameES: "Ollama", category: "data", iconSrc: "/logos/ollama-icon.svg" },
  { id: "bard", nameEN: "Gemini (Bard)", nameES: "Gemini (Bard)", category: "data", iconSrc: "/logos/google-bard-1.svg" },
  { id: "deepseek", nameEN: "DeepSeek", nameES: "DeepSeek", category: "data", iconSrc: "/logos/deepseek-2.svg" },
  { id: "openai-logo", nameEN: "OpenAI API", nameES: "OpenAI API", category: "data", iconSrc: "/logos/openai-logo-1.svg" },
  { id: "opencv", nameEN: "OpenCV", nameES: "OpenCV", category: "data", iconSrc: "/logos/opencv.svg" },
  { id: "genspark", nameEN: "Apache Spark", nameES: "Apache Spark", category: "data", iconSrc: "/logos/apachespark.svg" },

  // Databases
  { id: "mysql", nameEN: "MySQL", nameES: "MySQL", category: "db", iconSrc: "/logos/mysql.svg" },
  { id: "postgres", nameEN: "PostgreSQL", nameES: "PostgreSQL", category: "db", iconSrc: "/logos/postgressql.svg" },
  { id: "mongodb", nameEN: "MongoDB", nameES: "MongoDB", category: "db", iconSrc: "/logos/mongodb.svg" },
  { id: "prometheus", nameEN: "Prometheus", nameES: "Prometheus", category: "db", iconSrc: "/logos/prometheus.svg" },

  // Cloud & DevOps
  { id: "aws", nameEN: "AWS", nameES: "AWS", category: "cloud", iconSrc: "/logos/aws.svg" },
  { id: "azure", nameEN: "Azure", nameES: "Azure", category: "cloud", iconSrc: "/logos/azure.svg" },
  { id: "docker", nameEN: "Docker", nameES: "Docker", category: "cloud", iconSrc: "/logos/docker.svg" },
  { id: "ansible", nameEN: "Ansible", nameES: "Ansible", category: "cloud", iconSrc: "/logos/Ansible.svg" },

  // Automation & Scripting
  { id: "pytest", nameEN: "pytest", nameES: "pytest", category: "automation", iconSrc: "/logos/pytest.svg" },
  { id: "selenium", nameEN: "Selenium", nameES: "Selenium", category: "automation", iconSrc: "/logos/selenium.svg" },
  { id: "playwright", nameEN: "Playwright", nameES: "Playwright", category: "automation", iconSrc: "/logos/Playwrite.svg" },
  { id: "streamlit", nameEN: "Streamlit", nameES: "Streamlit", category: "automation", iconSrc: "/logos/streamlit.svg" },
  { id: "fastapi", nameEN: "FastAPI", nameES: "FastAPI", category: "automation", iconSrc: "/logos/fastapi.svg" },
  { id: "flask", nameEN: "Flask", nameES: "Flask", category: "automation", iconSrc: "/logos/flask.svg" },
  { id: "django", nameEN: "Django", nameES: "Django", category: "automation", iconSrc: "/logos/django.svg" },
  { id: "nodejs", nameEN: "Node.js", nameES: "Node.js", category: "automation", iconSrc: "/logos/nodejs.svg" },
];

export const skillCrossLinks: SkillLink[] = [
  { sourceId: "python", targetId: "pandas" },
  { sourceId: "python", targetId: "fastapi" },
  { sourceId: "typescript", targetId: "nodejs" },
  { sourceId: "docker", targetId: "aws" },
  { sourceId: "aws", targetId: "prometheus" },
  { sourceId: "pytorch", targetId: "huggingface" },
  { sourceId: "pytorch", targetId: "openai" },
  { sourceId: "playwright", targetId: "selenium" },
  { sourceId: "mysql", targetId: "docker" },
  { sourceId: "postgres", targetId: "docker" },
  { sourceId: "mongodb", targetId: "nodejs" },
];
