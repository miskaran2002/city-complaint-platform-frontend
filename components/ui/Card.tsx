// components/ui/Card.tsx
import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl border border-gray-100 p-6 sm:p-8 ${className}`} {...props}>
      {children}
    </div>
  );
};