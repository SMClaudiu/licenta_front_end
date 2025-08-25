import React from 'react';
import { Brain, Loader2 } from 'lucide-react';
import {AIAdviceButtonProps} from "../../../types/api";


export const AIAdviceButton: React.FC<AIAdviceButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
        hover:shadow-md hover:transform hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Brain className="w-4 h-4" />
      )}
      {loading ? 'Getting AI Advice...' : 'AI Advice'}
    </button>
  );
};