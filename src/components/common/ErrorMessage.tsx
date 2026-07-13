export function ErrorMessage({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-lg leading-none mt-0.5">!</span>
        <div className="flex-1">
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 text-sm leading-none"
            aria-label="关闭"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  )
}
