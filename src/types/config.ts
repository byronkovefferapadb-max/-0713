export interface ApiConfig {
  endpoint: string
  model: string
  apiKey: string
}

export const STORAGE_KEY_API_CONFIG = 'rps_api_config'

export const DEFAULT_ENDPOINT = 'https://api.openai.com/v1'
export const DEFAULT_MODEL = 'gpt-4o'
