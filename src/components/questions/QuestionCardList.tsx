import type { QuestionData } from '../../types/api'
import { QuestionCard } from './QuestionCard'

export function QuestionCardList({
  questions,
  selectedAnswers,
  onSelect,
  onSynthesize,
  allAnswered,
  disabled,
}: {
  questions: QuestionData[]
  selectedAnswers: Record<string, number | undefined>
  onSelect: (questionId: string, optionIndex: number) => void
  onSynthesize: () => void
  allAnswered: boolean
  disabled: boolean
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 font-medium mb-3">
        请回答以下 3 个问题，帮助 AI 更深入地理解您的需求：
      </p>
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          selectedIndex={selectedAnswers[q.id]}
          onSelect={(index) => onSelect(q.id, index)}
          disabled={disabled}
        />
      ))}
      <button
        onClick={onSynthesize}
        disabled={!allAnswered || disabled}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
          allAnswered && !disabled
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {allAnswered ? '生成终极提示词' : '请完成全部 3 道选择题'}
      </button>
    </div>
  )
}
