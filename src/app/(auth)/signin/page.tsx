'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-ink-400 py-10">Loading…</div>}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get('registered') === '1';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('That email and password combination was not recognized.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-xl font-serif font-semibold text-ink-900 dark:text-parchment-50">Welcome back</h1>
      <p className="text-sm text-ink-500 mt-1 mb-6">Continue exactly where your mastery model left off.</p>
      {justRegistered && (
        <p className="text-sm text-jade-700 dark:text-jade-300 bg-jade-50 dark:bg-jade-900/30 rounded-lg px-3 py-2 mb-4">
          Account created. Sign in to begin your placement assessment.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-700 dark:text-ink-200 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink-700 dark:text-ink-200 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-ink-500 mt-6 text-center">
        New to Miftāḥ?{' '}
        <Link href="/signup" className="text-indigo-700 dark:text-indigo-300 font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
