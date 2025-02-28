import { defineStore } from 'pinia'
import { computed, ref, Ref } from 'vue'

interface Payload {
  error?: string
  message?: string
  time?: number
}

export const useMessageStore = defineStore('message', () => {
  const error: Ref<string | null> = ref(null)
  const isSuccess: Ref<string | null> = ref(null)
  const errorTime: Ref<number> = ref(5000)
  const successTime: Ref<number> = ref(5000)

  const getError = computed(() => error.value)
  const getIsSuccess = computed(() => isSuccess.value)

  /**
   * Sets an error message and clears it after a specified time.
   * @param {Payload} payload - The payload containing the error message and optional custom time.
   */
  const setErrorClear = (payload: Payload): void => {
    error.value = payload.error ?? null
    const time: number = payload.time ?? errorTime.value
    setTimeout(() => {
      error.value = null
    }, time)
  }

  /**
   * Sets a success message and clears it after a specified time.
   * @param {Payload} payload - The payload containing the success message and optional custom time.
   */
  const setIsSuccessClear = (payload: Payload): void => {
    try {
      error.value = null
      isSuccess.value = payload.message ?? null
      const time: number = payload.time ?? successTime.value
      setTimeout(() => {
        isSuccess.value = null
      }, time)
    } catch (error) {
      setErrorClear({ error: error as string })
    }
  }

  /**
   * Public method to set a success message.
   * @param {Payload} payload - The payload containing the success message and optional custom time.
   */
  const setIsSuccess = (payload: Payload): void => {
    try {
      error.value = null
      setIsSuccessClear(payload)
    } catch (error) {
      setErrorClear({ error: error as string })
    }
  }

  /**
   * Public method to set an error message.
   * @param {Payload} payload - The payload containing the error message and optional custom time.
   */
  const setError = (payload: Payload): void => {
    try {
      isSuccess.value = null
      setErrorClear(payload)
    } catch (error) {
      setErrorClear({ error: error as string })
    }
  }

  return {
    error,
    isSuccess,
    errorTime,
    successTime,
    getError,
    getIsSuccess,
    setErrorClear,
    setIsSuccessClear,
    setIsSuccess,
    setError,
  }
})
