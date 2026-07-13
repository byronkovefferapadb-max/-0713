export interface QuestionData {
  id: string
  dimension: 'first_principle' | 'core_role' | 'core_background' | 'core_goal' | 'core_execution'
  title: string
  options: [string, string, string]
}

export interface DiagnoseResponse {
  questions: [QuestionData, QuestionData, QuestionData]
}

export interface SynthesizeResponse {
  reasoningChain: string
  finalPrompt: string
}

export interface ChatCompletionMessage {
  role: 'system' | 'user'
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatCompletionMessage[]
  response_format?: { type: 'json_object' }
  temperature?: number
}

export interface ChatCompletionChoice {
  message: {
    role: string
    content: string
  }
}

export interface ChatCompletionResponse {
  choices: ChatCompletionChoice[]
}
