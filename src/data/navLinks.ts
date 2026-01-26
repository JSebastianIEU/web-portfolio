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
  { id: "contact", href: "/#contact", labelKey: "nav.contact" },
];
