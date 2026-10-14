'use client';

import * as React from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    duration: duration * 1000,
    bounce: 0,
  });

  const [displayValue, setDisplayValue] = React.useState<number>(0);

  React.useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, motionVal, value]);

  React.useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springVal]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
