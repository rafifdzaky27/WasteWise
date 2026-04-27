"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

interface UserProfileProps {
  fullName: string;
  role: string;
}

export default function UserProfile({ fullName, role }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-stone-100 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
          {fullName.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {fullName || "User"}
          </p>
          <p className="text-xs text-muted capitalize">{role || "warga"}</p>
        </div>
        <div className="text-muted shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-stone-border rounded-xl shadow-lg p-2 animate-fade-in-up z-50">
          <button
            onClick={() => { setIsOpen(false); /* Add edit profile logic later */ }}
            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-stone-50 rounded-lg transition-colors"
          >
            Ubah Profil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium mt-1"
          >
            Keluar
          </button>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}
