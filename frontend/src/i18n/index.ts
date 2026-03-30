import enUS from './en-US';
import ptBR from './pt-BR';
import es from './es';

// Adicionar novos idiomas aqui: inclua no LOCALE_CONFIG e importe o arquivo de tradução acima.
export const LOCALE_CONFIG = {
  'pt-BR': { label: 'Português', flag: '🇧🇷' },
  'en-US': { label: 'English', flag: '🇺🇸' },
  es: { label: 'Español', flag: '🇪🇸' },
} as const;

export type SupportedLocale = keyof typeof LOCALE_CONFIG;

export const SUPPORTED_LOCALES = Object.keys(LOCALE_CONFIG) as SupportedLocale[];

export default {
  'en-US': enUS,
  'pt-BR': ptBR,
  es,
};
