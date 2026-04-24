import { GroupGenerator } from "@/components/group-generator";
import { RulesViewer } from "@/components/rules-viewer";
import { SessionTimer } from "@/components/session-timer";
import { getRulesViewerGames } from "@/lib/data";

export const metadata = {
  title: "Classroom tools",
};

export default function ToolsPage() {
  const games = getRulesViewerGames();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Classroom tools</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Keep gameplay organized, visible, and student-friendly.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Use the built-in group generator, session timer with phase announcements, and simplified rules viewer to keep the room moving.</p>
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Random group generator</h2>
          <GroupGenerator />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Session timer</h2>
          <SessionTimer />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Simplified rules viewer</h2>
        <RulesViewer games={games} />
      </div>
    </div>
  );
}
