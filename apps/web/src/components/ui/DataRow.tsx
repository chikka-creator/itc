import * as React from 'react';

interface DataRowProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
}

export function DataRow({ label, value, hint, className = '' }: DataRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 border-b border-hairline-soft ${className}`}
    >
      <div>
        <p className="text-[13px] font-medium text-text-1">{label}</p>
        {hint && (
          <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
            {hint}
          </p>
        )}
      </div>
      <div className="font-mono text-[13px] text-text-1 font-semibold">
        {value}
      </div>
    </div>
  );
}
