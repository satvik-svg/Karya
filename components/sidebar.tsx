"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  Users,
  LogOut,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Inbox,
  Target,
  Briefcase,
  BarChart3,
  Plus,
  X,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "./search-dialog";
import { getAvatarColor } from "@/lib/avatar-color";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  projects: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  teams: Array<{
    id: string;
    name: string;
    _count: { projects: number };
  }>;
  unreadCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, projects, teams, unreadCount = 0, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [teamsOpen, setTeamsOpen] = useState(true);

  const topNavItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/my-tasks", label: "My tasks", icon: CheckSquare },
    { href: "/dashboard/inbox", label: "Inbox", icon: Inbox, badge: unreadCount },
  ];

  const insightItems = [
    { href: "/dashboard/reporting", label: "Reporting", icon: BarChart3 },
    { href: "/dashboard/portfolios", label: "Portfolios", icon: Briefcase },
    { href: "/dashboard/goals", label: "Goals", icon: Target },
  ];

  const initials = (name?: string | null) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-[240px] bg-[#1C1C1E] flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Top: logo + close (mobile) */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" width={28} height={28} className="rounded-lg object-cover" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-2 pb-1">
          <SearchDialog />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {/* Top nav */}
          {topNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {"badge" in item && item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[11px] bg-[#6B7A2A] text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Insights section */}
          <div className="pt-4">
            <p className="px-3 pb-1 text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
              Insights
            </p>
            {insightItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Projects section */}
          <div className="pt-4">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-semibold text-gray-600 uppercase tracking-widest hover:text-gray-400 transition"
            >
              <span>Projects</span>
              <div className="flex items-center gap-1">
                <span className="p-0.5 rounded hover:bg-white/10 transition">
                  <Plus className="w-3 h-3" />
                </span>
                {projectsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </div>
            </button>

            {projectsOpen && (
              <div className="mt-0.5 space-y-0.5">
                {projects.length === 0 && (
                  <p className="px-3 py-2 text-[12px] text-gray-600">No projects yet</p>
                )}
                {projects.map((project) => {
                  const isActive = pathname === `/dashboard/projects/${project.id}`;
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition ${
                        isActive
                          ? "bg-white/10 text-white font-medium"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: getAvatarColor(project.id) }}
                      >
                        {project.name[0].toUpperCase()}
                      </div>
                      <span className="truncate">{project.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Teams section */}
          {teams.length > 0 && (
            <div className="pt-4">
              <button
                onClick={() => setTeamsOpen(!teamsOpen)}
                className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-semibold text-gray-600 uppercase tracking-widest hover:text-gray-400 transition"
              >
                <span>Teams</span>
                {teamsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {teamsOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {teams.map((team) => {
                    const isActive = pathname === `/dashboard/team`;
                    return (
                      <Link
                        key={team.id}
                        href="/dashboard/team"
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition ${
                          isActive
                            ? "bg-white/10 text-white font-medium"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Users className="w-4 h-4 shrink-0" />
                        <span className="truncate">{team.name}</span>
                        <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-3 space-y-1 border-t border-white/5 pt-2">
          <button
            className="flex items-center gap-2.5 w-full px-3 py-[7px] rounded-lg text-[13px] text-gray-400 hover:bg-white/5 hover:text-white transition"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ backgroundColor: getAvatarColor(user.name ?? "") }}
            >
              {initials(user.name)}
            </div>
            <span className="flex-1 truncate text-left">{user.name}</span>
            <LogOut className="w-3.5 h-3.5 shrink-0 opacity-60" />
          </button>

          <button className="flex items-center gap-2.5 w-full px-3 py-[7px] rounded-lg text-[13px] text-gray-400 hover:bg-white/5 hover:text-white transition">
            <UserPlus className="w-4 h-4 shrink-0" />
            Invite teammates
          </button>
        </div>
      </aside>
    </>
  );
}
