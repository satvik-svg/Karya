import { auth } from "@/lib/auth";
import { getNotes } from "@/lib/actions/notes";
import { PersonalNotes } from "@/components/personal-notes";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notes = await getNotes();

  return (
    <div className="p-8 max-w-5xl w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        <p className="text-gray-500 mt-1">
          Personal notes &mdash; only visible to you
        </p>
      </div>
      <PersonalNotes notes={JSON.parse(JSON.stringify(notes))} />
    </div>
  );
}
