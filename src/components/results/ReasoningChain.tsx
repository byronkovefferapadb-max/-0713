import { useState } from 'react'

export function ReasoningChain({ content }: { content: string }) {
  const [open, setOpen] = useState(false)

  if (!content) return null

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full"
      >
        <span className={`transform transition-transform ${open ? 'rotate-90' : ''}`}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 4l8 6-8 6V4z" />
          </svg>
        </span>
        AI 思维推演链（点击展开）
      </button>
      {open && (
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  )
}
