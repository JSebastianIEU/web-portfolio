"use client";

export type Locale = "en" | "es";

type Phrase = { prefix: string; highlight: string; suffix: string };

type Translations = {
  nav: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    contact: string;
  };
  hero: {
    phrases: Phrase[];
  };
  about: {
    label: string;
    headline: string;
    body: string;
    bullets: string[];
    humanLine: string;
    cards: {
      nowLabel: string;
      nowValue: string;
      focusLabel: string;
      focusValue: string;
      valuesLabel: string;
      valuesValue: string;
    };
  };
  skills: {
    label: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
};

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: "home",
      about: "about",
      skills: "skills",
      projects: "projects",
      contact: "contact",
    },
    hero: {
      phrases: [
        { prefix: "I build ", highlight: "intelligent systems", suffix: "" },
        { prefix: "I turn ideas into ", highlight: "real products", suffix: "" },
        { prefix: "I solve ", highlight: "problems", suffix: " through technology" },
        { prefix: "I care about ", highlight: "design and impact", suffix: "" },
        { prefix: "I'm ", highlight: "Sebastian Peña", suffix: "" },
      ],
    },
    about: {
      label: "About",
      headline: "Building clear systems where software, design, and data meet.",
      body:
        "I’m Sebastian Peña, a Colombian builder based in Madrid, pursuing a degree in Computer Science and Artificial Intelligence. I design and build clear, useful systems with a bias for clarity—because technical excellence matters most when it improves outcomes for real people and real contexts. Outside of work, salsa and bachata shape how I think about adaptability, collaboration, and connection.",
      bullets: [
        "Software engineering with product judgment",
        "Data-aware systems and practical AI",
        "Human-centered thinking in complex environments",
      ],
      humanLine:
        "Outside of work, salsa and bachata shape how I think about adaptability, collaboration, and connection.",
      cards: {
        nowLabel: "Now",
        nowValue: "Madrid",
        focusLabel: "Focus",
        focusValue: "Software · AI · Product",
        valuesLabel: "Values",
        valuesValue: "Human-centered · Systems-minded",
      },
    },
    skills: {
      label: "Skills",
    },
    footer: {
      tagline: "AI, Data & Intelligent Systems",
      copyright: "© {year} Juan Sebastian Peña",
    },
  },
  es: {
    nav: {
      home: "inicio",
      about: "sobre mí",
      skills: "habilidades",
      projects: "proyectos",
      contact: "contacto",
    },
    hero: {
      phrases: [
        { prefix: "Construyo ", highlight: "sistemas inteligentes", suffix: "" },
        { prefix: "Transformo ideas en ", highlight: "productos reales", suffix: "" },
        { prefix: "Resuelvo ", highlight: "problemas", suffix: " con tecnología" },
        { prefix: "Me importan el ", highlight: "diseño y el impacto", suffix: "" },
        { prefix: "Soy ", highlight: "Sebastian Peña", suffix: "" },
      ],
    },
    about: {
      label: "Sobre mí",
      headline: "Construyo sistemas claros donde el software, el diseño y los datos se encuentran.",
      body:
        "Soy Sebastian Peña, un creador colombiano basado en Madrid, y estoy cursando un grado en Ciencias de la Computación e Inteligencia Artificial. Diseño y construyo sistemas claros y útiles, con una obsesión sana por la claridad—porque la excelencia técnica solo importa cuando mejora resultados para personas reales y contextos reales. Fuera del trabajo, la salsa y la bachata moldean cómo pienso sobre adaptabilidad, colaboración y conexión.",
      bullets: [
        "Ingeniería de software con criterio de producto",
        "Sistemas orientados a datos e IA práctica",
        "Pensamiento centrado en las personas en entornos complejos",
      ],
      humanLine:
        "Fuera del trabajo, la salsa y la bachata moldean cómo pienso sobre adaptabilidad, colaboración y conexión.",
      cards: {
        nowLabel: "Ahora",
        nowValue: "Madrid",
        focusLabel: "Enfoque",
        focusValue: "Software · IA · Producto",
        valuesLabel: "Valores",
        valuesValue: "Centrado en las personas · Visión de sistemas",
      },
    },
    skills: {
      label: "Habilidades",
    },
    footer: {
      tagline: "IA, Datos y Sistemas Inteligentes",
      copyright: "© {year} Juan Sebastian Peña",
    },
  },
};

export function getTranslation(locale: Locale) {
  return translations[locale];
}
