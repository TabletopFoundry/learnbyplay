import Link from "next/link";
import { notFound } from "next/navigation";

import { GameArt } from "@/components/game-art";
import { getGameBySlug, getLessonsByGameSlug, getStandards } from "@/lib/data";
import { getComplexityLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  return {
    title: game ? game.name : "Game detail",
    description: game?.tagline,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const lessons = getLessonsByGameSlug(game.slug);
  const standards = getStandards().filter((standard) => game.standards.includes(standard.code));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <GameArt name={game.name} className="aspect-[4/5]" />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Classroom fit</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{game.classroomFit}</p>
            <p className="mt-4 text-sm font-medium text-slate-700">{game.copiesNote}</p>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {game.subjects.map((subject) => (
              <span key={subject} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{subject}</span>
            ))}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{game.name}</h1>
          <p className="mt-3 text-lg text-slate-600">{game.tagline}</p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{game.description}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Player count</p><p className="mt-2 text-lg font-semibold text-slate-900">{game.minPlayers}-{game.maxPlayers}</p></div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Play time</p><p className="mt-2 text-lg font-semibold text-slate-900">{game.playTimeMin}-{game.playTimeMax} min</p></div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Complexity</p><p className="mt-2 text-lg font-semibold text-slate-900">{getComplexityLabel(game.complexity)}</p></div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Age range</p><p className="mt-2 text-lg font-semibold text-slate-900">{game.ageRange}</p></div>
          </div>

          <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Skills developed</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {game.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{skill}</span>
                ))}
              </div>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Materials and setup</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>Setup time: {game.setupTimeMin} minutes</li>
                {game.materials.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Student-friendly rules</h2>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {game.simplifiedRules.map((rule, index) => (
                  <li key={index} className="rounded-2xl bg-slate-50 px-4 py-3"><span className="mr-2 font-semibold text-slate-900">{index + 1}.</span>{rule}</li>
                ))}
              </ol>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Standards alignment</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {standards.map((standard) => (
                <div key={standard.code} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">{standard.code}</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{standard.framework}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{standard.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Lesson plans</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ready-to-use facilitation plans</h2>
              </div>
              <Link href="/dashboard" className="text-sm font-semibold text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline">Track this game in the dashboard</Link>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {lessons.map((lesson) => (
                <article key={lesson.slug} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Grades {lesson.gradeBand}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{lesson.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lesson.standards.map((standard) => (
                      <span key={standard} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{standard}</span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/lessons/${lesson.slug}`} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Open lesson</Link>
                    <a href={`/api/lessons/${lesson.slug}/pdf`} download className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900">Download PDF</a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
