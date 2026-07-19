import Link from "next/link";
import { ArrowRight, Shield, GitBranch, FileCheck, CheckCircle2, Lock, History, UserCheck } from "lucide-react";
import { MagneticText } from "@/components/ui/morphing-cursor";
import CardSwap, { Card } from "@/components/ui/card-swap";
import BorderGlow from "@/components/ui/border-glow";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col hero-glow overflow-x-hidden">
      {/* ── Top Navigation ── */}
      <header className="border-b border-hairline bg-canvas/80 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-[26px] sm:text-[32px] font-extrabold tracking-tight text-ink group-hover:text-ink/90 transition-theme">
              Elevate<span className="text-primary">Flow</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[15px] sm:text-[16px] font-bold text-ink bg-surface-3 border border-hairline-strong overflow-hidden transition-all duration-300 hover:border-sky-300/60 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 group-hover:text-slate-950 transition-colors duration-300">
              Sign in
            </span>
          </Link>
        </div>
      </header>

      {/* ── Hero Split Section ── */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-6 sm:px-8 pt-4 sm:pt-6 lg:pt-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
        
        {/* Left Column — Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 pt-2 lg:pt-4">
          {/* Eyebrow */}
          <div className="eyebrow text-primary px-3.5 py-1.5 rounded-full bg-surface-1 border border-hairline inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Document Workflow Engine
          </div>

          {/* Headline — Geist display with MagneticText */}
          <h1 className="font-display text-[clamp(36px,4.5vw,58px)] font-semibold tracking-[-0.04em] text-ink leading-[1.08]">
            Controlled document approval.{" "}
            <br className="hidden sm:inline" />
            <MagneticText
              text="Zero shortcuts."
              hoverText="Zero shortcuts."
              circleBgClass="bg-[#F0B429]"
              circleTextClass="text-[#08090a]"
              textClassName="text-[clamp(36px,4.5vw,58px)] font-semibold tracking-[-0.04em] leading-[1.08]"
            />
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] sm:text-[18px] text-ink-muted max-w-[560px] leading-relaxed">
            ElevateFlow guarantees strict document lifecycle management. Every edit, approval, and state transition is verified server-side with optimistic concurrency and immutable audit logging.
          </p>

          {/* CTA Pair */}
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-[15px] font-semibold hover:bg-primary-hover transition-theme shadow-[0_0_20px_rgba(229,161,0,0.3)]"
            >
              Access portal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-surface-2 text-ink text-[15px] font-semibold border border-hairline-strong hover:bg-surface-3 transition-theme"
            >
              System specs
            </a>
          </div>

          {/* Engine Guarantee Badges */}
          <div className="pt-6 border-t border-hairline/60 grid grid-cols-3 gap-4 w-full max-w-[540px]">
            <div className="flex items-center gap-2 text-[12px] font-mono text-ink-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>State Validation</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-mono text-ink-muted">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Role Enforced</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-mono text-ink-muted">
              <History className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span>Atomic Audit</span>
            </div>
          </div>
        </div>

        {/* Right Column — 3 Whitish Glass Document Cards (Lifted by 5vh) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-center relative min-h-[520px] sm:min-h-[560px] w-full lg:-mt-[4vh] pr-4 sm:pr-8 lg:pr-12">
          <div className="relative w-full max-w-[420px] h-[500px]">
            <CardSwap
              width={370}
              height={410}
              cardDistance={48}
              verticalDistance={58}
              delay={4500}
              pauseOnHover={true}
              skewAmount={5}
            >
              {/* Card 1 — Seed Doc 1: Draft */}
              <Card className="color-card-amber p-7 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="status-capsule eyebrow bg-[#ff5530] text-white border border-[#ff5530]/80 px-3 py-1 rounded-full text-[10.5px] tracking-wider font-extrabold shadow-[0_2px_8px_rgba(255,85,48,0.3)]">
                      ● DRAFT
                    </span>
                    <span className="email-text text-[11px] font-mono text-slate-500">alice@elevateflow.dev</span>
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-slate-900 mb-3 leading-snug">
                    Q3 System Architecture & Zero-Trust Guidelines
                  </h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed font-medium">
                    Overview & Zero-Trust Architecture: Never trust, always verify — Every request must be authenticated and authorized. Least privilege access and continuous verification.
                  </p>
                </div>
                <div className="footer-box pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11.5px] font-mono text-slate-700">
                  <span className="flex items-center gap-2 font-semibold text-slate-800">
                    <UserCheck className="w-4 h-4 text-[#ff5530]" />
                    Alice Author
                  </span>
                  <span className="text-[#ff5530] font-semibold">Draft Status</span>
                </div>
              </Card>

              {/* Card 2 — Seed Doc 2: Submitted */}
              <Card className="color-card-sky p-7 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="status-capsule eyebrow bg-[#1456f0] text-white border border-[#1456f0]/80 px-3 py-1 rounded-full text-[10.5px] tracking-wider font-extrabold shadow-[0_2px_8px_rgba(20,86,240,0.3)]">
                      ● SUBMITTED
                    </span>
                    <span className="email-text text-[11px] font-mono text-slate-500">alice@elevateflow.dev</span>
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-slate-900 mb-3 leading-snug">
                    API Rate Limiting & Throttling Specification
                  </h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed font-medium">
                    Define rate limiting strategy for all public and internal APIs to ensure system stability, prevent abuse, and guarantee fair usage across all consumers.
                  </p>
                </div>
                <div className="footer-box pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11.5px] font-mono text-slate-700">
                  <span className="flex items-center gap-2 font-semibold text-slate-800">
                    <UserCheck className="w-4 h-4 text-[#1456f0]" />
                    Alice Author
                  </span>
                  <span className="text-[#1456f0] font-semibold">Pending Review</span>
                </div>
              </Card>

              {/* Card 3 — Seed Doc 3: Approved */}
              <Card className="color-card-emerald p-7 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between select-none">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="status-capsule eyebrow bg-[#10b981] text-white border border-[#10b981]/80 px-3 py-1 rounded-full text-[10.5px] tracking-wider font-extrabold shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                      ● APPROVED
                    </span>
                    <span className="email-text text-[11px] font-mono text-slate-500">alice@elevateflow.dev</span>
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-slate-900 mb-3 leading-snug">
                    Database Migration Strategy: Blue-Green Deployments
                  </h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed font-medium">
                    Achieve zero-downtime database schema migrations using blue-green deployment patterns with automated rollback capabilities and shadow traffic verification.
                  </p>
                </div>
                <div className="footer-box pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11.5px] font-mono text-slate-700">
                  <span className="flex items-center gap-2 font-semibold text-slate-800">
                    <UserCheck className="w-4 h-4 text-[#10b981]" />
                    Alice Author
                  </span>
                  <span className="text-[#10b981] font-semibold">Approved</span>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </main>

      {/* ── Architectural Goals & Principles Section ── */}
      <section className="border-t border-hairline bg-surface-1/40 py-16">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center max-w-[680px] mx-auto space-y-3">
            <span className="eyebrow text-primary">Mission & Engine Guarantees</span>
            <h2 className="font-display text-[28px] sm:text-[36px] font-semibold tracking-tight text-ink">
              What ElevateFlow Is & Why It Exists
            </h2>
            <p className="text-[15px] text-ink-muted leading-relaxed">
              We are not building a simple CRUD app. ElevateFlow is an enterprise-grade document workflow engine built to guarantee transactional consistency, strict authorization, and complete audit accountability.
            </p>
          </div>

          {/* Feature Grid with BorderGlow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="43 100 45"
              backgroundColor="var(--color-surface-1)"
              borderRadius={16}
              glowRadius={30}
              glowIntensity={1.2}
              coneSpread={30}
              animated={true}
              colors={["#e5a100", "#f0b429", "#3b82f6"]}
            >
              <FeatureCard
                icon={<Shield className="w-5 h-5" />}
                title="Server-Side Authorization"
                description="Permissions are validated strictly on the server before every mutation. Frontend buttons and routes are convenience only—the API enforces role and ownership."
              />
            </BorderGlow>
            <BorderGlow
              edgeSensitivity={30}
              glowColor="160 84 40"
              backgroundColor="var(--color-surface-1)"
              borderRadius={16}
              glowRadius={30}
              glowIntensity={1.2}
              coneSpread={30}
              animated={true}
              colors={["#3b82f6", "#10b981", "#e5a100"]}
            >
              <FeatureCard
                icon={<GitBranch className="w-5 h-5" />}
                title="Strict State Machine"
                description="Documents progress strictly along allowed transitions: Draft → Submitted → Approved → Published. Invalid transitions are explicitly rejected with 400 domain errors."
              />
            </BorderGlow>
            <BorderGlow
              edgeSensitivity={30}
              glowColor="260 84 55"
              backgroundColor="var(--color-surface-1)"
              borderRadius={16}
              glowRadius={30}
              glowIntensity={1.2}
              coneSpread={30}
              animated={true}
              colors={["#8b5cf6", "#10b981", "#f0b429"]}
            >
              <FeatureCard
                icon={<FileCheck className="w-5 h-5" />}
                title="Atomic Audit & Concurrency"
                description="Every document state update and audit log record execute inside the exact same database transaction with optimistic version checking."
              />
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-hairline py-8 text-center bg-canvas">
        <span className="eyebrow text-ink-subtle">
          ElevateFlow — Document Workflow Engine • Built for Precision
        </span>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 space-y-4 text-left">
      <div className="w-10 h-10 rounded-xl bg-surface-3 border border-hairline-strong flex items-center justify-center text-primary shadow-sm">
        {icon}
      </div>
      <h3 className="text-[17px] font-bold text-ink leading-snug">{title}</h3>
      <p className="text-[14px] text-ink-muted leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
}
