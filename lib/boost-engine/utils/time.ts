export function timeAgo(timestampMs: number): string {
  const diffMs = Date.now() - timestampMs;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "✨ atualizado hoje";
  if (diffDays === 1) return "✨ atualizado ontem";
  if (diffDays < 7) return `✨ atualizado há ${diffDays} dias`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return "atualizado há 1 semana";
  if (weeks < 5) return `atualizado há ${weeks} semanas`;
  return "atualizado recentemente";
}
