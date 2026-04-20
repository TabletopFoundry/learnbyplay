import Link from "next/link";

import { GameArt } from "@/components/game-art";
import { getCatalogInsights, getFeaturedGames } from "@/lib/data";

const testimonials = [
  {
    quote:
      "LearnByPlay cut my lesson planning time from an hour to ten minutes. I walked into math workshop with a game, a rubric, and a confident admin-facing explanation.",
    name: "Olivia R.",
    role: "Grade 4 teacher",
  },
  {
    quote:
      "The dashboard finally gives us a way to show that play is rigorous. Our pilot team can point to standards, skills, and actual classroom usage.",
    name: "Marcus T.",
    role: "Curriculum coordinator",
  },
  {
    quote:
      "The timer, group generator, and student-friendly rules saved my after-school staff from constant rule reteaching.",
    name: "Talia N.",
    role: "Library program lead",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    details: "Explore the catalog, classroom tools, and PD content with local sample data.",
  },
  {
    name: "Teacher Pilot",
    price: "$29/mo",
    details: "Includes printable lesson plans, favorites, and classroom session tracking.",
  },
  {
    name: "School Launch",
    price: "$249/mo",
    details: "Adds school-wide adoption reporting, admin-ready FAQ support, and team planning workflows.",
  },
];

export default function Home() {
  const insights = getCatalogInsights();
  const featuredGames = getFeaturedGames(3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
            Standards-aligned board game lessons for real classrooms
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Turn great board games into trusted instruction.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            LearnByPlay helps teachers find the right game for a standard, launch a lesson with confidence, run structured play, and show administrators exactly what students practiced.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/games"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Browse game-to-curriculum matches
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900"
            >
              Open teacher dashboard
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-3xl font-semibold text-slate-900">{insights.games}+</p>
              <p className="mt-2 text-sm text-slate-600">
                Seeded board games with standards and SEL mappings
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-3xl font-semibold text-slate-900">{insights.lessons}</p>
              <p className="mt-2 text-sm text-slate-600">
                Detailed lesson plans with printable facilitation guidance
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-3xl font-semibold text-slate-900">{insights.standards}</p>
              <p className="mt-2 text-sm text-slate-600">
                Real Common Core and CASEL-aligned standards entries
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="sr-only">Featured games</h2>
          <div className="grid gap-5">
          {featuredGames.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
                <GameArt name={game.name} className="aspect-[5/3]" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                    {game.subjects.join(" • ")}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">{game.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{game.tagline}</p>
                  <p className="mt-3 text-sm text-slate-600">
                    {game.playTimeMin}-{game.playTimeMax} min • Grades {game.gradeBand}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="sr-only">How LearnByPlay works</h2>
        <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Find the right fit",
            body: "Filter by subject, grade band, standard, play time, group size, and complexity to find a lesson-ready game in minutes.",
          },
          {
            title: "Run play with structure",
            body: "Use ready-to-use lesson plans, group generation, student-friendly rules, and a visible session timer to stay classroom-ready.",
          },
          {
            title: "Show the evidence",
            body: "Track games used, saved lessons, standards covered, and skill practice so administrators see instructional value immediately.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Why teachers trust it
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              A warm, professional workflow from search to reflection
            </h2>
          </div>
          <Link
            href="/tools"
            className="text-sm font-semibold text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Try the classroom tools
          </Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
              <blockquote className="text-base leading-7 text-slate-100">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-slate-300">
                <span className="font-semibold text-white">{testimonial.name}</span>
                <br />
                <span className="sr-only">Role: </span>
                <span className="text-slate-400">{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Pricing
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Start small, then grow into school-wide adoption
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            This MVP includes sample pricing language so teachers, pilot leaders, and administrators can picture the rollout path.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {pricing.map((plan) => (
            <div key={plan.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                {plan.name}
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.details}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
