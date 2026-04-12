import { getPdArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Professional development",
};

export default function PDPage() {
  const articles = getPdArticles();
  const guide = articles.find((article) => article.slug === "getting-started-game-based-learning");
  const adminFaq = articles.find((article) => article.slug === "using-games-to-support-administrative-buy-in");
  const bestPractices = articles.filter((article) => article.slug !== guide?.slug && article.slug !== adminFaq?.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Professional development</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Guides, best practices, and admin-ready justification for game-based learning.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">This MVP includes a getting-started guide, practical facilitation notes, and talking points administrators can use to support implementation.</p>
      </div>

      {guide ? (
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Featured guide</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{guide.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{guide.summary}</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {guide.sections.map((section) => (
              <article key={section.heading} className="rounded-3xl bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">{section.heading}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  {section.body.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        {bestPractices.map((article) => (
          <article key={article.slug} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">{article.category}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
            <div className="mt-5 space-y-4">
              {article.sections.map((section) => (
                <div key={section.heading} className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">{section.heading}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {section.body.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {adminFaq ? (
        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Administrator FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold">{adminFaq.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">{adminFaq.summary}</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {adminFaq.sections.map((section) => (
              <div key={section.heading} className="rounded-3xl bg-slate-800 p-5">
                <h3 className="text-xl font-semibold">{section.heading}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                  {section.body.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
