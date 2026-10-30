import Link from 'next/link';
import { ArrowRight, Check, LockOpen } from 'lucide-react';
import { WEEKS, STAGES } from '@/content';
import { getCurrentUser } from '@/lib/auth';
import { OrbitHero } from '@/components/OrbitHero';
import { TopBar } from '@/components/TopBar';

export default async function Home() {
  const user = await getCurrentUser();
  const stages = [1, 2, 3, 4].map((s) => ({ s, ...STAGES[s], weeks: WEEKS.filter((w) => w.stage === s) }));

  return (
    <>
      <TopBar user={user} />
      <main>
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <h1 className="hero-title">
                Data Science <span>Lab</span>
              </h1>
              <p className="hero-sub">Kiểm tra hằng tuần · Khoa CNTT – PTIT</p>
              <p className="hero-lede">
                16 tuần từ Python đến Transformer. Mỗi tuần một bài trắc nghiệm và một notebook lập trình được chấm tự
                động. Đạt 80% cả hai thì tuần tiếp theo mới mở.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" href={user ? '/dashboard' : '/login'}>
                  {user ? 'Vào lộ trình của bạn' : 'Đăng nhập'} <ArrowRight size={18} />
                </Link>
                {!user && (
                  <Link className="btn btn-ghost btn-lg" href="/register">Tạo tài khoản</Link>
                )}
              </div>
              {!user && <p className="hero-note">Đăng ký cần mã lớp do giảng viên cung cấp.</p>}
            </div>
            <div className="hero-art">
              <OrbitHero />
            </div>
          </div>
        </section>

        <section className="demo">
          <div className="wrap">
            <h2 className="section-title">Một tuần học trông như thế này</h2>
            <div className="demo-strip">
              <figure className="demo-step">
                <figcaption><b>Trắc nghiệm</b>đề xáo trộn, chấm ngay, cần ≥ 80%.</figcaption>
                <div className="mini mini-quiz" aria-hidden>
                  <p>Gradient của f(x, y) = x² + 3xy + y² tại (1, 1) là:</p>
                  <span className="mini-opt is-picked"><i />(5, 5)</span>
                  <span className="mini-opt"><i />(2, 2)</span>
                  <span className="mini-opt"><i />(5, 3)</span>
                </div>
              </figure>
              <figure className="demo-step">
                <figcaption><b>Lập trình</b>notebook Python chạy ngay trên trình duyệt, nộp để chấm bằng test ẩn.</figcaption>
                <pre className="mini mini-code" aria-hidden>
                  <span className="c"># GRADED FUNCTION: compute_cost</span>{'\n'}
                  <span className="k">def</span> compute_cost(X, y, w, b):{'\n'}
                  {'    '}<span className="c">### START CODE HERE ###</span>{'\n'}
                  {'    '}err = X @ w + b - y{'\n'}
                  {'    '}<span className="k">return</span> (err ** 2).sum() / (2 * m){'\n'}
                  <span className="ok"><Check size={13} strokeWidth={3} /> 3/3 test đạt</span>
                </pre>
              </figure>
              <figure className="demo-step">
                <figcaption><b>Mở khoá</b>đạt cả hai, tuần kế tiếp sáng lên trên lộ trình.</figcaption>
                <div className="mini mini-unlock" aria-hidden>
                  <span className="node done"><Check size={16} strokeWidth={3} /></span>
                  <span className="rail" />
                  <span className="node next"><LockOpen size={16} /></span>
                  <p><b>Tuần 4</b> đã mở</p>
                </div>
              </figure>
            </div>
          </div>
        </section>

        <section className="roadmap-public">
          <div className="wrap">
            <h2 className="section-title">Lộ trình 16 tuần</h2>
            <div className="stage-cols">
              <div className="stage-col">
                <h3><span className="stage-dot" data-stage="0" />{STAGES[0].name}</h3>
                <ol>
                  <li><span className="wk">00</span>{WEEKS[0].title}</li>
                </ol>
              </div>
              {stages.map(({ s, name, weeks }) => (
                <div className="stage-col" key={s}>
                  <h3><span className="stage-dot" data-stage={s} />{name}</h3>
                  <ol>
                    {weeks.map((w) => (
                      <li key={w.n}><span className="wk">{String(w.n).padStart(2, '0')}</span>{w.title}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <span>Data Science Lab · Khoa Công nghệ Thông tin · Học viện Công nghệ Bưu chính Viễn thông</span>
          <span>Nghiên cứu &amp; Ứng dụng</span>
        </div>
      </footer>
    </>
  );
}
