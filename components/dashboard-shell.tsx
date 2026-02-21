"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { getAvatarColor } from "@/lib/avatar-color";
import Sidebar from "./sidebar";
import { SearchDialog } from "./search-dialog";

interface DashboardShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  projects: Array<{ id: string; name: string; color: string }>;
  teams: Array<{ id: string; name: string; _count: { projects: number } }>;
  unreadCount: number;
  children: React.ReactNode;
}

export default function DashboardShell({
  user,
  projects,
  teams,
  unreadCount,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = (name?: string | null) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  return (
    <div className="flex h-screen bg-[#141414] overflow-hidden">
      <Sidebar
        user={user}
        projects={projects}
        teams={teams}
        unreadCount={unreadCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-12 flex items-center px-4 gap-3 bg-[#141414] border-b border-white/5 shrink-0">
          {/* Hamburger – mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-auto">
            <SearchDialog />
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold select-none"
              style={{ backgroundColor: getAvatarColor(user.name ?? "") }}
            >
              {initials(user.name)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
