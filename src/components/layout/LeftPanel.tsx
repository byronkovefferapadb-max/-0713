import type { ReactNode } from 'react'

export function LeftPanel({ children }: { children: ReactNode }) {
  return (
    <div className="w-full md:w-1/2 border-r border-gray-200 overflow-y-auto p-6">
      {children}
    </div>
  )
}
