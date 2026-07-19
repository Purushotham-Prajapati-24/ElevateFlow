"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const SEEDED_PERSONAS = [
  {
    role: "Author",
    name: "Alice",
    email: "alice@elevateflow.dev",
    color: "text-state-draft",
    bg: "bg-state-draft-bg",
  },
  {
    role: "Reviewer",
    name: "Bob",
    email: "bob@elevateflow.dev",
    color: "text-state-submitted",
    bg: "bg-state-submitted-bg",
  },
  {
    role: "Admin",
    name: "Charlie",
    email: "charlie@elevateflow.dev",
    color: "text-primary",
    bg: "bg-primary-muted/30",
  },
  {
    role: "Viewer",
    name: "Vera",
    email: "vera@elevateflow.dev",
    color: "text-ink-subtle",
    bg: "bg-surface-3",
  },
] as const;

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
        setError(
          signInError.message ||
            "Invalid credentials. Please check your email and password."
        );
        setIsLoading(false);
        return;
      }

      router.push("/documents" as any);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleSelectPersona = (personaEmail: string) => {
    setEmail(personaEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12 hero-glow">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-1">
          <Link href="/" className="inline-block">
            <span className="font-display text-[26px] sm:text-[32px] font-extrabold tracking-tight text-ink">
              Elevate<span className="text-primary">Flow</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Card */}
        <div className="card-highlight bg-surface-1 border border-hairline rounded-xl p-6 space-y-5">
          <div className="border-b border-hairline pb-4">
            <h2 className="text-[16px] font-semibold text-ink">Sign in</h2>
            <p className="text-[13px] text-ink-muted mt-1">
              Enter credentials to access the workflow engine.
            </p>
          </div>

          {error && (
            <div className="p-3 text-[12px] bg-error-bg border border-error/20 text-error rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="eyebrow text-ink-muted mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@elevateflow.dev"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-focus focus:outline-none rounded-lg text-[14px] text-ink placeholder-ink-disabled transition-theme"
              />
            </div>

            <div>
              <label className="eyebrow text-ink-muted mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-surface-2 border border-hairline focus:border-hairline-focus focus:outline-none rounded-lg text-[14px] text-ink placeholder-ink-disabled transition-theme"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary font-medium text-[14px] rounded-lg transition-theme flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Persona selector */}
          <div className="border-t border-hairline pt-4 space-y-3">
            <div className="eyebrow text-ink-subtle text-center">
              Quick persona fill
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SEEDED_PERSONAS.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleSelectPersona(p.email)}
                  className={`${p.bg} p-2.5 rounded-lg text-left transition-theme hover:brightness-110 border border-hairline`}
                >
                  <div className={`text-[13px] font-medium ${p.color}`}>
                    {p.name}
                  </div>
                  <div className="eyebrow text-[10px] text-ink-subtle mt-0.5">
                    {p.role}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="eyebrow text-ink-subtle text-center">
          Strict role authorization enabled
        </div>
      </div>
    </div>
  );
}
