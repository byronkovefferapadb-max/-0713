import type { QuestionData } from '../../types/api'

export function QuestionCard({
  question,
  selectedIndex,
  onSelect,
  disabled,
}: {
  question: QuestionData
  selectedIndex: number | undefined
  onSelect: (index: number) => void
  disabled: boolean
}) {
  const dimensionLabels: Record<string, string> = {
    first_principle: '第一性原理',
    core_role: '角色设定',
    core_background: '背景约束',
    core_goal: '目标定义',
    core_execution: '执行要求',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {dimensionLabels[question.dimension] || question.dimension}
        </span>
        <span className="text-xs text-gray-400">#{question.id}</span>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-4 leading-relaxed">{question.title}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              disabled={disabled}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-500'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300'
                  }`}
                >
                  {isSelected ? '✓' : index + 1}
                </span>
                <span className="leading-relaxed">{option}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
