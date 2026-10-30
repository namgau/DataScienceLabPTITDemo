import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { WEEKS } from '@/content';
import { requireUser } from '@/lib/auth';
import { getDb, parseDbTime } from '@/lib/db';
import { weekStatuses } from '@/lib/progress';
import type { LabResult } from '@/lib/lab';
import { TopBar } from '@/components/TopBar';
import { ResetQuizButton } from '@/components/ResetQuizButton';

export const metadata: Metadata = { title: 'Chi tiết học viên' };

const fmt = (s: string | null) =>
  s ? new Date(parseDbTime(s)!).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';

export default async function StudentPage(props: PageProps<'/admin/student/[id]'>) {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/dashboard');
  const id = Number((await props.params).id);
  const db = getDb();
  const s = db.prepare("SELECT id, username, email, full_name, student_id, created_at FROM users WHERE id = ? AND role = 'student'").get(id) as
    | { id: number; username: string; email: string; full_name: string; student_id: string; created_at: string }
    | undefined;
  if (!s) notFound();

  const statuses = weekStatuses(s.id);
  const attempts = db.prepare(
    'SELECT id, week, started_at, submitted_at, score, voided FROM quiz_attempts WHERE user_id = ? ORDER BY id DESC',
  ).all(s.id) as { id: number; week: number; started_at: string; submitted_at: string | null; score: number | null; voided: number }[];
  const subs = db.prepare(
    `SELECT l.week, l.cells_json, l.results_json, l.score, l.created_at, c.cnt FROM lab_submissions l
     JOIN (SELECT week, MAX(id) AS mid, COUNT(*) AS cnt FROM lab_submissions WHERE user_id = ? GROUP BY week) c ON l.id = c.mid`,
  ).all(s.id) as { week: number; cells_json: string; results_json: string; score: number; created_at: string; cnt: number }[];
  const subByWeek = new Map(subs.map((x) => [x.week, x]));
  const touched = WEEKS.filter((w) => attempts.some((a) => a.week === w.n) || subByWeek.has(w.n));

  return (
    <>
      <TopBar user={user} current="admin" />
      <main className="wrap page">
        <Link href="/admin" className="back"><ArrowLeft size={16} /> Danh sách học viên</Link>
        <header className="admin-head">
          <div>
            <h1 className="page-title">{s.full_name}</h1>
            <p className="page-lede">
              {s.student_id && <>{s.student_id} · </>}{s.username} · {s.email} · đăng ký {fmt(s.created_at)}
            </p>
          </div>
          <p className="admin-count"><b>{statuses.filter((x) => x.passed).length}</b>/{WEEKS.length} tuần đã qua</p>
        </header>

        {touched.length === 0 && <div className="empty"><h2>Học viên chưa làm bài nào</h2></div>}

        {touched.map((w) => {
          const st = statuses.find((x) => x.n === w.n)!;
          const qa = attempts.filter((a) => a.week === w.n);
          const sub = subByWeek.get(w.n);
          const res: LabResult | null = sub ? JSON.parse(sub.results_json) : null;
          const code: Record<string, string> = sub ? JSON.parse(sub.cells_json) : {};
          return (
            <section className="admin-week" key={w.n}>
              <header>
                <h2>Tuần {w.n}: {w.title}</h2>
                <span className={`pill ${st.passed ? 'pill-ok' : 'pill-muted'}`}>{st.passed ? 'Đạt' : 'Chưa đạt'}</span>
              </header>
              <div className="admin-week-grid">
                <div>
                  <h3>Trắc nghiệm</h3>
                  <table className="mini-table">
                    <thead><tr><th>Bắt đầu</th><th>Nộp</th><th>Điểm</th><th /></tr></thead>
                    <tbody>
                      {qa.map((a) => (
                        <tr key={a.id} className={a.voided ? 'is-voided' : ''}>
                          <td>{fmt(a.started_at)}</td>
                          <td>{a.submitted_at ? fmt(a.submitted_at) : 'đang làm'}</td>
                          <td className="num">{a.score ?? '–'}{a.score !== null && '%'}</td>
                          <td>{a.voided ? <small>đã huỷ lượt</small> : null}</td>
                        </tr>
                      ))}
                      {qa.length === 0 && <tr><td colSpan={4} className="muted">Chưa làm</td></tr>}
                    </tbody>
                  </table>
                  {qa.some((a) => !a.voided) && <ResetQuizButton userId={s.id} week={w.n} />}
                </div>
                <div>
                  <h3>Bài lập trình {sub && <small>· {sub.cnt} lần nộp · gần nhất {fmt(sub.created_at)} · {sub.score}%</small>}</h3>
                  {res ? (
                    res.exercises.map((e) => (
                      <details key={e.id} className="code-review">
                        <summary>
                          <span>{e.title}</span>
                          <span className="num">{e.passed}/{e.total} test</span>
                        </summary>
                        <pre>{code[e.id]}</pre>
                      </details>
                    ))
                  ) : (
                    <p className="muted">Chưa nộp</p>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
