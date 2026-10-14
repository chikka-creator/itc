import * as React from 'react';

interface OversizedWordmarkProps {
  text?: string;
  glyph?: string;
  className?: string;
}

export function OversizedWordmark({
  text = 'IT CLUB',
  glyph = '✳',
  className = '',
}: OversizedWordmarkProps) {
  return (
    <div className={`overflow-hidden select-none pointer-events-none ${className}`}>
      <div className="flex items-end gap-4 sm:gap-6 leading-none">
        <span className="text-[clamp(3.5rem,12vw,10rem)] leading-[0.8] text-white">
          {glyph}
        </span>
        <span className="text-[clamp(3.5rem,12vw,10rem)] font-bold tracking-[-0.04em] leading-[0.8] text-white">
          {text}
        </span>
      </div>
    </div>
  );
}
