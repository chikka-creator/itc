import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-neutral-200/80 border border-hairline/60 rounded-none ${className}`}
      {...props}
    />
  );
}
