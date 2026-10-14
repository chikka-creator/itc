import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="bg-surface border border-hairline p-10 text-center rounded-none flex flex-col items-center justify-center space-y-3">
      {Icon && (
        <div className="p-3 bg-bg border border-hairline rounded-none text-text-3 mb-1">
          <Icon className="w-5 h-5 text-brand" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-1 font-sans">{title}</h3>
      <p className="text-xs text-text-2 font-mono max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <div className="pt-2">
          <Link
            href={actionHref}
            className="px-4 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors inline-block"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
