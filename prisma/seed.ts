import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { stages, domains } from '../content/domains';
import { units } from '../content/units';
import { concepts } from '../content/concepts';
import { referenceWorks } from '../content/referenceWorks';
import { roots } from '../content/roots';
import { patterns } from '../content/patterns';
import { lexemes } from '../content/lexemes';
import { allSentences } from '../content/sentences/index';
import { lessons } from '../content/lessons';
import { misconceptions } from '../content/misconceptions';
import { allHandAuthoredExercises } from '../content/exercises/index';
import { placementQuestions } from '../content/placementQuestions';
import { readingPassages } from '../content/readingPassages';
import { computeOverallScore, scoreToLabel } from '../src/lib/mastery';
import { scheduleNextReview } from '../src/lib/srs';
import type { MasteryScoreSet } from '../src/lib/types';

const prisma = new PrismaClient();

async function clearDatabase() {
  const tables = [
    'TutorExplanationOutcome', 'TutorMessage', 'TutorConversation',
    'ContentReview', 'PlacementAttempt', 'PlacementQuestion',
    'ReadingPassage', 'DailySession', 'ReviewSchedule', 'ConceptMastery',
    'Attempt', 'MisconceptionLog', 'MisconceptionConcept', 'Misconception',
    'Hint', 'Exercise', 'AlternativeAnalysis', 'Dependency', 'Token',
    'ArabicSentence', 'VocabularyItem', 'Lexeme', 'Pattern', 'Root',
    'ReferenceMapping', 'ReferenceWork', 'LessonConcept', 'Lesson',
    'ConceptPrerequisite', 'Concept', 'Unit', 'Domain', 'Stage',
    'LearningGoal', 'LanguageProfile', 'LearnerProfile', 'User',
  ];
  for (const table of tables) {
    // eslint-disable-next-line no-await-in-loop
    await (prisma as unknown as Record<string, { deleteMany: () => Promise<unknown> }>)[
      table.charAt(0).toLowerCase() + table.slice(1)
    ].deleteMany();
  }
}

function conceptForSentencePrefix(code: string): string {
  if (code.startsWith('nom-')) return 'c-mubtada-khabar';
  if (code.startsWith('verb-')) return 'c-fi-l-fa-il';
  if (code.startsWith('pass-')) return 'c-passive-voice';
  if (code.startsWith('case-')) return 'c-three-cases';
  if (code.startsWith('part-')) return 'c-inna-wa-akhawatuha';
  if (code.startsWith('morph-')) return 'c-root-and-pattern';
  return 'c-word-classes';
}

