"use client";

import { useState, useTransition } from "react";
import { getAvatarColor } from "@/lib/avatar-color";
import { format, isPast, isToday } from "date-fns";
import { updateTask } from "@/lib/actions/tasks";
import {
  MessageSquare,
  Paperclip,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  completed: boolean;
  assignee: { id: string; name: string; avatar: string | null; email: string } | null;
  _count: { comments: number; attachments: number };
}

interface Props {
  task: Task;
  onClick: () => void;
}

const PRIORITY_STYLES: Record<string, { color: string; icon: typeof AlertCircle }> = {
  urgent: { color: "text-red-500", icon: AlertCircle },
  high: { color: "text-orange-500", icon: AlertCircle },
  medium: { color: "text-yellow-500", icon: Clock },
  low: { color: "text-blue-400", icon: Circle },
};

export function TaskCard({ task, onClick }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(task.completed);
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const PriorityIcon = priority.icon;
  const hasDueDate = task.dueDate;
  const isOverdue = hasDueDate && isPast(new Date(task.dueDate!)) && !isToday(new Date(task.dueDate!));
  const isDueToday = hasDueDate && isToday(new Date(task.dueDate!));

  function handleToggleComplete(e: React.MouseEvent) {
    e.stopPropagation();
    const newVal = !optimisticCompleted;
    setOptimisticCompleted(newVal);
    startTransition(async () => {
      await updateTask(task.id, { completed: newVal });
    });
  }

  return (
    <div
      onClick={onClick}
      className="bg-[#1C1C1E] rounded-lg border border-white/8 p-3 cursor-pointer hover:shadow-md hover:border-white/15 transition group"
    >
      {/* Title */}
      <div className="flex items-start gap-2">
        <button
          onClick={handleToggleComplete}
          className={`mt-0.5 shrink-0 ${optimisticCompleted ? "text-green-500" : "text-gray-300 hover:text-gray-400"}`}
        >
          {optimisticCompleted ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>
        <span
          className={`text-sm font-medium ${
            optimisticCompleted ? "line-through text-gray-400" : "text-white"
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-gray-400 mt-1.5 ml-6 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 ml-6">
        {/* Priority */}
        <div className={`flex items-center gap-1 ${priority.color}`}>
          <PriorityIcon className="w-3 h-3" />
          <span className="text-xs capitalize">{task.priority}</span>
        </div>

        {/* Due date */}
        {hasDueDate && (
          <div
            className={`flex items-center gap-1 text-xs ${
              isOverdue
                ? "text-red-500"
                : isDueToday
                ? "text-orange-500"
                : "text-gray-400"
            }`}
          >
            <Calendar className="w-3 h-3" />
            {isOverdue
              ? "Overdue"
              : isDueToday
              ? "Today"
              : format(new Date(task.dueDate!), "MMM d")}
          </div>
        )}

        {/* Comment count */}
        {task._count.comments > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MessageSquare className="w-3 h-3" />
            {task._count.comments}
          </div>
        )}

        {/* Attachment count */}
        {task._count.attachments > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Paperclip className="w-3 h-3" />
            {task._count.attachments}
          </div>
        )}

        {/* Spacer + Assignee */}
        <div className="flex-1" />
        {task.assignee && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium"
            style={{ backgroundColor: getAvatarColor(task.assignee.name) }}
            title={task.assignee.name}
          >
            {task.assignee.name[0].toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
