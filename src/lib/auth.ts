import 'server-only';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDb, parseDbTime, toDbTime } from './db';

const SESSION_DAYS = 7;
export const SESSION_COOKIE = 'dslab_session';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  student_id: string;
  role: 'student' | 'admin';
  created_at: string;
}

const USER_COLS = 'id, username, email, full_name, student_id, role, created_at';

export function classCode() {
  return process.env.CLASS_CODE || 'DSLAB-PTIT';
}

export function register(input: {
  username: string; email: string; password: string; fullName: string; studentId: string; classCode: string;
}): { error: string } | { user: User } {
  const username = input.username.trim().toLowerCase();
  const email = input.email.trim().toLowerCase();
  if (!/^[a-z0-9_.]{3,32}$/.test(username)) return { error: 'Tên đăng nhập gồm 3–32 ký tự: chữ thường, số, dấu chấm hoặc gạch dưới.' };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Email không hợp lệ.' };
  if (input.password.length < 6) return { error: 'Mật khẩu cần ít nhất 6 ký tự.' };
  if (!input.fullName.trim()) return { error: 'Vui lòng nhập họ tên.' };
  if (input.classCode.trim() !== classCode()) return { error: 'Mã lớp không đúng. Hỏi giảng viên để lấy mã lớp.' };

  const db = getDb();
  if (db.prepare('SELECT 1 FROM users WHERE username = ? OR email = ?').get(username, email)) {
    return { error: 'Tên đăng nhập hoặc email đã được sử dụng.' };
  }
  const r = db.prepare(
    'INSERT INTO users (username, email, password_hash, full_name, student_id) VALUES (?, ?, ?, ?, ?)',
  ).run(username, email, bcrypt.hashSync(input.password, 10), input.fullName.trim(), input.studentId.trim());
  return { user: db.prepare(`SELECT ${USER_COLS} FROM users WHERE id = ?`).get(r.lastInsertRowid) as User };
}

export function login(identifier: string, password: string): { error: string } | { user: User; sessionId: string } {
  const db = getDb();
  const id = identifier.trim().toLowerCase();
  const row = db.prepare(`SELECT ${USER_COLS}, password_hash FROM users WHERE username = ? OR email = ?`).get(id, id) as
    | (User & { password_hash: string })
    | undefined;
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return { error: 'Sai tên đăng nhập hoặc mật khẩu.' };
  }
  const sessionId = randomUUID();
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(
    sessionId, row.id, toDbTime(Date.now() + SESSION_DAYS * 86400_000),
  );
  const user: User = { id: row.id, username: row.username, email: row.email, full_name: row.full_name, student_id: row.student_id, role: row.role, created_at: row.created_at };
  return { user, sessionId };
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== '1',
  sameSite: 'lax' as const,
  maxAge: SESSION_DAYS * 86400,
  path: '/',
};

export async function getCurrentUser(): Promise<User | null> {
  const sid = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  const db = getDb();
  const s = db.prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?').get(sid) as
    | { user_id: number; expires_at: string }
    | undefined;
  if (!s) return null;
  if ((parseDbTime(s.expires_at) ?? 0) < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sid);
    return null;
  }
  return (db.prepare(`SELECT ${USER_COLS} FROM users WHERE id = ?`).get(s.user_id) as User) ?? null;
}

export async function requireUser(): Promise<User> {
  const u = await getCurrentUser();
  if (!u) redirect('/login');
  return u;
}

export async function logout() {
  const sid = (await cookies()).get(SESSION_COOKIE)?.value;
  if (sid) getDb().prepare('DELETE FROM sessions WHERE id = ?').run(sid);
}
