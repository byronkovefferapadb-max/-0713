import { ApiConfigProvider } from './context/ApiConfigContext'
import { AppProvider, useAppState, useAppActions, useAppDispatch } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { LeftPanel } from './components/layout/LeftPanel'
import { RightPanel } from './components/layout/RightPanel'
import { IdeaInput } from './components/input/IdeaInput'
import { QuestionCardList } from './components/questions/QuestionCardList'
import { QuestionSkeleton } from './components/questions/QuestionSkeleton'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { ErrorMessage } from './components/common/ErrorMessage'
import { EmptyState } from './components/common/EmptyState'
import { RetryNotice } from './components/common/RetryNotice'
import { ReasoningChain } from './components/results/ReasoningChain'
import { FinalPrompt } from './components/results/FinalPrompt'

function AppContent() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const { handleDiagnose, handleSelectAnswer, handleSynthesize, handleReset, allAnswered } =
    useAppActions()

  const isBusy = state.phase === 'diagnosing' || state.phase === 'synthesizing'

  return (
    <AppShell>
      <LeftPanel>
        <IdeaInput
          value={state.userInput}
          onChange={(v) => dispatch({ type: 'SET_USER_INPUT', payload: v })}
          onDiagnose={handleDiagnose}
          disabled={isBusy}
        />

        {state.phase === 'retrying' && <RetryNotice count={state.retryCount} />}

        {state.phase === 'diagnosing' && <QuestionSkeleton />}

        {state.phase === 'answering' && state.questions.length > 0 && (
          <QuestionCardList
            questions={state.questions}
            selectedAnswers={state.selectedAnswers}
            onSelect={handleSelectAnswer}
            onSynthesize={handleSynthesize}
            allAnswered={allAnswered}
            disabled={isBusy}
          />
        )}

        {state.phase === 'error' && state.errorMessage && (
          <ErrorMessage
            message={state.errorMessage}
            onDismiss={() => dispatch({ type: 'RESET' })}
          />
        )}

        {state.phase === 'synthesizing' && (
          <LoadingSpinner text="AI 正在合成终极提示词..." />
        )}

        {state.phase === 'complete' && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-4"
          >
            重新开始
          </button>
        )}
      </LeftPanel>

      <RightPanel>
        {state.phase === 'complete' && (
          <>
            <ReasoningChain content={state.reasoningChain} />
            <FinalPrompt content={state.finalPrompt} />
          </>
        )}

        {state.phase === 'synthesizing' && (
          <LoadingSpinner text="正在生成终极提示词..." />
        )}

        {(state.phase === 'input' || state.phase === 'diagnosing' || state.phase === 'retrying') && (
          <EmptyState />
        )}
      </RightPanel>
    </AppShell>
  )
}

export default function App() {
  return (
    <ApiConfigProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ApiConfigProvider>
  )
}
