"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";

async function getCurrentUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function createSubtask(taskId: string, title: string) {
  const userId = await getCurrentUserId();

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return { error: "Task not found" };

  const lastSubtask = await prisma.subtask.findFirst({
    where: { taskId },
    orderBy: { order: "desc" },
  });

  const subtask = await prisma.subtask.create({
    data: {
      title,
      taskId,
      order: (lastSubtask?.order ?? -1) + 1,
    },
  });

  after(() =>
    prisma.activityLog.create({
      data: { action: "subtask_added", details: JSON.stringify({ subtaskTitle: title }), taskId, userId },
    })
  );

  revalidateTag(`project-${task.projectId}`, "max");
  revalidatePath(`/dashboard/projects/${task.projectId}`);
  return { success: true, subtask };
}

export async function toggleSubtask(subtaskId: string) {
  const userId = await getCurrentUserId();

  const subtask = await prisma.subtask.findUnique({
    where: { id: subtaskId },
    include: { task: true },
  });
  if (!subtask) return { error: "Subtask not found" };

  await prisma.subtask.update({
    where: { id: subtaskId },
    data: { completed: !subtask.completed },
  });

  after(() =>
    prisma.activityLog.create({
      data: {
        action: subtask.completed ? "subtask_uncompleted" : "subtask_completed",
        details: JSON.stringify({ subtaskTitle: subtask.title }),
        taskId: subtask.taskId,
        userId,
      },
    })
  );

  revalidateTag(`project-${subtask.task.projectId}`, "max");
  revalidatePath(`/dashboard/projects/${subtask.task.projectId}`);
  return { success: true };
}

export async function deleteSubtask(subtaskId: string) {
  const subtask = await prisma.subtask.findUnique({
    where: { id: subtaskId },
    include: { task: true },
  });
  if (!subtask) return { error: "Subtask not found" };

  await prisma.subtask.delete({ where: { id: subtaskId } });
  revalidateTag(`project-${subtask.task.projectId}`, "max");
  revalidatePath(`/dashboard/projects/${subtask.task.projectId}`);
  return { success: true };
}

export async function updateSubtask(subtaskId: string, data: { title?: string; assigneeId?: string | null }) {
  const subtask = await prisma.subtask.findUnique({
    where: { id: subtaskId },
    include: { task: true },
  });
  if (!subtask) return { error: "Subtask not found" };

  await prisma.subtask.update({
    where: { id: subtaskId },
    data,
  });

  revalidateTag(`project-${subtask.task.projectId}`, "max");
  revalidatePath(`/dashboard/projects/${subtask.task.projectId}`);
  return { success: true };
}

export async function getSubtasks(taskId: string) {
  return prisma.subtask.findMany({
    where: { taskId },
    orderBy: { order: "asc" },
    include: {
      assignee: { select: { id: true, name: true, avatar: true } },
    },
  });
}
