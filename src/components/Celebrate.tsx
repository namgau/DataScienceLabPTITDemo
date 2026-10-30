'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, LockOpen } from 'lucide-react';

/** The unlock moment: the next week's node opens and orbs scatter along its orbit. */
export function Celebrate({ nextWeek, onClose }: { nextWeek: number | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-labelledby="celebrate-title" ref={ref}>
      <div className="celebrate-stage" aria-hidden>
        <span className="cel-ring cel-ring-1" />
        <span className="cel-ring cel-ring-2" />
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="cel-orb" style={{ ['--a' as string]: `${(360 / 14) * i}deg`, ['--k' as string]: i % 3 }} />
        ))}
        <span className="cel-node"><LockOpen size={34} /></span>
      </div>
      <h2 id="celebrate-title">{nextWeek === null ? 'Bạn đã hoàn thành lộ trình!' : `Tuần ${nextWeek} đã mở`}</h2>
      <p>Bạn đã đạt cả trắc nghiệm và bài lập trình của tuần này.</p>
      <div className="celebrate-actions">
        {nextWeek !== null && (
          <Link href={`/week/${nextWeek}`} className="btn btn-primary btn-lg">Sang tuần {nextWeek} <ArrowRight size={18} /></Link>
        )}
        <button className="btn btn-ghost btn-lg" onClick={onClose}>Xem kết quả</button>
      </div>
    </div>
  );
}
