import { requireUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.learnerProfile?.placementCompletedAt) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-jade-700 dark:text-jade-300 mb-2">Step 1 of 2</p>
          <h1 className="text-2xl font-serif font-semibold">Your learner profile</h1>
          <p className="text-sm text-ink-500 mt-2">
            This shapes how explanations are bridged for you — never which explanations exist.
          </p>
        </div>
        <div className="card p-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
