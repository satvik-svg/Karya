"use client";

import { useMemo, useState } from "react";
import { KanbanBoard } from "./kanban-board";
import { ListView } from "./list-view";
import { TaskDetailModal } from "./task-detail-modal";
import { CreateTaskDialog } from "./create-task-dialog";
import { getAvatarColor } from "@/lib/avatar-color";
import {
  LayoutGrid,
  List,
  Plus,
  Filter,
  X,
  Search,
} from "lucide-react";

interface Section {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  order: number;
  completed: boolean;
  sectionId: string;
  projectId: string;
  assignee: { id: string; name: string; avatar: string | null; email: string } | null;
  _count: { comments: number; attachments: number };
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  sections: Section[];
  team: {
    members: Array<{ user: TeamMember }>;
  };
}

interface Props {
  project: Project;
  teamMembers: TeamMember[];
  currentUserId: string;
}

export function ProjectView({ project, teamMembers, currentUserId }: Props) {
  const [view, setView] = useState<"board" | "list">("board");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [defaultSectionId, setDefaultSectionId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterAssignee, setFilterAssignee] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState("");

  const hasActiveFilters = filterPriority || filterAssignee || filterStatus || filterSearch;

  const filteredSections = useMemo(() => {
    if (!hasActiveFilters) return project.sections;
    return project.sections.map((section) => ({
      ...section,
      tasks: section.tasks.filter((task) => {
        if (filterPriority && task.priority !== filterPriority) return false;
        if (filterAssignee === "unassigned" && task.assignee) return false;
        if (filterAssignee && filterAssignee !== "unassigned" && task.assignee?.id !== filterAssignee) return false;
        if (filterStatus === "completed" && !task.completed) return false;
        if (filterStatus === "incomplete" && task.completed) return false;
        if (filterSearch && !task.title.toLowerCase().includes(filterSearch.toLowerCase())) return false;
        return true;
      }),
    }));
  }, [project.sections, filterPriority, filterAssignee, filterStatus, filterSearch, hasActiveFilters]);

  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <div className="bg-[#1C1C1E] border-b border-white/8 px-4 sm:px-6 py-3">
        {/* Row 1: title + add task */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: project.color }}
          >
            {project.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-white truncate leading-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-xs text-gray-400 truncate">{project.description}</p>
            )}
          </div>

          {/* Members — hidden on mobile */}
          <div className="hidden sm:flex -space-x-2 shrink-0">
            {teamMembers.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ring-2 ring-[#1C1C1E]"
                style={{ backgroundColor: getAvatarColor(m.name) }}
                title={m.name}
              >
                {m.name[0].toUpperCase()}
              </div>
            ))}
            {teamMembers.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-gray-400 ring-2 ring-[#1C1C1E]">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>

          {/* Add task */}
          <button
            onClick={() => {
              setDefaultSectionId(project.sections[0]?.id || null);
              setShowCreateTask(true);
            }}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#6B7A2A] rounded-lg hover:bg-[#8B9A35] transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Row 2: view toggle + filter */}
        <div className="flex items-center gap-2 mt-3">
          {/* View toggle */}
          <div className="flex items-center bg-white/8 rounded-lg p-0.5">
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                view === "board"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                view === "list"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Members — mobile only, inline */}
          <div className="flex sm:hidden -space-x-2">
            {teamMembers.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium ring-2 ring-[#1C1C1E]"
                style={{ backgroundColor: getAvatarColor(m.name) }}
                title={m.name}
              >
                {m.name[0].toUpperCase()}
              </div>
            ))}
            {teamMembers.length > 2 && (
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium text-gray-400 ring-2 ring-[#1C1C1E]">
                +{teamMembers.length - 2}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
              hasActiveFilters
                ? "border-[#6B7A2A]/40 bg-[#6B7A2A]/15 text-[#8B9A35]"
                : "border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/5"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
            {hasActiveFilters && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterPriority("");
                  setFilterAssignee("");
                  setFilterStatus("");
                  setFilterSearch("");
                }}
                className="ml-1 hover:text-[#8B9A35]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </button>
        </div>

        {/* Filter selects row — shown below toolbar */}
        {showFilters && (
          <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Search tasks..."
                className="pl-7 pr-2 py-1 text-xs bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:ring-1 focus:ring-[#6B7A2A] outline-none w-36"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="shrink-0 px-2 py-1 text-xs bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-lg focus:ring-1 focus:ring-[#6B7A2A] outline-none"
            >
              <option value="">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="shrink-0 px-2 py-1 text-xs bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-lg focus:ring-1 focus:ring-[#6B7A2A] outline-none"
            >
              <option value="">All assignees</option>
              <option value="unassigned">Unassigned</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="shrink-0 px-2 py-1 text-xs bg-[#1C1C1E] border border-white/10 text-gray-300 rounded-lg focus:ring-1 focus:ring-[#6B7A2A] outline-none"
            >
              <option value="">All statuses</option>
              <option value="incomplete">Incomplete</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === "board" ? (
          <KanbanBoard
            sections={filteredSections}
            projectId={project.id}
            teamMembers={teamMembers}
            onTaskClick={setSelectedTaskId}
            onAddTask={(sectionId: string) => {
              setDefaultSectionId(sectionId);
              setShowCreateTask(true);
            }}
          />
        ) : (
          <ListView
            sections={filteredSections}
            projectId={project.id}
            teamMembers={teamMembers}
            onTaskClick={setSelectedTaskId}
          />
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          teamMembers={teamMembers}
          currentUserId={currentUserId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {/* Create Task Dialog */}
      {showCreateTask && defaultSectionId && (
        <CreateTaskDialog
          projectId={project.id}
          sectionId={defaultSectionId}
          sections={project.sections}
          teamMembers={teamMembers}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
}
