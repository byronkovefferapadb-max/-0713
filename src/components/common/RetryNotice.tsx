export function RetryNotice({ count }: { count: number }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-3 text-center">
      <p className="text-amber-700 text-sm">
        AI 思考走神了，正在重试...（第 {count} 次）
      </p>
    </div>
  )
}
