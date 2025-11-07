import { getTranslation, TranslationKey, LanguageCode } from '../utils/translations';

export function useTranslation(selectedLanguage: string) {
  const t = (key: TranslationKey): string => {
    return getTranslation(selectedLanguage as LanguageCode, key);
  };

  return { t };
}
