import { NextResponse, type NextRequest } from 'next/server';
import { login, register, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { fail } from '@/lib/api';

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const s = (v: unknown) => (typeof v === 'string' ? v : '');
  const r = register({
    username: s(b.username), email: s(b.email), password: s(b.password),
    fullName: s(b.fullName), studentId: s(b.studentId), classCode: s(b.classCode),
  });
  if ('error' in r) return fail(r.error);
  const l = login(r.user.username, s(b.password));
  if ('error' in l) return fail(l.error);
  const res = NextResponse.json({ user: l.user });
  res.cookies.set(SESSION_COOKIE, l.sessionId, sessionCookieOptions);
  return res;
}
