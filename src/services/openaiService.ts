import { upload } from './firebase'
import CONSTANTS from '../CONSTANTS'
import { requestOpenAI } from '../shared/api'

/**
 * Generate an image file from a URL and upload it.
 * @param url - The data URL of the image.
 * @returns The file name after upload.
 */
const generateImage = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    const a = document.createElement('a')
    const objectURL = URL.createObjectURL(blob)
    a.href = objectURL
    a.download = 'image.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objectURL)

    const fileName = await upload({ extension: 'png', file: blob, mimeType: 'image/png', page })
    return fileName
  } catch (error) {
    console.error('Error downloading the image:', error)
    return ''
  }
}

/**
 * Convert an ArrayBuffer to a Base64 string.
 * @param buffer - The ArrayBuffer to convert.
 * @returns The Base64 string.
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return window.btoa(binary)
}

/**
 * Get OpenAI completion while remembering previous chat history.
 * @param payload - The payload containing chat details.
 * @returns The API response or file name.
 */
export const getChatCompletion = async (payload: {
  content: string
  format?: string
  speed?: number
  voice?: string
  model?: string
  size?: string
  page?: string
  chatHistory: Record<string, any>
}): Promise<any> => {
  const { content, format, speed, voice, chatHistory, page } = payload
  let { model, size } = payload
  let domainName = ''
  const MAX_MESSAGES = 20 // Limit messages sent to OpenAI
  const messages = [
    {
      role: 'system',
      content: `You are a helpful AI that remembers past interactions and specializes in domain lookup assistance. You always greet the user warmly and entertain only domain lookup-related topics. You strictly enforce the discussion to remain on domain lookup but remain polite and professional.

If a user greets you (e.g., 'Hello' or 'Hi'), respond with a friendly greeting. If the user asks a question related to domain lookup, provide accurate and helpful information.

If the user provides a valid domain name (e.g., amazon.com, google.com), respond only with: 'Thanks for providing the domain name! Domain Name:[insert domain name here]'

If the user attempts to discuss unrelated topics or asks about anything outside domain lookup, politely but firmly respond with: 'Please provide a valid domain name for lookup. I can only assist with domain-related queries.'

Ensure all interactions remain strictly focused on domain lookup and verification.`,
    },
    ...chatHistory.slice(-MAX_MESSAGES),
  ]

  // Add user message to history
  messages.push({ role: 'user', content })
  if (page === CONSTANTS.pages.text) {
    model = model || CONSTANTS.defaultModels.text
    const aiResponse = await requestOpenAI({
      model,
      messages, // Send the entire conversation
    })

    console.log('--------')
    console.log(aiResponse)
    if (aiResponse.includes('Thanks for providing the domain name! Domain Name:')) {
      domainName = content.replace('Thanks for providing the domain name! Domain Name:', '').trim()
    }

    return { domain: domainName, response: aiResponse }
  }

  return ''
}
