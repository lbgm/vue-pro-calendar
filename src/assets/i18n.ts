//@ts-nocheck
import { createI18n } from "vue-i18n";
import { messages } from "vite-i18n-resources";

export const locales = Object.keys(messages);

const numberFormats = {
  fr: {
    XOF: { style: "currency", currency: "XOF", currencyDisplay: "code" },
    number: { style: "decimal" },
  },

  en: {
    XOF: { style: "currency", currency: "USD" },
    number: { style: "decimal" },
  },

  es: {
    EUR: { style: "currency", currency: "EUR" },
    number: { style: "decimal" },
  },
};

export const i18n = createI18n({
  locales: locales,
  locale: window.navigator.language.split("-")[0],
  fallbackLocale: "fr",

  numberFormats,
  messages,
  globalInjection: true,
  legacy: false,
});

// Only if you want hot module replacement when translation message file change
if (import.meta.hot) {
  import.meta.hot.on("locales-update", (data) => {
    Object.keys(data).forEach((lang) => {
      i18n.global.setLocaleMessage(lang, data[lang]);
    });
  });
}
