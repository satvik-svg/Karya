"use client";

import { useState } from "react";
import { createProject } from "@/lib/actions/projects";
import { Plus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const COLORS = [
  "#6B7A2A", "#8B9A35", "#4A5420", "#22c55e",
  "#14b8a6", "#0ea5e9", "#f97316", "#ec4899",
  "#f43f5e", "#6b7280",
];

interface Props {
  teams: Array<{ id: string; name: string }>;
  asCard?: boolean;
}

export function CreateProjectDialog({ teams, asCard }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set("color", selectedColor);
    const result = await createProject(formData);
    setLoading(false);
    if (result?.projectId) {
      setOpen(false);
      router.push(`/dashboard/projects/${result.projectId}`);
    }
  }

  const trigger = asCard ? (
    <button
      onClick={() => setOpen(true)}
      className="bg-white/5 border border-white/8 border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition min-h-[80px] w-full"
    >
      <div className="w-8 h-8 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
        <Plus className="w-4 h-4 text-gray-500" />
      </div>
      <span className="text-[12px] text-gray-500">Create project</span>
    </button>
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8B9A35] bg-[#6B7A2A]/10 rounded-lg hover:bg-[#6B7A2A]/20 transition"
    >
      <Plus className="w-4 h-4" />
      New Project
    </button>
  );

  return (
    <>
      {trigger}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold text-white">New Project</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-400 mb-1.5">
                  Project name
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#6B7A2A] focus:border-[#6B7A2A] outline-none text-[14px] text-white placeholder:text-gray-600"
                  placeholder="e.g., Website Redesign"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-400 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#6B7A2A] focus:border-[#6B7A2A] outline-none text-[14px] text-white placeholder:text-gray-600 resize-none"
                  placeholder="What's this project about?"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-400 mb-1.5">
                  Team
                </label>
                <select
                  name="teamId"
                  required
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#6B7A2A] outline-none text-[14px] text-white"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id} className="bg-[#1C1C1E]">
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-400 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-lg transition ring-2 ring-offset-2 ring-offset-[#1C1C1E] ${
                        selectedColor === color ? "ring-white/60" : "ring-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 text-[14px] font-medium text-gray-400 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-[14px] font-medium text-white bg-[#6B7A2A] hover:bg-[#7A8B30] rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
