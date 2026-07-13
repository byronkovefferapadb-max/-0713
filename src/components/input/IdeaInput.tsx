export function IdeaInput({
  value,
  onChange,
  onDiagnose,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  onDiagnose: () => void
  disabled: boolean
}) {
  const charCount = value.length
  const canSubmit = charCount >= 2 && !disabled

  return (
    <div className="mb-6">
      <label htmlFor="idea-input" className="block text-sm font-medium text-gray-700 mb-2">
        输入您的想法或需求
      </label>
      <textarea
        id="idea-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例如：我想做一个帮助程序员保持专注的番茄钟工具..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-colors text-sm"
        disabled={disabled}
      />
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs ${charCount < 2 ? 'text-gray-400' : 'text-gray-500'}`}>
          {charCount} / 最少 2 个字符
        </span>
        <button
          onClick={onDiagnose}
          disabled={!canSubmit}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            canSubmit
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          深度诊断
        </button>
      </div>
    </div>
  )
}
