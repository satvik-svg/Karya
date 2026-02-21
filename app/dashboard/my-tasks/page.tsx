import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MyTasksList } from "@/components/my-tasks-list";

export default async function MyTasksPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const tasks = await prisma.task.findMany({
    where: { assigneeId: userId },
    include: {
      project: { select: { id: true, name: true, color: true } },
      section: { select: { name: true } },
      _count: { select: { comments: true, attachments: true } },
    },
    orderBy: [
      { completed: "asc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Tasks</h1>
        <p className="text-gray-400 mt-1">
          Tasks assigned to you across all projects
        </p>
      </div>

      <MyTasksList tasks={tasks} />
      </div>
    </div>
  );
}
