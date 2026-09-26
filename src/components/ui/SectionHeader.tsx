import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) => {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl mb-12 md:mb-16 ${alignmentClass} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] leading-tight"
        style={{ textWrap: 'balance' }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
