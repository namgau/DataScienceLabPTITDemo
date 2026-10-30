import { NextResponse, type NextRequest } from 'next/server';
import { fail, requireAdmin } from '@/lib/api';
import { getDb } from '@/lib/db';

/** Voids a student's quiz attempts for one week so they can retake it. Scores stay in history. */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return fail('Chỉ giảng viên mới có quyền này.', 403);
  const { userId, week } = await req.json().catch(() => ({}));
  if (!Number.isInteger(userId) || !Number.isInteger(week)) return fail('Thiếu userId hoặc week.');
  const r = getDb().prepare('UPDATE quiz_attempts SET voided = 1 WHERE user_id = ? AND week = ? AND voided = 0').run(userId, week);
  return NextResponse.json({ voided: r.changes });
}
