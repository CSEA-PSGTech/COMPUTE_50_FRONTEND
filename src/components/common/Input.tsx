import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text-primary)]">
            {label}
            {props.required && <span className="text-red-500"> *</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 dark:text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`block w-full rounded-lg bg-[var(--bg-surface)] border text-[var(--text-primary)] placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors ${
              error
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 dark:border-[var(--border-color)] hover:border-zinc-400 dark:hover:border-zinc-500'
            } ${leftIcon ? 'pl-10' : 'pl-3.5'} ${rightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 dark:text-zinc-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-[var(--text-secondary)] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';