export type Locale = "en" | "es";

export type Phrase = { prefix: string; highlight: string; suffix: string };

export type TranslationCopy = {
  nav: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    contact: string;
  };
  statuses: {
    live: string;
    paused: string;
    prototype: string;
    "in-progress": string;
  };
  types: {
    personal: string;
    enterprise: string;
    hackathon: string;
    startup: string;
  };
  projects: {
    title: string;
    subcopy: string;
    groups: {
      professional: {
        title: string;
        subcopy: string;
      };
      openSource: {
        title: string;
        subcopy: string;
      };
    };
    cards: {
      caseStudy: string;
      demoVideo: string;
      github: string;
      liveDemo: string;
      soon: string;
      offline: string;
      privateCode: string;
      tryIt: string;
      visit: string;
      viewDetails: string;
      newTab: string;
    };
    modal: {
      whatBuilt: string;
      architecture: string;
      stack: string;
      openPage: string;
      githubSoon: string;
      caseSoon: string;
      videoSoon: string;
      liveOffline: string;
    };
    detail: {
      overview: string;
      highlights: string;
      architecture: string;
      stack: string;
      media: string;
      videoPlaceholder: string;
      imagePlaceholder: string;
      nextProject: string;
    };
  };
  contact: {
    title: string;
    tagline: string;
    subcopy: string;
    actions: {
      email: string;
      linkedin: string;
      calendly: string;
    };
    form: {
      name: string;
      email: string;
      company: string;
      subject: string;
      message: string;
      submit: string;
      sent: string;
      error: string;
      required: string;
      emailInvalid: string;
      messageLength: string;
    };
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
  cta: {
    downloadCv: string;
    contactMe: string;
  };
};

export type Translations = Record<Locale, TranslationCopy>;
