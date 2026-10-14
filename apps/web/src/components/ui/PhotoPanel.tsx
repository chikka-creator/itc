import Image from 'next/image';
import type { FloatingCardProps } from './FloatingCard';
import { FloatingCard } from './FloatingCard';

interface PhotoPanelProps {
  src: string;
  alt: string;
  priority?: boolean;
  children?: React.ReactNode;
}

export function PhotoPanel({
  src,
  alt,
  priority = false,
  children,
}: PhotoPanelProps) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden shadow-photo bg-brand-soft">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 520px"
      />
      {children}
    </div>
  );
}