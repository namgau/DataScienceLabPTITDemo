import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AuthShell } from '@/components/AuthShell';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = { title: 'Đăng nhập' };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/dashboard');
  return (
    <AuthShell>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
