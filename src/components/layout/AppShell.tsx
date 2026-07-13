import type { ReactNode } from 'react'
import { ApiConfigBar } from '../config/ApiConfigBar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">逆向思维脚手架</h1>
          <p className="text-xs text-gray-400">Reverse Prompt Scaffold</p>
        </div>
      </header>
      <ApiConfigBar />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {children}
      </main>
    </div>
  )
}
