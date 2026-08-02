import { requireOnboardedUser } from '@/lib/session';
import NavShell from '@/components/NavShell';
import OfflineStudio from './OfflineStudio';

export default async function OfflinePage() {
  const user = await requireOnboardedUser();

  return (
    <NavShell userName={user.name}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-semibold mb-1">Offline study</h1>
          <p className="text-sm text-ink-500">
            Download the full curriculum once, then keep studying with no connection — on a plane, on the road, or
            anywhere your machine has no network.
          </p>
        </div>
        <OfflineStudio />
      </div>
    </NavShell>
  );
}
