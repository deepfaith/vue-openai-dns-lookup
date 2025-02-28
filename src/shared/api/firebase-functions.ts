import { httpsCallable } from 'firebase/functions'
import { functions } from '../../services'

/**
 * Parameters for OpenAI API request.
 */
export type OpenAIParams = {
  model: string
  messages: any[]
}

/**
 * Parameters for WHOIS API request.
 */
export type WhoIsParams = {
  domainName: string
}

/**
 * Creates a callable function for interacting with OpenAI via Firebase.
 */
export const requestOpenAIFirebase = httpsCallable<OpenAIParams, string>(functions, 'converseWithOpenAI')

/**
 * Creates a callable function for performing a WHOIS lookup via Firebase.
 */
export const requestWhoIsFirebase = httpsCallable<WhoIsParams, string>(functions, 'domainLookUpWhoIs')
