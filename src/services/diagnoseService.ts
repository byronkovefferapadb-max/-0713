import type { ApiConfig } from '../types/config'
import type { QuestionData } from '../types/api'
import { callChatCompletion } from './aiClient'
import { safeParseJson } from '../utils/jsonParser'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const DIAGNOSE_SYSTEM_PROMPT = `你是一位拥有顶级分析能力的"第一性原理思考者"兼提示词架构师。
你的任务是看透用户简短输入背后的本质，打破思维惯性，提出3个极其精准的单选题。

[诊断协议]
你必须严格遵循以下三层诊断框架：

Layer 0 - 第一性原理剥离（作为第1题，即 id="q1", dimension="first_principle"）：
忽略用户要求的表象形式，追问达成该目标的本质物理法则或核心心理动机。
示例：如果用户说"我要做一个记账App"，不是问"你要记什么账"，而是问"你记账的深层动机是控制消费欲、看清现金流、还是培养财富意识？"

Layer 1 - C.O.R.E. 结构补全（作为第2和第3题，即 id="q2"/"q3"）：
扫描输入，分析用户的想法在以下四个维度中最欠缺哪两个：
- 角色 (Role)：AI 应该以什么特定专家身份介入？
- 背景 (Context)：这件事发生在什么特殊环境或约束下？
- 目标 (Objective)：成功的具体边界是什么？
- 执行 (Execution)：输出的具体格式和交付物要求？

[选项设计原则]
- 每个选项必须有强烈的画面感和具体场景
- 三个选项之间应形成有意义的对比或递进关系
- 选项长度控制在15-50字之间

[输出要求]
你必须严格输出合法的 JSON 对象，不要包含 markdown 代码块标记、不要包含任何其他文字。
请严格按照以下结构输出，其中 title 和 options 的内容请根据用户输入动态生成：
{
  "questions": [
    {
      "id": "q1",
      "dimension": "first_principle",
      "title": "抛开表象形式，你做这件事最核心的底层驱动力/本质机制是什么？",
      "options": ["选项A", "选项B", "选项C"]
    },
    {
      "id": "q2",
      "dimension": "core_role",
      "title": "你希望 AI 以什么身份角色来协助你？",
      "options": ["选项A", "选项B", "选项C"]
    },
    {
      "id": "q3",
      "dimension": "core_background",
      "title": "你要处理的内容或环境有什么特殊约束？",
      "options": ["选项A", "选项B", "选项C"]
    }
  ]
}

请确保：
1. 输出的是纯粹的 JSON，没有任何前后缀文字
2. questions 数组包含恰好 3 个对象
3. 每个对象必须包含 id, dimension, title, options 四个字段
4. options 数组包含恰好 3 个字符串`

const MAX_RETRIES = 2

export async function diagnose(
  config: ApiConfig,
  userInput: string,
  onRetry?: () => void,
): Promise<QuestionData[]> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // First attempt tries json_object mode; retries fall back to plain text
      // (many custom APIs don't support response_format: json_object)
      const useJsonMode = attempt === 0
      const raw = await callChatCompletion(
        config,
        [
          { role: 'system', content: DIAGNOSE_SYSTEM_PROMPT },
          { role: 'user', content: useJsonMode ? userInput : `${userInput}\n\n请严格输出合法的 JSON 格式，不要包含任何其他文字。` },
        ],
        useJsonMode ? { responseFormat: 'json_object' } : undefined,
      )

      const parsed = safeParseJson(raw) as Record<string, unknown>

      // Normalize: the model might wrap questions under different keys
      let questionsRaw: unknown
      if (parsed?.questions) {
        questionsRaw = parsed.questions
      } else if ((parsed?.output as Record<string, unknown>)?.questions) {
        questionsRaw = (parsed.output as Record<string, unknown>).questions
      } else {
        // Try to find any array field with objects that look like questions
        const arrayField = Object.values(parsed).find(
          (v) => Array.isArray(v) && v.length === 3 && v[0] && typeof v[0] === 'object' && 'title' in (v[0] as object),
        )
        questionsRaw = arrayField
      }

      if (!Array.isArray(questionsRaw) || questionsRaw.length !== 3) {
        throw new Error(`返回数据格式不符合预期: AI 返回了 ${JSON.stringify(parsed).slice(0, 200)}`)
      }

      const questions = questionsRaw as QuestionData[]
      for (const q of questions) {
        if (!q.id || !q.dimension || !q.title || !Array.isArray(q.options) || q.options.length !== 3) {
          throw new Error(`题目字段不完整: ${JSON.stringify(q).slice(0, 150)}`)
        }
      }
      return questions
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        onRetry?.()
        await sleep(1000)
      } else {
        throw err
      }
    }
  }
  throw new Error('诊断失败，请重试')
}
