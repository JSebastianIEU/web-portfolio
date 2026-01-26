type Tone = "neutral" | "accent" | "warning";

type ProjectBadgeProps = {
  label: string;
  tone?: Tone;
  isDark: boolean;
};

export default function ProjectBadge({ label, tone = "neutral", isDark }: ProjectBadgeProps) {
  const palette: Record<Tone, { bg: string; color: string; border: string }> = isDark
    ? {
        neutral: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.9)", border: "rgba(255,255,255,0.14)" },
        accent: { bg: "rgba(126,226,255,0.12)", color: "rgba(126,226,255,0.95)", border: "rgba(126,226,255,0.3)" },
        warning: { bg: "rgba(255,199,122,0.16)", color: "rgba(255,199,122,0.95)", border: "rgba(255,199,122,0.32)" },
      }
    : {
        neutral: { bg: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.9)", border: "rgba(15,23,42,0.14)" },
        accent: { bg: "rgba(6,95,186,0.08)", color: "rgba(6,95,186,0.9)", border: "rgba(6,95,186,0.2)" },
        warning: { bg: "rgba(217,119,6,0.08)", color: "rgba(217,119,6,0.9)", border: "rgba(217,119,6,0.2)" },
      };
  const style = palette[tone];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
    >
      {label}
    </span>
  );
}
