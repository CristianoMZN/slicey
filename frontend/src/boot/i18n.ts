import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages, { SUPPORTED_LOCALES, type SupportedLocale } from 'src/i18n';

const LOCALE_KEY = 'jobbie_locale';

function detectLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
      return stored as SupportedLocale;
    }
  } catch {
    // ignore em ambientes sem localStorage (ex: SSR)
  }

  const browser = (navigator.language ?? 'en-US');
  if (SUPPORTED_LOCALES.includes(browser as SupportedLocale)) {
    return browser as SupportedLocale;
  }
  // Tenta match por prefixo: 'pt' → 'pt-BR', 'es-MX' → 'es'
  const prefix = browser.split('-')[0]!;
  const matched = SUPPORTED_LOCALES.find(
    (l) => l === prefix || l.toLowerCase().startsWith(prefix.toLowerCase()),
  );
  return matched ?? 'en-US';
}

// Type-define 'en-US' como schema mestre para os recursos de tradução
export type MessageSchema = (typeof messages)['en-US'];
export type MessageLanguages = SupportedLocale;

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export const i18n = createI18n({
  locale: detectLocale(),
  legacy: false,
  messages,
});

export default defineBoot(({ app }) => {
  app.use(i18n);
});

