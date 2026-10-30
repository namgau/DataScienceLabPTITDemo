import { NextResponse, type NextRequest } from 'next/server';
import { fail, weekAccess } from '@/lib/api';
import { quizAllowance } from '@/lib/progress';
import { findOpenAttempt, startAttempt } from '@/lib/quiz';

export async function POST(_req: NextRequest, ctx: RouteContext<'/api/quiz/[week]/start'>) {
  const a = await weekAccess((await ctx.params).week);
  if ('res' in a) return a.res;
  const open = findOpenAttempt(a.user.id, a.week);
  if (open) return NextResponse.json(open);
  const allow = quizAllowance(a.user.id, a.week);
  if (!allow.allowed) {
    return fail(allow.exam ? 'Bạn đã dùng lượt làm bài thi duy nhất.' : 'Bạn đã hết lượt trong khung 8 giờ.', 429);
  }
  return NextResponse.json(startAttempt(a.user.id, a.week));
}
