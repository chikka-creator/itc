import { cookies } from 'next/headers';
import { dictionaries } from '@itc/config';

export type Locale = 'id' | 'en';
export type Dictionary = typeof dictionaries.id;

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const c = cookieStore.get('NEXT_LOCALE')?.value;
  return c === 'en' ? 'en' : 'id';
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}