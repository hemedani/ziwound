import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  heroGradient?: string;
  className?: string;
  showHeader?: boolean;
  contentClassName?: string;
  meshAnimation?: boolean;
}

export function PageContainer({
  children,
  title,
  description,
  heroGradient = "from-crimson/5",
  className = "",
  showHeader = true,
  contentClassName = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20",
  meshAnimation = true,
}: PageContainerProps) {
  return (
    <div className={`relative min-h-screen bg-background ${className}`}>
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${heroGradient} via-background to-background pointer-events-none`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {meshAnimation && (
        <>
          <div className="mesh-sweep-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="mesh-shimmer-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
        </>
      )}
      <div className="relative z-10">
        {showHeader && title && (
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 text-center">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-offwhite mb-4">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-slate-body max-w-2xl mx-auto">{description}</p>
              )}
            </div>
          </header>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
