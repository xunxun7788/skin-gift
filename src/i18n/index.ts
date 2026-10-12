import { createI18n } from "vue-i18n";
import enUS from "./locales/en-US";
import ruRU from "./locales/ru-RU";

// 支持的语言列表
export const SUPPORT_LOCALES = [
  { value: "en-US", label: "English", flag: "🇺🇸" },
  { value: "ru-RU", label: "Русский", flag: "🇷🇺" },
];

// localStorage key
const LOCALE_KEY = "app-locale";

// 获取浏览器默认语言
function getBrowserLocale(): string {
  const lang = navigator.language || (navigator as any).userLanguage;
  // if (lang.startsWith('zh')) return 'zh-CN'
  if (lang.startsWith("ru")) return "ru-RU";
  return "en-US";
}

// 获取当前语言（优先 localStorage，其次浏览器，默认中文）
export function getLocale(): string {
  const saved = localStorage.getItem(LOCALE_KEY);
  if (saved && SUPPORT_LOCALES.some((l) => l.value === saved)) {
    return saved;
  }
  return getBrowserLocale();
}

// 设置语言并持久化
export function setLocale(locale: string) {
  if (SUPPORT_LOCALES.some((l) => l.value === locale)) {
    i18n.global.locale.value = locale;
    localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.setAttribute("lang", locale);
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocale: "en-US",
  messages: {
    "en-US": enUS,
    "ru-RU": ruRU,
  },
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});

export default i18n;
