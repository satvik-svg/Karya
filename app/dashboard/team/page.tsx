import { auth } from "@/lib/auth";
import { getTeams } from "@/lib/actions/teams";
import { TeamManagement } from "@/components/team-management";

export default async function TeamPage() {
  const session = await auth();
  const teams = await getTeams();

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <p className="text-gray-400 mt-1">Manage your team members and invitations</p>
      </div>

      <TeamManagement teams={teams} currentUserId={session!.user!.id!} />
      </div>
    </div>
  );
}
