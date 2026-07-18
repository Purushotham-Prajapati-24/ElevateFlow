import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between hero-glow">
      {/* Top Header Navigation */}
      <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight">
            Elevate<span className="text-[#f59e0b]">Flow</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
            v1.0.0
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-widest text-[#f59e0b] mb-4 bg-[#18181b] px-3 py-1 rounded-full border border-[#27272a]">
          Enterprise Workflow Authority
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#fafafa] max-w-3xl leading-[1.08] mb-6">
          Controlled Document Approval. <br />
          <span className="text-[#a1a1aa]">Zero Shortcuts.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#a1a1aa] max-w-2xl font-normal leading-relaxed mb-10">
          The platform that guarantees every document is reviewed, every action is authorized,
          and every change is permanently recorded before anything goes public.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-[#f59e0b] text-[#09090b] font-medium hover:bg-[#fbbf24] transition-all shadow-lg shadow-[#f59e0b]/10 text-sm"
          >
            Access Portal
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg bg-[#1f1f23] text-[#fafafa] font-medium border border-[#3f3f46] hover:bg-[#27272a] transition-all text-sm"
          >
            System Specs
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] py-8 text-center text-xs font-mono text-[#71717a]">
        ElevateFlow Workflow Engine — Built for Precision & Consistency
      </footer>
    </div>
  );
}
