import * as React from 'react';

interface DialProps {
  value: number | string;
  label: string;
  meta?: string;
  className?: string;
}

export function Dial({ value, label, meta, className = '' }: DialProps) {
  return (
    <div
      className={`bg-surface rounded-none border border-hairline p-5 flex flex-col items-center text-center shadow-sm ${className}`}
    >
      <div className="font-mono text-[28px] font-bold text-text-1 leading-tight">
        {value}
      </div>
      <p className="font-semibold text-[13px] text-text-1 mt-1">{label}</p>
      {meta && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-3 mt-0.5">
          {meta}
        </p>
      )}
    </div>
  );
}
