export * from './theme';
import idDict from './i18n/id.json';
import enDict from './i18n/en.json';

export const dictionaries = {
  id: idDict,
  en: enDict,
} as const;

// Alias for convenience — web app imports as `i18n`
export const i18n = dictionaries;

export type Locale = keyof typeof dictionaries;
