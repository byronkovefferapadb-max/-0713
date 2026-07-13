import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ApiConfig } from '../types/config'
import { STORAGE_KEY_API_CONFIG, DEFAULT_ENDPOINT, DEFAULT_MODEL } from '../types/config'
import { loadFromStorage, saveToStorage } from '../utils/storage'

interface ApiConfigContextValue {
  config: ApiConfig
  isConfigured: boolean
  updateConfig: (partial: Partial<ApiConfig>) => void
}

const ApiConfigContext = createContext<ApiConfigContextValue | null>(null)

export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ApiConfig>(() =>
    loadFromStorage<ApiConfig>(STORAGE_KEY_API_CONFIG, {
      endpoint: DEFAULT_ENDPOINT,
      model: DEFAULT_MODEL,
      apiKey: '',
    }),
  )

  const updateConfig = useCallback((partial: Partial<ApiConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial }
      saveToStorage(STORAGE_KEY_API_CONFIG, next)
      return next
    })
  }, [])

  const isConfigured = config.endpoint.length > 0 && config.apiKey.length > 0

  return (
    <ApiConfigContext.Provider value={{ config, isConfigured, updateConfig }}>
      {children}
    </ApiConfigContext.Provider>
  )
}

export function useApiConfig(): ApiConfigContextValue {
  const ctx = useContext(ApiConfigContext)
  if (!ctx) throw new Error('useApiConfig must be used within ApiConfigProvider')
  return ctx
}
