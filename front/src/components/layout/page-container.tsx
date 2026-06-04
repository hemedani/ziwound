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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {meshAnimation && (
        <div className="mesh-sweep-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      )}

      <div className="relative z-10">
        {showHeader && title && (
          <header className="relative w-full overflow-hidden">
            {/* Crimson radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(153,27,27,0.12)_0%,_transparent_70%)]" />
            {/* Gold accent glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />
            {/* Frosted-glass blur */}
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 lg:pb-12 text-center">
              <div className="mx-auto max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-offwhite leading-[1.1] tracking-tight text-glow-crimson mb-4">
                  {title}
                </h1>
                {description && (
                  <p className="text-lg md:text-xl text-slate-body max-w-2xl mx-auto leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Neon separator */}
            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
              <div
                className="w-full h-px bg-gradient-to-r from-transparent via-crimson/35 to-transparent header-neon-pulse"
                style={{
                  animation: "headerNeonPulse 4s ease-in-out infinite",
                  boxShadow: "0 0 8px 1px rgba(153,27,27,0.12)",
                }}
              />
            </div>
          </header>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
}
