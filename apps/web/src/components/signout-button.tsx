"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
      className="text-xs font-mono text-[#a1a1aa] hover:text-[#f43f5e] transition-colors border border-[#27272a] px-2.5 py-1 rounded bg-[#18181b]"
    >
      Sign Out
    </button>
  );
}
