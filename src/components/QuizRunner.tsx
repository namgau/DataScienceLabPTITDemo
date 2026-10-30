'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Clock, LoaderCircle, RotateCcw, X } from 'lucide-react';
import { Celebrate } from './Celebrate';

interface Q {
  id: string;
  kind: 'single' | 'multi' | 'numeric';
  prompt: string;
  code?: string;
  options?: [number, string][];
}
interface Attempt { attemptId: number; deadline: number | null; questions: Q[] }
interface Feedback { id: string; correct: boolean; explain?: string }
interface Result {
  score: number; passed: boolean; late: boolean; total: number; correctCount: number;
  feedback: Feedback[]; weekPassed: boolean; nextUnlocked: boolean;
}
type Answer = number | number[] | string;

export interface QuizMeta {
  week: number;
  title: string;
  count: number;
  passPct: number;
  timeLimitMin?: number;
  exam: boolean;
  complete: boolean;
  allowed: boolean;
  left: number;
  limit: number;
  nextAt: number | null;
  hasOpen: boolean;
  best: number | null;
  lastWeek: number;
}

const store = {
  get(id: number): Record<string, Answer> {
    try { return JSON.parse(localStorage.getItem(`dslab:quiz:${id}`) || '{}'); } catch { return {}; }
  },
  set(id: number, a: Record<string, Answer>) {
    try { localStorage.setItem(`dslab:quiz:${id}`, JSON.stringify(a)); } catch {}
  },
  clear(id: number) {
    try { localStorage.removeItem(`dslab:quiz:${id}`); } catch {}
  },
};

function answered(a: Answer | undefined) {
  return a !== undefined && a !== '' && !(Array.isArray(a) && a.length === 0);
}

