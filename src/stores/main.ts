// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Main store definition using Pinia with the setup syntax.
 * @returns {Object} The store with state, getters, and actions.
 */
export const useMainStore = defineStore('main', () => {
  const isLoading = ref<boolean>(false)

  return {
    isLoading,
  }
})
