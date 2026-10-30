import 'server-only';
import { randomInt } from 'node:crypto';
import { PASS_PCT, type QuizQuestion, type Week } from '@/content';
import { getDb, parseDbTime, toDbTime } from './db';

/** Order of questions and of each question's options for one attempt. */
type Layout = { id: string; opts: number[] }[];
export type Answers = Record<string, number | number[] | string>;

export interface ClientQuestion {
  id: string;
  kind: QuizQuestion['kind'];
  prompt: string;
  code?: string;
  /** [originalIndex, text] in display order */
  options?: [number, string][];
}

export interface ActiveAttempt {
  attemptId: number;
  deadline: number | null;
  questions: ClientQuestion[];
}

export interface QuestionFeedback {
  id: string;
  correct: boolean;
  explain?: string;
}

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function toClient(week: Week, layout: Layout): ClientQuestion[] {
  const byId = new Map(week.quiz.questions.map((q) => [q.id, q]));
  return layout.map(({ id, opts }) => {
    const q = byId.get(id)!;
    return {
      id: q.id,
      kind: q.kind,
      prompt: q.prompt,
      code: q.code,
      options: q.kind === 'numeric' ? undefined : opts.map((i) => [i, q.options[i]] as [number, string]),
    };
  });
}

export function findOpenAttempt(userId: number, week: Week): ActiveAttempt | null {
  const row = getDb().prepare(
    'SELECT id, deadline, layout_json FROM quiz_attempts WHERE user_id = ? AND week = ? AND submitted_at IS NULL AND voided = 0 ORDER BY id DESC LIMIT 1',
  ).get(userId, week.n) as { id: number; deadline: string | null; layout_json: string } | undefined;
  if (!row) return null;
  return { attemptId: row.id, deadline: parseDbTime(row.deadline), questions: toClient(week, JSON.parse(row.layout_json)) };
}

export function startAttempt(userId: number, week: Week): ActiveAttempt {
  const layout: Layout = shuffle(week.quiz.questions).map((q) => ({
    id: q.id,
    opts: q.kind === 'numeric' ? [] : shuffle(q.options.map((_, i) => i)),
  }));
  const deadline = week.quiz.timeLimitMin ? Date.now() + week.quiz.timeLimitMin * 60_000 : null;
  const r = getDb().prepare(
    'INSERT INTO quiz_attempts (user_id, week, deadline, layout_json) VALUES (?, ?, ?, ?)',
  ).run(userId, week.n, deadline ? toDbTime(deadline) : null, JSON.stringify(layout));
  return { attemptId: Number(r.lastInsertRowid), deadline, questions: toClient(week, layout) };
}

function parseNumber(v: unknown): number | null {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return null;
  const s = v.trim().replace(',', '.');
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  return s === '' || Number.isNaN(Number(s)) ? null : Number(s);
}

function isCorrect(q: QuizQuestion, a: unknown): boolean {
  if (q.kind === 'single') return a === q.answer;
  if (q.kind === 'multi') {
    if (!Array.isArray(a)) return false;
    const got = [...new Set(a)].sort();
    const exp = [...q.answer].sort();
    return got.length === exp.length && got.every((v, i) => v === exp[i]);
  }
  const n = parseNumber(a);
  return n !== null && Math.abs(n - q.answer) <= q.tolerance + 1e-9;
}

const GRACE_MS = 2 * 60_000;

export function submitAttempt(userId: number, week: Week, attemptId: number, answers: Answers) {
  const db = getDb();
  const row = db.prepare(
    'SELECT id, deadline, submitted_at, layout_json FROM quiz_attempts WHERE id = ? AND user_id = ? AND week = ? AND voided = 0',
  ).get(attemptId, userId, week.n) as { id: number; deadline: string | null; submitted_at: string | null; layout_json: string } | undefined;
  if (!row) return { error: 'Không tìm thấy lượt làm bài.' } as const;
  if (row.submitted_at) return { error: 'Lượt làm bài này đã được nộp.' } as const;

  const deadline = parseDbTime(row.deadline);
  const late = deadline !== null && Date.now() > deadline + GRACE_MS;
  const layout: Layout = JSON.parse(row.layout_json);
  const byId = new Map(week.quiz.questions.map((q) => [q.id, q]));

  const graded = layout.map(({ id }) => {
    const q = byId.get(id)!;
    return { q, correct: !late && isCorrect(q, answers[id]) };
  });
  const score = Math.round((100 * graded.filter((g) => g.correct).length) / graded.length);
  const passed = week.gate === 'complete' || score >= PASS_PCT;

  db.prepare("UPDATE quiz_attempts SET submitted_at = datetime('now'), answers_json = ?, score = ? WHERE id = ?")
    .run(JSON.stringify(answers), score, row.id);

  // Explanations are shown once the quiz is passed; before that only correct answers explain themselves.
  const feedback: QuestionFeedback[] = graded.map(({ q, correct }) => ({
    id: q.id,
    correct,
    explain: passed || correct ? q.explain : undefined,
  }));
  return { score, passed, late, feedback, total: graded.length, correctCount: graded.filter((g) => g.correct).length };
}
