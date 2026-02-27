// TODO: I am going to change these colors
export const colors = {
  primary50: '#eff6ff',
  primary100: '#dbeafe',
  primary200: '#bfdbfe',
  primary300: '#93c5fd',
  primary400: '#60a5fa',
  primary500: '#3b82f6',
  primary600: '#2563eb',
  primary700: '#1d4ed8',
  primary800: '#1e40af',
  primary900: '#1e3a8a',

  neutral50: '#f9fafb',
  neutral100: '#f3f4f6',
  neutral200: '#e5e7eb',
  neutral300: '#d1d5db',
  neutral400: '#9ca3af',
  neutral500: '#6b7280',
  neutral600: '#4b5563',
  neutral700: '#374151',
  neutral800: '#1f2937',
  neutral900: '#111827',

  success500: '#22c55e',
  warning500: '#f59e0b',
  error500: '#ef4444',
} as const;

export type ColorToken = keyof typeof colors;
