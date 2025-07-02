// frontend/src/components/ui/InputField.tsx

import React from 'react';

/**
 * Props interface for the InputField component.
 * Extends standard HTML input attributes and adds custom styling and error handling.
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string; // Error message to display below the input
  isTextArea?: boolean; // Flag to render a textarea instead of input
}

/**
 * Reusable InputField component for consistent form inputs.
 * Supports text, number, date, and other input types,
 * and can render as a textarea. Includes error display.
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  id, // id is required for label 'htmlFor' attribute
  error,
  isTextArea = false,
  className = '',
  ...props
}) => {
  const baseStyles = `
    appearance-none rounded-lg relative block w-full px-4 py-3
    border bg-gray-700 placeholder-gray-400 text-white
    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
    sm:text-sm transition-all duration-200
  `;

  const errorStyles = error ? 'border-red-500' : 'border-gray-600';

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          id={id}
          className={`${baseStyles} ${errorStyles} ${className}`}
          rows={3} // Default rows for textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} // Type assertion for textarea props
        />
      ) : (
        <input
          id={id}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default InputField;
