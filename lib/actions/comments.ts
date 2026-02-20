"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return { id: session.user.id, name: session.user.name || "Unknown" };
}

export async function addComment(taskId: string, content: string) {
  const user = await getCurrentUser();

  const comment = await prisma.comment.create({
    data: {
      content,
      taskId,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (task) {
    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "commented",
        details: JSON.stringify({ content: content.substring(0, 100) }),
        taskId,
        userId: user.id,
      },
    });

    // Notify task creator if someone else comments
    if (task.creatorId !== user.id) {
      await prisma.notification.create({
        data: {
          type: "commented",
          message: `${user.name} commented on "${task.title}"`,
          link: `/dashboard/projects/${task.projectId}`,
          userId: task.creatorId,
        },
      });
    }

    // Notify assignee if different from commenter and creator
    if (task.assigneeId && task.assigneeId !== user.id && task.assigneeId !== task.creatorId) {
      await prisma.notification.create({
        data: {
          type: "commented",
          message: `${user.name} commented on "${task.title}"`,
          link: `/dashboard/projects/${task.projectId}`,
          userId: task.assigneeId,
        },
      });
    }

    revalidatePath(`/dashboard/projects/${task.projectId}`);
  }

  return comment;
}

export async function deleteComment(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { task: true },
  });
  if (!comment) return;

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/dashboard/projects/${comment.task.projectId}`);
}

export async function addAttachment(taskId: string, data: {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}) {
  const user = await getCurrentUser();

  const attachment = await prisma.attachment.create({
    data: {
      ...data,
      taskId,
      uploadedById: user.id,
    },
  });

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (task) {
    await prisma.activityLog.create({
      data: {
        action: "attachment_added",
        details: JSON.stringify({ filename: data.filename }),
        taskId,
        userId: user.id,
      },
    });
    revalidatePath(`/dashboard/projects/${task.projectId}`);
  }

  return attachment;
}

export async function deleteAttachment(attachmentId: string) {
  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
    include: { task: true },
  });
  if (!attachment) return;

  await prisma.attachment.delete({ where: { id: attachmentId } });
  revalidatePath(`/dashboard/projects/${attachment.task.projectId}`);
}
