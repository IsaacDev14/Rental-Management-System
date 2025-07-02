import React from 'react';
import { ChevronDown } from 'lucide-react'; // Import the dropdown icon
import type { SelectOption } from '../../types/common'; // Import SelectOption as type-only

/**
 * Props interface for the SelectField component.
 * Extends standard HTML select attributes and adds custom options and error handling.
 */
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[]; // Array of { value: string, label: string }
  error?: string; // Error message to display below the select
  placeholder?: string; // Optional placeholder text for the default option
}

/**
 * Reusable SelectField component for consistent dropdown inputs.
 * Supports a list of options and displays error messages.
 */
const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id, // id is required for label 'htmlFor' attribute
  options,
  error,
  placeholder = `Select ${label || 'an option'}`, // Default placeholder
  className = '',
  ...props
}) => {
  const baseStyles = `
    appearance-none rounded-lg relative block w-full px-4 py-3 pr-10
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
      <div className="relative">
        <select
          id={id}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        >
          {/* Always include a default/placeholder option */}
          <option value="" disabled={props.value === "" || props.value === undefined}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow icon */}
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default SelectField;
