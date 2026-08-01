import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="arabic text-3xl text-indigo-700 dark:text-indigo-300" dir="rtl">مِفْتَاح</span>
        </Link>
        <div className="card p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
