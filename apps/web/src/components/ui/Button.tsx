interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  dark?: boolean;
  href?: string;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = 'solid',
  dark = false,
  href,
  className = '',
  children,
  asChild,
  ...props
}: ButtonProps) {
  const base =
    'font-mono text-[10px] font-medium uppercase tracking-[0.1em] px-5 h-11 inline-flex items-center justify-center gap-2 rounded-none transition-all duration-200 whitespace-nowrap hover:-translate-y-px';

  // All buttons have the exact same unified color: solid black #111111 with white text
  const variantCls = 'bg-[#111111] text-white hover:bg-[#2E2E2E] border border-[#111111]';

  const cls = `${base} ${variantCls} ${className}`;

  if (asChild && children) {
    // Render children directly with className injected
    return <>{children}</>;
  }

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}