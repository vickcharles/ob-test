import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium rounded-lg focus:ring-4 transition-colors';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-500 focus:ring-primary-300 text-gray-800',
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-100 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800 dark:text-white',
    outlined: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-300'
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3'
  };

  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}; 