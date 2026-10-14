export interface FloatingCardProps {
  title: string;
  meta: string;
  done?: boolean;
  index?: number;
}

const POSITIONS = [
  'left-4 md:left-8 top-8',
  'right-4 md:right-10 top-1/3',
  'left-4 md:left-12 bottom-8',
];

export function FloatingCard({
  title,
  meta,
  done = true,
  index = 0,
}: FloatingCardProps) {
  return (
    <div
      className={`absolute ${POSITIONS[index % POSITIONS.length]} bg-surface rounded-none border border-hairline shadow-float px-4 py-3 min-w-[200px] max-w-[240px] pointer-events-none`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex size-4 items-center justify-center rounded-none text-[9px] ${
            done ? 'bg-success text-white' : 'border border-hairline text-text-3'
          }`}
        >
          {done ? '✓' : ''}
        </span>
        <span className="text-[13px] font-semibold text-text-1 truncate">
          {title}
        </span>
      </div>
      <p className="mt-1 ml-6 font-mono text-[10px] uppercase tracking-[0.12em] text-text-3">
        {meta}
      </p>
    </div>
  );
}