// Browser Python kernel for the lab notebook (Pyodide in a module Web Worker).
// Messages: { id, type: 'init' | 'reset' | 'exec' | 'grade', ... } → { id, ok, data | error }
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs';

let py = null;
const quiet = () => {};
const status = (text) => postMessage({ type: 'status', text });

async function init(harness, packages) {
  status('Đang khởi động Python…');
  py = await loadPyodide({ indexURL: PYODIDE_URL, stdout: quiet, stderr: quiet });
  if (packages.length) {
    status('Đang tải ' + packages.join(', ') + '…');
    await py.loadPackage(packages, { messageCallback: quiet, errorCallback: quiet });
  }
  py.runPython(harness);
}

async function loadImports(code) {
  try {
    await py.loadPackagesFromImports(code, { messageCallback: quiet, errorCallback: quiet });
  } catch {
    // Unknown module: the ImportError shows up in the cell output instead.
  }
}

self.onmessage = async (e) => {
  const { id, type } = e.data;
  try {
    let data = null;
    if (type === 'init') {
      await init(e.data.harness, e.data.packages);
    } else if (type === 'reset') {
      data = JSON.parse(py.globals.get('__dslab_reset')(e.data.setup));
    } else if (type === 'exec') {
      if (/\bimport\b/.test(e.data.code)) status('Đang tải thư viện…');
      await loadImports(e.data.code);
      data = JSON.parse(py.globals.get('__dslab_exec')(e.data.code, e.data.cellId));
    } else if (type === 'grade') {
      const p = JSON.parse(e.data.payload);
      await loadImports(p.cells.map((c) => c.code).join('\n'));
      data = JSON.parse(py.globals.get('__dslab_grade')(e.data.payload));
    }
    postMessage({ id, ok: true, data });
  } catch (err) {
    postMessage({ id, ok: false, error: String((err && err.message) || err) });
  }
};
