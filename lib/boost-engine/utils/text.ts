// Palavras de ligação em português que ficam minúsculas no meio do título
// (nunca na primeira posição) — segue a convenção padrão de Title Case.
const LOWERCASE_WORDS = new Set([
  "e", "de", "da", "do", "das", "dos", "em", "com", "para",
  "a", "o", "as", "os", "no", "na", "nos", "nas",
]);

/**
 * Normaliza o nome de um pack para Title Case, independente de como foi
 * digitado na origem (TUDO MAIÚSCULO, tudo minúsculo, misto). Usado só na
 * apresentação — não altera o valor salvo no banco.
 */
export function toTitleCase(text: string): string {
  let isFirstWord = true;
  return text.replace(/\p{L}+/gu, (word) => {
    const lower = word.toLowerCase();
    const capitalize = isFirstWord || !LOWERCASE_WORDS.has(lower);
    isFirstWord = false;
    return capitalize ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
  });
}
