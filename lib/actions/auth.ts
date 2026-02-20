"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  // Create a default team for the user
  const team = await prisma.team.create({
    data: {
      name: `${name}'s Team`,
      members: {
        create: {
          userId: user.id,
          role: "owner",
        },
      },
    },
  });

  // Create a default project
  await prisma.project.create({
    data: {
      name: "My First Project",
      description: "Get started by adding tasks to this project",
      color: "#6366f1",
      teamId: team.id,
      creatorId: user.id,
      sections: {
        create: [
          { name: "To Do", order: 0 },
          { name: "In Progress", order: 1 },
          { name: "Done", order: 2 },
        ],
      },
    },
  });

  // Sign in the user
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error: unknown) {
    // NextAuth throws NEXT_REDIRECT on success, rethrow it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as Record<string, unknown>).digest === "string" &&
      ((error as Record<string, string>).digest.includes("NEXT_REDIRECT"))
    ) {
      throw error;
    }
    return { error: "Invalid credentials" };
  }
}
