/**
 * Map common colour names to their hex values.
 * Used to render actual colour swatches instead of text labels.
 */
export const COLOR_HEX: Record<string, string> = {
  black: '#222222',
  white: '#ffffff',
  brown: '#8B5A2B',
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  grey: '#888888',
  gray: '#888888',
  red: '#c44545',
  blue: '#4b6e94',
  navy: '#324a64',
  teal: '#469c9b',
  green: '#3a8a5c',
  yellow: '#e8c547',
  orange: '#d4874a',
  pink: '#d4839a',
  purple: '#7a5a8a',
  gold: '#c9a84c',
  silver: '#b0b0b0',
  maroon: '#6e2b3a',
  tan: '#d2b48c',
  chocolate: '#7B3F00',
  camel: '#C19A6B',
  burgundy: '#6e2b3a',
  charcoal: '#444444',
  khaki: '#C3B091',
  olive: '#556B2F',
  rust: '#B7410E',
  mustard: '#E1AD01',
  taupe: '#483C32',
  denim: '#1565C0',
}

/**
 * Determine the foreground colour (black or white) for optimal contrast
 * against a given background hex colour.
 */
export function contrastColor(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#222222' : '#ffffff'
}
