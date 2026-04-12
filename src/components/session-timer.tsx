"use client";

import { useEffect, useMemo, useState } from "react";

const defaultPhases = [
  { label: "Launch", minutes: 5 },
  { label: "Play", minutes: 20 },
  { label: "Debrief", minutes: 8 },
];

export function SessionTimer() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(defaultPhases[0].minutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value > 1) {
          return value - 1;
        }

        setCurrentPhase((phase) => Math.min(phase + 1, defaultPhases.length - 1));
        return defaultPhases[Math.min(currentPhase + 1, defaultPhases.length - 1)].minutes * 60;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentPhase, running]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const message = `Phase ${currentPhase + 1}: ${defaultPhases[currentPhase].label}`;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
    }
  }, [currentPhase]);

  const timeLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(secondsLeft % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const phase = defaultPhases[currentPhase];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div aria-live="polite" className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900">
        Current phase: {phase.label}
      </div>
      <div className="mt-5 text-center">
        <div className="text-6xl font-semibold tracking-tight text-slate-900">{timeLabel}</div>
        <p className="mt-2 text-sm text-slate-600">{phase.minutes} minutes planned for this phase</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => setRunning((value) => !value)} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setCurrentPhase(0);
            setSecondsLeft(defaultPhases[0].minutes * 60);
          }}
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            const nextPhase = Math.min(currentPhase + 1, defaultPhases.length - 1);
            setCurrentPhase(nextPhase);
            setSecondsLeft(defaultPhases[nextPhase].minutes * 60);
          }}
          className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900"
        >
          Next phase
        </button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {defaultPhases.map((item, index) => (
          <div key={item.label} className={`rounded-2xl p-4 ${index === currentPhase ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"}`}>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-sm">{item.minutes} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
