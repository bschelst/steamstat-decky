import { useState } from 'react';
import languages from '../lib/translations';

function getCurrentLanguage(): keyof typeof languages {
  try {
    const steamLang = window.LocalizationManager?.m_rgLocalesToUse?.[0] || 'en';
    // Convert locale format (e.g., 'pt-br' -> 'ptBr')
    const lang = steamLang.replace(/-([a-z])/g, (_, letter: string) =>
      letter.toUpperCase()
    ) as keyof typeof languages;
    return languages[lang] ? lang : 'en';
  } catch {
    return 'en';
  }
}

function useTranslations() {
  const [lang] = useState(getCurrentLanguage());

  return function (
    key: keyof (typeof languages)['en'],
    params?: Record<string, string | number | null>
  ): string {
    let text: string;
    if (languages[lang]?.[key]?.length) {
      text = languages[lang]?.[key];
    } else if (languages.en?.[key]?.length) {
      text = languages.en?.[key];
    } else {
      text = key;
    }

    // Replace template variables like {{version}} with values from params
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(value ?? ''));
      });
    }

    return text;
  };
}

export default useTranslations;
