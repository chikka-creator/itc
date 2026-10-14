import type { Dictionary } from '@/lib/i18n';

export function Eyebrow({
  children,
  variant = 'dot',
  center = false,
}: {
  children: React.ReactNode;
  variant?: 'dot' | 'asterisk';
  center?: boolean;
}) {
  return (
    <p
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-3 ${
        center ? 'text-center' : ''
      }`}
    >
      <span className="inline-block mr-2 align-middle">
        {variant === 'asterisk' ? '✳' : '●'}
      </span>
      {children}
    </p>
  );
}