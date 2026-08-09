import path from 'path';

export const CONCEPTS_FILE = path.join(process.cwd(), 'content', 'concepts.ts');
export const LESSONS_FILE = path.join(process.cwd(), 'content', 'lessons.ts');
export const STUDIO_EXERCISES_FILE = path.join(process.cwd(), 'content', 'exercises', 'studio.ts');

export const CODE_PATTERN = /^[a-z][a-z0-9-]*$/;
