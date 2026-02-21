import { getGoals } from "@/lib/actions/goals";
import { GoalsList } from "@/components/goals-list";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Goals</h1>
        <p className="text-gray-400 mt-1">Track high-level objectives and their progress</p>
      </div>
      <GoalsList goals={JSON.parse(JSON.stringify(goals))} />
      </div>
    </div>
  );
}
