'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn btn-quiet btn-icon"
      aria-label="Đăng xuất"
      title="Đăng xuất"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
      }}
    >
      <LogOut size={18} strokeWidth={2} />
    </button>
  );
}
