// frontend/src/components/ui/Button.tsx

import React from 'react';

/**
 * Props interface for the Button component.
 * Extends standard HTML button attributes and adds custom styling options.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Reusable Button component with different variants and sizes.
 * Provides a consistent look and feel across the application.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary', // Default variant
  size = 'md',         // Default size
  children,
  className = '',      // Allow additional custom classes
  ...props             // Rest of the HTML button props
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500';

  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white shadow-md hover:scale-[1.02]',
    secondary: 'bg-gray-600 hover:bg-gray-500 text-gray-300 border border-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
    outline: 'bg-transparent border border-cyan-600 text-cyan-400 hover:bg-cyan-900/20',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white',
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
