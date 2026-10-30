import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { fail } from '@/lib/api';

export async function GET() {
  const user = await getCurrentUser();
  return user ? NextResponse.json({ user }) : fail('Bạn cần đăng nhập.', 401);
}
