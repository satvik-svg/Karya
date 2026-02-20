import { auth } from "@/lib/auth";
import { getIdeas } from "@/lib/actions/ideas";
import { getTeams } from "@/lib/actions/teams";
import { IdeasBoard } from "@/components/ideas-board";
import { redirect } from "next/navigation";

export default async function IdeasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [ideas, teams] = await Promise.all([getIdeas(), getTeams()]);

  return (
    <div className="p-8 max-w-5xl w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ideas</h1>
        <p className="text-gray-500 mt-1">
          Share ideas with your team &mdash; vote, discuss, and build together
        </p>
      </div>
      <IdeasBoard
        ideas={JSON.parse(JSON.stringify(ideas))}
        teams={JSON.parse(JSON.stringify(teams.map((t) => ({ id: t.id, name: t.name }))))}
        currentUserId={session.user.id}
      />
    </div>
  );
}
