'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface FloatingHubProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
}

export function FloatingHub({
  children,
  className = '',
  enableTilt = true,
}: FloatingHubProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  // Mouse tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth tilt response
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map to subtle rotation (-4 to 4 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        y: [-4, 4, -4],
      }}
      transition={{
        y: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
