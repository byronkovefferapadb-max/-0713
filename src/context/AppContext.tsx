import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppState, AppAction } from '../types/app'
import { useApiConfig } from './ApiConfigContext'
import { diagnose } from '../services/diagnoseService'
import { synthesize } from '../services/synthesizeService'
import { ApiConfigError } from '../services/aiClient'

const initialState: AppState = {
  phase: 'input',
  userInput: '',
  questions: [],
  selectedAnswers: {},
  reasoningChain: '',
  finalPrompt: '',
  errorMessage: null,
  retryCount: 0,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_INPUT':
      return { ...state, userInput: action.payload }
    case 'START_DIAGNOSIS':
      return { ...state, phase: 'diagnosing', retryCount: 0, errorMessage: null, questions: [], selectedAnswers: {} }
    case 'START_RETRY':
      return { ...state, phase: 'retrying', retryCount: state.retryCount + 1 }
    case 'DIAGNOSIS_SUCCESS':
      return { ...state, phase: 'answering', questions: action.payload, retryCount: 0 }
    case 'DIAGNOSIS_FAILURE':
      return { ...state, phase: 'error', errorMessage: action.payload }
    case 'SELECT_ANSWER':
      return {
        ...state,
        selectedAnswers: { ...state.selectedAnswers, [action.payload.questionId]: action.payload.optionIndex },
      }
    case 'START_SYNTHESIS':
      return { ...state, phase: 'synthesizing', errorMessage: null }
    case 'SYNTHESIS_SUCCESS':
      return { ...state, phase: 'complete', ...action.payload }
    case 'SYNTHESIS_FAILURE':
      return { ...state, phase: 'error', errorMessage: action.payload }
    case 'RESET':
      return initialState
  }
}

const AppContext = createContext<AppState | null>(null)
const AppDispatchContext = createContext<React.Dispatch<AppAction> | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppContext.Provider>
  )
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const ctx = useContext(AppDispatchContext)
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider')
  return ctx
}

export function useAppActions() {
  const { config, isConfigured } = useApiConfig()
  const dispatch = useAppDispatch()
  const state = useAppState()

  const handleDiagnose = async () => {
    if (!isConfigured) {
      dispatch({ type: 'DIAGNOSIS_FAILURE', payload: '请先配置 API 密钥和地址' })
      return
    }
    dispatch({ type: 'START_DIAGNOSIS' })
    try {
      const questions = await diagnose(config, state.userInput, () =>
        dispatch({ type: 'START_RETRY' }),
      )
      dispatch({ type: 'DIAGNOSIS_SUCCESS', payload: questions })
    } catch (err) {
      const message =
        err instanceof ApiConfigError
          ? err.message
          : err instanceof Error
            ? err.message
            : '诊断失败，请稍后重试'
      dispatch({ type: 'DIAGNOSIS_FAILURE', payload: message })
    }
  }

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    dispatch({ type: 'SELECT_ANSWER', payload: { questionId, optionIndex } })
  }

  const handleSynthesize = async () => {
    if (!isConfigured) {
      dispatch({ type: 'SYNTHESIS_FAILURE', payload: '请先配置 API 密钥和地址' })
      return
    }
    dispatch({ type: 'START_SYNTHESIS' })
    try {
      const choiceTexts = state.questions.map((q) => q.options[state.selectedAnswers[q.id]]) as [
        string,
        string,
        string,
      ]
      const result = await synthesize(config, state.userInput, choiceTexts)
      dispatch({ type: 'SYNTHESIS_SUCCESS', payload: result })
    } catch (err) {
      const message =
        err instanceof ApiConfigError
          ? err.message
          : err instanceof Error
            ? err.message
            : '合成失败，请稍后重试'
      dispatch({ type: 'SYNTHESIS_FAILURE', payload: message })
    }
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  const allAnswered =
    state.questions.length === 3 &&
    state.questions.every((q) => state.selectedAnswers[q.id] !== undefined)

  return {
    handleDiagnose,
    handleSelectAnswer,
    handleSynthesize,
    handleReset,
    allAnswered,
  }
}
