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
    published: string;
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
      ownedEndToEnd: string;
      tryIt: string;
      visit: string;
      viewDetails: string;
      newTab: string;
      back: string;
      skipToDemo: string;
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
    wizard: {
      eyebrow: string;
      cta: string;
      steps: [string, string, string, string];
      q1: string;
      account: { company: string; individual: string };
      /* The goal question adapts to who is asking. */
      q2: { company: string; individual: string };
      intents: {
        company: Array<{ id: string; label: string }>;
        individual: Array<{ id: string; label: string }>;
      };
      /* The story step adapts to the chosen goal: hiring asks about the
         role, a project asks about the build, a question just asks. */
      story: Record<
        "company" | "individual",
        Record<string, { q: string; hint: string; placeholder: string }>
      >;
      q4: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      companyPlaceholder: string;
      review: string;
      summaryWho: string;
      summaryGoal: string;
      summaryMessage: string;
      back: string;
      next: string;
      send: string;
      sending: string;
      successTitle: string;
      successBody: string;
      another: string;
    };
  };
  hero: {
    phrases: Phrase[];
    name: string;
    role: string;
    tagline: string;
    ctaProjects: string;
    ctaContact: string;
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
  experience: {
    label: string;
    title: string;
    subcopy: string;
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
