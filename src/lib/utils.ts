export type ClassValue = string | number | boolean | null | undefined | Record<string, boolean> | ClassValue[];

function toValue(input: ClassValue): string {
  if (!input) return '';
  if (typeof input === 'string' || typeof input === 'number') return String(input);
  if (typeof input === 'boolean') return '';
  if (Array.isArray(input)) return input.map(toValue).filter(Boolean).join(' ');
  if (typeof input === 'object') return Object.entries(input).filter(([, v]) => Boolean(v)).map(([k]) => k).join(' ');
  return '';
}

export function cn(...inputs: ClassValue[]): string {
  const classNames = inputs.map(toValue).filter(Boolean).join(' ');
  return classNames
    .replace(/\s+/g, ' ')
    .trim();
}