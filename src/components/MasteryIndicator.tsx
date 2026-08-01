import type { MasteryLabel } from '@/lib/types';

const LABEL_STYLE: Record<MasteryLabel, { bg: string; text: string; ring: string; word: string }> = {
  new: { bg: 'bg-ink-100 dark:bg-ink-800', text: 'text-ink-600 dark:text-ink-300', ring: 'ring-ink-300', word: 'New' },
  emerging: { bg: 'bg-indigo-50 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-200', ring: 'ring-indigo-300', word: 'Emerging' },
  developing: { bg: 'bg-gold-400/10', text: 'text-gold-600 dark:text-gold-400', ring: 'ring-gold-400', word: 'Developing' },
  reliable: { bg: 'bg-jade-50 dark:bg-jade-900/40', text: 'text-jade-700 dark:text-jade-300', ring: 'ring-jade-400', word: 'Reliable' },
  strong: { bg: 'bg-jade-100 dark:bg-jade-800/50', text: 'text-jade-800 dark:text-jade-200', ring: 'ring-jade-500', word: 'Strong' },
  needs_review: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', ring: 'ring-red-400', word: 'Needs review' },
};

export default function MasteryIndicator({
  label,
  size = 'md',
}: {
  label: MasteryLabel;
  size?: 'sm' | 'md';
}) {
  const style = LABEL_STYLE[label];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ring-1 ring-inset ${style.bg} ${style.text} ${style.ring} ${padding} font-medium`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.word}
    </span>
  );
}
