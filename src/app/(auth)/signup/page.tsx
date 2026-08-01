'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { signUpAction, type FormState } from '@/lib/actions/auth';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
    >
      {pending ? 'Creating account…' : 'Create your account'}
    </button>
  );
}

export default function SignUpPage() {
  const [state, formAction] = useFormState(signUpAction, initialState);

  return (
    <div>
      <h1 className="text-xl font-serif font-semibold text-ink-900 dark:text-parchment-50">Begin with Miftāḥ</h1>
      <p className="text-sm text-ink-500 mt-1 mb-6">
        See the system. Build the language. Create your learner account to start the placement assessment.
      </p>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink-700 dark:text-ink-200 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
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
            minLength={8}
            required
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
        <SubmitButton />
      </form>
      <p className="text-sm text-ink-500 mt-6 text-center">
        Already learning with Miftāḥ?{' '}
        <Link href="/signin" className="text-indigo-700 dark:text-indigo-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
