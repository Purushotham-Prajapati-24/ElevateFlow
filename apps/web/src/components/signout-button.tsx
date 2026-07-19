"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-ink-muted hover:text-white hover:bg-error transition-theme group border border-hairline hover:border-error"
      aria-label="Sign out"
    >
      <LogOut className="w-3.5 h-3.5 text-ink-subtle group-hover:text-white transition-theme" />
      <span>Sign out</span>
    </button>
  );
}
