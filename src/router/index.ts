/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, Router } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

/**
 * Creates and configures the router instance.
 *
 * @returns {Router} The configured router instance.
 */
const createAppRouter = (): Router => {
  const history = createWebHistory(import.meta.env.BASE_URL)

  const router = createRouter({
    history,
    extendRoutes: setupLayouts,
  })

  return router
}

const router = createAppRouter()

export default router
