'use client';

import { useI18nStore } from '@/stores/i18n.store';
import vi from '../../public/locales/vi.json';
import en from '../../public/locales/en.json';

type DeepKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DeepKeys<T[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K & string}`>
    : `${Prefix}${Prefix extends '' ? '' : '.'}${K & string}`;
}[keyof T];

const messages = { vi, en } as const;

type Messages = typeof vi;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string;
}

export function useTranslation() {
  const locale = useI18nStore((s) => s.locale);
  const dict = messages[locale] as unknown as Record<string, unknown>;

  function t(key: string, params?: Record<string, string | number>): string {
    let value = getNestedValue(dict, key);
    if (!value) {
      // fallback to Vietnamese
      const fallback = getNestedValue(
        messages.vi as unknown as Record<string, unknown>,
        key,
      );
      value = fallback || key;
    }
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
        value,
      );
    }
    return value;
  }

  return { t, locale };
}
