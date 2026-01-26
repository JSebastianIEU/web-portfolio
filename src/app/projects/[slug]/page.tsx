"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { projectsData } from "@/data/projectsData";
import { useI18n } from "@/components/providers/language-provider";
import { translations } from "@/i18n/translations";

function Content({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const dict = translations[lang].projects.detail;
  const statusMap = translations[lang].statuses;
  const typeMap = translations[lang].types;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return notFound();
  const badgeTone =
    project.status === "live"
      ? "border-emerald-300/60 bg-emerald-300/10 text-emerald-800 dark:text-emerald-100"
      : project.status === "paused"
      ? "border-amber-300/60 bg-amber-200/15 text-amber-800 dark:text-amber-100"
      : "border-slate-300/50 bg-slate-200/15 text-slate-800 dark:border-white/30 dark:bg-white/10 dark:text-slate-100";

  const linkButton = (label: string, href?: string, fallback?: string) => (
    <Link
      href={href || "#"}
      aria-disabled={!href}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
        href
          ? "border border-slate-300/60 bg-slate-100/40 text-slate-900 hover:bg-slate-100/70 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          : "border border-slate-200/50 text-slate-500 cursor-not-allowed dark:border-white/10 dark:text-white/50"
      }`}
    >
      <span>{href ? label : fallback || label}</span>
    </Link>
  );

  return (
    <main className="relative z-[10] px-4 md:px-8 py-12 md:py-16 text-slate-900 dark:text-slate-50" style={{ cursor: "none" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-slate-300/60 bg-slate-200/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-slate-100">
              {typeMap[project.type]}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${badgeTone}`}>
              {statusMap[project.status]}
            </span>
            {project.role && (
              <span className="rounded-full border border-slate-300/60 bg-slate-200/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-slate-100">
                {project.role}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-900 dark:text-white">
              {project.titleES || project.title}
            </h1>
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-200/85">
              {project.subtitleES || project.subtitle}
            </p>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-6 rounded-2xl border border-slate-200/60 bg-slate-100/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-200/80">{dict.overview}</h3>
            <p className="text-slate-800 dark:text-slate-100/85 leading-relaxed">{project.descriptionES || project.description}</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-200/80">{dict.highlights}</h3>
            <ul className="space-y-2 text-slate-800 dark:text-slate-100/85 leading-relaxed">
              {(project.highlightsES || project.highlights).map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200/60 bg-slate-100/60 p-6 backdrop-blur-xl space-y-3 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-200/80">{dict.architecture}</h3>
            <ul className="space-y-2 text-slate-800 dark:text-slate-100/85 leading-relaxed">
              {(project.architectureES || project.architecture).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200/60 bg-slate-100/60 p-6 backdrop-blur-xl space-y-3 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-200/80">{dict.stack}</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="text-xs font-semibold rounded-full px-3 py-1 border border-slate-200/60 bg-slate-100/60 text-slate-800 dark:border-white/15 dark:bg-white/5 dark:text-slate-50">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/60 bg-slate-100/60 p-6 backdrop-blur-xl space-y-3 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-200/80">{dict.media}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aspect-video rounded-xl border border-slate-200/60 bg-slate-100/60 flex items-center justify-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300/70">
              {dict.videoPlaceholder}
            </div>
            <div className="aspect-video rounded-xl border border-slate-200/60 bg-slate-100/60 flex items-center justify-center text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300/70">
              {dict.imagePlaceholder}
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {linkButton("GitHub", project.links.github, translations[lang].projects.modal.githubSoon)}
          {linkButton(translations[lang].projects.cards.caseStudy, project.links.caseStudy, translations[lang].projects.modal.caseSoon)}
          {linkButton(translations[lang].projects.cards.demoVideo, project.links.video, translations[lang].projects.modal.videoSoon)}
          {linkButton(translations[lang].projects.cards.liveDemo, project.links.live, translations[lang].projects.modal.liveOffline)}
        </section>

        <div className="flex justify-end">
          <Link href="/#projects" className="text-sm font-semibold text-slate-800 underline-offset-4 hover:underline dark:text-slate-100">
            {dict.nextProject}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return <Content slug={params.slug} />;
}
