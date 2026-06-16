import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const locales = ["en", "es", "de", "nl", "it", "zh", "ru", "fr", "ar", "hi"];

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
