import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/signout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FileText,
  Search,
  BookOpen,
  Settings,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleBadgeClasses: Record<string, string> = {
    author: "text-state-draft bg-state-draft-bg",
    reviewer: "text-state-submitted bg-state-submitted-bg",
    admin: "text-primary bg-primary-muted/30",
    viewer: "text-ink-subtle bg-surface-3",
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* ── Header (64px) ── */}
      <header className="h-16 border-b border-hairline bg-canvas/90 backdrop-blur-xl sticky top-0 z-40 px-5 sm:px-6 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="font-display text-[24px] sm:text-[28px] font-extrabold tracking-tight text-ink"
          >
            Elevate<span className="text-primary">Flow</span>
          </Link>
        </div>

        {/* Right: User identity & Theme */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-[12px] font-medium text-ink">
              {user.name.charAt(0)}
            </div>
            {/* Name + Email */}
            <div className="hidden sm:block text-left">
              <div className="text-[13px] font-medium text-ink leading-none">
                {user.name}
              </div>
              <div className="font-mono text-[10px] text-ink-subtle leading-tight mt-0.5">
                {user.email}
              </div>
            </div>
            {/* Role badge */}
            <span
              className={`eyebrow text-[10px] px-2 py-0.5 rounded-md ${
                roleBadgeClasses[user.role] || roleBadgeClasses.viewer
              }`}
            >
              {user.role}
            </span>
          </div>

          <SignOutButton />
        </div>
      </header>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex-1 flex">
        {/* Sidebar (240px) */}
        <aside className="w-60 border-r border-hairline bg-surface-1/50 px-3 py-4 space-y-5 flex-shrink-0 hidden md:flex md:flex-col">
          {/* Workflow section */}
          <div className="space-y-0.5">
            <div className="eyebrow text-[10px] text-ink-subtle px-2.5 mb-2">
              Workflow
            </div>

            {(user.role === "author" || user.role === "admin") && (
              <SidebarLink href="/documents" icon={FileText} label="My documents" />
            )}

            {(user.role === "reviewer" || user.role === "admin") && (
              <SidebarLink href="/review" icon={Search} label="Review queue" />
            )}

            <SidebarLink href="/published" icon={BookOpen} label="Published library" />
          </div>

          {/* System section */}
          {user.role === "admin" && (
            <div className="space-y-0.5">
              <div className="eyebrow text-[10px] text-ink-subtle px-2.5 mb-2">
                System
              </div>
              <SidebarLink href="/admin" icon={Settings} label="Admin console" />
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-5 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href as any}
      className="group flex items-center gap-2.5 px-2.5 py-[7px] text-[13px] font-medium rounded-lg text-ink-muted hover:text-ink hover:bg-surface-3 transition-theme"
    >
      <Icon className="w-4 h-4 text-ink-subtle group-hover:text-ink-muted transition-theme" />
      {label}
    </Link>
  );
}
