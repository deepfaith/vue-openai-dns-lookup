import { createPinia, Pinia } from 'pinia'
import { App, markRaw } from 'vue'
import { Router } from 'vue-router'
import { I18n } from 'vue-i18n'

/**
 * Initializes Pinia store with router and i18n.
 * @param app - The Vue application instance.
 * @param router - The Vue Router instance.
 * @param i18n - The Vue I18n instance.
 * @returns The initialized Pinia instance.
 */
export const initPinia = (app: App, router: Router, i18n: I18n): Pinia => {
  const pinia: Pinia = createPinia()

  pinia.use(({ store }) => {
    store.router = markRaw(router)
    store.i18n = markRaw(i18n)
  })

  return pinia
}
