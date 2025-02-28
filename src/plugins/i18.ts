import messages from '@/locales'
import { createI18n, I18n, I18nOptions } from 'vue-i18n'

/**
 * Default locale for the application.
 */
const DEFAULT_LOCALE: string = 'en'

/**
 * Initializes and returns the i18n configuration.
 * @returns {I18n} The i18n instance configured for the application.
 */
export const initI18n: () => I18n = (): I18n => {
  const options: I18nOptions = {
    legacy: false,
    locale: DEFAULT_LOCALE,
    messages,
  }

  return createI18n(options)
}
