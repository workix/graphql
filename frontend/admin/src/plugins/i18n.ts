import { createI18n, useI18n } from 'vue-i18n';
import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';
import esES from '../locales/es-ES.json';

export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';

export const SUPPORTED_LOCALES: { code: SupportedLocale; name: string; flag: string }[] = [
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' }
];

const getInitialLocale = (): SupportedLocale => {
  const saved = localStorage.getItem('workix_admin_locale') as SupportedLocale;
  if (saved && ['pt-BR', 'en-US', 'es-ES'].includes(saved)) {
    return saved;
  }
  const browserLang = navigator.language;
  if (browserLang.startsWith('en')) return 'en-US';
  if (browserLang.startsWith('es')) return 'es-ES';
  return 'pt-BR';
};

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es-ES': esES
  }
});

export const setAdminLocale = (locale: SupportedLocale) => {
  (i18n.global.locale as any).value = locale;
  localStorage.setItem('workix_admin_locale', locale);
  document.querySelector('html')?.setAttribute('lang', locale);
};

export { useI18n };
export default i18n;
