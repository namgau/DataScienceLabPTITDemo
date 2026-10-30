import Image from 'next/image';
import Link from 'next/link';
import { BrandMark } from './TopBar';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth-art">
        <Link href="/" className="auth-brand" aria-label="Về trang chủ">
          <BrandMark />
        </Link>
        <Image src="/brand/banner.jpg" alt="Data Science Lab PTIT — Nghiên cứu và Ứng dụng" width={960} height={400} className="auth-banner" priority />
        <blockquote>
          “Mỗi tuần một bước nhỏ, chạy đúng rồi mới đi tiếp.”
        </blockquote>
      </aside>
      <main className="auth-main">{children}</main>
    </div>
  );
}
