export function safeParseJson(raw: string): unknown {
  // Strategy 1: direct parse
  try {
    return JSON.parse(raw)
  } catch {
    // continue
  }

  // Strategy 2: strip markdown code fences
  const stripped = raw.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim()
  try {
    return JSON.parse(stripped)
  } catch {
    // continue
  }

  // Strategy 3: extract the first { … } block
  const braceStart = raw.indexOf('{')
  const braceEnd = raw.lastIndexOf('}')
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      return JSON.parse(raw.slice(braceStart, braceEnd + 1))
    } catch {
      // continue
    }
  }

  throw new Error('AI 返回内容无法解析为 JSON，请重试')
}
