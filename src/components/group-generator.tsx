"use client";

import { useMemo, useState } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  const rand = seededRandom(seed);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    const temp = copy[index];
    copy[index] = copy[swapIndex]!;
    copy[swapIndex] = temp!;
  }
  return copy;
}

export function GroupGenerator() {
  const [studentCount, setStudentCount] = useState(24);
  const [groupSize, setGroupSize] = useState(4);
  const [seed, setSeed] = useState(0);

  const clampStudentCount = (value: number) => {
    const parsed = Number(value) || 2;
    return Math.min(Math.max(parsed, 2), 40);
  };

  const clampGroupSize = (value: number) => {
    const parsed = Number(value) || 2;
    return Math.min(Math.max(parsed, 2), 8);
  };

  const groups = useMemo(() => {
    const students = Array.from({ length: studentCount }, (_, index) => `Student ${index + 1}`);
    const randomized = seededShuffle(students, seed);
    const result: string[][] = [];
    for (let index = 0; index < randomized.length; index += groupSize) {
      result.push(randomized.slice(index, index + groupSize));
    }
    return result;
  }, [groupSize, seed, studentCount]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex min-w-40 flex-1 flex-col gap-2 text-sm font-medium text-slate-700">
          Number of students
          <input
            type="number"
            min={2}
            max={40}
            value={studentCount}
            onChange={(event) => setStudentCount(clampStudentCount(Number(event.target.value)))}
            onBlur={(event) => setStudentCount(clampStudentCount(Number(event.target.value)))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="flex min-w-40 flex-1 flex-col gap-2 text-sm font-medium text-slate-700">
          Group size
          <input
            type="number"
            min={2}
            max={8}
            value={groupSize}
            onChange={(event) => setGroupSize(clampGroupSize(Number(event.target.value)))}
            onBlur={(event) => setGroupSize(clampGroupSize(Number(event.target.value)))}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <button
          type="button"
          onClick={() => setSeed((current) => current + 1)}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Randomize groups
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group, index) => (
          <div key={`${index}-${seed}`} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Group {index + 1}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {group.map((student) => (
                <li key={student} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                  {student}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
