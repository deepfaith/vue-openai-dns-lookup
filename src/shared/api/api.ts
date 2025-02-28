import { OpenAIParams, requestOpenAIFirebase, requestWhoIsFirebase, WhoIsParams } from './firebase-functions'

/**
 * Requests data from OpenAI using provided parameters.
 * @param {OpenAIParams} params - The parameters for the OpenAI request.
 * @returns {Promise<any>} The data returned from the OpenAI service.
 */
export const requestOpenAI = async (params: OpenAIParams): Promise<any> => {
  const response = await requestOpenAIFirebase(params)
  return response.data
}

/**
 * Requests WHOIS data using provided parameters.
 * @param {WhoIsParams} params - The parameters for the WHOIS request.
 * @returns {Promise<any>} The data returned from the WHOIS service.
 */
export const requestWhoIsLookUp = async (params: WhoIsParams): Promise<any> => {
  const response = await requestWhoIsFirebase(params)
  return response.data
}
