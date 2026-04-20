import Link from "next/link";

import { createClassroomAction, logSessionAction } from "@/app/actions";
import { EmptyState } from "@/components/empty-state";
import { FlashBanner } from "@/components/flash-banner";
import { SessionLogger } from "@/components/session-logger";
import { SubmitButton } from "@/components/submit-button";
import { GRADE_BANDS, SUBJECTS } from "@/lib/constants";
import { getDashboardSnapshot, getGames, getAllLessonsGroupedByGame } from "@/lib/data";
import type { Classroom, LessonPlan, SessionRecord, SkillHeatmapEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Teacher dashboard",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getHeatmapLevelLabel(level: string): string {
  switch (level) {
    case "high": return "High";
    case "medium": return "Medium";
    default: return "Low";
  }
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const snapshot = getDashboardSnapshot();
  const games = getGames({ sort: "fit" });

  // Single bulk query replaces N+1 per-game queries
  const lessonsByGame = getAllLessonsGroupedByGame();

  const created = params.created === "1";
  const logged = params.logged === "1";
  const error = typeof params.error === "string" ? params.error : undefined;
  const errorFields = typeof params.fields === "string" ? params.fields.split(",") : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Teacher dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Manage classes, track sessions, and monitor skill coverage.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">The dashboard seeds demo data, then stores new classes, favorites, and sessions locally in SQLite so the MVP stays fully runnable on your machine.</p>
      </div>

      {created ? <FlashBanner message="Class created successfully." variant="success" /> : null}
      {logged ? <FlashBanner message="Session logged successfully." variant="success" /> : null}
      {error ? <FlashBanner
        message={error === "classroom"
          ? `Please fix the following field${errorFields.length > 1 ? "s" : ""}: ${errorFields.join(", ") || "all required fields"}.`
          : `Please complete the following field${errorFields.length > 1 ? "s" : ""}: ${errorFields.join(", ") || "all required fields"}.`}
        variant="error"
      /> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Classes</p><p className="mt-2 text-3xl font-semibold text-slate-900">{snapshot.metrics.classCount}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Sessions logged</p><p className="mt-2 text-3xl font-semibold text-slate-900">{snapshot.metrics.sessionCount}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Saved lessons</p><p className="mt-2 text-3xl font-semibold text-slate-900">{snapshot.metrics.favoriteCount}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Standards covered</p><p className="mt-2 text-3xl font-semibold text-slate-900">{snapshot.metrics.standardsCovered}</p></div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="classrooms-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Classes management</p>
              <h2 id="classrooms-heading" className="mt-2 text-2xl font-semibold text-slate-900">Create a classroom</h2>
            </div>
            <p className="text-sm text-slate-600">Manual entry for the MVP</p>
          </div>
          <form action={createClassroomAction} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Class name
              <input name="name" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Room 22 Fraction Lab" />
            </label>
            <label className="text-sm font-medium text-slate-700">Subject
              <select name="subject" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Grade band
              <select name="gradeBand" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                {GRADE_BANDS.map((gradeBand) => <option key={gradeBand}>{gradeBand}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Student count
              <input name="studentCount" type="number" min={1} required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="24" />
            </label>
            <div className="md:col-span-2">
              <SubmitButton label="Create class" pendingLabel="Creating…" />
            </div>
          </form>
          <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-label="Classrooms table, scroll for more">
            <table className="min-w-full text-left text-sm text-slate-600" aria-label="Classrooms">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="px-3 py-3 font-semibold">Class</th>
                  <th className="px-3 py-3 font-semibold">Subject</th>
                  <th className="px-3 py-3 font-semibold">Grade</th>
                  <th className="px-3 py-3 font-semibold">Students</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.classrooms.map((classroom: Classroom) => (
                  <tr key={classroom.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-semibold text-slate-900">{classroom.name}</td>
                    <td className="px-3 py-3">{classroom.subject}</td>
                    <td className="px-3 py-3">{classroom.gradeBand}</td>
                    <td className="px-3 py-3">{classroom.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="sessions-heading">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Games used tracker</p>
            <h2 id="sessions-heading" className="mt-2 text-2xl font-semibold text-slate-900">Log a classroom session</h2>
          </div>
          <SessionLogger
            classrooms={snapshot.classrooms}
            games={games.map((g) => ({ slug: g.slug, name: g.name }))}
            lessonsByGame={lessonsByGame}
            action={logSessionAction}
          />
          <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-label="Sessions table, scroll for more">
            <table className="min-w-full text-left text-sm text-slate-600" aria-label="Logged sessions">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900">
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Class</th>
                  <th className="px-3 py-3 font-semibold">Game</th>
                  <th className="px-3 py-3 font-semibold">Lesson</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.sessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-sm text-slate-600">
                      No sessions logged yet. Use the form above to log your first classroom session.
                    </td>
                  </tr>
                ) : (
                  snapshot.sessions.map((session: SessionRecord) => (
                    <tr key={session.id} className="border-b border-slate-100">
                      <td className="px-3 py-3">{formatDate(session.sessionDate)}</td>
                      <td className="px-3 py-3">{session.classroomName}</td>
                      <td className="px-3 py-3 font-semibold text-slate-900">{session.gameName}</td>
                      <td className="px-3 py-3">{session.lessonTitle}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="heatmap-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Skills coverage heatmap</p>
              <h2 id="heatmap-heading" className="mt-2 text-2xl font-semibold text-slate-900">Which skills are students practicing?</h2>
            </div>
            <Link href="/pd" className="text-sm font-semibold text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline">See facilitation best practices</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list" aria-label="Skills coverage levels">
            {snapshot.skillsHeatmap.map((skill: SkillHeatmapEntry) => (
              <div key={skill.skill} role="listitem" className={`rounded-3xl p-5 ${skill.level === 'high' ? 'bg-emerald-100 text-emerald-950' : skill.level === 'medium' ? 'bg-amber-100 text-amber-950' : 'bg-slate-100 text-slate-900'}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-semibold">{skill.skill}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${skill.level === 'high' ? 'bg-emerald-200 text-emerald-900' : skill.level === 'medium' ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'}`}>
                    {getHeatmapLevelLabel(skill.level)}
                  </span>
                </div>
                <p className="mt-2 text-sm">Practiced in {skill.count} session{skill.count === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="favorites-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Saved lesson plans</p>
          <h2 id="favorites-heading" className="mt-2 text-2xl font-semibold text-slate-900">Favorites</h2>
          <div className="mt-6 space-y-4">
            {snapshot.favoriteLessons.length === 0 ? (
              <EmptyState title="No saved lessons yet" description="Save a lesson from any detail page to keep your go-to plans close at hand." />
            ) : (
              snapshot.favoriteLessons.map((lesson: LessonPlan) => (
                <article key={lesson.slug} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Grades {lesson.gradeBand}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{lesson.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/lessons/${lesson.slug}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Open lesson</Link>
                    <a href={`/api/lessons/${lesson.slug}/pdf`} download className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900">PDF</a>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
