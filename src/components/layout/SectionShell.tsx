import type { CSSProperties, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type SectionShellProps = {
  id?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
  style?: CSSProperties;
};

const SectionShell = forwardRef<HTMLElement, SectionShellProps>(
  ({ id, className, contentClassName, children, style }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        className={cn("relative w-full px-4 md:px-6 lg:px-8", className)}
        style={{ cursor: "none", ...style }}
      >
        <div className={cn("max-w-5xl mx-auto", contentClassName)}>{children}</div>
      </section>
    );
  },
);

SectionShell.displayName = "SectionShell";

export default SectionShell;
