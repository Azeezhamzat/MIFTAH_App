import { prisma } from '@/lib/db';
import { normalizeArabic } from '@/lib/grading';
import { getYorubaNote } from '@/lib/tutor/yorubaNotes';

export interface TutorAnswer {
  text: string;
  uncertain: boolean;
  groundedOn: string[];
  intent: string;
}

const ARABIC_RANGE = /[؀-ۿ]+/g;

function meaningfulWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?()"']/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

export async function answerQuestion(params: {
  userId: string;
  question: string;
  contextConceptCode?: string;
  contextSentenceId?: string;
}): Promise<TutorAnswer> {
  const { userId, question, contextConceptCode, contextSentenceId } = params;
  const q = question.toLowerCase();

  // 1. Direct word-level question: "why is X accusative/nominative/genitive/..."
  const arabicMatches = question.match(ARABIC_RANGE);
  const caseKeywords = /(accusative|nominative|genitive|case|ending|منصوب|مرفوع|مجرور|نصب|رفع|جر)/i;
  if (arabicMatches && caseKeywords.test(q)) {
    const target = normalizeArabic(arabicMatches[0]);
    const tokens = await prisma.token.findMany({
      where: contextSentenceId ? { sentenceId: contextSentenceId } : undefined,
      take: 500,
    });
    const match = tokens.find((t) => normalizeArabic(t.surfaceVocalized).includes(target) || normalizeArabic(t.surfaceUnvocalized).includes(target));
    if (match) {
      const governor = match.governedByTokenId ? await prisma.token.findUnique({ where: { id: match.governedByTokenId } }) : null;
      const caseLabel = match.grammaticalCase ?? match.mood ?? 'no case (built word)';
      const text = `${match.surfaceVocalized} is ${caseLabel} because it functions as ${match.role}${governor ? `, governed by ${governor.surfaceVocalized}` : ''}. ${match.explanation}`;
      return { text, uncertain: false, groundedOn: [match.id], intent: 'why_case' };
    }
  }

  // 2. "harder example"
  if (/harder example|more difficult|challenge me/.test(q)) {
    const concept = contextConceptCode ? await prisma.concept.findUnique({ where: { code: contextConceptCode } }) : null;
    const exercise = await prisma.exercise.findFirst({
      where: concept ? { conceptId: concept.id, status: 'published' } : { status: 'published' },
      orderBy: { difficulty: 'desc' },
    });
    if (exercise) {
      return {
        text: `Try this: ${exercise.prompt}${exercise.promptArabic ? ` (${exercise.promptArabic})` : ''} — head to the lesson or review queue to submit an answer and get full feedback.`,
        uncertain: false,
        groundedOn: [exercise.id],
        intent: 'harder_example',
      };
    }
  }

  // 3. "three contrasting examples"
  if (/three (contrasting )?examples|contrast(ing)? examples|show me examples/.test(q)) {
    const concept = contextConceptCode ? await prisma.concept.findUnique({ where: { code: contextConceptCode } }) : null;
    const exercises = await prisma.exercise.findMany({
      where: { AND: [concept ? { conceptId: concept.id } : {}, { sentenceId: { not: null } }, { status: 'published' }] },
      include: { sentence: true },
      take: 3,
      distinct: ['sentenceId'],
    });
    const sentences = exercises.map((e) => e.sentence).filter(Boolean);
    if (sentences.length > 0) {
      const text = sentences.map((s) => `${s!.textVocalized} — ${s!.translationEnglish}`).join('\n');
      return { text, uncertain: false, groundedOn: sentences.map((s) => s!.id), intent: 'contrast_examples' };
    }
  }

  // 4. "explain more simply"
  if (/simpler|more simply|explain like|eli5|dumb it down/.test(q)) {
    const concept = contextConceptCode ? await prisma.concept.findUnique({ where: { code: contextConceptCode } }) : null;
    if (concept) {
      return { text: concept.whyItMatters, uncertain: false, groundedOn: [concept.id], intent: 'simplify' };
    }
  }

  // 5. Yoruba influence
  if (/yoruba|yorùbá/.test(q)) {
    const note = getYorubaNote(contextConceptCode);
    if (note) {
      return { text: note, uncertain: false, groundedOn: contextConceptCode ? [contextConceptCode] : [], intent: 'yoruba_note' };
    }
    return {
      text: "I don't have a reviewed Yorùbá contrast note for this specific point yet, so I won't guess. In general: Yorùbá has no case-ending system, no grammatical gender, no dual number, and verbs that don't inflect for person/gender/number the way Arabic verbs do — several of the patterns you're learning here are genuinely new structures, not relabeled Yorùbá ones.",
      uncertain: true,
      groundedOn: [],
      intent: 'yoruba_fallback',
    };
  }

  // 6. Missing prerequisite
  if (/prerequisite|what am i missing|missing/.test(q)) {
    const masteries = await prisma.conceptMastery.findMany({ where: { userId }, include: { concept: true } });
    const weakest = masteries
      .filter((m) => m.label === 'needs_review' || m.overallScore < 0.45)
      .sort((a, b) => a.overallScore - b.overallScore)[0];
    if (weakest) {
      return {
        text: `Based on your mastery data, ${weakest.concept.title} looks fragile (overall evidence: ${Math.round(weakest.overallScore * 100)}%). That's the most likely prerequisite gap behind recent mistakes.`,
        uncertain: false,
        groundedOn: [weakest.conceptId],
        intent: 'missing_prerequisite',
      };
    }
    return {
      text: 'I don\'t see a clearly fragile prerequisite in your mastery data yet — either you\'re early in the course, or your foundations are holding up. Keep going and I\'ll have more signal soon.',
      uncertain: true,
      groundedOn: [],
      intent: 'missing_prerequisite_unknown',
    };
  }

  // 7. Alternative analysis
  if (/alternative analysis|another analysis|different analysis|could this be/.test(q)) {
    if (contextSentenceId) {
      const alt = await prisma.alternativeAnalysis.findFirst({ where: { token: { sentenceId: contextSentenceId } } });
      if (alt) {
        return { text: alt.description, uncertain: false, groundedOn: [alt.id], intent: 'alternative_analysis' };
      }
    }
    return {
      text: 'I don\'t have a catalogued alternative analysis for this specific item. That doesn\'t mean one is impossible — it means this app hasn\'t verified one yet, so I won\'t invent one.',
      uncertain: true,
      groundedOn: [],
      intent: 'alternative_analysis_none',
    };
  }

  // 8. Test me / teach back
  if (/test me/.test(q)) {
    return { text: 'Head to your Review queue — it will give you retrieval practice without multiple choice, drawn from concepts you\'ve actually studied.', uncertain: false, groundedOn: [], intent: 'test_me' };
  }
  if (/teach.*back|let me teach/.test(q)) {
    const concept = contextConceptCode ? await prisma.concept.findUnique({ where: { code: contextConceptCode } }) : null;
    return {
      text: concept
        ? `Go ahead — explain ${concept.title} in your own words, as if teaching a beginner. I'll compare it against: "${concept.definition}"`
        : 'Pick a concept from your dashboard first, then come back and teach it to me.',
      uncertain: false,
      groundedOn: concept ? [concept.id] : [],
      intent: 'teach_back_invite',
    };
  }

  // 9. General grounded search across concepts and misconceptions
  const [concepts, misconceptions] = await Promise.all([
    prisma.concept.findMany(),
    prisma.misconception.findMany(),
  ]);
  const qWords = new Set(meaningfulWords(question));

  function overlapScore(text: string): number {
    const words = meaningfulWords(text);
    if (words.length === 0) return 0;
    const matches = words.filter((w) => qWords.has(w)).length;
    return matches / words.length;
  }

  const conceptScores = concepts.map((c) => ({ c, score: overlapScore(`${c.title} ${c.titleArabic} ${c.definition}`) }));
  const misconceptionScores = misconceptions.map((m) => ({ m, score: overlapScore(`${m.title} ${m.description} ${m.evidencePattern}`) }));

  const bestConcept = conceptScores.sort((a, b) => b.score - a.score)[0];
  const bestMisconception = misconceptionScores.sort((a, b) => b.score - a.score)[0];

  if (bestMisconception && bestMisconception.score > 0.15 && (!bestConcept || bestMisconception.score >= bestConcept.score)) {
    return {
      text: `This sounds like a known pattern: "${bestMisconception.m.title}." ${bestMisconception.m.correctModel} For example: ${bestMisconception.m.contrastExample}`,
      uncertain: false,
      groundedOn: [bestMisconception.m.id],
      intent: 'misconception_match',
    };
  }
  if (bestConcept && bestConcept.score > 0.15) {
    return {
      text: `${bestConcept.c.definition} ${bestConcept.c.whyItMatters}`,
      uncertain: false,
      groundedOn: [bestConcept.c.id],
      intent: 'concept_match',
    };
  }

  return {
    text:
      "I'm not confident I understood that from what's in the curriculum yet — I'd rather say so than guess. Try asking about a specific word (\"why is X accusative?\"), a concept you're studying, or say \"give me a harder example\" / \"test me\" / \"explain more simply.\"",
    uncertain: true,
    groundedOn: [],
    intent: 'fallback_uncertain',
  };
}
