"use client";

import { useMemo, useState } from "react";

type RuleGame = {
  slug: string;
  name: string;
  simplifiedRules: string[];
};

export function RulesViewer({ games }: { games: RuleGame[] }) {
  const [selected, setSelected] = useState(games[0]?.slug ?? "");

  const game = useMemo(() => games.find((entry) => entry.slug === selected) ?? games[0], [games, selected]);

  if (!game) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="text-sm font-medium text-slate-700">
        Choose a game
        <select
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
        >
          {games.map((entry) => (
            <option key={entry.slug} value={entry.slug}>
              {entry.name}
            </option>
          ))}
        </select>
      </label>
      <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
        {game.simplifiedRules.map((rule, index) => (
          <li key={index} className="rounded-2xl bg-slate-50 px-4 py-3">
            <span className="mr-2 font-semibold text-slate-900">{index + 1}.</span>{rule}
          </li>
        ))}
      </ol>
    </div>
  );
}
