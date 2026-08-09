// Mirrors the `type` comment on the Exercise model in prisma/schema.prisma —
// kept here as the one shared list so the create-exercise API route and the
// Studio author form validate/offer the same set.
export const EXERCISE_TYPES = [
  'identify_role', 'select_ending', 'add_vowels', 'reorder', 'connect_dependency',
  'complete_conjugation', 'construct_from_root', 'transform_word', 'transform_sentence',
  'repair_error', 'complete_paradigm', 'translate_to_structure', 'compare_analyses',
  'explain_rule', 'partial_irab', 'full_irab', 'analyze_passage', 'free_production', 'teach_back',
] as const;
