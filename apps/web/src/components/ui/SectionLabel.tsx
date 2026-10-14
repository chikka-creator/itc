import * as React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  variant?: 'dot' | 'asterisk';
  className?: string;
  center?: boolean;
}

export function SectionLabel({
  children,
  variant = 'dot',
  className = '',
  center = false,
}: SectionLabelProps) {
  const glyph = variant === 'dot' ? '●' : '✳';

  return (
    <p
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-3 flex items-center gap-2 ${
        center ? 'justify-center' : ''
      } ${className}`}
    >
      <span className="text-[10px] leading-none text-brand">{glyph}</span>
      <span>{children}</span>
    </p>
  );
}
