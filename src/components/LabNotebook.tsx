'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check, ChevronDown, CircleAlert, EyeOff, FlaskConical, LoaderCircle, Play, PlayCircle, RefreshCw, RotateCcw, Send, X,
} from 'lucide-react';
import type { ClientLab, LabResult } from '@/lib/lab';
import { PY_HARNESS } from '@/lib/py-harness';
import { CodeEditor } from './CodeEditor';
import { Markdown } from './Markdown';
import { Celebrate } from './Celebrate';

type KernelState = 'booting' | 'ready' | 'busy' | 'error';
interface CellOut { error: string | null; stdout: string; figures?: string[] }
interface TestOut { name: string; passed: boolean; message: string; hidden?: boolean }

// ---------- kernel ----------

function useKernel(lab: ClientLab) {
  // Primitive deps: a router.refresh() hands us a new lab object, which must not reboot Python.
  const packagesKey = lab.packages.join(',');
  const { setup } = lab;
  const worker = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>());
  const seq = useRef(0);
  const [state, setState] = useState<KernelState>('booting');
  const [statusText, setStatusText] = useState('Đang khởi động Python…');
  const [setupOut, setSetupOut] = useState<CellOut | null>(null);
  const [generation, setGeneration] = useState(0);

  const call = useCallback(<T,>(type: string, data: Record<string, unknown> = {}) => {
    return new Promise<T>((resolve, reject) => {
      const id = ++seq.current;
      pending.current.set(id, { resolve: resolve as (v: unknown) => void, reject });
      worker.current?.postMessage({ id, type, ...data });
    });
  }, []);

  const boot = useCallback(async () => {
    worker.current?.terminate();
    pending.current.forEach((p) => p.reject(new Error('Kernel đã khởi động lại')));
    pending.current.clear();
    setState('booting');
    setSetupOut(null);
    const w = new Worker('/py-worker.js', { type: 'module' });
    worker.current = w;
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'status') return setStatusText(m.text);
      const p = pending.current.get(m.id);
      if (!p) return;
      pending.current.delete(m.id);
      if (m.ok) p.resolve(m.data);
      else p.reject(new Error(m.error));
    };
    w.onerror = () => {
      setState('error');
      setStatusText('Không tải được Python. Kiểm tra kết nối mạng rồi khởi động lại.');
    };
    try {
      await call('init', { harness: PY_HARNESS, packages: packagesKey ? packagesKey.split(',') : [] });
      setStatusText('Đang chạy ô thiết lập…');
      setSetupOut(await call<CellOut>('reset', { setup }));
      setState('ready');
      setStatusText('Sẵn sàng');
      setGeneration((g) => g + 1);
    } catch (e) {
      if (worker.current === w) {
        setState('error');
        setStatusText(e instanceof Error ? e.message : 'Lỗi khởi động');
      }
    }
  }, [call, packagesKey, setup]);

  useEffect(() => {
    // Starting the worker is synchronising with an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    boot();
    return () => worker.current?.terminate();
  }, [boot]);

  const run = useCallback(async <T,>(type: string, data: Record<string, unknown>) => {
    setState('busy');
    try {
      return await call<T>(type, data);
    } finally {
      setState((s) => (s === 'busy' ? 'ready' : s));
      setStatusText('Sẵn sàng');
    }
  }, [call]);

  return { state, statusText, setupOut, boot, run, generation, call };
}

// ---------- drafts ----------

function useDraft(key: string, initial: Record<string, string>) {
  const [cells, setCells] = useState<Record<string, string>>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      // Drafts live in localStorage, which only exists after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && typeof saved === 'object') setCells((c) => ({ ...c, ...saved }));
    } catch {}
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(cells)); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [key, cells]);
  return [cells, setCells] as const;
}

// ---------- view pieces ----------

