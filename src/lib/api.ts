import 'server-only';
import { NextResponse } from 'next/server';
import { getWeek } from '@/content';
import { getCurrentUser, type User } from './auth';
import { weekStatus } from './progress';

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Resolves the user and an unlocked week, or returns the error response to send. */
export async function weekAccess(weekParam: string) {
  const user = await getCurrentUser();
  if (!user) return { res: fail('Bạn cần đăng nhập.', 401) } as const;
  const week = getWeek(Number(weekParam));
  if (!week) return { res: fail('Không có tuần này.', 404) } as const;
  const status = weekStatus(user.id, week.n, user.role === 'admin')!;
  if (!status.unlocked) return { res: fail('Tuần này chưa mở. Hãy hoàn thành tuần trước.', 403) } as const;
  return { user, week, status } as const;
}

export async function requireAdmin(): Promise<User | null> {
  const u = await getCurrentUser();
  return u?.role === 'admin' ? u : null;
}
