'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';

interface MotionRevealProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'simple-fade';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function MotionReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
}: MotionRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px 0px' });

  const getVariants = () => {
    switch (variant) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 28 },
          visible: { opacity: 1, y: 0 },
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -28 },
          visible: { opacity: 1, y: 0 },
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: -28 },
          visible: { opacity: 1, x: 0 },
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: 28 },
          visible: { opacity: 1, x: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.96 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'simple-fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // organic smooth ease
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
