/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { App } from 'vue'

import { initI18n } from './i18'
import { initRouter } from './router'
import { initPinia } from './pinia'
import { Pinia } from 'pinia'
import { Router } from 'vue-router'
import { I18n } from 'vue-i18n'
import vuetify from './vuetify'


/**
 * Registers Vue plugins to the provided Vue application instance.
 * @param app - The Vue application instance.
 */
export const registerPlugins = (app: App<Element>): void => {
  const i18n: I18n = initI18n()
  const router: Router = initRouter()
  const pinia: Pinia = initPinia(app, router, i18n)

  app.use(vuetify)
  app.use(i18n)
  app.use(pinia)
  app.use(router)
}
