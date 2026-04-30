import '@testing-library/jest-dom';
import ko from './i18n/locales/ko.json';

function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, part) => acc?.[part], obj);
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => getNestedValue(ko, key) ?? key,
    i18n: { language: 'ko', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: () => {} },
}));
