// gitshot brand colors — from the CLI's ANSI gradient
export const GRADIENT = {
  magenta: '#ff00af',
  purple: '#af5fff',
  blue: '#005fff',
  cyan: '#00d7ff',
  teal: '#00d787',
} as const;

export const GRADIENT_CSS = `linear-gradient(90deg, ${GRADIENT.magenta}, ${GRADIENT.purple}, ${GRADIENT.blue}, ${GRADIENT.cyan}, ${GRADIENT.teal})`;

// Catppuccin Mocha palette
export const C = {
  base: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
  surface0: '#313244',
  surface1: '#45475a',
  surface2: '#585b70',
  overlay0: '#6c7086',
  overlay1: '#7f849c',
  subtext0: '#a6adc8',
  subtext1: '#bac2de',
  text: '#cdd6f4',
  lavender: '#b4befe',
  blue: '#89b4fa',
  green: '#a6e3a1',
  red: '#f38ba8',
  yellow: '#f9e2af',
  peach: '#fab387',
  mauve: '#cba6f7',
  teal: '#94e2d5',
} as const;

export const FONTS = {
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;
