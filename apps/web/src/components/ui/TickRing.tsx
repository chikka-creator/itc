import * as React from 'react';

interface TickRingProps {
  progress?: number; // 0 to 100
  size?: number;
  ticks?: number;
  className?: string;
}

export function TickRing({
  progress = 75,
  size = 140,
  ticks = 36,
  className = '',
}: TickRingProps) {
  const activeTicks = Math.round((progress / 100) * ticks);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: ticks }).map((_, i) => {
          const angle = (i * 360) / ticks;
          const isActive = i < activeTicks;
          return (
            <line
              key={i}
              x1={size / 2}
              y1={6}
              x2={size / 2}
              y2={16}
              stroke={isActive ? 'currentColor' : '#E4E4E1'}
              strokeWidth={2}
              strokeLinecap="round"
              transform={`rotate(${angle} ${size / 2} ${size / 2})`}
              className={isActive ? 'text-brand' : ''}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-[13px] font-bold text-text-1">
        {progress}%
      </div>
    </div>
  );
}
