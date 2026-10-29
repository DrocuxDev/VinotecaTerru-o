import { useState } from 'react';
import { motion } from 'motion/react';
import type { Wine } from '../../data/contracts';
import { useMotionPolicy } from '../../motion/MotionPolicy';

export function ProductImage({ wine, shared = false, priority = false, className = '' }: { wine: Wine; shared?: boolean; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  const { level } = useMotionPolicy();
  return <motion.div layoutId={shared && level !== 'reduced' ? `wine:${wine.id}:image` : undefined} className={`product-image ${className}`} transition={level === 'reduced' ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 25, mass: 0.85 }}>
    <img src={failed ? '/assets/bottle-study.svg' : wine.images[0].src} alt={wine.images[0].alt} width={600} height={800} loading={priority ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
  </motion.div>;
}

export function ProductName({ wine, as = 'h3', className = '' }: { wine: Wine; as?: 'h1' | 'h3'; className?: string }) {
  const { level } = useMotionPolicy();
  const Heading = as === 'h1' ? motion.h1 : motion.h3;
  return <Heading layoutId={level === 'reduced' ? undefined : `wine:${wine.id}:name`} layout="position" className={className} transition={level === 'reduced' ? { duration: 0 } : { type: 'spring', stiffness: 130, damping: 25 }}>{wine.name}</Heading>;
}
