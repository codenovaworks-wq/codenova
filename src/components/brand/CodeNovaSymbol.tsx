import React from 'react';

interface CodeNovaSymbolProps {
  className?: string;
  size?: number | string;
}

/**
 * CodeNova official 3D isometric geometric emblem
 * Preserves the exact proportions, facets, angles and colors of the uploaded brand mark.
 */
export const CodeNovaSymbol: React.FC<CodeNovaSymbolProps> = ({
  className = 'w-9 h-9',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={style}
      aria-label="CodeNova Mark"
    >
      <g transform="translate(4, 4)">
        {/* Top-Right Ribbon */}
        {/* Top Royal Blue Facet */}
        <polygon
          points="76,28 116,50 90,66 50,44"
          fill="#2563EB"
        />
        {/* Right Outer Royal Blue Facet */}
        <polygon
          points="116,50 116,78 90,94 90,66"
          fill="#1D4ED8"
        />
        {/* Inner Dark Navy Facet */}
        <polygon
          points="50,44 90,66 90,94 50,72"
          fill="#0F172A"
        />

        {/* Bottom-Left Ribbon */}
        {/* Upper Dark Navy Facet */}
        <polygon
          points="24,62 64,84 38,100 -2,78"
          fill="#0B132B"
        />
        {/* Left Vibrant Cyan Facet */}
        <polygon
          points="-2,78 38,100 38,128 -2,106"
          fill="#00A3E0"
        />
        {/* Inner Sky Blue Facet */}
        <polygon
          points="38,100 64,84 64,112 38,128"
          fill="#0284C7"
        />
      </g>
    </svg>
  );
};
