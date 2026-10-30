import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getWeek, PASS_PCT, WEEKS } from '@/content';
import { requireUser } from '@/lib/auth';
import { clientLab, lastSubmission } from '@/lib/lab';
import { weekStatus } from '@/lib/progress';
import { warmGrader } from '@/lib/grader';
import { LabNotebook } from '@/components/LabNotebook';
import { TopBar } from '@/components/TopBar';

export async function generateMetadata(props: PageProps<'/week/[n]/lab'>): Promise<Metadata> {
  return { title: `Bài lập trình tuần ${(await props.params).n}` };
}

export default async function LabPage(props: PageProps<'/week/[n]/lab'>) {
  const user = await requireUser();
  const week = getWeek(Number((await props.params).n));
  if (!week) notFound();
  const status = weekStatus(user.id, week.n, user.role === 'admin')!;
  if (!status.unlocked) redirect('/dashboard');

  // Someone opened a notebook: make sure a sandbox is warm for their submission.
  warmGrader().catch((e) => console.error('[grader] warm-up failed', e));

  const lab = clientLab(week);
  const last = lastSubmission(user.id, week.n);
  const initial = Object.fromEntries(lab.exercises.map((e) => [e.id, last?.cells[e.id] ?? e.starter]));

  return (
    <>
      <TopBar user={user} current="roadmap" />
      <main className="wrap page page-nb">
        <Link href={`/week/${week.n}`} className="back"><ArrowLeft size={16} /> Tuần {week.n}: {week.title}</Link>
        <LabNotebook
          week={week.n}
          lab={lab}
          userKey={String(user.id)}
          initialCells={initial}
          lastResult={last?.result ?? null}
          passPct={PASS_PCT}
          complete={week.gate === 'complete'}
          lastWeek={WEEKS[WEEKS.length - 1].n}
        />
      </main>
    </>
  );
}
