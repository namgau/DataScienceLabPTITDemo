// Sandboxed grader process. Spawned by src/lib/grader.ts with Node's permission
// model: it may only read the Pyodide distribution and the wheel cache, and it
// cannot write files or spawn processes. Student code runs inside Pyodide here.
//
// Protocol: prints "@@READY" once Pyodide and packages are loaded, then reads a
// single JSON line from stdin { harness, payload } and prints "@@RESULT <json>".
// With --warm it runs unsandboxed only to download wheels into the cache.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Pyodide's NODEFS reads fs constants through process.binding, which the
// permission model blocks. Provide just those constants.
Object.defineProperty(process, 'binding', {
  value: (name) => {
    if (name === 'constants') return { fs: fs.constants, os: os.constants };
    throw new Error('process.binding is disabled');
  },
  configurable: true,
});

const [pyodideDir, cacheDir, mode] = process.argv.slice(2);
const PRELOAD = ['numpy', 'pandas', 'scikit-learn'];
const WARM_EXTRA = ['matplotlib'];

const { loadPyodide } = await import(pathToFileURL(path.join(pyodideDir, 'pyodide.mjs')).href);
const quiet = () => {};
const py = await loadPyodide({ packageCacheDir: cacheDir, stdout: quiet, stderr: quiet });
await py.loadPackage(mode === '--warm' ? [...PRELOAD, ...WARM_EXTRA] : PRELOAD, { messageCallback: quiet, errorCallback: quiet });

if (mode === '--warm') {
  process.stdout.write('@@WARM_OK\n');
  process.exit(0);
}

process.stdout.write('@@READY\n');

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buf += chunk;
  const nl = buf.indexOf('\n');
  if (nl < 0) return;
  process.stdin.pause();
  const { harness, payload } = JSON.parse(buf.slice(0, nl));
  try {
    const allCode = payload.setup + '\n' + payload.cells.map((c) => c.code).join('\n');
    try {
      await py.loadPackagesFromImports(allCode, { messageCallback: quiet, errorCallback: quiet });
    } catch {
      // Missing package → the import error surfaces in the cell result instead.
    }
    py.runPython(harness);
    const grade = py.globals.get('__dslab_grade');
    const out = grade(JSON.stringify(payload));
    process.stdout.write('@@RESULT ' + out + '\n');
  } catch (e) {
    process.stdout.write('@@ERROR ' + JSON.stringify(String(e && e.message ? e.message : e).slice(-2000)) + '\n');
  }
  process.exit(0);
});
