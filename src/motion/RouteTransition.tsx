import type { ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useMotionPolicy } from './MotionPolicy';

function PageFrame({ children, compact }: { children: ReactNode; compact: boolean }) {
  const present = useIsPresent();
  const { level } = useMotionPolicy();
  const reduced = level === 'reduced';
  return <motion.div data-route-present={present} aria-hidden={!present || undefined} inert={!present} initial={reduced ? false : { opacity: 0.65, y: compact ? 12 : 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.14 } }} transition={{ duration: reduced ? 0 : compact ? 0.3 : 0.5 }} style={!present ? { position: 'absolute', inset: 0, pointerEvents: 'none' } : undefined}>{children}</motion.div>;
}
export function RouteTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const { level } = useMotionPolicy();
  const compact = location.pathname.startsWith('/checkout');
  // These destinations contain shared products; a curtain would conceal their FLIP animation.
  const continuity = location.pathname.startsWith('/vino/') || location.pathname === '/coleccion' || location.pathname === '/';
  return <div className="relative"><AnimatePresence initial={false} mode="sync"><PageFrame key={location.pathname} compact={compact}>{outlet}</PageFrame></AnimatePresence>{!compact && !continuity && level !== 'reduced' && <div className="pointer-events-none fixed inset-0 z-[var(--layer-transition)] overflow-hidden" aria-hidden="true"><motion.div key={location.pathname} className="absolute inset-y-0 left-0 w-1/2 origin-left bg-background" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} /><motion.div key={`${location.pathname}:right`} className="absolute inset-y-0 right-0 w-1/2 origin-right bg-background" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} /></div>}</div>;
}

