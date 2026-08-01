'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton({ className = '' }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={`text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-100 transition-colors ${className}`}
    >
      Sign out
    </button>
  );
}
