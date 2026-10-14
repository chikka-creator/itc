import * as React from 'react';

interface CornerFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function CornerFrame({ children, className = '' }: CornerFrameProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -top-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      <span className="absolute -top-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      {children}
    </div>
  );
}
