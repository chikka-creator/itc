import * as React from 'react';

interface BlobFieldProps {
  className?: string;
}

export function BlobField({ className = '' }: BlobFieldProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-soft/40 blur-[100px]" />
    </div>
  );
}
