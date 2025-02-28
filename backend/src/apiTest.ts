import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import OpenAI from 'openai'
import * as logger from 'firebase-functions/logger'
import axios, { AxiosInstance } from 'axios'

const openAIKey = defineSecret('OPENAI_API_KEY')
const whoIsKey = defineSecret('WHOIS_API_KEY')

/**
 * Redirect requests to OpenAI API, using the API key stored in the secrets.
 * @param {any} data - The request data containing model and messages.
 * @returns {Promise<string>} The generated content from OpenAI.
 */
export const converseWithOpenAI = onCall(
  {
    cors: true,
    secrets: [openAIKey],
  },
  async (request): Promise<string> => {
    const { data } = request
    if (!data || !data.model || !data.messages) {
      throw new HttpsError('invalid-argument', 'The function must be called with the correct model and messages.')
    }

    return generateContentFromOpenAI(data.model, data.messages)
  },
)

/**
 * Look up domain information using the WHOIS API.
 * @param {any} data - The request data containing domainName.
 * @returns {Promise<string>} The WHOIS data for the domain.
 */
export const domainLookUpWhoIs = onCall(
  {
    secrets: [whoIsKey],
  },
  async (request): Promise<string> => {
    const { data } = request

    if (!data || !data.domainName) {
      throw new HttpsError('invalid-argument', 'The function must be called with a domain name.')
    }

    const axiosClient: AxiosInstance = axios.create({
      baseURL: 'https://www.whoisxmlapi.com/whoisserver/WhoisService',
      headers: {
        'Access-Control-Allow-Origin': '*', // Ensure it's only set once
      },
      params: {
        apiKey: whoIsKey.value(),
        outputFormat: 'JSON',
      },
    })

    try {
      const response = await axiosClient.get('', { params: { domainName: data.domainName } })
      logger.info('successfully fetched WHOIS data:', response)
      return JSON.stringify(response.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error('Error in WHOIS lookup:', error)
      throw new Error('WHOIS API returned an error: ' + error.message)
    }
  },
)

/**
 * Generates content from OpenAI based on the provided model and messages.
 * @param {string} model - The model to use for the generation.
 * @param {any[]} messages - The messages to send to the model.
 * @return {Promise<string>} The response from OpenAI.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateContentFromOpenAI = async (model: string, messages: any[]): Promise<string> => {
  try {
    const openai = new OpenAI({
      apiKey: openAIKey.value(),
    })

    const response = await openai.chat.completions.create({
      model,
      messages,
    })

    return response.choices[0].message.content as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error('Error generating content from OpenAI:', error)
    throw new Error('OpenAI API returned an error: ' + error.message)
  }
}
