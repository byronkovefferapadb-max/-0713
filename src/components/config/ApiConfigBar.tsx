import { useState } from 'react'
import { useApiConfig } from '../../context/ApiConfigContext'

export function ApiConfigBar() {
  const { config, updateConfig } = useApiConfig()
  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="border-b border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-2.5 flex items-center justify-between text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          API 配置
        </span>
        <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="px-6 pb-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">API 地址</label>
            <input
              type="url"
              value={config.endpoint}
              onChange={(e) => updateConfig({ endpoint: e.target.value })}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">模型名称</label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => updateConfig({ model: e.target.value })}
              placeholder="gpt-4o"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                placeholder="sk-..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="px-2 py-1.5 text-xs text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {showKey ? '隐藏' : '显示'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