async function main() {
  console.log('Clearing existing data...');
  await clearDatabase();

  console.log('Seeding stages and domains...');
  const stageIdByCode = new Map<string, string>();
  for (const s of stages) {
    const row = await prisma.stage.create({ data: s });
    stageIdByCode.set(s.code, row.id);
  }
  const domainIdByCode = new Map<string, string>();
  for (const d of domains) {
    const row = await prisma.domain.create({ data: d });
    domainIdByCode.set(d.code, row.id);
  }

  console.log('Seeding units...');
  const unitIdByCode = new Map<string, string>();
  for (const u of units) {
    const row = await prisma.unit.create({
      data: {
        code: u.code,
        title: u.title,
        titleArabic: u.titleArabic,
        description: u.description,
        order: u.order,
        domainId: domainIdByCode.get(u.domainCode)!,
        stageId: stageIdByCode.get(u.stageCode)!,
      },
    });
    unitIdByCode.set(u.code, row.id);
  }

  console.log('Seeding concepts...');
  const conceptIdByCode = new Map<string, string>();
  for (const c of concepts) {
    const row = await prisma.concept.create({
      data: {
        code: c.code,
        title: c.title,
        titleArabic: c.titleArabic,
        definition: c.definition,
        whyItMatters: c.whyItMatters,
        difficulty: c.difficulty,
        order: c.order,
        domainId: domainIdByCode.get(c.domainCode)!,
      },
    });
    conceptIdByCode.set(c.code, row.id);
  }
  for (const c of concepts) {
    for (const prereqCode of c.prerequisites) {
      await prisma.conceptPrerequisite.create({
        data: {
          conceptId: conceptIdByCode.get(c.code)!,
          prerequisiteId: conceptIdByCode.get(prereqCode)!,
        },
      });
    }
  }

  console.log('Seeding reference works and mappings...');
  const refWorkIdByCode = new Map<string, string>();
  for (const rw of referenceWorks) {
    const row = await prisma.referenceWork.create({ data: rw });
    refWorkIdByCode.set(rw.code, row.id);
  }
  for (const c of concepts) {
    if (c.nahwWadih) {
      await prisma.referenceMapping.create({
        data: {
          conceptId: conceptIdByCode.get(c.code)!,
          referenceWorkId: refWorkIdByCode.get('nahw_wadih')!,
          chapter: c.nahwWadih,
        },
      });
    }
    if (c.tuhfahSaniyyah) {
      await prisma.referenceMapping.create({
        data: {
          conceptId: conceptIdByCode.get(c.code)!,
          referenceWorkId: refWorkIdByCode.get('tuhfah_saniyyah')!,
          chapter: c.tuhfahSaniyyah,
        },
      });
    }
  }

  console.log('Seeding roots and patterns...');
  const rootIdByRadicals = new Map<string, string>();
  for (const r of roots) {
    const row = await prisma.root.create({ data: { radicals: r.radicals, meaningCore: r.meaningCore } });
    rootIdByRadicals.set(r.radicals, row.id);
  }
  const patternIdByLabel = new Map<string, string>();
  for (const p of patterns) {
    const row = await prisma.pattern.create({ data: p });
    patternIdByLabel.set(p.label, row.id);
  }

  console.log('Seeding lexemes...');
  for (const l of lexemes) {
    await prisma.lexeme.create({
      data: {
        vocalized: l.vocalized,
        unvocalized: l.unvocalized,
        partOfSpeech: l.partOfSpeech,
        meaningEnglish: l.meaningEnglish,
        notes: l.notes,
        rootId: l.rootRadicals ? rootIdByRadicals.get(l.rootRadicals) : undefined,
        patternId: l.patternLabel ? patternIdByLabel.get(l.patternLabel) : undefined,
      },
    });
  }

  console.log('Seeding annotated sentences, tokens, and dependencies...');
  const sentenceIdByCode = new Map<string, string>();
  const tokensByCode = new Map<string, Map<number, string>>();

  for (const s of allSentences) {
    const sentenceRow = await prisma.arabicSentence.create({
      data: {
        code: s.code,
        textVocalized: s.textVocalized,
        textUnvocalized: s.textUnvocalized,
        transliteration: s.transliteration,
        translationEnglish: s.translationEnglish,
        sourceType: s.sourceType ?? 'original',
        sourceRef: s.sourceRef,
        notes: s.notes,
        difficulty: s.difficulty ?? 1,
      },
    });
    sentenceIdByCode.set(s.code, sentenceRow.id);
    const positionToTokenId = new Map<number, string>();

    for (const t of s.tokens) {
      const tokenRow = await prisma.token.create({
        data: {
          sentenceId: sentenceRow.id,
          position: t.position,
          surfaceVocalized: t.surfaceVocalized,
          surfaceUnvocalized: t.surfaceUnvocalized,
          lemma: t.lemma,
          rootId: t.rootRadicals ? rootIdByRadicals.get(t.rootRadicals) : undefined,
          patternId: t.patternLabel ? patternIdByLabel.get(t.patternLabel) : undefined,
          prefix: t.prefix,
          stem: t.stem,
          suffix: t.suffix,
          partOfSpeech: t.partOfSpeech,
          person: t.person,
          gender: t.gender,
          number: t.number,
          definiteness: t.definiteness,
          state: t.state,
          grammaticalCase: t.grammaticalCase,
          mood: t.mood,
          role: t.role,
          marker: t.marker,
          markerType: t.markerType,
          translation: t.translation,
          contextualMeaning: t.contextualMeaning,
          explanation: t.explanation,
          traditionalExplanation: t.traditionalExplanation,
        },
      });
      positionToTokenId.set(t.position, tokenRow.id);

      if (t.alternatives) {
        for (const alt of t.alternatives) {
          await prisma.alternativeAnalysis.create({
            data: {
              tokenId: tokenRow.id,
              description: alt.description,
              isTraditional: alt.isTraditional ?? false,
              note: alt.note,
            },
          });
        }
      }
    }

    // second pass: attach governedByTokenId now that all tokens exist
    for (const t of s.tokens) {
      if (t.governedByPosition) {
        await prisma.token.update({
          where: { id: positionToTokenId.get(t.position)! },
          data: { governedByTokenId: positionToTokenId.get(t.governedByPosition) },
        });
      }
    }

    for (const dep of s.dependencies) {
      await prisma.dependency.create({
        data: {
          sentenceId: sentenceRow.id,
          headTokenId: positionToTokenId.get(dep.headPosition)!,
          dependentTokenId: positionToTokenId.get(dep.dependentPosition)!,
          relation: dep.relation,
          explanation: dep.explanation,
        },
      });
    }

    tokensByCode.set(s.code, positionToTokenId);
  }

  console.log('Seeding lessons and lesson-concept links...');
  const lessonIdByCode = new Map<string, string>();
  const lessonFirstConceptByCode = new Map<string, string>();
  for (const l of lessons) {
    const row = await prisma.lesson.create({
      data: {
        unitId: unitIdByCode.get(l.unitCode)!,
        code: l.code,
        title: l.title,
        titleArabic: l.titleArabic,
        summary: l.summary,
        order: l.order,
        estimatedMinutes: l.estimatedMinutes,
        observePrompt: JSON.stringify(l.observeSentenceCodes),
        discoveryJson: JSON.stringify({ prompt: l.discoveryPrompt }),
        microExplanation: l.microExplanation,
        deeperDetail: l.deeperDetail,
      },
    });
    lessonIdByCode.set(l.code, row.id);
    lessonFirstConceptByCode.set(l.code, l.concepts[0]?.conceptCode);
    for (const lc of l.concepts) {
      await prisma.lessonConcept.create({
        data: {
          lessonId: row.id,
          conceptId: conceptIdByCode.get(lc.conceptCode)!,
          role: lc.role,
        },
      });
    }
  }

  // Build sentenceCode -> conceptCode map from lessons' observeSentenceCodes, falling back to prefix heuristic.
  const conceptCodeForSentence = new Map<string, string>();
  for (const l of lessons) {
    const primaryConcept = l.concepts[0]?.conceptCode;
    if (!primaryConcept) continue;
    for (const sc of l.observeSentenceCodes) {
      if (!conceptCodeForSentence.has(sc)) conceptCodeForSentence.set(sc, primaryConcept);
    }
  }
  for (const s of allSentences) {
    if (!conceptCodeForSentence.has(s.code)) {
      conceptCodeForSentence.set(s.code, conceptForSentencePrefix(s.code));
    }
  }

  console.log('Seeding misconceptions...');
  const misconceptionIdByCode = new Map<string, string>();
  for (const m of misconceptions) {
    const row = await prisma.misconception.create({
      data: {
        code: m.code,
        title: m.title,
        description: m.description,
        evidencePattern: m.evidencePattern,
        correctModel: m.correctModel,
        contrastExample: m.contrastExample,
        repairGuidance: m.repairGuidance,
      },
    });
    misconceptionIdByCode.set(m.code, row.id);
    for (const conceptCode of m.conceptCodes) {
      await prisma.misconceptionConcept.create({
        data: { misconceptionId: row.id, conceptId: conceptIdByCode.get(conceptCode)! },
      });
    }
  }

  console.log('Seeding hand-authored exercises...');
  let exerciseOrder = 0;
  const exerciseIds: string[] = [];
  for (const e of allHandAuthoredExercises) {
    exerciseOrder += 1;
    const row = await prisma.exercise.create({
      data: {
        lessonId: e.lessonCode ? lessonIdByCode.get(e.lessonCode) : undefined,
        conceptId: conceptIdByCode.get(e.conceptCode)!,
        sentenceId: e.sentenceCode ? sentenceIdByCode.get(e.sentenceCode) : undefined,
        type: e.type,
        objective: e.objective,
        prompt: e.prompt,
        promptArabic: e.promptArabic,
        difficulty: e.difficulty,
        expectedAnswer: JSON.stringify(e.expectedAnswer),
        acceptedVariants: JSON.stringify(e.acceptedVariants ?? []),
        invalidPlausible: JSON.stringify(e.invalidPlausible ?? []),
        explanation: e.explanation,
        misconceptionTags: JSON.stringify(e.misconceptionTags ?? []),
        estimatedSeconds: e.estimatedSeconds ?? 30,
        reviewPriority: e.reviewPriority ?? 1,
        order: exerciseOrder,
      },
    });
    exerciseIds.push(row.id);
    for (let i = 0; i < e.hints.length; i += 1) {
      await prisma.hint.create({ data: { exerciseId: row.id, level: i + 1, text: e.hints[i] } });
    }
  }

  console.log('Generating supplementary drill exercises from the sentence bank...');
  for (const s of allSentences) {
    exerciseOrder += 1;
    const conceptCode = conceptCodeForSentence.get(s.code)!;
    const vowelRow = await prisma.exercise.create({
      data: {
        conceptId: conceptIdByCode.get(conceptCode)!,
        sentenceId: sentenceIdByCode.get(s.code),
        type: 'add_vowels',
        objective: 'Add full diacritics to an unvocalized sentence.',
        prompt: `Add full vowel marks (تشكيل) to: ${s.textUnvocalized}`,
        promptArabic: s.textUnvocalized,
        difficulty: Math.min(5, (s.difficulty ?? 1) + 1),
        expectedAnswer: JSON.stringify(s.textVocalized),
        acceptedVariants: JSON.stringify([]),
        invalidPlausible: JSON.stringify([]),
        explanation: `Full vocalization: ${s.textVocalized} — ${s.translationEnglish}`,
        misconceptionTags: JSON.stringify([]),
        estimatedSeconds: 40,
        reviewPriority: 1,
        order: exerciseOrder,
      },
    });
    await prisma.hint.create({ data: { exerciseId: vowelRow.id, level: 1, text: 'Work word by word: first decide each word\'s role, then its case, then its ending.' } });
    await prisma.hint.create({ data: { exerciseId: vowelRow.id, level: 2, text: 'Check whether any word here is governed by a preposition, a verb, or a particle like إنّ/كان.' } });

    const roleToken = s.tokens.find((t) => /fāʿil|mubtada|khabar|mafʿūl|nāʾib/i.test(t.role)) ?? s.tokens[Math.min(1, s.tokens.length - 1)];
    if (roleToken) {
      exerciseOrder += 1;
      const roleRow = await prisma.exercise.create({
        data: {
          conceptId: conceptIdByCode.get(conceptCode)!,
          sentenceId: sentenceIdByCode.get(s.code),
          type: 'identify_role',
          objective: 'Identify a word\'s grammatical role within a full sentence.',
          prompt: `In ${s.textVocalized}, what grammatical role does "${roleToken.surfaceVocalized}" play?`,
          promptArabic: s.textVocalized,
          difficulty: s.difficulty ?? 1,
          expectedAnswer: JSON.stringify(roleToken.role),
          acceptedVariants: JSON.stringify([]),
          invalidPlausible: JSON.stringify([]),
          explanation: roleToken.explanation,
          misconceptionTags: JSON.stringify([]),
          estimatedSeconds: 30,
          reviewPriority: 1,
          order: exerciseOrder,
        },
      });
      await prisma.hint.create({ data: { exerciseId: roleRow.id, level: 1, text: 'Check the word\'s case ending first.' } });
      await prisma.hint.create({ data: { exerciseId: roleRow.id, level: 2, text: roleToken.marker ? `Its marker is: ${roleToken.marker}.` : 'Consider what governs or is predicated of this word.' } });
    }
  }

  console.log('Seeding placement questions...');
  for (const q of placementQuestions) {
    await prisma.placementQuestion.create({
      data: {
        code: q.code,
        skillArea: q.skillArea,
        prompt: q.prompt,
        promptArabic: q.promptArabic,
        type: q.type,
        options: JSON.stringify(q.options ?? []),
        correctAnswer: JSON.stringify(q.correctAnswer),
        difficulty: q.difficulty,
      },
    });
  }

  console.log('Seeding reading passages...');
  for (const p of readingPassages) {
    const sentenceIds = p.sentenceCodes.map((c) => sentenceIdByCode.get(c)).filter(Boolean);
    await prisma.readingPassage.create({
      data: {
        title: p.title,
        level: p.level,
        textVocalized: p.textVocalized,
        vocabPreview: JSON.stringify(p.vocabPreview),
        comprehensionQuestions: JSON.stringify(p.comprehensionQuestions),
        sentenceIds: JSON.stringify(sentenceIds),
        recurringStructures: JSON.stringify(p.recurringStructures),
      },
    });
  }

  console.log('Seeding demo learner account...');
  const demoPasswordHash = await bcrypt.hash('learnarabic', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@miftah.app',
      name: 'Amina (Demo Learner)',
      passwordHash: demoPasswordHash,
    },
  });
  await prisma.languageProfile.create({
    data: { userId: demoUser.id, motherTongue: 'yoruba', instructionalLanguage: 'english' },
  });
  await prisma.learnerProfile.create({
    data: {
      userId: demoUser.id,
      arabicOrientation: 'msa',
      studyIntensity: 'intensive',
      dailyGoalMinutes: 25,
      placementCompletedAt: new Date(Date.now() - 6 * 86_400_000),
      placementConfidence: 0.78,
      recommendedStartNodeId: unitIdByCode.get('unit-nominal-sentence'),
      currentStreak: 4,
      longestStreak: 9,
      lastStudyDate: new Date(Date.now() - 86_400_000),
    },
  });
  await prisma.learningGoal.create({
    data: { userId: demoUser.id, text: 'Read and understand Arabic texts independently, without relying on translation.' },
  });
  await prisma.placementAttempt.create({
    data: {
      userId: demoUser.id,
      startedAt: new Date(Date.now() - 7 * 86_400_000),
      completedAt: new Date(Date.now() - 7 * 86_400_000 + 16 * 60_000),
      responses: JSON.stringify([]),
      recommendedStartUnitId: unitIdByCode.get('unit-nominal-sentence'),
      strengths: JSON.stringify(['Reading comfort with vocalized text', 'Recognizing اسم vs فعل vs حرف']),
      fragilePrerequisites: JSON.stringify(['Verb–subject agreement before a fronted subject', 'Distinguishing idafa genitive from prepositional genitive']),
      priorityGaps: JSON.stringify(['مبتدأ/خبر', 'الفعل والفاعل', 'الإعراب: المفهوم العام']),
      suggestedFirstWeek: JSON.stringify(['l-mubtada-khabar', 'l-khabar-types', 'l-verb-subject', 'l-irab-concept']),
      estimatedIntensity: 'intensive',
      confidenceLevel: 0.78,
    },
  });

  // Seed a realistic, evidence-based mastery + review state for a handful of concepts
  // the demo learner has already encountered, rather than arbitrary numbers.
  const demoMasterySeeds: { conceptCode: string; scores: MasteryScoreSet; days: number; dueInDays: number; lastResult: 'again' | 'hard' | 'good' | 'easy' }[] = [
    { conceptCode: 'c-word-classes', scores: { recognitionScore: 0.95, formationScore: 0.9, explanationScore: 0.85, transferScore: 0.8, retentionScore: 0.82, readingApplicationScore: 0.7 }, days: 5, dueInDays: 6, lastResult: 'easy' },
    { conceptCode: 'c-nominal-vs-verbal', scores: { recognitionScore: 0.9, formationScore: 0.75, explanationScore: 0.7, transferScore: 0.65, retentionScore: 0.68, readingApplicationScore: 0.55 }, days: 4, dueInDays: 3, lastResult: 'good' },
    { conceptCode: 'c-mubtada-khabar', scores: { recognitionScore: 0.8, formationScore: 0.6, explanationScore: 0.5, transferScore: 0.4, retentionScore: 0.45, readingApplicationScore: 0.3 }, days: 2, dueInDays: -1, lastResult: 'hard' },
    { conceptCode: 'c-fi-l-fa-il', scores: { recognitionScore: 0.55, formationScore: 0.4, explanationScore: 0.3, transferScore: 0.25, retentionScore: 0.3, readingApplicationScore: 0.2 }, days: 1, dueInDays: 0, lastResult: 'again' },
    { conceptCode: 'c-demonstratives', scores: { recognitionScore: 0.4, formationScore: 0.3, explanationScore: 0.2, transferScore: 0.15, retentionScore: 0.2, readingApplicationScore: 0.1 }, days: 1, dueInDays: 2, lastResult: 'good' },
  ];

  for (const seed of demoMasterySeeds) {
    const overall = computeOverallScore(seed.scores);
    const dueAt = new Date(Date.now() + seed.dueInDays * 86_400_000);
    const label = scoreToLabel({
      overall,
      distinctDaysPracticed: seed.days,
      explanationScore: seed.scores.explanationScore,
      transferScore: seed.scores.transferScore,
      retentionScore: seed.scores.retentionScore,
      isOverdueForReview: dueAt.getTime() < Date.now(),
    });
    await prisma.conceptMastery.create({
      data: {
        userId: demoUser.id,
        conceptId: conceptIdByCode.get(seed.conceptCode)!,
        ...seed.scores,
        overallScore: overall,
        label,
        distinctDaysPracticed: seed.days,
        lastPracticedAt: new Date(Date.now() - 86_400_000),
      },
    });
    const srsResult = scheduleNextReview({ intervalDays: 2, easeFactor: 2.3, repetitions: seed.days }, seed.lastResult);
    await prisma.reviewSchedule.create({
      data: {
        userId: demoUser.id,
        conceptId: conceptIdByCode.get(seed.conceptCode)!,
        dueAt,
        intervalDays: srsResult.intervalDays,
        easeFactor: srsResult.easeFactor,
        repetitions: srsResult.repetitions,
        lastResult: seed.lastResult,
        lastReason: `Scheduled from a spacing algorithm after a "${seed.lastResult}" self-rating on the last review.`,
      },
    });
  }

  // A few realistic attempts for analytics.
  const sampleExercise = await prisma.exercise.findFirst({ where: { conceptId: conceptIdByCode.get('c-mubtada-khabar') } });
  if (sampleExercise) {
    for (let i = 0; i < 3; i += 1) {
      await prisma.attempt.create({
        data: {
          userId: demoUser.id,
          exerciseId: sampleExercise.id,
          response: JSON.stringify('الطالب'),
          isCorrect: i !== 1,
          score: i === 1 ? 0.4 : 1,
          confidence: i === 1 ? 2 : 3,
          responseTimeMs: 8000 + i * 1500,
          hintsUsed: i === 1 ? 1 : 0,
          attemptedAt: new Date(Date.now() - (3 - i) * 86_400_000),
        },
      });
    }
  }

  await prisma.misconceptionLog.create({
    data: {
      userId: demoUser.id,
      misconceptionId: misconceptionIdByCode.get('mis-first-noun-is-subject')!,
      status: 'active',
    },
  });

  console.log('Seed complete.');
  console.log(`  Domains: ${domains.length}, Units: ${units.length}, Concepts: ${concepts.length}`);
  console.log(`  Lessons: ${lessons.length}`);
  console.log(`  Sentences: ${allSentences.length}`);
  console.log(`  Roots: ${roots.length}, Patterns: ${patterns.length}, Lexemes: ${lexemes.length}`);
  console.log(`  Hand-authored exercises: ${allHandAuthoredExercises.length}`);
  console.log(`  Total exercises (incl. generated drills): ${exerciseOrder}`);
  console.log(`  Misconceptions: ${misconceptions.length}`);
  console.log(`  Placement questions: ${placementQuestions.length}`);
  console.log(`  Reading passages: ${readingPassages.length}`);
  console.log('  Demo login: demo@miftah.app / learnarabic');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
