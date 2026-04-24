import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { GameArt } from "@/components/game-art";
import { SubmitButton } from "@/components/submit-button";
import { GRADE_BANDS, SUBJECTS } from "@/lib/constants";
import { getGames, getNearMatches, getStandards } from "@/lib/data";
import { getComplexityLabel } from "@/lib/utils";

export const metadata = {
  title: "Game browser",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function numberValue(value: string | string[] | undefined) {
  const text = Array.isArray(value) ? value[0] : value;
  const parsed = Number(text);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export default async function GamesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = {
    subject: Array.isArray(params.subject) ? params.subject[0] : params.subject,
    gradeBand: Array.isArray(params.gradeBand) ? params.gradeBand[0] : params.gradeBand,
    standard: Array.isArray(params.standard) ? params.standard[0] : params.standard,
    maxPlayTime: numberValue(params.maxPlayTime),
    groupSize: numberValue(params.groupSize),
    maxComplexity: numberValue(params.maxComplexity),
    sort: Array.isArray(params.sort) ? params.sort[0] : params.sort,
  };

  const standards = getStandards();
  const games = getGames(filters);
  const nearMatches = games.length === 0 ? getNearMatches(filters) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Game-to-curriculum browser</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Browse games by standards, grade band, and classroom fit.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Filter by subject, Common Core standard, play time, group size, and complexity to find the best fit for your next lesson.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:h-fit">
          <details className="lg:open" open>
            <summary className="cursor-pointer text-lg font-semibold text-slate-900 lg:hidden">Filters</summary>
            <form className="mt-4 lg:mt-0">
              <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Subject
              <select name="subject" defaultValue={filters.subject ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">All subjects</option>
                {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Grade band
              <select name="gradeBand" defaultValue={filters.gradeBand ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">All grade bands</option>
                {GRADE_BANDS.map((gradeBand) => <option key={gradeBand} value={gradeBand}>{gradeBand}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Specific standard
              <select name="standard" defaultValue={filters.standard ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Any mapped standard</option>
                {standards.map((standard) => <option key={standard.code} value={standard.code}>{standard.code}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Max play time (minutes)
              <input name="maxPlayTime" type="number" min={10} defaultValue={filters.maxPlayTime} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Minimum ideal group size
              <input name="groupSize" type="number" min={2} defaultValue={filters.groupSize} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Max complexity
              <select name="maxComplexity" defaultValue={filters.maxComplexity ?? ""} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="">Any complexity</option>
                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} - {getComplexityLabel(value)}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Sort by
              <select name="sort" defaultValue={filters.sort ?? "fit"} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="fit">Best fit</option>
                <option value="time">Shortest play time</option>
                <option value="complexity">Lowest complexity</option>
                <option value="standards">Most standards mapped</option>
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <SubmitButton label="Apply filters" pendingLabel="Filtering…" />
            <Link href="/games" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900">Clear</Link>
          </div>
            </form>
          </details>
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Results</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{games.length} games match your filters</p>
            </div>
            {filters.standard ? <p className="max-w-sm text-sm text-slate-600">Standard focus: {filters.standard}</p> : null}
          </div>

          {games.length === 0 ? (
            <div className="space-y-6">
              <EmptyState
                title="No exact matches yet"
                description="Try relaxing the standard or complexity filter. LearnByPlay is showing nearby alternatives that still fit most of your classroom constraints."
              />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {nearMatches.map((game) => (
                  <Link key={game.slug} href={`/games/${game.slug}`} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <GameArt name={game.name} />
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">{game.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{game.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => (
                <Link key={game.slug} href={`/games/${game.slug}`} aria-label={game.name} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div aria-hidden="true">
                  <GameArt name={game.name} />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {game.subjects.map((subject) => (
                      <span key={subject} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{subject}</span>
                    ))}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">{game.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{game.tagline}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="rounded-2xl bg-slate-50 p-3"><dt className="font-semibold text-slate-900">Grades</dt><dd>{game.gradeBand}</dd></div>
                    <div className="rounded-2xl bg-slate-50 p-3"><dt className="font-semibold text-slate-900">Play time</dt><dd>{game.playTimeMin}-{game.playTimeMax} min</dd></div>
                    <div className="rounded-2xl bg-slate-50 p-3"><dt className="font-semibold text-slate-900">Players</dt><dd>{game.minPlayers}-{game.maxPlayers}</dd></div>
                    <div className="rounded-2xl bg-slate-50 p-3"><dt className="font-semibold text-slate-900">Standards</dt><dd>{game.standards.length}</dd></div>
                  </dl>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
