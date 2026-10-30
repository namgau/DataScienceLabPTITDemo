import { NextResponse, type NextRequest } from 'next/server';
import { fail, weekAccess } from '@/lib/api';
import { gradeSubmission } from '@/lib/lab';
import { weekStatus } from '@/lib/progress';

export const maxDuration = 300;

export async function POST(req: NextRequest, ctx: RouteContext<'/api/lab/[week]/submit'>) {
  const a = await weekAccess((await ctx.params).week);
  if ('res' in a) return a.res;
  const { cells } = await req.json().catch(() => ({}));
  if (typeof cells !== 'object' || cells === null) return fail('Dữ liệu nộp bài không hợp lệ.');
  try {
    const r = await gradeSubmission(a.user.id, a.week, cells);
    if ('error' in r) return fail(r.error as string, 429);
    const status = weekStatus(a.user.id, a.week.n, a.user.role === 'admin')!;
    return NextResponse.json({ ...r.result, weekPassed: status.passed, nextUnlocked: !a.status.passed && status.passed });
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Lỗi khi chấm bài.', 500);
  }
}
