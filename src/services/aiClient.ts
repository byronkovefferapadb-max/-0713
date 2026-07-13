import type { ApiConfig } from '../types/config'
import type { ChatCompletionMessage, ChatCompletionRequest, ChatCompletionResponse } from '../types/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiConfigError'
  }
}

export async function callChatCompletion(
  config: ApiConfig,
  messages: ChatCompletionMessage[],
  options?: { responseFormat?: 'json_object'; temperature?: number },
): Promise<string> {
  if (!config.endpoint) throw new ApiConfigError('请先配置 API 地址')
  if (!config.apiKey) throw new ApiConfigError('请先配置 API 密钥')

  const baseUrl = config.endpoint.replace(/\/+$/, '')
  const body: ChatCompletionRequest = {
    model: config.model,
    messages,
    temperature: options?.temperature ?? 0.7,
  }
  if (options?.responseFormat === 'json_object') {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '未知错误')
    throw new ApiError(res.status, `API 请求失败 (${res.status}): ${errorText}`)
  }

  const data: ChatCompletionResponse = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new ApiError(0, 'AI 返回内容为空')
  return content
}
