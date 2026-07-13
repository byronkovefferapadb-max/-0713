import type { QuestionData } from './api'

export type AppPhase =
  | 'input'
  | 'diagnosing'
  | 'retrying'
  | 'answering'
  | 'synthesizing'
  | 'complete'
  | 'error'

export interface SelectedAnswers {
  [questionId: string]: number
}

export interface AppState {
  phase: AppPhase
  userInput: string
  questions: QuestionData[]
  selectedAnswers: SelectedAnswers
  reasoningChain: string
  finalPrompt: string
  errorMessage: string | null
  retryCount: number
}

export type AppAction =
  | { type: 'SET_USER_INPUT'; payload: string }
  | { type: 'START_DIAGNOSIS' }
  | { type: 'START_RETRY' }
  | { type: 'DIAGNOSIS_SUCCESS'; payload: QuestionData[] }
  | { type: 'DIAGNOSIS_FAILURE'; payload: string }
  | { type: 'SELECT_ANSWER'; payload: { questionId: string; optionIndex: number } }
  | { type: 'START_SYNTHESIS' }
  | { type: 'SYNTHESIS_SUCCESS'; payload: { reasoningChain: string; finalPrompt: string } }
  | { type: 'SYNTHESIS_FAILURE'; payload: string }
  | { type: 'RESET' }
