'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';

type Mode = 'login' | 'register';

const FIELDS: Record<Mode, { name: string; label: string; type?: string; autoComplete?: string; hint?: string; optional?: boolean }[]> = {
  login: [
    { name: 'identifier', label: 'Tên đăng nhập hoặc email', autoComplete: 'username' },
    { name: 'password', label: 'Mật khẩu', type: 'password', autoComplete: 'current-password' },
  ],
  register: [
    { name: 'fullName', label: 'Họ và tên', autoComplete: 'name' },
    { name: 'studentId', label: 'Mã sinh viên', optional: true, hint: 'Ví dụ: B22DCCN123' },
    { name: 'username', label: 'Tên đăng nhập', autoComplete: 'username', hint: 'Chữ thường, số, dấu chấm hoặc gạch dưới' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Mật khẩu', type: 'password', autoComplete: 'new-password', hint: 'Ít nhất 6 ký tự' },
    { name: 'classCode', label: 'Mã lớp', hint: 'Giảng viên cung cấp' },
  ],
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : { error: 'Không kết nối được máy chủ.' };
    if (!res?.ok) {
      setError(data.error || 'Có lỗi xảy ra, thử lại sau.');
      setBusy(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h1>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản học viên'}</h1>
      <p className="auth-lede">
        {mode === 'login' ? 'Tiếp tục lộ trình kiểm tra hằng tuần của bạn.' : 'Mỗi học viên một tài khoản. Tiến độ được lưu theo tài khoản.'}
      </p>
      <div className={mode === 'register' ? 'auth-grid' : undefined}>
        {FIELDS[mode].map((f) => (
          <label className="field" key={f.name}>
            <span className="field-label">
              {f.label}
              {f.optional && <em> · không bắt buộc</em>}
            </span>
            <input
              className="input"
              name={f.name}
              type={f.type ?? 'text'}
              autoComplete={f.autoComplete}
              required={!f.optional}
              aria-invalid={!!error || undefined}
            />
            {f.hint && <span className="field-hint">{f.hint}</span>}
          </label>
        ))}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
        {busy ? <LoaderCircle className="spin" size={18} /> : null}
        {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        {!busy && <ArrowRight size={18} />}
      </button>
      <p className="auth-switch">
        {mode === 'login' ? (
          <>Chưa có tài khoản? <Link href="/register">Đăng ký</Link></>
        ) : (
          <>Đã có tài khoản? <Link href="/login">Đăng nhập</Link></>
        )}
      </p>
    </form>
  );
}
