const PALETTE = [
  "#E74C3C", // red
  "#E67E22", // orange
  "#F39C12", // amber
  "#27AE60", // green
  "#1ABC9C", // teal
  "#2980B9", // blue
  "#8E44AD", // purple
  "#E91E63", // pink
  "#00BCD4", // cyan
  "#FF5722", // deep orange
  "#7CB342", // light green
  "#5E35B1", // deep purple
  "#FF8F00", // dark amber
  "#00897B", // dark teal
  "#1E88E5", // material blue
  "#D81B60", // dark pink
];

/**
 * Returns a deterministic color for a given identifier (name or id).
 * The same identifier always returns the same color.
 */
export function getAvatarColor(identifier: string): string {
  if (!identifier) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // convert to 32-bit int
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/**
 * Returns a random color from the palette (for newly created projects).
 */
export function getRandomProjectColor(): string {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}