function Output({ out }: { out: CellOut | null }) {
  if (!out || (!out.stdout && !out.error && !out.figures?.length)) return null;
  return (
    <div className="cell-out">
      {out.stdout && <pre>{out.stdout}</pre>}
      {/* eslint-disable-next-line @next/next/no-img-element -- inline base64 plot from Python */}
      {out.figures?.map((f, i) => <img key={i} src={`data:image/png;base64,${f}`} alt={`Biểu đồ ${i + 1}`} />)}
      {out.error && <pre className="cell-err">{out.error}</pre>}
    </div>
  );
}

function Tests({ tests, title }: { tests: TestOut[]; title: string }) {
  const passed = tests.filter((t) => t.passed).length;
  const all = passed === tests.length;
  return (
    <div className={`tests ${all ? 'is-pass' : 'is-fail'}`}>
      <p className="tests-head">
        {all ? <Check size={16} strokeWidth={3} /> : <CircleAlert size={16} />}
        {title}: {passed}/{tests.length} test đạt
      </p>
      <ul>
        {tests.map((t, i) => (
          <li key={i} className={t.passed ? 'ok' : 'bad'}>
            {t.passed ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
            <span>
              {t.name}
              {t.hidden && <em className="tag-hidden"><EyeOff size={11} /> ẩn</em>}
              {!t.passed && t.message && <small>{t.message}</small>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GRADE_STEPS = ['Đóng gói code', 'Khởi chạy sandbox Python', 'Chạy test công khai và test ẩn', 'Tính điểm'];

function Grading() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, GRADE_STEPS.length - 1)), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="grading" role="status" aria-live="polite">
      <span className="grading-orb" aria-hidden />
      <div>
        <b>Đang chấm bài…</b>
        <ol>
          {GRADE_STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ---------- notebook ----------

export function LabNotebook({
  week, lab, userKey, initialCells, lastResult, passPct, complete, lastWeek,
}: {
  week: number;
  lab: ClientLab;
  userKey: string;
  initialCells: Record<string, string>;
  lastResult: LabResult | null;
  passPct: number;
  complete: boolean;
  lastWeek: number;
}) {
  const router = useRouter();
  const kernel = useKernel(lab);
  const [cells, setCells] = useDraft(`dslab:lab:${userKey}:${week}`, { ...initialCells, __scratch: initialCells.__scratch ?? '# Ô nháp: thử nghiệm tự do, không được chấm\n' });
  const [outs, setOuts] = useState<Record<string, CellOut | null>>({});
  const [tests, setTests] = useState<Record<string, TestOut[]>>({});
  const [running, setRunning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<(LabResult & { weekPassed?: boolean }) | null>(lastResult);
  const [submitError, setSubmitError] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const ready = kernel.state === 'ready';

  useEffect(() => {
    setOuts({});
  }, [kernel.generation]);

  const execCell = useCallback(async (id: string) => {
    setRunning(id);
    try {
      const out = await kernel.run<CellOut>('exec', { code: cells[id] ?? '', cellId: id });
      setOuts((o) => ({ ...o, [id]: out }));
    } catch (e) {
      setOuts((o) => ({ ...o, [id]: { error: e instanceof Error ? e.message : String(e), stdout: '' } }));
    } finally {
      setRunning(null);
    }
  }, [cells, kernel]);

  const runAll = async () => {
    setRunning('__all');
    try {
      await kernel.run('reset', { setup: lab.setup });
      for (const e of lab.exercises) {
        const out = await kernel.run<CellOut>('exec', { code: cells[e.id] ?? '', cellId: e.id });
        setOuts((o) => ({ ...o, [e.id]: out }));
      }
    } finally {
      setRunning(null);
    }
  };

  const checkCell = async (exId: string) => {
    const ex = lab.exercises.find((e) => e.id === exId)!;
    setRunning(exId + ':test');
    try {
      const r = await kernel.run<{ setupError: string | null; cells: Record<string, CellOut>; tests: TestOut[] }>('grade', {
        payload: JSON.stringify({
          setup: lab.setup,
          cells: lab.exercises.map((e) => ({ id: e.id, code: cells[e.id] ?? '' })),
          tests: ex.tests.map((t) => ({ exercise: ex.id, name: t.name, code: t.code })),
        }),
      });
      setTests((t) => ({ ...t, [exId]: r.tests }));
    } catch (e) {
      setTests((t) => ({ ...t, [exId]: [{ name: 'Không chạy được test', passed: false, message: e instanceof Error ? e.message : String(e) }] }));
    } finally {
      setRunning(null);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError('');
    const payload: Record<string, string> = {};
    for (const e of lab.exercises) payload[e.id] = cells[e.id] ?? e.starter;
    const res = await fetch(`/api/lab/${week}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cells: payload }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : { error: 'Không kết nối được máy chủ.' };
    setSubmitting(false);
    if (!res?.ok) return setSubmitError(data.error || 'Chấm bài thất bại.');
    setResult(data);
    if (data.nextUnlocked) setCelebrate(true);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    router.refresh();
  };

  const resetCell = (id: string, starter: string) => {
    setCells((c) => ({ ...c, [id]: starter }));
    setTests((t) => ({ ...t, [id]: [] }));
  };

  const busy = !!running || submitting;

  return (
    <div className="notebook">
      {celebrate && <Celebrate nextWeek={week < lastWeek ? week + 1 : null} onClose={() => setCelebrate(false)} />}

      <div className="nb-bar">
        <span className={`kernel kernel-${kernel.state}`}>
          <i aria-hidden />
          <span>Python · {kernel.state === 'busy' ? 'Đang chạy…' : kernel.statusText}</span>
        </span>
        <div className="nb-actions">
          <button className="btn btn-quiet btn-sm" onClick={runAll} disabled={!ready || busy} title="Chạy lại từ đầu tất cả các ô">
            <PlayCircle size={16} /> <span>Chạy tất cả</span>
          </button>
          <button className="btn btn-quiet btn-sm" onClick={() => kernel.boot()} disabled={submitting} title="Dừng và khởi động lại Python">
            <RefreshCw size={16} /> <span>Khởi động lại</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={submit} disabled={submitting}>
            {submitting ? <LoaderCircle size={16} className="spin" /> : <Send size={16} />} Nộp bài
          </button>
        </div>
      </div>

      <section className="nb-intro">
        <h1 className="page-title">{lab.title}</h1>
        <Markdown text={lab.intro} />
        <p className="muted small">
          Viết code giữa <code>### START CODE HERE ###</code> và <code>### END CODE HERE ###</code>. <kbd>Shift</kbd>+<kbd>Enter</kbd> để chạy ô.
          Code được tự lưu trên trình duyệt. Bấm <b>Nộp bài</b> để chấm bằng test công khai và test ẩn{complete ? '' : `; cần ${passPct}% để đạt`}.
        </p>
      </section>

      {(submitting || submitError || result) && (
        <div ref={resultRef} className="nb-result-anchor">
          {submitting && <Grading />}
          {submitError && <p className="banner banner-err"><CircleAlert size={18} /> {submitError}</p>}
          {result && !submitting && (
            <section className={`lab-result ${result.passed ? 'is-pass' : 'is-fail'}`}>
              <div className="result-score">
                <b>{result.score}<small>%</small></b>
                <span>{complete ? 'Đã ghi nhận' : result.passed ? 'Đạt' : `Cần ${passPct}%`}</span>
              </div>
              <ul className="lab-result-list">
                {result.exercises.map((e) => (
                  <li key={e.id}>
                    <a href={`#ex-${e.id}`}>{e.title}</a>
                    <span className="bar"><i style={{ width: `${(100 * e.passed) / Math.max(1, e.total)}%` }} /></span>
                    <span className="pts">{Math.round(e.earned * 10) / 10}/{e.points}</span>
                  </li>
                ))}
              </ul>
              {result.passed && result.weekPassed === false && (
                <p className="lab-result-note">Còn bài trắc nghiệm tuần này. <Link href={`/week/${week}/quiz`}>Làm trắc nghiệm</Link></p>
              )}
            </section>
          )}
        </div>
      )}

      <section className="cell cell-setup">
        <button className="cell-toggle" onClick={() => setShowSetup((s) => !s)} aria-expanded={showSetup}>
          <ChevronDown size={16} className={showSetup ? 'rot' : ''} /> Ô thiết lập (chạy tự động)
          {kernel.setupOut?.error && <span className="pill pill-err">lỗi</span>}
        </button>
        {showSetup && (
          <>
            <CodeEditor value={lab.setup} readOnly label="Ô thiết lập" />
            <Output out={kernel.setupOut} />
          </>
        )}
      </section>

      {lab.exercises.map((e, i) => {
        const ex = result?.exercises.find((x) => x.id === e.id);
        return (
          <section className="cell" key={e.id} id={`ex-${e.id}`}>
            <header className="cell-head">
              <span className="cell-num">Bài {i + 1}</span>
              <h2>{e.title}</h2>
              <span className="cell-pts">{e.points} điểm</span>
            </header>
            <Markdown text={e.instructions} />
            <div className={`cell-editor ${running === e.id ? 'is-running' : ''}`}>
              <CodeEditor
                value={cells[e.id] ?? e.starter}
                onChange={(v) => setCells((c) => ({ ...c, [e.id]: v }))}
                onRun={() => ready && !busy && execCell(e.id)}
                label={`Code bài ${i + 1}: ${e.title}`}
              />
            </div>
            <div className="cell-tools">
              <button className="btn btn-dark btn-sm" onClick={() => execCell(e.id)} disabled={!ready || busy}>
                {running === e.id ? <LoaderCircle size={15} className="spin" /> : <Play size={15} />} Chạy
              </button>
              <button className="btn btn-quiet btn-sm" onClick={() => checkCell(e.id)} disabled={!ready || busy}>
                {running === e.id + ':test' ? <LoaderCircle size={15} className="spin" /> : <FlaskConical size={15} />} Kiểm tra
              </button>
              <button className="btn btn-quiet btn-sm" onClick={() => resetCell(e.id, e.starter)} disabled={busy} title="Khôi phục code ban đầu">
                <RotateCcw size={15} /> Đặt lại
              </button>
              <span className="cell-meta">{e.tests.length} test công khai · {e.hiddenCount} test ẩn khi nộp</span>
            </div>
            <Output out={outs[e.id] ?? null} />
            {tests[e.id]?.length ? <Tests tests={tests[e.id]} title="Test công khai" /> : null}
            {ex && <Tests tests={ex.tests} title="Kết quả lần nộp gần nhất" />}
          </section>
        );
      })}

      <section className="cell cell-scratch">
        <header className="cell-head">
          <span className="cell-num">Nháp</span>
          <h2>Ô nháp</h2>
          <span className="cell-pts">không chấm</span>
        </header>
        <p className="muted small">Dùng các biến và hàm đã chạy ở trên. Có thể vẽ biểu đồ bằng <code>matplotlib.pyplot</code>.</p>
        <div className={`cell-editor ${running === '__scratch' ? 'is-running' : ''}`}>
          <CodeEditor
            value={cells.__scratch ?? ''}
            onChange={(v) => setCells((c) => ({ ...c, __scratch: v }))}
            onRun={() => ready && !busy && execCell('__scratch')}
            label="Ô nháp"
          />
        </div>
        <div className="cell-tools">
          <button className="btn btn-dark btn-sm" onClick={() => execCell('__scratch')} disabled={!ready || busy}>
            {running === '__scratch' ? <LoaderCircle size={15} className="spin" /> : <Play size={15} />} Chạy
          </button>
        </div>
        <Output out={outs.__scratch ?? null} />
      </section>
    </div>
  );
}
