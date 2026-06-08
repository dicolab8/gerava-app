// src/theme/index.ts
export const lightColors = {
  primary: '#1A3A5C',
  primaryLight: '#2563A8',
  accent: '#F59E0B',
  accentSoft: '#FEF3C7',
  bg: '#F7F8FA',
  surface: '#FFFFFF',
  surface2: '#F0F2F5',
  border: '#E2E6EC',
  text: '#111827',
  text2: '#4B5563',
  text3: '#9CA3AF',
  success: '#10B981',
  danger: '#EF4444',
  info: '#3B82F6',
  white: '#FFFFFF',
};

export const darkColors = {
  primary: '#0F172A',
  primaryLight: '#60A5FA',
  accent: '#FBBF24',
  accentSoft: '#3A2B0B',
  bg: '#0B1120',
  surface: '#111827',
  surface2: '#1F2937',
  border: '#334155',
  text: '#F8FAFC',
  text2: '#CBD5E1',
  text3: '#94A3B8',
  success: '#34D399',
  danger: '#F87171',
  info: '#60A5FA',
  white: '#FFFFFF',
};

export const highContrastColors = {
  ...darkColors,
  primary: '#000000',
  primaryLight: '#FBBF24',
  accent: '#FBBF24',
  bg: '#000000',
  surface: '#0A0A0A',
  surface2: '#171717',
  border: '#FFFFFF',
  text: '#FFFFFF',
  text2: '#F5F5F5',
  text3: '#D4D4D4',
};

export const blueSoftColors = {
  ...lightColors,
  primary: '#1E3A8A',
  primaryLight: '#2563EB',
  bg: '#EFF6FF',
  surface2: '#DBEAFE',
  border: '#BFDBFE',
};

export const greenColors = {
  ...lightColors,
  primary: '#064E3B',
  primaryLight: '#059669',
  bg: '#F0FDF4',
  surface2: '#DCFCE7',
  border: '#BBF7D0',
};

export const colors = lightColors;

export const typography = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  serif: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};
