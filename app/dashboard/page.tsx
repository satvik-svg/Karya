import { auth } from "@/lib/auth";
import { getProjects } from "@/lib/actions/projects";
import { getTeams } from "@/lib/actions/teams";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  CheckSquare,
  ChevronDown,
  UserPlus,
  Layers,
} from "lucide-react";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { getAvatarColor } from "@/lib/avatar-color";

type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  _count: { tasks: number };
  creator: { name: string; avatar: string | null };
};

export default async function DashboardPage() {
  const session = await auth();
  const [projects, teams] = await Promise.all([getProjects(), getTeams()]);

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const initials = (name?: string | null) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        {/* Date + greeting */}
        <div className="mb-6">
          <p className="text-[13px] text-gray-500 mb-1">{today}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-white">
              Good {getTimeOfDay()}, {firstName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 text-[12px] text-gray-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/10 transition">
                My week <ChevronDown className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-1.5 text-[12px] text-gray-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#8B9A35]" />
                <span>0 tasks completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-gray-400 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{projects.length} projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Tasks widget */}
        <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl mb-4 overflow-hidden">
          <div className="flex items-center gap-3 px-5 pt-5 pb-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
              style={{ backgroundColor: getAvatarColor(session?.user?.name || "") }}
            >
              {initials(session?.user?.name)}
            </div>
            <span className="text-[15px] font-semibold text-white flex-1">My tasks</span>
            <button className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 px-5 mt-3 border-b border-white/8">
            {["Upcoming", "Overdue", "Completed"].map((tab, i) => (
              <button
                key={tab}
                className={`text-[13px] pb-2.5 mr-5 border-b-2 transition ${
                  i === 0
                    ? "text-white border-white font-medium"
                    : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="px-5 py-4">
            <Link
              href="/dashboard/my-tasks"
              className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-300 transition w-fit"
            >
              <Plus className="w-4 h-4" />
              Create task
            </Link>
          </div>
        </div>

        {/* Projects + People row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Projects widget */}
          <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-white">Projects</h2>
                <button className="text-[12px] text-gray-500 bg-white/5 rounded-md px-2 py-0.5 hover:bg-white/10 transition flex items-center gap-1">
                  Recents <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <button className="p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Create project card */}
              {teams.length > 0 && (
                <CreateProjectDialog teams={teams} asCard />
              )}

              {/* Project cards */}
              {projects.slice(0, teams.length > 0 ? 3 : 4).map((project: Project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="group bg-white/5 border border-white/8 rounded-xl p-3 hover:bg-white/10 hover:border-white/15 transition"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[13px] mb-2"
                    style={{ backgroundColor: getAvatarColor(project.id) }}
                  >
                    {project.name[0].toUpperCase()}
                  </div>
                  <p className="text-[13px] font-medium text-white truncate">{project.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {project._count.tasks} task{project._count.tasks !== 1 ? "s" : ""}
                  </p>
                </Link>
              ))}

              {projects.length === 0 && teams.length === 0 && (
                <div className="col-span-2 py-6 text-center text-[13px] text-gray-600">
                  No projects yet
                </div>
              )}
            </div>
          </div>

          {/* People widget */}
          <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-white">People</h2>
                <button className="text-[12px] text-gray-500 bg-white/5 rounded-md px-2 py-0.5 hover:bg-white/10 transition flex items-center gap-1">
                  Frequent collaborators <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <button className="p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Invite card */}
              <Link
                href="/dashboard/team"
                className="bg-white/5 border border-white/8 border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition min-h-[80px]"
              >
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-[12px] text-gray-500">Invite</span>
              </Link>

              {/* Team members */}
              {teams.flatMap((t) => [t]).slice(0, 3).map((team) => (
                <Link
                  key={team.id}
                  href="/dashboard/team"
                  className="bg-white/5 border border-white/8 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition min-h-[80px]"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                    style={{ backgroundColor: getAvatarColor(team.name) }}
                  >
                    {team.name[0].toUpperCase()}
                  </div>
                  <span className="text-[12px] text-gray-300 truncate max-w-full text-center">{team.name}</span>
                </Link>
              ))}

              {teams.length === 0 && (
                <div className="col-span-1 flex flex-col items-center justify-center gap-1.5 min-h-[80px]">
                  <UserPlus className="w-5 h-5 text-gray-600" />
                  <span className="text-[12px] text-gray-600">No teammates yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
