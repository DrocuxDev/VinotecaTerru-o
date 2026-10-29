import { useEffect } from 'react';
import type { PointerEvent } from 'react';
import { useSpring } from 'motion/react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useMotionPolicy } from './MotionPolicy';

/** Move the contents while keeping the hit area and focus ring fixed. */
export function useMagnetic(enabled = true) {
  const { level } = useMotionPolicy();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const allowed = enabled && fine && level !== 'reduced';
  const x = useSpring(0, { stiffness: 220, damping: 22, mass: 0.45 });
  const y = useSpring(0, { stiffness: 220, damping: 22, mass: 0.45 });
  const scale = useSpring(1, { stiffness: 350, damping: 24 });
  useEffect(() => { if (!allowed) { x.jump(0); y.jump(0); scale.jump(1); } }, [allowed, x, y, scale]);
  const reset = () => { x.set(0); y.set(0); scale.set(1); };
  return { style: { x, y, scale }, reset,
    move: (event: PointerEvent<HTMLElement>) => {
      if (!allowed || event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      const range = level === 'full' ? 7 : 4;
      x.set(Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1)) * range);
      y.set(Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1)) * range);
    }, press: () => { if (allowed) scale.set(0.96); }, release: () => scale.set(1),
  };
}
