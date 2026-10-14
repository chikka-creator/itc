import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-surface border border-hairline p-12 text-center rounded-none flex flex-col items-center justify-center space-y-3 shadow-sm">
      {Icon && (
        <div className="p-3 bg-bg border border-hairline rounded-none text-text-3 mb-1">
          <Icon className="w-6 h-6 text-brand" />
        </div>
      )}
      <h3 className="text-base font-semibold text-text-1 font-sans">{title}</h3>
      <p className="text-xs text-text-2 font-mono max-w-sm leading-relaxed">
        {description}
      </p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-4 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors inline-block"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors inline-block"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
