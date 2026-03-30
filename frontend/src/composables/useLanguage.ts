import { computed } from 'vue';
import { i18n } from 'boot/i18n';
import { LOCALE_CONFIG, SUPPORTED_LOCALES, type SupportedLocale } from 'src/i18n';

const LOCALE_KEY = 'jobbie_locale';

export { LOCALE_CONFIG, SUPPORTED_LOCALES, type SupportedLocale };

export function useLanguage() {
  const locale = computed<SupportedLocale>({
    get: () => i18n.global.locale.value,
    set: (val: SupportedLocale) => {
      i18n.global.locale.value = val;
      localStorage.setItem(LOCALE_KEY, val);
    },
  });

  function setLocale(lang: SupportedLocale) {
    locale.value = lang;
  }

  return {
    locale,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
    localeConfig: LOCALE_CONFIG,
  };
}
