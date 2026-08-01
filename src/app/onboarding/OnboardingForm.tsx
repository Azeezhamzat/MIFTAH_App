'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { saveOnboardingAction, type FormState } from '@/lib/actions/onboarding';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium py-2.5 transition-colors"
    >
      {pending ? 'Saving…' : 'Continue to placement assessment'}
    </button>
  );
}

export default function OnboardingForm() {
  const [state, formAction] = useFormState(saveOnboardingAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="motherTongue">Mother tongue</label>
          <select
            id="motherTongue"
            name="motherTongue"
            defaultValue="yoruba"
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            <option value="yoruba">Yorùbá</option>
            <option value="english">English</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="instructionalLanguage">Instructional language</label>
          <select
            id="instructionalLanguage"
            name="instructionalLanguage"
            defaultValue="english"
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            <option value="english">English</option>
            <option value="yoruba">Yorùbá</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="arabicOrientation">
          Which Arabic matters most to you right now?
        </label>
        <select
          id="arabicOrientation"
          name="arabicOrientation"
          defaultValue="msa"
          className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
        >
          <option value="msa">Modern Standard Arabic — reading, writing, structure</option>
          <option value="quranic">Qur'anic Arabic — understanding the text directly</option>
          <option value="classical">Classical prose and poetry</option>
          <option value="mixed">A mix — let the app balance it</option>
        </select>
        <p className="text-xs text-ink-400 mt-1">You can change this later; it only weights example selection, not core grammar.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="studyIntensity">Study intensity</label>
          <select
            id="studyIntensity"
            name="studyIntensity"
            defaultValue="intensive"
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          >
            <option value="light">Light — a few sessions a week</option>
            <option value="standard">Standard — daily</option>
            <option value="intensive">Intensive — several sessions a day</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="dailyGoalMinutes">Daily minimum (minutes)</label>
          <input
            id="dailyGoalMinutes"
            name="dailyGoalMinutes"
            type="number"
            min={3}
            max={180}
            defaultValue={25}
            className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="goalText">
          What do you want to be able to do with Arabic?
        </label>
        <textarea
          id="goalText"
          name="goalText"
          required
          rows={3}
          placeholder="e.g. Read and understand Arabic texts independently, without relying on translation."
          className="w-full rounded-lg border border-ink-900/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="yorubaNotesEnabled" defaultChecked className="rounded" />
        Show optional Yorùbá-aware contrast notes where they help explain an Arabic pattern
      </label>

      {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
