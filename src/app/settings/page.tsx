import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import SettingsForm from './SettingsForm';
import AccountActions from './AccountActions';

export default async function SettingsPage() {
  const user = await requireOnboardedUser();

  return (
    <NavShell userName={user.name}>
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-2xl font-serif font-semibold mb-1">Settings & accessibility</h1>
          <p className="text-sm text-ink-500">{user.name} · {user.email}</p>
        </div>

        <SettingsForm profile={user.learnerProfile!} />

        <div className="card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400 mb-3">Placement</h2>
          <p className="text-sm text-ink-600 dark:text-ink-300 mb-3">
            Confidence in your current placement: {user.learnerProfile?.placementConfidence ? Math.round(user.learnerProfile.placementConfidence * 100) : '—'}%
          </p>
          <a href="/placement" className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            Retake the placement assessment →
          </a>
        </div>

        <AccountActions />
      </div>
    </NavShell>
  );
}
