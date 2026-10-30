import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCode2, ListChecks } from 'lucide-react';
import { WEEKS, STAGES, PASS_PCT } from '@/content';
import { requireUser } from '@/lib/auth';
import { weekStatuses } from '@/lib/progress';
import { Roadmap } from '@/components/Roadmap';
import { TopBar } from '@/components/TopBar';

export const metadata: Metadata = { title: 'Lộ trình' };

export default async function Dashboard() {
  const user = await requireUser();
  const statuses = weekStatuses(user.id, user.role === 'admin');
  const passedCount = statuses.filter((s) => s.passed).length;
  const current = statuses.find((s) => s.unlocked && !s.passed);
  const cw = current ? WEEKS.find((w) => w.n === current.n)! : null;
  const firstName = user.full_name.trim().split(/\s+/).pop();

  return (
    <>
      <TopBar user={user} current="roadmap" />
      <main className="wrap page">
        <section className="dash-head">
          <div>
            <h1 className="page-title">Chào {firstName},</h1>
            <p className="page-lede">
              {passedCount === WEEKS.length
                ? 'Bạn đã hoàn thành toàn bộ lộ trình. Chúc mừng!'
                : `Bạn đã qua ${passedCount}/${WEEKS.length} tuần. Mỗi tuần cần đạt ${PASS_PCT}% trắc nghiệm và ${PASS_PCT}% bài code.`}
            </p>
          </div>
          <div className="segbar" role="img" aria-label={`Đã qua ${passedCount} trên ${WEEKS.length} tuần`}>
            {statuses.map((s) => (
              <span key={s.n} className={s.passed ? 'is-done' : s.unlocked ? 'is-current' : ''} />
            ))}
          </div>
        </section>

        {cw && current && (
          <section className="next-up">
            <div className="next-up-main">
              <span className="next-up-week">
                <small>Tuần</small>
                <b>{cw.n}</b>
              </span>
              <div>
                <p className="next-up-stage">{STAGES[cw.stage].name}{cw.exam ? ' · Bài kiểm tra' : ''}</p>
                <h2>{cw.title}</h2>
                <p className="next-up-summary">{cw.summary}</p>
              </div>
            </div>
            <div className="next-up-tasks">
              <Link href={`/week/${cw.n}/quiz`} className={`task-chip ${current.quizPassed ? 'is-done' : ''}`}>
                <ListChecks size={18} />
                <span>Trắc nghiệm</span>
                <b>{current.quizBest === null ? 'Chưa làm' : `${current.quizBest}%`}</b>
              </Link>
              <Link href={`/week/${cw.n}/lab`} className={`task-chip ${current.labPassed ? 'is-done' : ''}`}>
                <FileCode2 size={18} />
                <span>Bài code</span>
                <b>{current.labBest === null ? 'Chưa nộp' : `${current.labBest}%`}</b>
              </Link>
              <Link href={`/week/${cw.n}`} className="btn btn-primary">
                Vào tuần {cw.n} <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title">Lộ trình</h2>
          <Roadmap weeks={WEEKS.map(({ n, title, stage, exam }) => ({ n, title, stage, exam }))} statuses={statuses} />
          <ul className="legend">
            {[0, 1, 2, 3, 4].map((s) => (
              <li key={s}><span className="stage-dot" data-stage={s} />{STAGES[s].short}</li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