function Countdown({ deadline, onExpire }: { deadline: number; onExpire: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const fired = useRef(false);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, deadline - now);
  useEffect(() => {
    if (left === 0 && !fired.current) {
      fired.current = true;
      onExpire();
    }
  }, [left, onExpire]);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return (
    <span className={`countdown ${left < 5 * 60000 ? 'is-low' : ''}`} role="timer" aria-live="off">
      <Clock size={16} /> {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

export function QuizRunner({ meta }: { meta: QuizMeta }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const start = async () => {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/quiz/${meta.week}/start`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Không bắt đầu được bài.');
    setAttempt(data);
    setAnswers(store.get(data.attemptId));
    setResult(null);
    window.scrollTo({ top: 0 });
  };

  const setAnswer = (id: string, a: Answer) => {
    setConfirming(false);
    setAnswers((prev) => {
      const next = { ...prev, [id]: a };
      if (attempt) store.set(attempt.attemptId, next);
      return next;
    });
  };

  const submit = useCallback(async (force = false) => {
    if (!attempt) return;
    const unanswered = attempt.questions.filter((q) => !answered(answers[q.id])).length;
    if (unanswered && !force) return setConfirming(true);
    setBusy(true);
    setError('');
    const res = await fetch(`/api/quiz/${meta.week}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId: attempt.attemptId, answers }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Nộp bài thất bại, thử lại.');
    store.clear(attempt.attemptId);
    setResult(data);
    setConfirming(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (data.nextUnlocked) setCelebrate(true);
    router.refresh();
  }, [attempt, answers, meta.week, router]);

  const fb = useMemo(() => new Map(result?.feedback.map((f) => [f.id, f])), [result]);
  const doneCount = attempt ? attempt.questions.filter((q) => answered(answers[q.id])).length : 0;

  if (!attempt) {
    return (
      <section className="quiz-intro">
        <h1 className="page-title">Trắc nghiệm · Tuần {meta.week}</h1>
        <p className="page-lede">{meta.title}</p>
        <ul className="rules">
          <li><b>{meta.count}</b> câu, gồm chọn một đáp án, chọn nhiều đáp án và điền số.</li>
          <li>{meta.complete ? 'Bài đánh giá đầu vào: chỉ cần nộp để mở Tuần 1, điểm dùng để xếp lộ trình.' : <>Cần đạt <b>{meta.passPct}%</b>. Câu chọn nhiều phải đúng toàn bộ mới được điểm.</>}</li>
          {meta.timeLimitMin && <li>Thời gian <b>{meta.timeLimitMin} phút</b>, tính từ lúc bắt đầu. Hết giờ bài tự nộp.</li>}
          <li>{meta.exam ? <>Chỉ được làm <b>1 lần</b>.</> : <>Tối đa <b>{meta.limit} lượt</b> trong 8 giờ. Thứ tự câu hỏi và đáp án được xáo trộn mỗi lượt.</>}</li>
          <li>Câu trả lời được lưu tạm trên trình duyệt nếu lỡ tải lại trang.</li>
        </ul>
        {meta.best !== null && <p className="muted">Điểm cao nhất hiện tại: <b>{meta.best}%</b></p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {meta.hasOpen ? (
          <button className="btn btn-primary btn-lg" onClick={start} disabled={busy}>
            {busy && <LoaderCircle className="spin" size={18} />} Tiếp tục bài đang làm <ArrowRight size={18} />
          </button>
        ) : meta.allowed ? (
          <button className="btn btn-primary btn-lg" onClick={start} disabled={busy}>
            {busy && <LoaderCircle className="spin" size={18} />} Bắt đầu làm bài <ArrowRight size={18} />
          </button>
        ) : (
          <p className="banner banner-warn">
            <Clock size={18} />
            {meta.exam ? 'Bạn đã dùng lượt làm bài duy nhất. Liên hệ giảng viên nếu cần làm lại.'
              : `Bạn đã hết lượt. Làm lại được từ ${new Date(meta.nextAt!).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}.`}
          </p>
        )}
      </section>
    );
  }

  return (
    <>
      {celebrate && <Celebrate nextWeek={meta.week < meta.lastWeek ? meta.week + 1 : null} onClose={() => setCelebrate(false)} />}

      {result ? (
        <section className={`result ${result.passed ? 'is-pass' : 'is-fail'}`} aria-live="polite">
          <div className="result-score">
            <b>{result.score}<small>%</small></b>
            <span>{result.correctCount}/{result.total} câu đúng</span>
          </div>
          <div className="result-copy">
            <h1>{meta.complete ? 'Đã nộp bài đầu vào' : result.passed ? 'Đạt yêu cầu' : 'Chưa đạt'}</h1>
            <p>
              {result.late ? 'Bài nộp sau khi hết giờ nên không được tính điểm. ' : ''}
              {meta.complete
                ? 'Kết quả đã được ghi nhận cho giảng viên.'
                : result.passed
                  ? result.weekPassed ? 'Bạn đã hoàn thành tuần này.' : 'Hãy hoàn thành bài lập trình để mở tuần tiếp theo.'
                  : `Cần ${meta.passPct}%. Xem lại các câu sai rồi thử lại — giải thích chi tiết sẽ hiện khi bạn đạt.`}
            </p>
            <div className="result-actions">
              <Link className="btn btn-ghost" href={`/week/${meta.week}`}>Về trang tuần</Link>
              {!result.passed && !meta.exam && (
                <button className="btn btn-primary" onClick={start} disabled={busy}><RotateCcw size={16} /> Làm lượt mới</button>
              )}
              {result.passed && !result.weekPassed && (
                <Link className="btn btn-primary" href={`/week/${meta.week}/lab`}>Sang bài lập trình <ArrowRight size={16} /></Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="quiz-bar">
          <span><b>Tuần {meta.week}</b> · đã trả lời {doneCount}/{attempt.questions.length}</span>
          <span className="quiz-bar-track"><i style={{ width: `${(100 * doneCount) / attempt.questions.length}%` }} /></span>
          {attempt.deadline && <Countdown deadline={attempt.deadline} onExpire={() => submit(true)} />}
        </div>
      )}

      <ol className="questions">
        {attempt.questions.map((q, i) => {
          const f = fb.get(q.id);
          const a = answers[q.id];
          const locked = !!result;
          return (
            <li key={q.id} className={`question ${f ? (f.correct ? 'is-correct' : 'is-wrong') : ''}`}>
              <div className="q-head">
                <span className="q-num">{i + 1}</span>
                <div className="q-body">
                  <p className="q-prompt">{q.prompt}</p>
                  {q.kind === 'multi' && <p className="q-hint">Chọn tất cả đáp án đúng</p>}
                  {q.code && <pre className="q-code">{q.code}</pre>}
                </div>
                {f && (
                  <span className={`q-mark ${f.correct ? 'ok' : 'bad'}`}>
                    {f.correct ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                    {f.correct ? 'Đúng' : 'Chưa đúng'}
                  </span>
                )}
              </div>

              {q.kind === 'numeric' ? (
                <input
                  className="input q-numeric"
                  inputMode="decimal"
                  placeholder="Nhập số, ví dụ 0.75"
                  value={typeof a === 'string' ? a : ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  disabled={locked}
                  aria-label={`Đáp án câu ${i + 1}`}
                />
              ) : (
                <div className="options" role={q.kind === 'single' ? 'radiogroup' : 'group'} aria-label={`Lựa chọn câu ${i + 1}`}>
                  {q.options!.map(([orig, text]) => {
                    const checked = q.kind === 'single' ? a === orig : Array.isArray(a) && a.includes(orig);
                    return (
                      <label key={orig} className={`option ${checked ? 'is-checked' : ''}`}>
                        <input
                          type={q.kind === 'single' ? 'radio' : 'checkbox'}
                          name={q.id}
                          checked={checked}
                          disabled={locked}
                          onChange={() => {
                            if (q.kind === 'single') setAnswer(q.id, orig);
                            else {
                              const cur = Array.isArray(a) ? a : [];
                              setAnswer(q.id, cur.includes(orig) ? cur.filter((x) => x !== orig) : [...cur, orig]);
                            }
                          }}
                        />
                        <span className="option-mark" />
                        <span>{text}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {f?.explain && <p className="q-explain">{f.explain}</p>}
            </li>
          );
        })}
      </ol>

      {!result && (
        <div className="quiz-submit">
          {error && <p className="form-error" role="alert">{error}</p>}
          {confirming && (
            <p className="banner banner-warn">
              Còn {attempt.questions.length - doneCount} câu chưa trả lời. Câu bỏ trống tính là sai.
            </p>
          )}
          <button className="btn btn-primary btn-lg" onClick={() => submit(confirming)} disabled={busy}>
            {busy && <LoaderCircle className="spin" size={18} />}
            {confirming ? 'Vẫn nộp bài' : 'Nộp bài'}
          </button>
        </div>
      )}
    </>
  );
}
