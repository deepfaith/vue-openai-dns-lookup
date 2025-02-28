import { doc, getDoc, setDoc, updateDoc, getDocs, collection } from 'firebase/firestore'
import { firestore } from './index'

/**
 * Fetches all chats from Firestore.
 * @returns {Promise<Record<string, any>>} A promise resolving to all chat data.
 */
export async function fetchChats(): Promise<Record<string, any>> {
  const chatsRef = collection(firestore, 'chats')
  const snapshot = await getDocs(chatsRef)

  const chats: Record<string, any> = {}
  for (const doc of snapshot.docs) {
    const chatsPageRef = collection(firestore, 'chats', doc.id, 'messages')
    const pageSnapshot = await getDocs(chatsPageRef)

    pageSnapshot.forEach(pageDoc => {
      chats[pageDoc.id] = pageDoc.data()
    })
  }

  return chats
}

/**
 * Fetches all chat messages from Firestore.
 * @param {string} payload.id - Unique chat ID.
 * @param {string} payload.page - Chat category (e.g., "text", "image").
 * @returns {Promise<Record<string, any>>} A promise resolving to all chat data.
 */
export async function fetchChatMessages(id: string, page: string): Promise<Record<string, any>> {
  const chatsRef = doc(firestore, 'chats', page, 'messages', id)
  const snapshot = await getDoc(chatsRef)

  const chatsPrompts: any[] = []
  snapshot.data()!.messages.forEach((message: any) => {
    const { type, content } = message
    if (type !== 'whois') chatsPrompts.push({ role: type, content })
  })

  return { prompts: chatsPrompts, chats: snapshot.data()!.messages }
}

/**
 * Creates a new chat document in Firestore.
 * @param {Object} payload - The chat data.
 * @param {string} payload.createdAt - Timestamp of creation.
 * @param {string} payload.id - Unique chat ID.
 * @param {any[]} payload.messages - Array of chat messages.
 * @param {string} payload.page - Chat category (e.g., "text", "image").
 * @param {string} payload.title - Title of the chat.
 * @returns {Promise<void>} A promise resolving when the operation is complete.
 */
export async function createTitle(payload: {
  createdAt: string
  id: string
  messages: any[]
  page: string
  title: string
}): Promise<void> {
  const { createdAt, id, messages, page, title } = payload
  const chatRef = doc(firestore, 'chats', page, 'messages', id)

  await setDoc(chatRef, {
    createdAt,
    id,
    messages,
    title,
    updatedAt: createdAt,
  })
}

/**
 * Adds messages to a specific chat in Firestore.
 * @param {Object} payload - The message data.
 * @param {any[]} payload.messages - List of messages.
 * @param {string} payload.id - Chat ID.
 * @param {string} payload.page - Chat category (e.g., "text", "image").
 * @param {string} [payload.updatedAt] - Timestamp of update.
 * @returns {Promise<void>} A promise resolving when the messages are updated.
 */
export async function addMessage(payload: {
  messages: any[]
  id: string
  page: string
  updatedAt?: string
}): Promise<void> {
  const { messages, id, page, updatedAt } = payload
  const messagesRef = doc(firestore, 'chats', page, 'messages', id)
  await updateDoc(messagesRef, { messages })

  if (updatedAt) {
    await updateDoc(messagesRef, { updatedAt })
  }
}

/**
 * Updates specific chat details like title, createdAt, and updatedAt in Firestore.
 * @param {Object} payload - The chat details to update.
 * @param {string} payload.id - Chat ID.
 * @param {string} payload.page - Chat category (e.g., "text", "image").
 * @param {string} [payload.title] - New title of the chat.
 * @param {string} [payload.createdAt] - Creation timestamp.
 * @param {string} [payload.updatedAt] - Update timestamp.
 * @returns {Promise<void>} A promise resolving when the chat details are updated.
 */
export async function setMessageDetails(payload: {
  id: string
  page: string
  title?: string
  createdAt?: string
  updatedAt?: string
}): Promise<void> {
  const { id, page, title, createdAt, updatedAt } = payload
  const chatRef = doc(firestore, 'chats', page, 'messages', id)

  const updates: Partial<Record<string, any>> = {}
  if (title) updates['title'] = title
  if (createdAt) updates['createdAt'] = createdAt
  if (updatedAt) updates['updatedAt'] = updatedAt

  await updateDoc(chatRef, updates)
}
