// Utilities

import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'
import { useMainStore } from './main'
import { useStorage } from '@vueuse/core'
import moment from 'moment'
import CONSTANTS from '../CONSTANTS'
import { ref, computed } from 'vue'
import { getChatCompletion } from '../services/openaiService'
import { fetchChats, setMessageDetails, createTitle, addMessage, fetchChatMessages } from '../services/firebase'
import WhoisService from '../services/WhoisService'

/**
 * Chat store using setup syntax with Composition API
 */
export const useChatStore = defineStore('chat', () => {
  /**
   * Stores chat messages, categorized by text, image, and audio
   */
  const chats = useStorage('chats', {
    text: {},
    image: {},
    audio: {},
  })
  const domainName = ref('')
  const router = useRouter()

  /**
   * Gets chat titles
   */
  const getTitles = computed(() => Object.values(chats.value).map(chat => chat.title))

  /**
   * Retrieves chats by ID and page
   */
  const getChatsById = (id, page = CONSTANTS.defaultPage) => {
    return chats.value?.[page]?.[id]?.messages || []
  }

  /**
   * Retrieves the entire chat object by ID and page
   */
  const getWholeTitle = (id, page = CONSTANTS.defaultPage) => {
    return chats.value?.[page]?.[id] || {}
  }

  /**
   * Retrieves chats by page with optional limit
   */
  const getChatsByPage = ({ limit, page }) => {
    const entries = Object.entries(chats.value?.[page] || {})
    const result = entries.map(([id, chat]) => ({ id, ...chat }))

    result.sort((a, b) => {
      const updatedAtA = a.updatedAt ? new Date(a.updatedAt) : new Date(0)
      const updatedAtB = b.updatedAt ? new Date(b.updatedAt) : new Date(0)
      return updatedAtB - updatedAtA
    })

    return limit ? result.slice(0, limit) : result
  }

  /**
   * Retrieves chat titles by page
   */
  const getTitlesByPage = payload => {
    return getChatsByPage(payload).map(chat => ({ id: chat.id, title: chat.title }))
  }

  /**
   * Initializes the chat store by fetching existing chats
   */
  const init = async () => {
    const fetchedChats = await fetchChats()
    chats.value = { ...fetchedChats }
  }

  /**
   * Adds a message to a chat, creates a new chat if needed
   */
  const addMessageToChat = async ({ id, page, content, format, model, speed, type, voice }) => {
    if (!content) return

    const time = moment().format()
    page = page ?? CONSTANTS.defaultPage
    id = id ?? crypto.randomUUID()

    if (!chats.value[page]) chats.value[page] = {}
    if (!chats.value[page][id]) createTitle({ id, page })
    const chatPayload = { id, page, updatedAt: time }
    const chat = chats.value[page][id]
    if (!Array.isArray(chat?.messages)) {
      chat.messages = []
      chat.title = content.substring(0, 100)
      setMessageDetails({ ...chatPayload, title: chat.title })
    }

    chat.messages.push({ content, time, type })
    addMessage({ ...chatPayload, messages: chat.messages })

    useMainStore().isLoading = true
    try {
      const chatHistory = await fetchChatMessages(id, page)
      const botResponse = await getChatCompletion({
        content,
        format,
        model,
        page,
        speed,
        voice,
        chatHistory: chatHistory.prompts,
      })

      chat.messages.push({ content: botResponse.response, time, type: 'assistant' })
      addMessage({ ...chatPayload, messages: chat.messages })
      domainName.value = botResponse.domain || ''
    } finally {
      useMainStore().isLoading = false
    }
    if (domainName.value) {
      const fetchData = await WhoisService.fetchWhoisData(domainName.value)
      chat.messages.push({ content: fetchData, time, type: 'whois' })
      addMessage({ ...chatPayload, messages: chat.messages })
    }
  }

  /**
   * Creates a new chat title
   */
  const createChatTitle = ({ id, page }) => {
    const time = moment().format()
    id = id ?? crypto.randomUUID()
    page = page ?? CONSTANTS.defaultPage

    if (isEmpty(chats.value[page])) chats.value[page] = {}
    const chatMessages = {
      createdAt: time,
      id,
      messages: [{ type: 'assistant', time: moment().format(), content: 'Hello! How can I assist you today?' }],
      page,
      title: 'New Chat',
    }
    createTitle(chatMessages)
    chats.value[page][id] = { ...chatMessages, title: 'New Chat', updatedAt: time }
    return id
  }

  /**
   * Gets the last chat ID for a given page
   */
  const getLastTitleId = (page = CONSTANTS.defaultPage) => {
    const chatIds = Object.keys(chats.value?.[page] || {})
    return chatIds.length ? chatIds[chatIds.length - 1] : createChatTitle({ page })
  }

  /**
   * Checks if a chat title exists, if not redirects
   */
  const isTheTitleExist = async (id, page = CONSTANTS.defaultPage) => {
    const chatsRecords = (await fetchChatMessages(id, page))?.chats

    if (!chatsRecords) {
      await router.push(`/${page}?id${id}`)
    } else {
      if (!chats.value[page]) {
        chats.value[page] = {}
      }
      if (!chats.value[page][id]) {
        chats.value[page][id] = {}
      }
      chats.value[page][id].messages = []
      chats.value[page][id].messages = chatsRecords
    }
  }

  return {
    chats,
    getTitles,
    getChatsById,
    getWholeTitle,
    getChatsByPage,
    getTitlesByPage,
    init,
    addMessageToChat,
    createChatTitle,
    getLastTitleId,
    isTheTitleExist,
  }
})
