<script setup lang="ts">
import { useMessageStore } from '@/stores/'
import { useI18n } from 'vue-i18n'
import { computed, defineProps, Ref } from 'vue'

defineProps<{ class: string }>()

/**
 * Hook to access message store.
 * @returns {object} The message store instance.
 */
const useMessageStoreTyped = (): any => useMessageStore()

/**
 * Hook to access internationalization functionalities.
 * @returns {object} The i18n instance methods.
 */
const useI18nTyped = (): {
  t: (key: string) => string
  te: (key: string) => boolean
} => useI18n()

const messageStore: any = useMessageStoreTyped()
const { t, te } = useI18nTyped()

/**
 * Computed property to get the localized error message or the raw message.
 * @returns {Ref<string>} The error message.
 */
const error: Ref<string> = computed(() =>
  te(messageStore?.getError) ? t(messageStore?.getError) : messageStore?.getError,
)

/**
 * Computed property to get the localized success message or the raw message.
 * @returns {Ref<string>} The success message.
 */
const success: Ref<string> = computed(() =>
  te(messageStore?.getIsSuccess) ? t(messageStore?.getIsSuccess) : messageStore?.getIsSuccess,
)
</script>

<template>
  <VAlert
    v-if="error"
    color="error"
    :class
    v-html="error"
  />

  <VAlert
    v-if="success"
    color="success"
    :class
    v-html="success"
  />
</template>
