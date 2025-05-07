interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  return (
    <div className="flex items-center w-full p-4 mb-6 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
      <div className="mr-3 text-xl">⚠️</div>
      <div className="flex-1">{message}</div>
      {onDismiss && (
        <button 
          className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none" 
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}; 