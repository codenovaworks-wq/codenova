import React from 'react';
import { CodeNovaSymbol } from './CodeNovaSymbol';

export { CodeNovaSymbol };

interface CodeNovaLogoProps {
  variant?: 'dark' | 'light' | 'auto';
  showWordmark?: boolean;
  className?: string;
  symbolSize?: number | string;
  onClick?: () => void;
}

/**
 * Official CodeNova Brand Logo
 * Combines the uploaded 3D isometric emblem with the CodeNova wordmark.
 */
export const CodeNovaLogo: React.FC<CodeNovaLogoProps> = ({
  variant = 'dark',
  showWordmark = true,
  className = '',
  symbolSize = 36,
  onClick,
}) => {
  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-[#0B132B]'
      : 'text-slate-900 dark:text-white';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      role="banner"
    >
      <div className="transition-transform duration-200 group-hover:scale-105">
        <CodeNovaSymbol size={symbolSize} />
      </div>

      {showWordmark && (
        <span
          className={`font-sans font-bold text-xl md:text-2xl tracking-tight leading-none ${textColor} transition-colors duration-200`}
        >
          CodeNova
        </span>
      )}
    </div>
  );
};
