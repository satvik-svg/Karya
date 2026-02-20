"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getCurrentUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function createPortfolio(data: {
  name: string;
  description?: string;
  teamId: string;
  color?: string;
}) {
  await getCurrentUserId();

  const portfolio = await prisma.portfolio.create({
    data: {
      name: data.name,
      description: data.description || null,
      teamId: data.teamId,
      color: data.color || "#6366f1",
    },
  });

  revalidatePath("/dashboard/portfolios");
  return { success: true, portfolio };
}

export async function updatePortfolio(portfolioId: string, data: {
  name?: string;
  description?: string;
  color?: string;
}) {
  await prisma.portfolio.update({
    where: { id: portfolioId },
    data,
  });

  revalidatePath("/dashboard/portfolios");
  return { success: true };
}

export async function deletePortfolio(portfolioId: string) {
  await prisma.portfolio.delete({ where: { id: portfolioId } });
  revalidatePath("/dashboard/portfolios");
  return { success: true };
}

export async function addProjectToPortfolio(portfolioId: string, projectId: string) {
  await prisma.portfolioProject.create({
    data: { portfolioId, projectId },
  });
  revalidatePath("/dashboard/portfolios");
  return { success: true };
}

export async function removeProjectFromPortfolio(portfolioId: string, projectId: string) {
  await prisma.portfolioProject.deleteMany({
    where: { portfolioId, projectId },
  });
  revalidatePath("/dashboard/portfolios");
  return { success: true };
}

export async function getPortfolios() {
  const userId = await getCurrentUserId();

  const teams = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  const teamIds = teams.map((t: { teamId: string }) => t.teamId);

  return prisma.portfolio.findMany({
    where: { teamId: { in: teamIds } },
    include: {
      team: { select: { name: true } },
      projects: {
        include: {
          project: {
            include: {
              _count: { select: { tasks: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPortfolio(portfolioId: string) {
  return prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: {
      team: { select: { id: true, name: true } },
      projects: {
        include: {
          project: {
            include: {
              _count: { select: { tasks: true } },
              creator: { select: { name: true } },
              tasks: {
                select: { completed: true },
              },
            },
          },
        },
      },
    },
  });
}
