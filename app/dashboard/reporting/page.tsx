import { getAnalytics } from "@/lib/actions/analytics";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export default async function ReportingPage() {
  const analytics = await getAnalytics();

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reporting</h1>
        <p className="text-gray-400 mt-1">Analytics and insights across your projects</p>
      </div>
      <AnalyticsDashboard data={analytics} />
      </div>
    </div>
  );
}
