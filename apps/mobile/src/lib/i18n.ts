import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ar, en } from './strings';

let arabicDigits = false;
/** Called by PrefsProvider so numbers inside translated strings follow the user's digit choice. */
export function setArabicDigits(on: boolean) {
  arabicDigits = on;
}

i18n
  .use({
    type: 'postProcessor',
    name: 'digits',
    process: (value: string) => (arabicDigits ? value.replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + Number(d))) : value),
  })
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    postProcess: ['digits'],
    returnNull: false,
  });

export default i18n;
