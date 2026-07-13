export function QuestionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-full mb-1" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="h-10 bg-gray-100 rounded-lg mb-2" />
          ))}
        </div>
      ))}
    </div>
  )
}
