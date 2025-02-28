/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the Vue application.
 */

import { createApp } from 'vue'
import App from './App.vue'
import './styles/settings.scss'
import { useChatStore } from './stores'
import { registerPlugins } from './plugins'

/**
 * Initializes the application with necessary plugins, services, and stores.
 */
const initializeApp = async (): Promise<void> => {
  const app = createApp(App)

  registerPlugins(app)

  const chatStore = useChatStore()
  await chatStore.init()

  app.mount('#app')
}

await initializeApp()
