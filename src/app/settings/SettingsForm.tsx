'use client';

import { useState } from 'react';
import { updateSettingsAction } from '@/lib/actions/settings';

interface Profile {
  theme: string;
  reducedMotion: boolean;
  diacriticLevel: string;
  yorubaNotesEnabled: boolean;
  quietProgress: boolean;
  dailyGoalMinutes: number;
  studyIntensity: string;
  arabicOrientation: string;
}

function applyTheme(theme: string) {
  localStorage.setItem('miftah-theme', theme);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

function applyReducedMotion(on: boolean) {
  localStorage.setItem('miftah-reduced-motion', String(on));
  document.documentElement.classList.toggle('reduced-motion', on);
}

export default function SettingsForm({ profile }: { profile: Profile }) {
  const [theme, setTheme] = useState(profile.theme);
  const [reducedMotion, setReducedMotion] = useState(profile.reducedMotion);
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await updateSettingsAction(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="card p-6 space-y-5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">Appearance & accessibility</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Theme</label>
        <select
          name="theme"
          value={theme}
          onChange={(e) => { setTheme(e.target.value); applyTheme(e.target.value); }}
          className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
        >
          <option value="system">Match system</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="reducedMotion"
          checked={reducedMotion}
          onChange={(e) => { setReducedMotion(e.target.checked); applyReducedMotion(e.target.checked); }}
          className="rounded"
        />
        Reduce motion and animation
      </label>

      <div>
        <label className="block text-sm font-medium mb-1">Diacritic level</label>
        <select name="diacriticLevel" defaultValue={profile.diacriticLevel} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm">
          <option value="full">Full diacritics</option>
          <option value="partial">Partial diacritics</option>
          <option value="minimal">Minimal diacritics</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="yorubaNotesEnabled" defaultChecked={profile.yorubaNotesEnabled} className="rounded" />
        Show optional Yorùbá-aware contrast notes
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="quietProgress" defaultChecked={profile.quietProgress} className="rounded" />
        Quiet Progress — hide streaks, points, and competitive elements
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Study intensity</label>
          <select name="studyIntensity" defaultValue={profile.studyIntensity} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm">
            <option value="light">Light</option>
            <option value="standard">Standard</option>
            <option value="intensive">Intensive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daily minimum (min)</label>
          <input name="dailyGoalMinutes" type="number" min={3} max={180} defaultValue={profile.dailyGoalMinutes} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Arabic orientation</label>
        <select name="arabicOrientation" defaultValue={profile.arabicOrientation} className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm">
          <option value="msa">Modern Standard Arabic</option>
          <option value="quranic">Qur'anic Arabic</option>
          <option value="classical">Classical prose and poetry</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <button type="submit" className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-2.5">
        {saved ? 'Saved ✓' : 'Save settings'}
      </button>
    </form>
  );
}
