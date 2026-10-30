import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Clock, FileCode2, ListChecks } from 'lucide-react';
import { getWeek, STAGES, PASS_PCT } from '@/content';
import { requireUser } from '@/lib/auth';
import { quizAllowance, weekStatus, QUIZ_WINDOW_HOURS } from '@/lib/progress';
import { TopBar } from '@/components/TopBar';

export async function generateMetadata(props: PageProps<'/week/[n]'>): Promise<Metadata> {
  const w = getWeek(Number((await props.params).n));
  return { title: w ? `Tuần ${w.n}: ${w.title}` : 'Không tìm thấy' };
}

function fmtTime(ms: number) {
  return new Date(ms).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

export default async function WeekPage(props: PageProps<'/week/[n]'>) {
  const user = await requireUser();
  const week = getWeek(Number((await props.params).n));
  if (!week) notFound();
  const status = weekStatus(user.id, week.n, user.role === 'admin')!;
  if (!status.unlocked) redirect('/dashboard');
  const allow = quizAllowance(user.id, week);
  const exCount = week.lab.exercises.length;
  const complete = week.gate === 'complete';

  return (
    <>
      <TopBar user={user} current="roadmap" />
      <main className="wrap page">
        <Link href="/dashboard" className="back"><ArrowLeft size={16} /> Lộ trình</Link>

        <header className="week-head">
          <span className="week-num" data-stage={week.stage}>{String(week.n).padStart(2, '0')}</span>
          <div>
            <p className="week-stage">{STAGES[week.stage].name}{week.exam ? ' · Bài kiểm tra' : ''}</p>
            <h1 className="page-title">{week.title}</h1>
            <p className="page-lede">{week.summary}</p>
            <ul className="chips">
              {week.topics.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </header>

        {status.passed && (
          <p className="banner banner-ok">
            <Check size={18} strokeWidth={3} />
            {complete ? 'Bạn đã hoàn thành bài test đầu vào.' : 'Bạn đã đạt tuần này.'}{' '}
            {week.n < 15 && <Link href={`/week/${week.n + 1}`}>Sang tuần {week.n + 1} <ArrowRight size={14} /></Link>}
          </p>
        )}

        <div className="tasks">
          <article className={`task ${status.quizPassed ? 'is-done' : ''}`}>
            <header>
              <ListChecks size={22} />
              <h2>Trắc nghiệm</h2>
              {status.quizPassed && <span className="pill pill-ok">{complete ? 'Đã nộp' : 'Đạt'}</span>}
            </header>
            <dl className="task-facts">
              <div><dt>Số câu</dt><dd>{week.quiz.questions.length}</dd></div>
              <div><dt>Điểm cao nhất</dt><dd>{status.quizBest === null ? '–' : `${status.quizBest}%`}</dd></div>
              <div><dt>{complete ? 'Yêu cầu' : 'Cần đạt'}</dt><dd>{complete ? 'Nộp bài' : `${PASS_PCT}%`}</dd></div>
              {week.quiz.timeLimitMin && <div><dt>Thời gian</dt><dd>{week.quiz.timeLimitMin} phút</dd></div>}
            </dl>
            <p className="task-note">
              {allow.exam
                ? allow.left > 0 ? 'Bài thi chỉ được làm một lần. Hãy chuẩn bị trước khi bắt đầu.' : 'Bạn đã dùng lượt làm bài duy nhất.'
                : allow.allowed
                  ? `Còn ${allow.left}/${allow.limit} lượt trong khung ${QUIZ_WINDOW_HOURS} giờ.`
                  : <><Clock size={14} /> Hết lượt. Làm lại được từ {fmtTime(allow.nextAt!)}.</>}
            </p>
            <Link href={`/week/${week.n}/quiz`} className="btn btn-primary">
              {status.quizSubmitted ? 'Xem / làm lại' : 'Làm bài'} <ArrowRight size={18} />
            </Link>
          </article>

          <article className={`task ${status.labPassed ? 'is-done' : ''}`}>
            <header>
              <FileCode2 size={22} />
              <h2>Bài lập trình</h2>
              {status.labPassed && <span className="pill pill-ok">{complete ? 'Đã nộp' : 'Đạt'}</span>}
            </header>
            <dl className="task-facts">
              <div><dt>Số bài</dt><dd>{exCount}</dd></div>
              <div><dt>Điểm cao nhất</dt><dd>{status.labBest === null ? '–' : `${status.labBest}%`}</dd></div>
              <div><dt>{complete ? 'Yêu cầu' : 'Cần đạt'}</dt><dd>{complete ? 'Nộp bài' : `${PASS_PCT}%`}</dd></div>
              <div><dt>Lần nộp</dt><dd>{status.labSubmissions}</dd></div>
            </dl>
            <p className="task-note">{week.lab.title}. Nộp không giới hạn số lần; tính điểm cao nhất.</p>
            <Link href={`/week/${week.n}/lab`} className="btn btn-primary">
              Mở notebook <ArrowRight size={18} />
            </Link>
          </article>
        </div>

        <section className="practice">
          <h2>Thực hành trên lớp</h2>
          <p>{week.practice}</p>
        </section>
      </main>
    </>
  );
}
