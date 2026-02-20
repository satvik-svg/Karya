"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getCurrentUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function getTeams() {
  const userId = await getCurrentUserId();
  return prisma.team.findMany({
    where: {
      members: { some: { userId } },
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      },
      _count: { select: { projects: true } },
    },
  });
}

export async function inviteToTeam(teamId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found" };

  const existing = await prisma.teamMember.findUnique({
    where: { userId_teamId: { userId: user.id, teamId } },
  });
  if (existing) return { error: "User already in team" };

  await prisma.teamMember.create({
    data: { userId: user.id, teamId, role: "member" },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeFromTeam(teamId: string, userId: string) {
  await prisma.teamMember.delete({
    where: { userId_teamId: { userId, teamId } },
  });
  revalidatePath("/dashboard");
}
