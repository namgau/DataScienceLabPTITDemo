import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getWeek, PASS_PCT, WEEKS } from '@/content';
import { requireUser } from '@/lib/auth';
import { quizAllowance, weekStatus } from '@/lib/progress';
import { findOpenAttempt } from '@/lib/quiz';
import { QuizRunner } from '@/components/QuizRunner';
import { TopBar } from '@/components/TopBar';

export async function generateMetadata(props: PageProps<'/week/[n]/quiz'>): Promise<Metadata> {
  return { title: `Trắc nghiệm tuần ${(await props.params).n}` };
}

export default async function QuizPage(props: PageProps<'/week/[n]/quiz'>) {
  const user = await requireUser();
  const week = getWeek(Number((await props.params).n));
  if (!week) notFound();
  const status = weekStatus(user.id, week.n, user.role === 'admin')!;
  if (!status.unlocked) redirect('/dashboard');
  const allow = quizAllowance(user.id, week);

  return (
    <>
      <TopBar user={user} current="roadmap" />
      <main className="wrap page page-narrow">
        <Link href={`/week/${week.n}`} className="back"><ArrowLeft size={16} /> Tuần {week.n}</Link>
        <QuizRunner
          meta={{
            week: week.n,
            title: week.title,
            count: week.quiz.questions.length,
            passPct: PASS_PCT,
            timeLimitMin: week.quiz.timeLimitMin,
            exam: !!week.exam,
            complete: week.gate === 'complete',
            allowed: allow.allowed,
            left: allow.left,
            limit: allow.limit,
            nextAt: allow.nextAt,
            hasOpen: !!findOpenAttempt(user.id, week),
            best: status.quizBest,
            lastWeek: WEEKS[WEEKS.length - 1].n,
          }}
        />
      </main>
    </>
  );
}
