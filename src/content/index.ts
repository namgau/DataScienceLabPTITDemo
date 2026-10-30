import { week0, week1, week2, week3 } from './stage1';
import { week4, week5, week6, week7, week8 } from './stage2';
import { week9, week10, week11, week12 } from './stage3';
import { week13, week14, week15 } from './stage4';
import type { Week } from './types';

export const WEEKS: Week[] = [
  week0, week1, week2, week3, week4, week5, week6, week7,
  week8, week9, week10, week11, week12, week13, week14, week15,
];

export function getWeek(n: number): Week | undefined {
  return WEEKS.find((w) => w.n === n);
}

export * from './types';
