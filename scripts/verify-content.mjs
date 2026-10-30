// Checks every lab: reference solutions must pass all public + hidden tests,
// and the untouched starter code must not. Also sanity-checks quiz answers.
// Usage: node scripts/verify-content.mjs [weekNumber ...]
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'dslab-verify-'));
execSync(
  `npx tsc --outDir "${OUT}" --module commonjs --target es2022 --skipLibCheck --rootDir src src/content/index.ts src/lib/py-harness.ts`,
  { cwd: ROOT, stdio: 'inherit' },
);
const require = createRequire(import.meta.url);
const { WEEKS } = require(path.join(OUT, 'content', 'index.js'));
const { PY_HARNESS } = require(path.join(OUT, 'lib', 'py-harness.js'));

const PYODIDE_DIR = path.join(ROOT, 'node_modules', 'pyodide');
const CACHE_DIR = path.join(ROOT, '.pyodide-cache');
const RUNNER = path.join(ROOT, 'grader', 'runner.mjs');

function run(payload) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [
      '--permission', `--allow-fs-read=${PYODIDE_DIR}`, `--allow-fs-read=${CACHE_DIR}`, `--allow-fs-read=${RUNNER}`,
      RUNNER, PYODIDE_DIR, CACHE_DIR,
    ], { env: { SystemRoot: process.env.SystemRoot }, stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', (d) => {
      out += d;
      if (out.includes('@@READY') && !p.sent) {
        p.sent = true;
        p.stdin.write(JSON.stringify({ harness: PY_HARNESS, payload }) + '\n');
      }
    });
    p.stderr.on('data', (d) => (err += d));
    p.on('exit', () => {
      const i = out.indexOf('@@RESULT ');
      if (i >= 0) resolve(JSON.parse(out.slice(i + 9).split('\n')[0]));
      else reject(new Error(out.slice(-600) + err.slice(-600)));
    });
  });
}

const only = process.argv.slice(2).map(Number);
let failures = 0;
const fail = (msg) => { failures++; console.log('  ✗ ' + msg); };

for (const w of WEEKS) {
  if (only.length && !only.includes(w.n)) continue;
  const t0 = Date.now();
  console.log(`Tuần ${w.n}: ${w.title}`);

  for (const q of w.quiz.questions) {
    if (q.kind !== 'numeric' && (q.options.length < 2)) fail(`${q.id}: thiếu lựa chọn`);
    if (q.kind === 'single' && !(q.answer >= 0 && q.answer < q.options.length)) fail(`${q.id}: đáp án ngoài phạm vi`);
    if (q.kind === 'multi' && q.answer.some((a) => a >= q.options.length)) fail(`${q.id}: đáp án ngoài phạm vi`);
  }

  const tests = w.lab.exercises.flatMap((e) => [...e.tests, ...e.hidden].map((t) => ({ exercise: e.id, name: t.name, code: t.code })));
  const sol = await run({ setup: w.lab.setup, cells: w.lab.exercises.map((e) => ({ id: e.id, code: e.solution })), tests });
  if (sol.setupError) fail('setup lỗi: ' + sol.setupError);
  for (const [id, c] of Object.entries(sol.cells)) if (c.error) fail(`lời giải ${id} lỗi: ${c.error}`);
  for (const t of sol.tests) if (!t.passed) fail(`lời giải không pass "${t.exercise} / ${t.name}": ${t.message}`);

  const st = await run({ setup: w.lab.setup, cells: w.lab.exercises.map((e) => ({ id: e.id, code: e.starter })), tests });
  for (const e of w.lab.exercises) {
    const ts = st.tests.filter((t) => t.exercise === e.id);
    if (ts.every((t) => t.passed)) fail(`code khởi đầu của ${e.id} đã pass hết test`);
    const c = st.cells[e.id];
    if (c?.error && /SyntaxError|IndentationError/.test(c.error)) fail(`code khởi đầu của ${e.id} lỗi cú pháp: ${c.error}`);
  }
  console.log(`  ${sol.tests.filter((t) => t.passed).length}/${sol.tests.length} test pass với lời giải · ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

fs.rmSync(OUT, { recursive: true, force: true });
console.log(failures ? `\n${failures} lỗi` : '\nTất cả đều ổn');
process.exit(failures ? 1 : 0);
