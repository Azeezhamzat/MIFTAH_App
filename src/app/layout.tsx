import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'مِفْتَاح — Miftāḥ',
  description: 'See the system. Build the language. A complete personal teacher of Arabic Nahw and Sarf.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg' },
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('miftah-theme');
    var theme = stored || 'system';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    var motion = localStorage.getItem('miftah-reduced-motion');
    if (motion === 'true') document.documentElement.classList.add('reduced-motion');
    var contrast = localStorage.getItem('miftah-high-contrast');
    if (contrast === 'true') document.documentElement.classList.add('high-contrast');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
