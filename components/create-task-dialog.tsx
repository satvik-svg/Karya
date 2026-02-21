"use client";

import { useState } from "react";
import { createTask } from "@/lib/actions/tasks";
import { X, Loader2 } from "lucide-react";

interface Props {
  projectId: string;
  sectionId: string;
  sections: Array<{ id: string; name: string }>;
  teamMembers: Array<{ id: string; name: string; email: string }>;
  onClose: () => void;
}

export function CreateTaskDialog({
  projectId,
  sectionId,
  sections,
  teamMembers,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    formData.set("projectId", projectId);
    const result = await createTask(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#1C1C1E] border border-white/8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Create Task</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/8 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm rounded-lg p-3 mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Title *
            </label>
            <input
              name="title"
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-[#6B7A2A] focus:border-transparent outline-none text-sm"
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-[#6B7A2A] focus:border-transparent outline-none text-sm resize-none"
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Section
              </label>
              <select
                name="sectionId"
                defaultValue={sectionId}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B7A2A] focus:border-transparent outline-none text-sm"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Assignee
              </label>
              <select
                name="assigneeId"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B7A2A] focus:border-transparent outline-none text-sm"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Priority
              </label>
              <select
                name="priority"
                defaultValue="medium"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B7A2A] focus:border-transparent outline-none text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Due Date
              </label>
              <input
                name="dueDate"
                type="date"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B7A2A] focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium text-gray-300 bg-white/8 rounded-xl hover:bg-white/12 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm font-medium text-white bg-[#6B7A2A] rounded-xl hover:bg-[#8B9A35] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
