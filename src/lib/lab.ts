import 'server-only';
import { PASS_PCT, type Week } from '@/content';
import { getDb } from './db';
import { grade, type GradeResult } from './grader';

/** What the browser receives: no solutions, no hidden tests. */
export interface ClientLab {
  title: string;
  intro: string;
  setup: string;
  packages: string[];
  exercises: {
    id: string;
    title: string;
    instructions: string;
    starter: string;
    points: number;
    tests: { name: string; code: string }[];
    hiddenCount: number;
  }[];
}

export function clientLab(week: Week): ClientLab {
  const { title, intro, setup, packages, exercises } = week.lab;
  return {
    title, intro, setup, packages,
    exercises: exercises.map((e) => ({
      id: e.id, title: e.title, instructions: e.instructions, starter: e.starter, points: e.points,
      tests: e.tests, hiddenCount: e.hidden.length,
    })),
  };
}

export interface ExerciseScore {
  id: string;
  title: string;
  points: number;
  earned: number;
  passed: number;
  total: number;
  error: string | null;
  tests: { name: string; passed: boolean; message: string; hidden: boolean }[];
}

export interface LabResult {
  score: number;
  passed: boolean;
  exercises: ExerciseScore[];
  setupError: string | null;
}

function scoreResult(week: Week, r: GradeResult): LabResult {
  const exercises = week.lab.exercises.map((e) => {
    const ts = r.tests.filter((t) => t.exercise === e.id);
    const publicNames = new Set(e.tests.map((t) => t.name));
    const passed = ts.filter((t) => t.passed).length;
    return {
      id: e.id,
      title: e.title,
      points: e.points,
      earned: ts.length ? (e.points * passed) / ts.length : 0,
      passed,
      total: ts.length,
      error: r.cells[e.id]?.error ?? null,
      tests: ts.map((t) => ({ name: t.name, passed: t.passed, message: t.message, hidden: !publicNames.has(t.name) })),
    };
  });
  const total = week.lab.exercises.reduce((s, e) => s + e.points, 0);
  const score = Math.round((100 * exercises.reduce((s, e) => s + e.earned, 0)) / total);
  return { score, passed: week.gate === 'complete' || score >= PASS_PCT, exercises, setupError: r.setupError };
}

const inFlight = new Set<number>();

export async function gradeSubmission(userId: number, week: Week, cells: Record<string, string>) {
  if (inFlight.has(userId)) return { error: 'Bài trước của bạn đang được chấm, vui lòng đợi.' } as const;
  inFlight.add(userId);
  try {
    const clean: Record<string, string> = {};
    for (const e of week.lab.exercises) {
      const code = typeof cells[e.id] === 'string' ? cells[e.id] : e.starter;
      clean[e.id] = code.slice(0, 20_000);
    }
    const r = await grade({
      setup: week.lab.setup,
      cells: week.lab.exercises.map((e) => ({ id: e.id, code: clean[e.id] })),
      tests: week.lab.exercises.flatMap((e) =>
        [...e.tests, ...e.hidden].map((t) => ({ exercise: e.id, name: t.name, code: t.code })),
      ),
    });
    const result = scoreResult(week, r);
    getDb().prepare('INSERT INTO lab_submissions (user_id, week, cells_json, results_json, score) VALUES (?, ?, ?, ?, ?)')
      .run(userId, week.n, JSON.stringify(clean), JSON.stringify(result), result.score);
    return { result } as const;
  } finally {
    inFlight.delete(userId);
  }
}

export function lastSubmission(userId: number, week: number) {
  const row = getDb().prepare(
    'SELECT cells_json, results_json, created_at FROM lab_submissions WHERE user_id = ? AND week = ? ORDER BY id DESC LIMIT 1',
  ).get(userId, week) as { cells_json: string; results_json: string; created_at: string } | undefined;
  if (!row) return null;
  return { cells: JSON.parse(row.cells_json) as Record<string, string>, result: JSON.parse(row.results_json) as LabResult, at: row.created_at };
}
