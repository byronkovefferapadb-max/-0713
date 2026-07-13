import type { ApiConfig } from '../types/config'
import type { SynthesizeResponse } from '../types/api'
import { callChatCompletion } from './aiClient'

const SYNTHESIZE_SYSTEM_PROMPT = `你现在需要将用户的原始想法和他们补充的3个核心条件，融合重构成一段史诗级的高阶系统提示词。

[输入信息]
原始想法：{user_input}
补充条件1：{choice_1}
补充条件2：{choice_2}
补充条件3：{choice_3}

[架构要求]
1. 从第一性原理出发，分析用户意图的本质机制
2. 应用 C.O.R.E 框架（角色、背景、目标、执行）构建提示词结构
3. 最终输出的系统提示词必须具备：
   - 明确的角色设定（Role）
   - 清晰的背景和约束描述（Context）
   - 可衡量的目标定义（Objective）
   - 具体的执行指令和输出格式（Execution）

[输出要求]
请分为两部分输出，中间用 "---DIVIDER---" 隔开：

第一部分 (思维推演链)：
用极简的3-5个要点说明：
- 你如何应用第一性原理解读原输入
- 用户的3个选择分别补足了哪些维度
- 最终提示词的结构设计思路

第二部分 (终极提示词)：
以结构化、专业、指令清晰的方式撰写最终给大模型使用的系统提示词。
使用 Markdown 格式，包含适当的标题层级和列表。`

export async function synthesize(
  config: ApiConfig,
  userInput: string,
  choiceTexts: [string, string, string],
): Promise<SynthesizeResponse> {
  const userContent = `原始想法：${userInput}\n\n补充条件1：${choiceTexts[0]}\n补充条件2：${choiceTexts[1]}\n补充条件3：${choiceTexts[2]}`

  const raw = await callChatCompletion(config, [
    { role: 'system', content: SYNTHESIZE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ])

  const dividerIndex = raw.indexOf('---DIVIDER---')
  if (dividerIndex === -1) {
    // Divider not found, treat entire output as the prompt
    return { reasoningChain: '', finalPrompt: raw.trim() }
  }

  return {
    reasoningChain: raw.slice(0, dividerIndex).trim(),
    finalPrompt: raw.slice(dividerIndex + 13).trim(),
  }
}
