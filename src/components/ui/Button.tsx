import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'darkOutline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function resolveClasses(variantClass: string, callerClass: string): string {
  if (!callerClass || !callerClass.trim()) return variantClass;

  const isColorText = (cls: string) => {
    return /^!?text-(?!xs\b|sm\b|base\b|lg\b|xl\b|[0-9]xl\b|\[\d+px\]|center\b|left\b|right\b|justify\b|wrap\b|nowrap\b|clip\b|ellipsis\b)/.test(
      cls
    );
  };

  const callerTokens = callerClass.trim().split(/\s+/);
  const hasBaseBg = callerTokens.some((c) => /^bg-/.test(c));
  const hasHoverBg = callerTokens.some((c) => /^hover:bg-/.test(c));
  const hasBaseText = callerTokens.some((c) => isColorText(c));
  const hasHoverText = callerTokens.some((c) => /^hover:text-/.test(c));
  const hasBaseBorder = callerTokens.some((c) =>
    /^border-(?!0\b|2\b|4\b|8\b|t-\b|b-\b|l-\b|r-\b)/.test(c)
  );
  const hasHoverBorder = callerTokens.some((c) => /^hover:border-/.test(c));

  const isLightBg =
    hasBaseBg &&
    callerTokens.some((c) =>
      /^bg-(?:white|slate-50|slate-100|gray-50|gray-100|blue-50|amber-50|emerald-50)/.test(c)
    );
  const isDarkBg =
    hasBaseBg &&
    callerTokens.some((c) =>
      /^bg-(?:slate-800|slate-900|slate-950|gray-900|gray-950|blue-600|blue-700|blue-800|blue-900|blue-950|indigo-900|indigo-950|emerald-600|emerald-700|black|\[#0F172A\]|\[#0B132B\])/.test(
        c
      )
    );

  const isDarkTextCaller = callerTokens.some((c) =>
    /^text-(?:white|slate-[123]00|blue-[234]00)/.test(c)
  );

  const filtered = variantClass.split(/\s+/).filter((cls) => {
    if (hasBaseBg && cls.startsWith('bg-')) return false;
    if (hasHoverBg && cls.startsWith('hover:bg-')) return false;
    if (isLightBg && cls.startsWith('hover:bg-')) return false;
    if (hasBaseText && isColorText(cls)) return false;
    if (!hasBaseText && (isLightBg || isDarkBg) && isColorText(cls)) return false;
    if (hasHoverText && cls.startsWith('hover:text-')) return false;
    if (hasBaseText && cls.startsWith('hover:text-')) return false;
    if ((isDarkTextCaller || isDarkBg) && cls.startsWith('hover:text-')) return false;
    if (hasBaseBorder && (cls === 'border' || cls.startsWith('border-'))) return false;
    if (hasHoverBorder && cls.startsWith('hover:border-')) return false;
    if (hasBaseBorder && cls.startsWith('hover:border-')) return false;
    return true;
  });

  const extra: string[] = [];
  if (hasBaseBg && !hasBaseText) {
    if (isLightBg) extra.push('text-slate-900');
    else if (isDarkBg) extra.push('text-white');
  }
  if (isLightBg && !hasHoverBg) {
    extra.push('hover:bg-slate-100');
  }

  return `${filtered.join(' ')} ${extra.join(' ')} ${callerClass}`.replace(/\s+/g, ' ').trim();
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer whitespace-nowrap shrink-0 active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold',
  };

  // Auto-detect if caller intended a dark-outline button via className (e.g. text-white, border-slate-700, etc.)
  const isDarkOutlineOverride =
    variant === 'outline' &&
    /(?:^|\s)(?:text-(?:white|slate-[123]00|blue-[34]00)|border-(?:slate-[5678]00|blue-[3456]00|white)|bg-(?:slate-800|slate-900|transparent)|hover:bg-(?:slate-800|blue-800))/.test(
      className
    );

  const effectiveVariant = isDarkOutlineOverride ? 'darkOutline' : variant;

  const variantStyles = {
    primary:
      'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm hover:shadow active:bg-[#1E40AF] font-semibold',
    secondary:
      'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm hover:shadow font-semibold',
    outline:
      'border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100 hover:border-slate-400 shadow-2xs font-semibold',
    darkOutline:
      'border border-slate-700 bg-transparent text-white hover:bg-slate-800/80 hover:border-slate-500 shadow-2xs font-medium',
    white:
      'bg-white text-slate-950 border border-slate-200 hover:bg-slate-100 shadow-sm font-bold',
    ghost:
      'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 font-medium',
  };

  const resolvedVariantClasses = resolveClasses(variantStyles[effectiveVariant], className);

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${resolvedVariantClasses}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="shrink-0 text-current flex items-center">{leftIcon}</span>}
      <span className="inline-flex items-center gap-2 text-current">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0 text-current flex items-center">{rightIcon}</span>}
    </button>
  );
};
