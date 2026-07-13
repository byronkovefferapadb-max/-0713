import type { ReactNode } from 'react'

export function RightPanel({ children }: { children: ReactNode }) {
  return (
    <div className="w-full md:w-1/2 bg-white overflow-y-auto p-6">
      {children}
    </div>
  )
}
