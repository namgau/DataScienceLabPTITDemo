import Image from 'next/image';
import Link from 'next/link';
import type { User } from '@/lib/auth';
import { LogoutButton } from './LogoutButton';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <Image src="/brand/logo.jpg" alt="" width={40} height={40} className="brand-logo" priority />
      {!compact && (
        <span className="brand-text">
          <b>Data Science Lab</b>
          <small>CNTT · PTIT</small>
        </span>
      )}
    </span>
  );
}

export function TopBar({ user, current }: { user: User | null; current?: 'roadmap' | 'admin' }) {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href={user ? '/dashboard' : '/'} aria-label="Trang chủ DSLab">
          <BrandMark />
        </Link>
        {user && (
          <nav className="topnav" aria-label="Điều hướng chính">
            <Link href="/dashboard" aria-current={current === 'roadmap' ? 'page' : undefined}>Lộ trình</Link>
            {user.role === 'admin' && (
              <Link href="/admin" aria-current={current === 'admin' ? 'page' : undefined}>Giảng viên</Link>
            )}
          </nav>
        )}
        <div className="topbar-user">
          {user ? (
            <>
              <span className="who">
                <b>{user.full_name}</b>
                <small>{user.role === 'admin' ? `@${user.username}` : user.student_id || user.username}</small>
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link className="btn btn-primary btn-sm" href="/login">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
