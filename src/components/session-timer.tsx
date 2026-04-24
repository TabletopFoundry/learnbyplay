"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const defaultPhases = [
  { label: "Launch", minutes: 5 },
  { label: "Play", minutes: 20 },
  { label: "Debrief", minutes: 8 },
];

export function SessionTimer() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(defaultPhases[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const hasStartedRef = useRef(false);

  const phaseRef = useRef(currentPhase);
  phaseRef.current = currentPhase;

  useEffect(() => {
    if (!running || completed) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, completed]);

  // Separate effect for phase transitions when timer reaches zero
  useEffect(() => {
    if (secondsLeft === 0 && running && !completed) {
      if (phaseRef.current >= defaultPhases.length - 1) {
        setRunning(false);
        setCompleted(true);
      } else {
        const next = phaseRef.current + 1;
        setCurrentPhase(next);
        setSecondsLeft(defaultPhases[next].minutes * 60);
      }
    }
  }, [secondsLeft, running, completed]);

  // Only announce phase changes after user has started the timer
  useEffect(() => {
    if (!hasStartedRef.current) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (completed) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Session complete"));
      } else {
        const message = `Phase ${currentPhase + 1}: ${defaultPhases[currentPhase].label}`;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(message));
      }
    }
  }, [currentPhase, completed]);

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

  const handleStart = () => {
    hasStartedRef.current = true;
    if (completed) {
      setCompleted(false);
      setCurrentPhase(0);
      setSecondsLeft(defaultPhases[0].minutes * 60);
    }
    setRunning((value) => !value);
  };

  const handleReset = () => {
    setRunning(false);
    setCompleted(false);
    setCurrentPhase(0);
    setSecondsLeft(defaultPhases[0].minutes * 60);
  };

  const handleNextPhase = () => {
    if (currentPhase >= defaultPhases.length - 1) return;
    hasStartedRef.current = true;
    const nextPhase = currentPhase + 1;
    setCurrentPhase(nextPhase);
    setSecondsLeft(defaultPhases[nextPhase].minutes * 60);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" role="region" aria-label="Session timer">
      <div aria-live="polite" className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900">
        {completed ? (
          <span>
            <span aria-hidden="true">✓ </span>
            Session complete — all phases finished
          </span>
        ) : (
          <>Current phase: {phase.label}</>
        )}
      </div>
      <div className="mt-5 text-center">
        <div className="text-6xl font-semibold tracking-tight text-slate-900" aria-live="off" aria-atomic="true">
          {timeLabel}
        </div>
        <p className="mt-2 text-sm text-slate-600" aria-live="polite">
          {completed
            ? "All phases complete"
            : `${phase.minutes} minutes planned for this phase`}
        </p>
        <p className="sr-only" aria-live="polite">
          {completed ? "Session timer complete" : `${Math.floor(secondsLeft / 60)} minutes and ${secondsLeft % 60} seconds remaining`}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          className="rounded-full bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-700"
        >
          {completed ? "Restart" : running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-slate-200 px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleNextPhase}
          disabled={currentPhase >= defaultPhases.length - 1}
          className="rounded-full border border-slate-200 px-6 py-3.5 text-base font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next phase
        </button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {defaultPhases.map((item, index) => (
          <div key={item.label} className={`rounded-2xl p-4 ${completed ? "bg-emerald-50 text-emerald-800" : index === currentPhase ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"}`}>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-1 text-sm">{item.minutes} min</p>
            {completed && <span className="sr-only">(completed)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
