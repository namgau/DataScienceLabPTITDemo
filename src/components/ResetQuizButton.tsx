'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function ResetQuizButton({ userId, week }: { userId: number; week: number }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'confirm' | 'busy'>('idle');
  if (state === 'confirm') {
    return (
      <div className="inline-confirm">
        <span>Huỷ các lượt đã dùng để học viên làm lại? Điểm cũ vẫn giữ trong lịch sử.</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={async () => {
            setState('busy');
            await fetch('/api/admin/reset', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, week }),
            });
            setState('idle');
            router.refresh();
          }}
        >
          Xác nhận
        </button>
        <button className="btn btn-quiet btn-sm" onClick={() => setState('idle')}>Thôi</button>
      </div>
    );
  }
  return (
    <button className="btn btn-quiet btn-sm" disabled={state === 'busy'} onClick={() => setState('confirm')}>
      <RotateCcw size={15} /> Cho làm lại trắc nghiệm
    </button>
  );
}
