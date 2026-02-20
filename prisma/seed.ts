import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@anant.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@anant.com",
      hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "alice@anant.com" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@anant.com",
      hashedPassword,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "bob@anant.com" },
    update: {},
    create: {
      name: "Bob Smith",
      email: "bob@anant.com",
      hashedPassword,
    },
  });

  console.log("✅ Users created");

  // Create team
  const team = await prisma.team.create({
    data: {
      name: "Product Team",
      members: {
        create: [
          { userId: user.id, role: "owner" },
          { userId: user2.id, role: "admin" },
          { userId: user3.id, role: "member" },
        ],
      },
    },
  });

  console.log("✅ Team created");

  // Create project 1: Website Redesign
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Redesign the marketing website for Q1 launch",
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
    include: { sections: true },
  });

  // Add tasks to project 1
  const sections1 = project1.sections;
  const todo = sections1.find((s: { name: string }) => s.name === "To Do")!;
  const inProgress = sections1.find((s: { name: string }) => s.name === "In Progress")!;
  const done = sections1.find((s: { name: string }) => s.name === "Done")!;

  const tasks = [
    { title: "Design homepage mockup", description: "Create Figma mockup for the new homepage layout", sectionId: inProgress.id, assigneeId: user2.id, priority: "high", dueDate: new Date("2026-03-01"), order: 0 },
    { title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated deployment", sectionId: todo.id, assigneeId: user3.id, priority: "medium", dueDate: new Date("2026-03-10"), order: 0 },
    { title: "Write homepage copy", description: "Draft compelling copy for the hero section and features", sectionId: todo.id, assigneeId: user.id, priority: "high", dueDate: new Date("2026-02-28"), order: 1 },
    { title: "Implement responsive nav", description: "Build the responsive navigation component", sectionId: inProgress.id, assigneeId: user.id, priority: "medium", dueDate: new Date("2026-03-05"), order: 1 },
    { title: "Create brand guidelines doc", description: null, sectionId: done.id, assigneeId: user2.id, priority: "low", completed: true, order: 0 },
    { title: "Set up analytics tracking", description: "Integrate Google Analytics and event tracking", sectionId: todo.id, assigneeId: null, priority: "low", dueDate: new Date("2026-03-15"), order: 2 },
    { title: "User research interviews", description: "Conduct 5 user interviews for feedback on current site", sectionId: done.id, assigneeId: user3.id, priority: "high", completed: true, order: 1 },
    { title: "Design footer section", description: "Footer with newsletter signup and social links", sectionId: todo.id, assigneeId: user2.id, priority: "medium", dueDate: new Date("2026-03-08"), order: 3 },
  ];

  for (const task of tasks) {
    const createdTask = await prisma.task.create({
      data: {
        ...task,
        projectId: project1.id,
        creatorId: user.id,
        completed: task.completed || false,
      },
    });

    // Add some comments to the first few tasks
    if (tasks.indexOf(task) < 3) {
      await prisma.comment.create({
        data: {
          content: "Looking good! Let's discuss this in our next standup.",
          taskId: createdTask.id,
          authorId: user2.id,
        },
      });
      await prisma.comment.create({
        data: {
          content: "I've started working on this. Will update by EOD.",
          taskId: createdTask.id,
          authorId: user.id,
        },
      });
    }
  }

  console.log("✅ Project 1 with tasks created");

  // Create project 2: Mobile App
  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App v2",
      description: "Build the next version of our mobile application",
      color: "#ec4899",
      teamId: team.id,
      creatorId: user.id,
      sections: {
        create: [
          { name: "Backlog", order: 0 },
          { name: "Sprint", order: 1 },
          { name: "Review", order: 2 },
          { name: "Done", order: 3 },
        ],
      },
    },
    include: { sections: true },
  });

  const sections2 = project2.sections;
  const backlog = sections2.find((s: { name: string }) => s.name === "Backlog")!;
  const sprint = sections2.find((s: { name: string }) => s.name === "Sprint")!;
  const review = sections2.find((s: { name: string }) => s.name === "Review")!;
  const done2 = sections2.find((s: { name: string }) => s.name === "Done")!;

  const mobileTasks = [
    { title: "Push notification system", sectionId: sprint.id, assigneeId: user.id, priority: "urgent", dueDate: new Date("2026-02-25"), order: 0 },
    { title: "Dark mode support", sectionId: backlog.id, assigneeId: user3.id, priority: "medium", order: 0 },
    { title: "Offline data sync", sectionId: backlog.id, assigneeId: null, priority: "high", order: 1 },
    { title: "Biometric authentication", sectionId: review.id, assigneeId: user2.id, priority: "high", order: 0 },
    { title: "App store screenshots", sectionId: done2.id, assigneeId: user2.id, priority: "low", completed: true, order: 0 },
  ];

  for (const task of mobileTasks) {
    await prisma.task.create({
      data: {
        ...task,
        description: null,
        projectId: project2.id,
        creatorId: user.id,
        completed: task.completed || false,
      },
    });
  }

  console.log("✅ Project 2 with tasks created");

  // Create tags
  const tag1 = await prisma.tag.create({ data: { name: "Bug", color: "#ef4444" } });
  const tag2 = await prisma.tag.create({ data: { name: "Feature", color: "#3b82f6" } });
  const tag3 = await prisma.tag.create({ data: { name: "Design", color: "#8b5cf6" } });
  const tag4 = await prisma.tag.create({ data: { name: "Urgent", color: "#f59e0b" } });
  console.log("✅ Tags created");

  // Create goals
  await prisma.goal.create({
    data: {
      title: "Launch Website Redesign",
      description: "Complete and launch the new marketing website by end of Q1",
      status: "on_track",
      progress: 45,
      dueDate: new Date("2026-03-31"),
      ownerId: user.id,
    },
  });
  await prisma.goal.create({
    data: {
      title: "Ship Mobile App v2",
      description: "Release version 2 of the mobile app with push notifications and dark mode",
      status: "at_risk",
      progress: 20,
      dueDate: new Date("2026-06-30"),
      ownerId: user2.id,
    },
  });
  console.log("✅ Goals created");

  // Create a portfolio
  await prisma.portfolio.create({
    data: {
      name: "Q1 Initiatives",
      description: "All projects planned for Q1 2026",
      color: "#6366f1",
      teamId: team.id,
      projects: {
        create: [
          { projectId: project1.id },
          { projectId: project2.id },
        ],
      },
    },
  });
  console.log("✅ Portfolios created");

  console.log("");
  console.log("🎉 Seeding complete!");
  console.log("");
  console.log("📧 Demo login credentials:");
  console.log("   Email: demo@anant.com");
  console.log("   Password: password123");
  console.log("");
  console.log("   Other accounts: alice@anant.com, bob@anant.com (same password)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
