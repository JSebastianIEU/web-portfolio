import type { Locale, TranslationCopy, Translations } from "./types";

export const translations: Translations = {
  en: {
    nav: {
      home: "home",
      about: "about",
      skills: "skills",
      projects: "projects",
      contact: "contact",
    },
    statuses: {
      live: "Live",
      paused: "Paused",
      prototype: "Prototype",
      "in-progress": "In progress",
    },
    types: {
      personal: "Personal",
      enterprise: "Enterprise",
      hackathon: "Hackathon",
      startup: "Startup",
    },
    projects: {
      title: "Projects",
      subcopy: "Selected work across real products, startups, and open-source builds.",
      groups: {
        professional: {
          title: "Real-world work",
          subcopy: "Products running in production — client work and my own ventures. Code is private, but you can try them live.",
        },
        openSource: {
          title: "Open source & writing",
          subcopy: "Personal builds and experiments with public code or published write-ups.",
        },
      },
      cards: {
        caseStudy: "Case Study",
        demoVideo: "Demo Video",
        github: "GitHub",
        liveDemo: "Live Demo",
        soon: "— soon",
        offline: "Offline (infra paused)",
        privateCode: "Private code",
        tryIt: "Try it live",
      },
      modal: {
        whatBuilt: "What I built",
        architecture: "Architecture",
        stack: "Tech stack",
        openPage: "Open full page",
        githubSoon: "GitHub (soon)",
        caseSoon: "Case Study (soon)",
        videoSoon: "Demo Video (soon)",
        liveOffline: "Offline (infra paused)",
      },
      detail: {
        overview: "Overview",
        highlights: "Highlights",
        architecture: "Architecture",
        stack: "Tech stack",
        media: "Media",
        videoPlaceholder: "Video placeholder",
        imagePlaceholder: "Image placeholder",
        nextProject: "Next project →",
      },
    },
    contact: {
      title: "Contact",
      tagline: "Let's talk.",
      subcopy: "Reach out for collaborations, product conversations, or quick questions.",
      actions: {
        email: "Email me",
        linkedin: "LinkedIn",
        calendly: "Book a call",
      },
      form: {
        name: "Name",
        email: "Email",
        company: "Company (optional)",
        subject: "Subject",
        message: "Message",
        submit: "Send message",
        sent: "Message sent. I'll get back to you soon.",
        error: "Something went wrong. Please try again.",
        required: "This field is required",
        emailInvalid: "Enter a valid email",
        messageLength: "Message should be at least 20 characters",
      },
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
      headline: "Building clear AI and data-driven systems with strong product judgment.",
      body:
        "I'm Juan Sebastian Peña, a Colombian builder based in Madrid, pursuing a degree in Computer Science and Artificial Intelligence. I design and build AI- and data-driven systems with a strong focus on clarity, explainability, and product intent—because technical excellence only matters when people can understand, trust, and act on it in real contexts.",
      bullets: [],
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
    cta: {
      downloadCv: "Download CV",
      contactMe: "Contact me",
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
    statuses: {
      live: "Activo",
      paused: "Pausado",
      prototype: "Prototipo",
      "in-progress": "En progreso",
    },
    types: {
      personal: "Personal",
      enterprise: "Enterprise",
      hackathon: "Hackathon",
      startup: "Startup",
    },
    projects: {
      title: "Proyectos",
      subcopy: "Trabajo seleccionado entre productos reales, startups y builds open source.",
      groups: {
        professional: {
          title: "Trabajo real",
          subcopy: "Productos corriendo en producción — trabajo para clientes y empresas propias. El código es privado, pero puedes probarlos en vivo.",
        },
        openSource: {
          title: "Open source y publicaciones",
          subcopy: "Builds personales y experimentos con código público o artículos publicados.",
        },
      },
      cards: {
        caseStudy: "Case Study",
        demoVideo: "Video demo",
        github: "GitHub",
        liveDemo: "Demo en vivo",
        soon: "— próximamente",
        offline: "Offline (infra pausada)",
        privateCode: "Código privado",
        tryIt: "Probar en vivo",
      },
      modal: {
        whatBuilt: "Lo que construí",
        architecture: "Arquitectura",
        stack: "Stack técnico",
        openPage: "Abrir página completa",
        githubSoon: "GitHub (pronto)",
        caseSoon: "Case Study (pronto)",
        videoSoon: "Video demo (pronto)",
        liveOffline: "Offline (infra pausada)",
      },
      detail: {
        overview: "Resumen",
        highlights: "Highlights",
        architecture: "Arquitectura",
        stack: "Stack técnico",
        media: "Media",
        videoPlaceholder: "Placeholder de video",
        imagePlaceholder: "Placeholder de imagen",
        nextProject: "Próximo proyecto →",
      },
    },
    contact: {
      title: "Contacto",
      tagline: "Hablemos.",
      subcopy: "Escríbeme para colaborar, hablar de producto o resolver dudas rápidas.",
      actions: {
        email: "Envíame un correo",
        linkedin: "LinkedIn",
        calendly: "Agenda una llamada",
      },
      form: {
        name: "Nombre",
        email: "Correo",
        company: "Empresa (opcional)",
        subject: "Asunto",
        message: "Mensaje",
        submit: "Enviar mensaje",
        sent: "Mensaje enviado. Te responderé pronto.",
        error: "Algo salió mal. Intenta de nuevo.",
        required: "Este campo es obligatorio",
        emailInvalid: "Ingresa un correo válido",
        messageLength: "El mensaje debe tener al menos 20 caracteres",
      },
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
      headline: "Construyo sistemas de IA y datos claros con sólido criterio de producto.",
      body:
        "Soy Juan Sebastian Peña, un creador colombiano basado en Madrid, y estoy cursando un grado en Ciencias de la Computación e Inteligencia Artificial. Diseño y construyo sistemas impulsados por IA y datos con un fuerte enfoque en claridad, explicabilidad e intención de producto—porque la excelencia técnica solo importa cuando las personas pueden comprenderla, confiar en ella y actuar sobre ella en contextos reales.",
      bullets: [],
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
    cta: {
      downloadCv: "Descargar CV",
      contactMe: "Contáctame",
    },
  },
};

export function getTranslation(locale: Locale): TranslationCopy {
  return translations[locale];
}
