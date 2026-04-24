import Link from "next/link";
import { notFound } from "next/navigation";

import { toggleFavoriteLessonAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { getGameBySlug, getLessonBySlug, getStandards, isFavoriteLesson } from "@/lib/data";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  return {
    title: lesson ? lesson.title : "Lesson plan",
    description: lesson?.summary,
  };
}

export default async function LessonDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const game = getGameBySlug(lesson.gameSlug);
  if (!game) {
    notFound();
  }

  const search = await searchParams;
  const selectedVariant = Number(Array.isArray(search.variant) ? search.variant[0] : search.variant) || 45;
  const variant = lesson.variants.find((entry) => entry.duration === selectedVariant) ?? lesson.variants[0];
  const favorite = isFavoriteLesson(lesson.slug);
  const standards = getStandards().filter((standard) => lesson.standards.includes(standard.code));
  const redirectTo = `/lessons/${lesson.slug}?variant=${variant.duration}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <li><Link href="/games" className="hover:text-slate-900">Browse games</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/games/${game.slug}`} className="hover:text-slate-900">{game.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{lesson.title}</li>
        </ol>
      </nav>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Lesson plan</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{lesson.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{lesson.summary}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`/api/lessons/${lesson.slug}/pdf?variant=${variant.duration}`} download className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Download as PDF
          </a>
          <form action={toggleFavoriteLessonAction}>
            <input type="hidden" name="lessonSlug" value={lesson.slug} />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <SubmitButton label={favorite ? "Remove favorite" : "Save lesson"} pendingLabel="Updating…" className="bg-amber-600 hover:bg-amber-500" />
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Game</p><p className="mt-2 text-lg font-semibold text-slate-900">{game.name}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Grade band</p><p className="mt-2 text-lg font-semibold text-slate-900">{lesson.gradeBand}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Selected format</p><p className="mt-2 text-lg font-semibold text-slate-900">{variant.label}</p></div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-semibold text-slate-600">Focus</p><p className="mt-2 text-lg font-semibold text-slate-900">{variant.focus}</p></div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {lesson.variants.map((entry) => (
          <Link key={entry.duration} href={`/lessons/${lesson.slug}?variant=${entry.duration}`} className={`rounded-full px-5 py-3 text-sm font-semibold transition ${entry.duration === variant.duration ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-slate-900"}`}>
            {entry.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Learning objectives</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 list-disc pl-5">
              {lesson.learningObjectives.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Materials needed</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 list-disc pl-5">
              {lesson.materialsNeeded.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Standards alignment</h2>
            <div className="mt-4 space-y-3">
              {standards.map((standard) => (
                <div key={standard.code} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">{standard.code}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{standard.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Pre-game activity</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 list-disc pl-5">
              {lesson.preGameActivity.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Gameplay facilitation guide</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 list-disc pl-5">
              {lesson.facilitationGuide.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="mt-6 rounded-2xl bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">{variant.label}</p>
              <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {variant.sequence.map((item) => (
                  <li key={`${item.phase}-${item.minutes}`}>
                    <span className="font-semibold text-slate-900">{item.phase}</span> · {item.minutes} min — {item.guidance}
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Post-game reflection</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 list-disc pl-5">
              {lesson.postGameReflection.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Assessment rubric</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-600" aria-label="Assessment rubric">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-900">
                    <th className="px-3 py-3 font-semibold">Criterion</th>
                    <th className="px-3 py-3 font-semibold">Exceeds</th>
                    <th className="px-3 py-3 font-semibold">Meets</th>
                    <th className="px-3 py-3 font-semibold">Developing</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.assessmentRubric.map((row) => (
                    <tr key={row.criterion} className="border-b border-slate-100 align-top">
                      <td className="px-3 py-3 font-semibold text-slate-900">{row.criterion}</td>
                      <td className="px-3 py-3">{row.exceeds}</td>
                      <td className="px-3 py-3">{row.meets}</td>
                      <td className="px-3 py-3">{row.developing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
