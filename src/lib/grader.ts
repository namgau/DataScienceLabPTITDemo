import 'server-only';
import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PY_HARNESS } from './py-harness';

export interface GradePayload {
  setup: string;
  cells: { id: string; code: string }[];
  tests: { exercise: string; name: string; code: string }[];
}

export interface GradeResult {
  setupError: string | null;
  cells: Record<string, { error: string | null; stdout: string }>;
  tests: { exercise: string; name: string; passed: boolean; message: string }[];
}

const ROOT = process.cwd();
const PYODIDE_DIR = path.join(ROOT, 'node_modules', 'pyodide');
const CACHE_DIR = path.join(ROOT, '.pyodide-cache');
const RUNNER = path.join(ROOT, 'grader', 'runner.mjs');
const READY_MARK = path.join(CACHE_DIR, '.ready');

const GRADE_TIMEOUT_MS = 120_000;
const BOOT_TIMEOUT_MS = 120_000;
const MAX_CONCURRENT = 2;

function sandboxArgs() {
  return [
    '--permission',
    `--allow-fs-read=${PYODIDE_DIR}`,
    `--allow-fs-read=${CACHE_DIR}`,
    `--allow-fs-read=${RUNNER}`,
    '--max-old-space-size=1024',
    RUNNER,
    PYODIDE_DIR,
    CACHE_DIR,
  ];
}

// Minimal environment: the sandbox can read process.env, so never pass secrets.
function sandboxEnv(): NodeJS.ProcessEnv {
  const env = {} as NodeJS.ProcessEnv;
  if (process.env.SystemRoot) env.SystemRoot = process.env.SystemRoot;
  return env;
}

let warming: Promise<void> | null = null;

/** Downloads wheels into the cache once, outside the sandbox (no student code runs). */
function ensureCache(): Promise<void> {
  if (fs.existsSync(READY_MARK)) return Promise.resolve();
  if (warming) return warming;
  warming = new Promise<void>((resolve, reject) => {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    const p = spawn(process.execPath, [RUNNER, PYODIDE_DIR, CACHE_DIR, '--warm'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('exit', (code) => {
      if (code === 0 && out.includes('@@WARM_OK')) {
        fs.writeFileSync(READY_MARK, new Date().toISOString());
        resolve();
      } else {
        warming = null;
        reject(new Error('Không tải được thư viện Python cho grader: ' + out.slice(-500)));
      }
    });
  });
  return warming;
}

interface Booted {
  proc: ChildProcess;
  ready: Promise<void>;
  stdout: { text: string };
}

function boot(): Booted {
  const proc = spawn(process.execPath, sandboxArgs(), { env: sandboxEnv(), stdio: ['pipe', 'pipe', 'pipe'] });
  const stdout = { text: '' };
  proc.stdout!.setEncoding('utf8');
  proc.stdout!.on('data', (d: string) => (stdout.text += d));
  let stderr = '';
  proc.stderr!.on('data', (d) => (stderr += d));
  const ready = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('Grader khởi động quá lâu'));
    }, BOOT_TIMEOUT_MS);
    const check = () => {
      if (stdout.text.includes('@@READY')) {
        clearTimeout(timer);
        proc.stdout!.off('data', check);
        resolve();
      }
    };
    proc.stdout!.on('data', check);
    proc.on('exit', () => {
      clearTimeout(timer);
      reject(new Error('Grader dừng bất thường: ' + stderr.slice(-400)));
    });
  });
  ready.catch(() => {});
  return { proc, ready, stdout };
}

// One pre-booted sandbox waits idle so a submission doesn't pay Pyodide's boot time.
let spare: Booted | null = null;
let active = 0;
const queue: (() => void)[] = [];

function takeWorker(): Booted {
  const w = spare && spare.proc.exitCode === null ? spare : boot();
  spare = null;
  setTimeout(() => {
    if (!spare) spare = boot();
  }, 500);
  return w;
}

async function acquire() {
  if (active >= MAX_CONCURRENT) await new Promise<void>((r) => queue.push(r));
  active++;
}

function release() {
  active--;
  queue.shift()?.();
}

export async function warmGrader() {
  await ensureCache();
  if (!spare) spare = boot();
}

export async function grade(payload: GradePayload): Promise<GradeResult> {
  await ensureCache();
  await acquire();
  try {
    const w = takeWorker();
    await w.ready;
    return await new Promise<GradeResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        w.proc.kill();
        reject(new GradeTimeout());
      }, GRADE_TIMEOUT_MS);
      w.proc.on('exit', () => {
        clearTimeout(timer);
        const text = w.stdout.text;
        const r = text.indexOf('@@RESULT ');
        if (r >= 0) {
          resolve(JSON.parse(text.slice(r + 9).split('\n')[0]));
          return;
        }
        const e = text.indexOf('@@ERROR ');
        reject(new Error(e >= 0 ? JSON.parse(text.slice(e + 8).split('\n')[0]) : 'Grader dừng bất thường (có thể do hết bộ nhớ).'));
      });
      w.proc.stdin!.write(JSON.stringify({ harness: PY_HARNESS, payload }) + '\n');
    });
  } finally {
    release();
  }
}

export class GradeTimeout extends Error {
  constructor() {
    super('Quá thời gian chấm (120 giây). Kiểm tra vòng lặp vô hạn hoặc code quá chậm.');
  }
}
