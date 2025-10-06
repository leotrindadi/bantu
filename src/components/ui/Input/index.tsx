import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Propriedades específicas podem ser adicionadas aqui se necessário
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

export default Input;