import { useState, useCallback } from 'react'
import { copyToClipboard } from '../../utils/clipboard'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        copied
          ? 'bg-green-600 text-white'
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
      }`}
    >
      {copied ? '已复制!' : '一键复制'}
    </button>
  )
}
