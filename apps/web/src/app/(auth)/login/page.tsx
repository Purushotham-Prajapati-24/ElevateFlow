"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

const SEEDED_PERSONAS = [
  {
    role: "Author",
    name: "Alice",
    email: "alice@elevateflow.dev",
    badgeColor: "bg-[#1e293b] text-[#94a3b8] border-[#334155]",
  },
  {
    role: "Reviewer",
    name: "Bob",
    email: "bob@elevateflow.dev",
    badgeColor: "bg-[#1e3a5f] text-[#3b82f6] border-[#1d4ed8]",
  },
  {
    role: "Admin",
    name: "Charlie",
    email: "charlie@elevateflow.dev",
    badgeColor: "bg-[#451a03] text-[#f59e0b] border-[#78350f]",
  },
  {
    role: "Viewer",
    name: "Vera",
    email: "vera@elevateflow.dev",
    badgeColor: "bg-[#27272a] text-[#71717a] border-[#3f3f46]",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid credentials. Please check your email and password.");
        setIsLoading(false);
        return;
      }

      router.push("/documents" as any);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSelectPersona = (personaEmail: string) => {
    setEmail(personaEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 py-12 hero-glow">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-bold text-2xl tracking-tight text-[#fafafa]">
              Elevate<span className="text-[#f59e0b]">Flow</span>
            </span>
          </Link>
          <div className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">
            AUTHENTICATION PORTAL
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-[#27272a] pb-4">
            <h2 className="text-lg font-semibold text-[#fafafa]">Sign In</h2>
            <p className="text-xs text-[#a1a1aa]">
              Enter your credentials to access the document workflow engine.
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs bg-[#450a0a] border border-[#7f1d1d] text-[#fca5a5] rounded-md font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@elevateflow.dev"
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-md text-sm text-[#fafafa] placeholder-[#52525b] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-md text-sm text-[#fafafa] placeholder-[#52525b] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#f59e0b] hover:bg-[#fbbf24] disabled:opacity-50 text-[#09090b] font-medium text-sm rounded-md transition-colors shadow-md shadow-[#f59e0b]/10 flex items-center justify-center gap-2"
            >
              {isLoading ? "Authenticating..." : "Sign In to Engine"}
            </button>
          </form>

          {/* Quick persona select helper for demo/testing */}
          <div className="border-t border-[#27272a] pt-4 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] text-center">
              Quick Persona Fill (Dev Mode)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SEEDED_PERSONAS.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleSelectPersona(p.email)}
                  className={`p-2 rounded border text-left text-xs transition-colors hover:brightness-125 ${p.badgeColor}`}
                >
                  <div className="font-semibold text-current">{p.name}</div>
                  <div className="text-[10px] opacity-80">{p.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[#71717a] font-mono">
          Strict Role Authorization Enabled — AGENTS.md Contract
        </div>
      </div>
    </div>
  );
}
