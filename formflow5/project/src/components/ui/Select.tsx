import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    error,
    helperText,
    fullWidth = false,
    className = '',
    id,
    options,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              block appearance-none rounded-md shadow-sm border-gray-300
              focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${fullWidth ? 'w-full' : ''}
              transition duration-150 ease-in-out
              bg-white
              text-gray-900
              text-sm
              py-2
              px-3
              pr-8
              border
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;