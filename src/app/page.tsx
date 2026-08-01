import Link from 'next/link';
import ArabicText from '@/components/ArabicText';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

const CYCLE = ['Observe', 'Compare', 'Infer', 'Name', 'Manipulate', 'Produce', 'Explain', 'Retrieve', 'Transfer'];

const TOOLS = [
  {
    name: 'Iʿrāb X-Ray',
    nameArabic: 'إعراب',
    description: 'Select any word in a sentence to see its full morphology, syntax, governing element, and reasoning chain — or hide the answer and reason it out yourself.',
  },
  {
    name: 'Sentence Laboratory',
    nameArabic: 'مِخبَر الجملة',
    description: 'Flip a sentence from masculine to feminine, singular to plural, active to passive — and watch every dependent word, ending, and translation update in real time.',
  },
  {
    name: 'Morphology Forge',
    nameArabic: 'مِطبَعة الصرف',
    description: 'Drop a root into a pattern and watch the word form. Compare كَاتِب، كِتَاب، مَكْتُوب، مَكْتَب، كِتَابَة side by side.',
  },
  {
    name: 'Living Teacher',
    nameArabic: 'المعلّم الحيّ',
    description: 'Ask why a word is accusative, request a harder example, or teach a rule back — answered from a grounded grammatical knowledge base, not guesswork.',
  },
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 text-ink-900 dark:text-parchment-50">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <ArabicText text="مِفْتَاح" size="xl" className="text-indigo-700 dark:text-indigo-300" />
          <span className="text-xs uppercase tracking-[0.25em] text-ink-400">Miftāḥ</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/signin" className="text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 font-medium transition-colors"
          >
            Start learning
          </Link>
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <p className="text-jade-700 dark:text-jade-300 font-medium tracking-wide mb-4">See the system. Build the language.</p>
        <h1 className="text-4xl md:text-5xl font-serif font-semibold leading-tight text-balance">
          A complete personal teacher of Arabic <span className="text-indigo-700 dark:text-indigo-300">Naḥw</span> and{' '}
          <span className="text-jade-700 dark:text-jade-300">Ṣarf</span>
        </h1>
        <p className="mt-6 text-lg text-ink-600 dark:text-ink-300 max-w-2xl mx-auto">
          Not a digitized textbook. Not a quiz app. Miftāḥ diagnoses what you actually know, teaches through
          discovery rather than declaration, and proves mastery through recognition, formation, explanation, and
          transfer — so you can read Arabic you have never seen before, and explain why it works.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 font-medium transition-colors"
          >
            Begin the placement assessment
          </Link>
          <Link
            href="/signin"
            className="rounded-lg border border-ink-900/15 dark:border-white/15 px-6 py-3 font-medium hover:bg-ink-900/5 dark:hover:bg-white/5 transition-colors"
          >
            I already have an account
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="card p-8">
          <p className="text-xs uppercase tracking-widest text-ink-400 mb-4">Every concept moves through the same cycle</p>
          <div className="flex flex-wrap gap-2">
            {CYCLE.map((stage, i) => (
              <span key={stage} className="flex items-center gap-2">
                <span className="rounded-full bg-jade-50 dark:bg-jade-900/40 text-jade-800 dark:text-jade-200 px-3 py-1.5 text-sm font-medium">
                  {stage}
                </span>
                {i < CYCLE.length - 1 && <span className="text-ink-300" aria-hidden>→</span>}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-ink-500 max-w-3xl">
            You see كَتَبَ الطَّالِبُ الدَّرْسَ change to كَتَبَ الطَّالِبَانِ الدَّرْسَ, كَتَبَ الطُّلَّابُ الدَّرْسَ, and
            كُتِبَ الدَّرْسُ before a single Arabic grammatical term is introduced. The label always arrives after the
            meaning is already yours.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-serif font-semibold mb-8 text-center">Four laboratories, one mastery model</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((tool) => (
            <div key={tool.name} className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{tool.name}</h3>
                <ArabicText text={tool.nameArabic} className="text-indigo-600 dark:text-indigo-300" />
              </div>
              <p className="text-sm text-ink-600 dark:text-ink-300">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-6 py-10 text-center text-sm text-ink-400">
        Built on established Arabic grammar and morphology, an inductive method drawn from النحو الواضح, and the
        terminological precision of التحفة السنية — adapted to how a non-native adult learner actually acquires
        Arabic, not how a classical primer orders it for description.
      </footer>
    </div>
  );
}
