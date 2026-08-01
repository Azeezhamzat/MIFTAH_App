# Reference-mapping guide

Miftāḥ uses two reference works (`content/referenceWorks.ts`, seeded as `ReferenceWork` rows):

- **النحو الواضح في قواعد اللغة العربية** (al-Naḥw al-Wāḍiḥ) — used for inductive presentation style, example
  sequencing, and topic-coverage comparison. Its four-part method (أمثلة → ملاحظة ومناقشة → استنباط القاعدة → تطبيق
  القاعدة) is the direct inspiration for the app's Observe → Discover → Explain → Practice lesson cycle.
- **التحفة السنية بشرح المقدمة الآجرومية** (al-Tuḥfah al-Saniyyah) — used for traditional terminology, case/government
  relationships, and formal-analysis verification (the `traditionalExplanation` field on `Token` and the
  `traditionalExplanation`-style إعراب strings in exercises draw on this tradition).

Neither book is a binding syllabus. The app's curriculum order (`content/units.ts`, `content/concepts.ts`) is
organized by **acquisition order** — what a non-native adult learner needs first to make progress — not by either
book's chapter order, which is organized for **description**. See `README.md`'s note on this distinction.

## How a mapping is added

A `ReferenceMapping` row links one `Concept` to one `ReferenceWork` chapter/section. In content-authoring terms,
this is just two optional fields on a concept in `content/concepts.ts`:

```ts
{
  code: 'c-idafa',
  // ...
  nahwWadih: 'باب الإضافة',
  tuhfahSaniyyah: undefined, // omit if this book doesn't cover it separately
}
```

`prisma/seed.ts` turns these into `ReferenceMapping` rows automatically. The Reference Companion screen
(`/reference`) reads them back out, grouped by work, each linking to the corresponding lesson.

## Principles for mapping

1. **Map at the concept level, not the lesson level.** A lesson can bundle several concepts (e.g. "duals and sound
   plurals" is one lesson covering two concepts); each concept gets its own, more precise mapping.
2. **Only map to a chapter that genuinely covers the same idea**, even if the traditional chapter also covers
   material this app splits into several other concepts. It's fine for one traditional chapter to map to several
   `Concept` rows.
3. **Leave a mapping blank rather than force one.** Some app concepts (e.g. `c-marker-types`, which names and
   organizes something both books discuss implicitly but never as a single named topic) don't correspond to a clean
   chapter in either book — that's fine and expected, since the app's organization is acquisition-order, not
   description-order.
4. **Never require the learner to open Reference Mode.** The mapping exists so a learner *can* see "this app's
   lesson on X corresponds to al-Tuḥfah's chapter on Y" if they want the traditional framing or want to cross-check
   — never as a required reading assignment. `/reference` is purely opt-in browsing.

## Extending to a new reference work

1. Add it to `content/referenceWorks.ts` with a unique `code`.
2. Add `<newWorkCode>: 'chapter reference'`-style fields to the relevant concepts in `content/concepts.ts` (you'll
   need to extend the `ConceptSeed` interface and `prisma/seed.ts`'s mapping-creation loop to handle the new field
   — both are small, mechanical changes following the existing `nahwWadih`/`tuhfahSaniyyah` pattern).
3. Re-seed and verify the new work appears on `/reference` with its mappings.
