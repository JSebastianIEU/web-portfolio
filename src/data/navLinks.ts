export type NavLink = {
  id: string;
  href: string;
  labelKey: string;
};

export const navLinks: NavLink[] = [
  { id: "hero", href: "/#hero", labelKey: "nav.home" },
  { id: "about", href: "/#about", labelKey: "nav.about" },
  { id: "skills", href: "/#skills", labelKey: "nav.skills" },
  { id: "projects", href: "/#projects", labelKey: "nav.projects" },
  // Contact points at the wizard route, not the homepage section, so the
  // active state must come from the pathname there (see Header).
  { id: "contact", href: "/contact", labelKey: "nav.contact" },
];
