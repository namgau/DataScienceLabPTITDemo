import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import type { WeekStatus } from '@/lib/progress';

export interface RoadmapWeek {
  n: number;
  title: string;
  stage: number;
  exam?: boolean;
}

const COLS = [125, 375, 625, 875];
const ROW_H = 200;
const PER_ROW = 4;

function pos(i: number) {
  const r = Math.floor(i / PER_ROW);
  const k = i % PER_ROW;
  return { x: r % 2 === 0 ? COLS[k] : COLS[PER_ROW - 1 - k], y: ROW_H / 2 + r * ROW_H };
}

/** Snake path through node 0…last; row changes are half-circle turns. */
function pathTo(last: number) {
  let d = `M${pos(0).x} ${pos(0).y}`;
  for (let i = 1; i <= last; i++) {
    const a = pos(i - 1);
    const b = pos(i);
    if (a.y === b.y) d += ` L${b.x} ${b.y}`;
    else d += ` A${ROW_H / 2} ${ROW_H / 2} 0 0 ${a.x > 500 ? 1 : 0} ${b.x} ${b.y}`;
  }
  return d;
}

function stateOf(s: WeekStatus) {
  return s.passed ? 'done' : s.unlocked ? 'current' : 'locked';
}

function Detail({ s }: { s: WeekStatus }) {
  if (s.passed) return <>Đạt · TN {s.quizBest ?? 0}% · Code {s.labBest ?? 0}%</>;
  if (!s.unlocked) return <>Chưa mở</>;
  if (s.quizBest === null && s.labBest === null) return <>Chưa làm</>;
  return <>TN {s.quizBest ?? '–'}{s.quizBest !== null && '%'} · Code {s.labBest ?? '–'}{s.labBest !== null && '%'}</>;
}

export function Roadmap({ weeks, statuses }: { weeks: RoadmapWeek[]; statuses: WeekStatus[] }) {
  const rows = Math.ceil(weeks.length / PER_ROW);
  const height = rows * ROW_H;
  const lastUnlocked = statuses.reduce((m, s, i) => (s.unlocked ? i : m), 0);
  const nodes = weeks.map((w, i) => ({ w, s: statuses[i], p: pos(i) }));

  return (
    <>
      <div className="roadmap" style={{ aspectRatio: `1000 / ${height}` }}>
        <svg viewBox={`0 0 1000 ${height}`} className="roadmap-svg" aria-hidden>
          <path d={pathTo(weeks.length - 1)} className="roadmap-track" />
          {lastUnlocked > 0 && (
            <path d={pathTo(lastUnlocked)} className="roadmap-progress" pathLength={1} />
          )}
        </svg>
        <ol className="roadmap-nodes">
          {nodes.map(({ w, s, p }, i) => {
            const st = stateOf(s);
            const body = (
              <>
                <span className="rm-dot" data-stage={w.stage}>
                  {st === 'done' ? <Check size={22} strokeWidth={3} /> : st === 'locked' ? <Lock size={18} /> : <b>{w.n}</b>}
                </span>
                <span className="rm-label">
                  <small>Tuần {w.n}{w.exam ? ' · Kiểm tra' : ''}</small>
                  <b>{w.title}</b>
                  <em><Detail s={s} /></em>
                </span>
              </>
            );
            return (
              <li
                key={w.n}
                className={`rm-node is-${st}`}
                style={{ left: `${p.x / 10}%`, top: `${(p.y / height) * 100}%`, ['--i' as string]: i }}
              >
                {s.unlocked ? <Link href={`/week/${w.n}`}>{body}</Link> : <div aria-disabled>{body}</div>}
              </li>
            );
          })}
        </ol>
      </div>

      <ol className="roadmap-list">
        {nodes.map(({ w, s }) => {
          const st = stateOf(s);
          const inner = (
            <>
              <span className="rm-dot" data-stage={w.stage}>
                {st === 'done' ? <Check size={18} strokeWidth={3} /> : st === 'locked' ? <Lock size={15} /> : <b>{w.n}</b>}
              </span>
              <span className="rm-label">
                <small>Tuần {w.n}{w.exam ? ' · Kiểm tra' : ''}</small>
                <b>{w.title}</b>
                <em><Detail s={s} /></em>
              </span>
            </>
          );
          return (
            <li key={w.n} className={`rm-row is-${st}`}>
              {s.unlocked ? <Link href={`/week/${w.n}`}>{inner}</Link> : <div aria-disabled>{inner}</div>}
            </li>
          );
        })}
      </ol>
    </>
  );
}
