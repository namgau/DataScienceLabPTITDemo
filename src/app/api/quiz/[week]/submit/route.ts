import { NextResponse, type NextRequest } from 'next/server';
import { fail, weekAccess } from '@/lib/api';
import { submitAttempt } from '@/lib/quiz';
import { weekStatus } from '@/lib/progress';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/quiz/[week]/submit'>) {
  const a = await weekAccess((await ctx.params).week);
  if ('res' in a) return a.res;
  const { attemptId, answers } = await req.json().catch(() => ({}));
  if (!Number.isInteger(attemptId) || typeof answers !== 'object' || answers === null) return fail('Dữ liệu nộp bài không hợp lệ.');
  const r = submitAttempt(a.user.id, a.week, attemptId, answers);
  if ('error' in r) return fail(r.error as string);
  const status = weekStatus(a.user.id, a.week.n, a.user.role === 'admin')!;
  return NextResponse.json({ ...r, weekPassed: status.passed, nextUnlocked: !a.status.passed && status.passed });
}
