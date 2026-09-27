import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

/**
 * V1 language scope (R055A): only Spanish and English are officially supported.
 *
 * The other 8 locales (de, nl, it, zh, ru, fr, ar, hi) keep their files in
 * `messages/` and their entries in the LanguageSwitcher map, but they are NOT
 * resolved by the app while V1 is in progress. This prevents next-intl from
 * raising MISSING_MESSAGE for keys that only exist in es/en.
 *
 * To re-enable a locale: add it back to `locales` and to VISIBLE_LOCALES
 * in src/components/layout/language-switcher.tsx (after translating its keys).
 */
const locales = ["es", "en"];

export default getRequestConfig(async () => {
  const store = await cookies();
  let locale = store.get("warden-locale")?.value;

  if (!locale) {
    const acceptLanguage = (await headers()).get("accept-language");
    if (acceptLanguage) {
      const preferred = acceptLanguage
        .split(",")[0]
        .split("-")[0]
        .split(";")[0]
        .trim();
      if (locales.includes(preferred)) {
        locale = preferred;
      }
    }
  }

  if (!locale || !locales.includes(locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
