export function ToolChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-none border border-hairline bg-surface font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-2">
      <span className="inline-block size-2 rounded-none bg-text-1" />
      {children}
    </span>
  );
}