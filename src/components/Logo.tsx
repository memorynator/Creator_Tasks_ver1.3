import React from 'react';
import { CheckCircle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 36,
  };

  return (
    <div className="flex items-center">
      <div className={`relative ${variant === 'icon' ? '' : 'mr-2'}`}>
        <div className="absolute inset-0 text-blue-500 animate-pulse-soft">
          <CheckCircle size={iconSizes[size]} />
        </div>
        <div className="text-blue-600">
          <CheckCircle size={iconSizes[size]} />
        </div>
      </div>
      {variant === 'full' && (
        <div>
          <h1 className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            タスカン
          </h1>
          <p className="text-xs text-gray-500 leading-none">タスク管理をカンタンに♪</p>
        </div>
      )}
    </div>
  );
};