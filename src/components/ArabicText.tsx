interface ArabicTextProps {
  text: string;
  size?: 'base' | 'lg' | 'xl';
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3';
}

/**
 * Renders Arabic with correct direction isolation regardless of the
 * surrounding paragraph's base direction — the one detail that breaks most
 * naive Arabic-in-English UIs when punctuation or numerals sit next to the
 * script.
 */
export default function ArabicText({ text, size = 'base', className = '', as = 'span' }: ArabicTextProps) {
  const Tag = as;
  const sizeClass = size === 'xl' ? 'arabic-xl' : size === 'lg' ? 'arabic-lg' : '';
  return (
    <Tag className={`arabic ${sizeClass} ${className}`} dir="rtl" lang="ar">
      {text}
    </Tag>
  );
}
