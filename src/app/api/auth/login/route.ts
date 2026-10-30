import { NextResponse, type NextRequest } from 'next/server';
import { login, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { fail } from '@/lib/api';

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json().catch(() => ({}));
  if (!identifier || !password) return fail('Nhập tên đăng nhập và mật khẩu.');
  const r = login(String(identifier), String(password));
  if ('error' in r) return fail(r.error, 401);
  const res = NextResponse.json({ user: r.user });
  res.cookies.set(SESSION_COOKIE, r.sessionId, sessionCookieOptions);
  return res;
}
