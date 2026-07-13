import { CopyButton } from './CopyButton'

export function FinalPrompt({ content }: { content: string }) {
  if (!content) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">终极提示词</h3>
        <CopyButton text={content} />
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-5 text-sm leading-relaxed overflow-x-auto">
        <code>{content}</code>
      </pre>
    </div>
  )
}
