import * as React from 'react';

interface SpecCardProps {
  label: string;
  value: string;
  desc?: string;
  className?: string;
}

export function SpecCard({ label, value, desc, className = '' }: SpecCardProps) {
  return (
    <div
      className={`bg-surface rounded-none border border-hairline p-5 shadow-sm ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
        {label}
      </p>
      <p className="text-[18px] font-semibold text-text-1 mt-1">{value}</p>
      {desc && <p className="text-[12px] text-text-2 mt-1">{desc}</p>}
    </div>
  );
}
