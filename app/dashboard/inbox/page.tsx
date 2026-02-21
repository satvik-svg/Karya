import { getNotifications } from "@/lib/actions/notifications";
import { InboxList } from "@/components/inbox-list";

export default async function InboxPage() {
  const notifications = await getNotifications();

  return (
    <div className="h-full overflow-auto bg-[#141414]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Inbox</h1>
        <p className="text-gray-400 mt-1">Your notifications and updates</p>
      </div>
      <InboxList notifications={JSON.parse(JSON.stringify(notifications))} />
      </div>
    </div>
  );
}
