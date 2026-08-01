import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/session';
import PlacementRunner from './PlacementRunner';

export default async function PlacementPage() {
  const user = await requireUser();
  if (!user.learnerProfile) redirect('/onboarding');
  if (user.learnerProfile.placementCompletedAt) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-jade-700 dark:text-jade-300 mb-2">Step 2 of 2 — about 12–18 minutes</p>
          <h1 className="text-2xl font-serif font-semibold">Adaptive placement assessment</h1>
          <p className="text-sm text-ink-500 mt-2 max-w-md mx-auto">
            Answer honestly and move at your own pace. There is no penalty for "I don't know yet" — the goal is an
            accurate starting point, not a perfect score.
          </p>
        </div>
        <PlacementRunner />
      </div>
    </div>
  );
}
