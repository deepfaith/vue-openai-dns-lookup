import axios, { AxiosInstance } from 'axios'

interface WhoisData {
  domainName: string
  registrar: string
  registrationDate: string
  expirationDate: string
  estimatedDomainAge: number
  hostnames: string
  registrantName: string
  techContact: string
  adminContact: string
  contactEmail: string
}

class WhoisService {
  private httpClient: AxiosInstance

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'https://www.whoisxmlapi.com/whoisserver/WhoisService',
      params: {
        apiKey: import.meta.env.VITE_WHOIS_API_KEY,
        outputFormat: 'JSON',
      },
    })
  }

  /**
   * Fetches WHOIS data for a given domain.
   * @param domain The domain name to query.
   * @returns A promise that resolves to the WHOIS data.
   */
  fetchWhoisData = async (domain: string): Promise<string | { error: string }> => {
    try {
      const response = await this.httpClient.get('', { params: { domainName: domain } })
      return JSON.stringify(this.parseWhoisData(response.data))
    } catch (error: any) {
      return { error: error.message }
    }
  }

  /**
   * Parses the raw WHOIS data into a structured format.
   * @param data The raw data from the WHOIS API.
   * @returns The parsed WHOIS data.
   */
  private parseWhoisData = (data: any): WhoisData => {
    if (!data.WhoisRecord) {
      throw new Error('No WHOIS data available')
    }

    const record = data.WhoisRecord
    return {
      domainName: record.domainName,
      registrar: record.registrarName,
      registrationDate: record.createdDateNormalized,
      expirationDate: record.expiresDateNormalized,
      estimatedDomainAge: record.estimatedDomainAge,
      hostnames: this.formatHostNames(record.nameServers?.hostNames || []),
      registrantName: record.registrant?.name || 'N/A',
      techContact: record.technicalContact?.name || 'N/A',
      adminContact: record.administrativeContact?.name || 'N/A',
      contactEmail: record.contactEmail || 'N/A',
    }
  }

  /**
   * Formats the hostnames array into a string.
   * @param hostnames The array of hostnames.
   * @returns A formatted string of hostnames.
   */
  private formatHostNames = (hostnames: string[]): string => {
    const composed = hostnames.join(', ')
    return composed.length > 25 ? `${composed.substring(0, 22)}...` : composed
  }
}

export default new WhoisService()
