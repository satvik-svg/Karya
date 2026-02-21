import { getPortfolios } from "@/lib/actions/portfolios";
import { getTeams } from "@/lib/actions/teams";
import { PortfoliosList } from "@/components/portfolios-list";

export default async function PortfoliosPage() {
  const [portfolios, teams] = await Promise.all([getPortfolios(), getTeams()]);

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Portfolios</h1>
        <p className="text-gray-400 mt-1">Group and monitor multiple projects together</p>
      </div>
      <PortfoliosList
        portfolios={JSON.parse(JSON.stringify(portfolios))}
        teams={JSON.parse(JSON.stringify(teams))}
      />
      </div>
    </div>
  );
}
