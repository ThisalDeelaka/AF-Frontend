
const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;
  
  return (
    <div className="glass-card p-6 text-center mx-auto max-w-md my-8">
      <h3 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-300 mb-4">{error.message || "An unexpected error occurred."}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
