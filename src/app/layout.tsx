import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Be_Vietnam_Pro({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
});

const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
  title: { default: 'DSLab PTIT — Kiểm tra hằng tuần', template: '%s · DSLab PTIT' },
  description: 'Bài kiểm tra trắc nghiệm và lập trình hằng tuần của Data Science Lab, Khoa CNTT – PTIT.',
  icons: { icon: '/brand/logo.jpg' },
};

export const viewport: Viewport = {
  themeColor: '#FFF7F0',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
