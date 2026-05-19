import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Feature = {
  icon: string;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    icon: '🎯',
    title: 'Standard-first browsing',
    body: 'Filter 45 curated games by Common Core code, grade band, subject, play time, and group size. Every game maps to the standard it actually practices.',
  },
  {
    icon: '📋',
    title: 'Lesson plans that print',
    body: '21 ready-to-teach plans with objectives, sequences, rubrics, and reflection prompts. One click exports a clean PDF for sub folders or parent nights.',
  },
  {
    icon: '🧰',
    title: 'Live classroom tools',
    body: 'Random group generator, phased session timer with announcements, and a simplified rules viewer that survives a noisy 4th-grade room.',
  },
  {
    icon: '📊',
    title: 'Evidence for administrators',
    body: 'Log sessions, surface a skill coverage heatmap, and show exactly which standards each class touched this quarter.',
  },
  {
    icon: '♿',
    title: 'Accessible by default',
    body: 'Skip-nav, ARIA landmarks, focus-visible styling, and keyboard navigation throughout — because instruction has to work for every student and teacher.',
  },
  {
    icon: '🏠',
    title: 'Runs on a Chromebook',
    body: 'SQLite + Next.js. No cloud account, no vendor lock-in. Deploy on a school server, a Raspberry Pi, or your laptop.',
  },
];

const stats = [
  {value: '45', label: 'Curated games'},
  {value: '21', label: 'Lesson plans'},
  {value: '30', label: 'Aligned standards'},
  {value: 'K–12', label: 'Grade coverage'},
];

function Hero(): ReactNode {
  return (
    <header className="lbp-hero">
      <span className="lbp-hero__eyebrow">🎲 Built for working teachers</span>
      <h1 className="lbp-hero__title">
        Turn board games into <span className="lbp-hero__title-accent">standards-aligned instruction</span>.
      </h1>
      <p className="lbp-hero__subtitle">
        LearnByPlay helps teachers find the right game for a standard, launch a lesson with confidence,
        run structured play, and show administrators exactly what students practiced.
      </p>
      <div className="lbp-hero__ctas">
        <Link className="button button--primary button--lg" to="/docs/getting-started/quickstart">
          Get started in 5 minutes →
        </Link>
        <Link className="button button--secondary button--lg" to="https://github.com/TabletopFoundry/learnbyplay">
          View on GitHub
        </Link>
      </div>
      <div>
        <span className="lbp-install">
          <span className="lbp-install__prompt">$</span>
          git clone https://github.com/TabletopFoundry/learnbyplay &amp;&amp; cd learnbyplay &amp;&amp; npm install &amp;&amp; npm run dev
        </span>
      </div>
    </header>
  );
}

function FeatureGrid(): ReactNode {
  return (
    <section className="lbp-section">
      <h2 className="lbp-section__title">Everything a teacher needs in one app</h2>
      <p className="lbp-section__lede">
        From the moment you open a standard to the moment you log evidence after class — every step is covered.
      </p>
      <div className="lbp-features">
        {features.map((f) => (
          <div key={f.title} className="lbp-feature">
            <div className="lbp-feature__icon" aria-hidden>{f.icon}</div>
            <h3 className="lbp-feature__title">{f.title}</h3>
            <p className="lbp-feature__body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsBand(): ReactNode {
  return (
    <section className="lbp-section lbp-section--alt">
      <h2 className="lbp-section__title">Curriculum at scale</h2>
      <p className="lbp-section__lede">
        Demo dataset ships with the app. Fork it, extend it, or wire in your own curated catalog.
      </p>
      <div className="lbp-stats">
        {stats.map((s) => (
          <div key={s.label} className="lbp-stat">
            <div className="lbp-stat__value">{s.value}</div>
            <div className="lbp-stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks(): ReactNode {
  return (
    <section className="lbp-section">
      <h2 className="lbp-section__title">From standard to evidence in four steps</h2>
      <p className="lbp-section__lede">
        Open the standard, pick a game, run the session, log the outcome. That's the whole loop.
      </p>
      <div className="lbp-features">
        <div className="lbp-feature">
          <div className="lbp-feature__icon" aria-hidden>1️⃣</div>
          <h3 className="lbp-feature__title">Browse by standard</h3>
          <p className="lbp-feature__body">Filter the catalog by CCSS code, grade band, subject, or complexity.</p>
        </div>
        <div className="lbp-feature">
          <div className="lbp-feature__icon" aria-hidden>2️⃣</div>
          <h3 className="lbp-feature__title">Open the lesson plan</h3>
          <p className="lbp-feature__body">Objectives, materials, sequence, rubric, and reflection — already written. Export to PDF.</p>
        </div>
        <div className="lbp-feature">
          <div className="lbp-feature__icon" aria-hidden>3️⃣</div>
          <h3 className="lbp-feature__title">Run the session</h3>
          <p className="lbp-feature__body">Use the group generator, phased timer, and simplified rules viewer live in class.</p>
        </div>
        <div className="lbp-feature">
          <div className="lbp-feature__icon" aria-hidden>4️⃣</div>
          <h3 className="lbp-feature__title">Log the evidence</h3>
          <p className="lbp-feature__body">Record the session against a class — the skill heatmap and standards coverage update automatically.</p>
        </div>
      </div>
    </section>
  );
}

function FinalCTA(): ReactNode {
  return (
    <section className="lbp-final">
      <h2>Ready to run your first session?</h2>
      <p className="lbp-section__lede">
        Clone the repo, run <code>npm install</code>, and you'll be logging real sessions before the bell rings.
      </p>
      <div className="lbp-hero__ctas">
        <Link className="button button--primary button--lg" to="/docs/getting-started/quickstart">
          Quickstart
        </Link>
        <Link className="button button--secondary button--lg" to="/docs/why">
          Why LearnByPlay?
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — ${siteConfig.tagline}`}
      description="LearnByPlay turns board games into standards-aligned instruction. Lesson plans, classroom tools, and a teacher dashboard — open source and ready to run.">
      <Hero />
      <FeatureGrid />
      <StatsBand />
      <HowItWorks />
      <FinalCTA />
    </Layout>
  );
}
