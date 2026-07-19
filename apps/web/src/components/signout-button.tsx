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
      className="p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-2 transition-theme"
      aria-label="Sign out"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
