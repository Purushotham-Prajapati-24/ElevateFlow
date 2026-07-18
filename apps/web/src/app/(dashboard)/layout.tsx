import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/signout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleBadges: Record<string, string> = {
    author: "bg-[#1e293b] text-[#94a3b8] border-[#334155]",
    reviewer: "bg-[#1e3a5f] text-[#3b82f6] border-[#1d4ed8]",
    admin: "bg-[#451a03] text-[#f59e0b] border-[#78350f]",
    viewer: "bg-[#27272a] text-[#71717a] border-[#3f3f46]",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Header */}
      <header className="h-14 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/documents" className="font-bold text-lg tracking-tight text-[#fafafa]">
            Elevate<span className="text-[#f59e0b]">Flow</span>
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
            Workflow Engine
          </span>
        </div>

        {/* User Identity & Role Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center font-semibold text-xs text-[#fafafa]">
              {user.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-[#fafafa] leading-none">
                {user.name}
              </div>
              <div className="text-[10px] text-[#71717a] font-mono leading-tight">
                {user.email}
              </div>
            </div>
            <span
              className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ml-1 ${
                roleBadges[user.role] || roleBadges.viewer
              }`}
            >
              {user.role}
            </span>
          </div>

          <SignOutButton />
        </div>
      </header>

      {/* App Body: Sidebar + Main Content */}
      <div className="flex-1 flex">
        {/* Fixed 240px Sidebar */}
        <aside className="w-60 border-r border-[#27272a] bg-[#18181b]/50 p-4 space-y-6 flex-shrink-0 hidden md:block">
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#71717a] mb-2">
              DOCUMENT WORKFLOW
            </div>

            {/* Author Nav */}
            {(user.role === "author" || user.role === "admin") && (
              <Link
                href="/documents"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
              >
                <span>📄</span> My Documents
              </Link>
            )}

            {/* Reviewer Nav */}
            {(user.role === "reviewer" || user.role === "admin") && (
              <Link
                href="/review"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
              >
                <span>🔍</span> Review Queue
              </Link>
            )}

            {/* All Roles Nav */}
            <Link
              href="/published"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
            >
              <span>📚</span> Published Library
            </Link>

            {/* Admin Nav */}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors"
              >
                <span>⚙️</span> Admin Console
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
