import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { WEEKS } from '@/content';
import { classCode, requireUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { weekStatuses } from '@/lib/progress';
import { TopBar } from '@/components/TopBar';

export const metadata: Metadata = { title: 'Giảng viên' };

export default async function AdminPage() {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/dashboard');
  const students = getDb().prepare(
    "SELECT id, username, full_name, student_id, created_at FROM users WHERE role = 'student' ORDER BY full_name COLLATE NOCASE",
  ).all() as { id: number; username: string; full_name: string; student_id: string; created_at: string }[];

  const rows = students.map((s) => {
    const st = weekStatuses(s.id);
    return { s, st, passed: st.filter((x) => x.passed).length };
  });
  const atWeek = (n: number) => rows.filter((r) => r.st.find((x) => x.n === n)?.unlocked && !r.st.find((x) => x.n === n)?.passed).length;

  return (
    <>
      <TopBar user={user} current="admin" />
      <main className="wrap page">
        <header className="admin-head">
          <div>
            <h1 className="page-title">Theo dõi học viên</h1>
            <p className="page-lede">{students.length} học viên · mã lớp để đăng ký: <code className="code-chip">{classCode()}</code></p>
          </div>
          <p className="muted small">Đổi mã lớp bằng biến môi trường <code>CLASS_CODE</code>.</p>
        </header>

        {students.length === 0 ? (
          <div className="empty">
            <h2>Chưa có học viên nào</h2>
            <p>Gửi đường dẫn trang đăng ký cùng mã lớp <code className="code-chip">{classCode()}</code> cho học viên. Tiến độ sẽ hiện ở đây ngay khi họ làm bài.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="grid-table">
              <thead>
                <tr>
                  <th scope="col" className="sticky-col">Học viên</th>
                  <th scope="col">Đã qua</th>
                  {WEEKS.map((w) => (
                    <th scope="col" key={w.n} title={w.title}>
                      T{w.n}
                      <small>{atWeek(w.n) || ''}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ s, st, passed }) => (
                  <tr key={s.id}>
                    <th scope="row" className="sticky-col">
                      <Link href={`/admin/student/${s.id}`}>
                        <b>{s.full_name}</b>
                        <small>{s.student_id || s.username}</small>
                      </Link>
                    </th>
                    <td className="num">{passed}/{WEEKS.length}</td>
                    {st.map((x) => {
                      const cls = x.passed ? 'is-done' : x.unlocked ? (x.quizBest !== null || x.labBest !== null ? 'is-work' : 'is-open') : 'is-locked';
                      const label = x.passed ? 'Đạt' : x.unlocked ? 'Đang làm' : 'Chưa mở';
                      return (
                        <td key={x.n} className={`cellstat ${cls}`} title={`Tuần ${x.n}: ${label} · TN ${x.quizBest ?? '–'} · Code ${x.labBest ?? '–'}`}>
                          {x.unlocked && (x.quizBest !== null || x.labBest !== null) ? (
                            <span>{x.quizBest ?? '–'}<i>/</i>{x.labBest ?? '–'}</span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ul className="legend">
          <li><span className="sw is-done" />Đạt</li>
          <li><span className="sw is-work" />Đang làm (điểm TN / code)</li>
          <li><span className="sw is-open" />Đã mở, chưa làm</li>
          <li><span className="sw is-locked" />Chưa mở</li>
          <li className="muted">Số nhỏ dưới tên cột: số học viên đang ở tuần đó</li>
        </ul>
      </main>
    </>
  );
}
