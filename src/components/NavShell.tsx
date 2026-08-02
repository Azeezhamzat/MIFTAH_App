import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

const NAV_GROUPS: { title: string; items: { href: string; label: string; labelArabic?: string }[] }[] = [
  {
    title: 'Learn',
    items: [
      { href: '/dashboard', label: 'Home' },
      { href: '/lessons', label: 'All lessons' },
      { href: '/review', label: 'Review queue' },
      { href: '/curriculum', label: 'Grammar Constellation' },
      { href: '/library', label: 'Reading library' },
      { href: '/offline', label: 'Offline study' },
    ],
  },
  {
    title: 'Laboratories',
    items: [
      { href: '/xray', label: 'Iʿrāb X-Ray', labelArabic: 'إعراب' },
      { href: '/lab', label: 'Sentence Laboratory' },
      { href: '/forge', label: 'Morphology Forge' },
      { href: '/teacher', label: 'Living Teacher' },
    ],
  },
  {
    title: 'You',
    items: [
      { href: '/clinic', label: 'Misconception Clinic' },
      { href: '/notebook', label: 'Root & vocabulary notebook' },
      { href: '/analytics', label: 'Progress analytics' },
      { href: '/reference', label: 'Reference Companion' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/settings', label: 'Settings' },
      { href: '/studio', label: 'Content studio' },
    ],
  },
];

export default function NavShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-ink-900/5 dark:border-white/10 bg-parchment-100/60 dark:bg-ink-900/60">
        <div className="p-5 flex items-center justify-between md:block">
          <Link href="/dashboard" className="flex items-baseline gap-2">
            <span className="arabic text-2xl text-indigo-700 dark:text-indigo-300" dir="rtl">مِفْتَاح</span>
            <span className="text-xs uppercase tracking-widest text-ink-400">Miftāḥ</span>
          </Link>
        </div>
        <nav className="px-3 pb-6 space-y-6 overflow-x-auto md:overflow-visible">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-widest text-ink-400 mb-1.5">
                {group.title}
              </p>
              <ul className="flex md:block gap-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-ink-700 dark:text-ink-200 hover:bg-jade-50 dark:hover:bg-jade-900/30 hover:text-jade-800 dark:hover:text-jade-200 transition-colors whitespace-nowrap"
                    >
                      {item.label}
                      {item.labelArabic && (
                        <span className="arabic text-xs text-ink-400" dir="rtl">{item.labelArabic}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="hidden md:flex items-center justify-between px-5 py-4 border-t border-ink-900/5 dark:border-white/10">
          <span className="text-sm text-ink-500 truncate">{userName}</span>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
