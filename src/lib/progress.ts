import 'server-only';
import { WEEKS, PASS_PCT, type Week } from '@/content';
import { getDb, parseDbTime } from './db';

export const QUIZ_WINDOW_HOURS = 8;
export const QUIZ_ATTEMPTS_PER_WINDOW = 3;

export interface WeekStatus {
  n: number;
  unlocked: boolean;
  passed: boolean;
  quizBest: number | null;
  quizSubmitted: number;
  labBest: number | null;
  labSubmissions: number;
  quizPassed: boolean;
  labPassed: boolean;
}

interface Agg {
  week: number;
  best: number | null;
  count: number;
}

export function weekStatuses(userId: number, isAdmin = false): WeekStatus[] {
  const db = getDb();
  const quiz = new Map(
    (db.prepare(
      'SELECT week, MAX(score) AS best, COUNT(*) AS count FROM quiz_attempts WHERE user_id = ? AND submitted_at IS NOT NULL GROUP BY week',
    ).all(userId) as Agg[]).map((r) => [r.week, r]),
  );
  const lab = new Map(
    (db.prepare('SELECT week, MAX(score) AS best, COUNT(*) AS count FROM lab_submissions WHERE user_id = ? GROUP BY week')
      .all(userId) as Agg[]).map((r) => [r.week, r]),
  );

  const out: WeekStatus[] = [];
  let prevPassed = true;
  for (const w of WEEKS) {
    const q = quiz.get(w.n);
    const l = lab.get(w.n);
    const quizPassed = w.gate === 'complete' ? (q?.count ?? 0) > 0 : (q?.best ?? 0) >= PASS_PCT;
    const labPassed = w.gate === 'complete' ? (l?.count ?? 0) > 0 : (l?.best ?? 0) >= PASS_PCT;
    const passed = quizPassed && labPassed;
    out.push({
      n: w.n,
      unlocked: isAdmin || prevPassed,
      passed,
      quizBest: q?.best ?? null,
      quizSubmitted: q?.count ?? 0,
      labBest: l?.best ?? null,
      labSubmissions: l?.count ?? 0,
      quizPassed,
      labPassed,
    });
    prevPassed = passed;
  }
  return out;
}

export function weekStatus(userId: number, n: number, isAdmin = false) {
  return weekStatuses(userId, isAdmin).find((s) => s.n === n);
}

export interface QuizAllowance {
  allowed: boolean;
  /** Attempts left now (in the current window, or in total for exams) */
  left: number;
  limit: number;
  /** When the next attempt frees up, if blocked */
  nextAt: number | null;
  exam: boolean;
}

export function quizAllowance(userId: number, week: Week): QuizAllowance {
  const db = getDb();
  if (week.exam) {
    const used = (db.prepare('SELECT COUNT(*) AS c FROM quiz_attempts WHERE user_id = ? AND week = ? AND voided = 0')
      .get(userId, week.n) as { c: number }).c;
    return { allowed: used < 1, left: Math.max(0, 1 - used), limit: 1, nextAt: null, exam: true };
  }
  const since = Date.now() - QUIZ_WINDOW_HOURS * 3600_000;
  const rows = db.prepare(
    'SELECT started_at FROM quiz_attempts WHERE user_id = ? AND week = ? AND voided = 0 ORDER BY started_at ASC',
  ).all(userId, week.n) as { started_at: string }[];
  const recent = rows.map((r) => parseDbTime(r.started_at)!).filter((t) => t >= since);
  const left = Math.max(0, QUIZ_ATTEMPTS_PER_WINDOW - recent.length);
  return {
    allowed: left > 0,
    left,
    limit: QUIZ_ATTEMPTS_PER_WINDOW,
    nextAt: left > 0 ? null : recent[recent.length - QUIZ_ATTEMPTS_PER_WINDOW] + QUIZ_WINDOW_HOURS * 3600_000,
    exam: false,
  };
}
