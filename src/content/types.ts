// Content schema. Files under src/content are server-only: they hold answers,
// hidden tests and reference solutions. Clients only ever receive the output of
// the sanitize helpers in src/lib/content.ts.

export const py = String.raw;

export type QuizQuestion =
  | { id: string; kind: 'single'; prompt: string; code?: string; options: string[]; answer: number; explain: string }
  | { id: string; kind: 'multi'; prompt: string; code?: string; options: string[]; answer: number[]; explain: string }
  | { id: string; kind: 'numeric'; prompt: string; code?: string; answer: number; tolerance: number; explain: string };

export interface PyTest {
  name: string;
  code: string;
}

export interface Exercise {
  id: string;
  title: string;
  /** Lightweight markdown: paragraphs, `code`, **bold**, "- " lists, ``` blocks */
  instructions: string;
  starter: string;
  solution: string;
  /** Shown and runnable in the browser */
  tests: PyTest[];
  /** Run only by the server grader */
  hidden: PyTest[];
  points: number;
}

export interface Lab {
  title: string;
  intro: string;
  /** Read-only setup cell executed before student cells */
  setup: string;
  packages: string[];
  exercises: Exercise[];
}

export interface Week {
  n: number;
  title: string;
  stage: 0 | 1 | 2 | 3 | 4;
  summary: string;
  topics: string[];
  practice: string;
  /** 'pass' = quiz ≥ passPct and lab ≥ passPct. 'complete' = both submitted (placement test). */
  gate: 'pass' | 'complete';
  exam?: boolean;
  quiz: {
    questions: QuizQuestion[];
    timeLimitMin?: number;
  };
  lab: Lab;
}

export const PASS_PCT = 80;

export const STAGES: Record<number, { name: string; short: string }> = {
  0: { name: 'Đánh giá đầu vào', short: 'Đầu vào' },
  1: { name: 'Nhập môn & nền tảng toán', short: 'Nền tảng' },
  2: { name: 'Machine Learning cổ điển', short: 'Machine Learning' },
  3: { name: 'Deep Learning', short: 'Deep Learning' },
  4: { name: 'AI hiện đại & kỹ năng nghiên cứu', short: 'Nghiên cứu' },
};
