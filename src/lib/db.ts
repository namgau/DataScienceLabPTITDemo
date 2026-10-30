import 'server-only';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'dslab.sqlite');

const globalForDb = globalThis as unknown as { __dslabDb?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.__dslabDb) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initDb(db);
    globalForDb.__dslabDb = db;
  }
  return globalForDb.__dslabDb;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      student_id TEXT DEFAULT '',
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week INTEGER NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      deadline TEXT,
      submitted_at TEXT,
      layout_json TEXT NOT NULL,
      answers_json TEXT,
      score INTEGER,
      voided INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_quiz_user_week ON quiz_attempts(user_id, week);

    CREATE TABLE IF NOT EXISTS lab_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week INTEGER NOT NULL,
      cells_json TEXT NOT NULL,
      results_json TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_lab_user_week ON lab_submissions(user_id, week);
  `);

  const hasAdmin = db.prepare("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1").get();
  if (!hasAdmin) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'dslab@2026';
    db.prepare(
      "INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, 'admin')",
    ).run(username, `${username}@dslab.local`, bcrypt.hashSync(password, 10), 'Giảng viên');
    console.log(`[dslab] Đã tạo tài khoản giảng viên "${username}". Đổi mật khẩu qua biến môi trường ADMIN_PASSWORD trước khi triển khai.`);
  }
}

/** SQLite datetime('now') is UTC without a zone marker. */
export function parseDbTime(s: string | null | undefined): number | null {
  return s ? Date.parse(s.replace(' ', 'T') + 'Z') : null;
}

export function toDbTime(ms: number): string {
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 19);
}
