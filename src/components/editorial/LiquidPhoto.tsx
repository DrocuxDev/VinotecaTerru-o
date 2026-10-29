import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useInView, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useMotionPolicy } from '../../motion/MotionPolicy';
import { SceneBoundary } from '../../motion/SceneBoundary';
import { Photo } from './Editorial';

const PhotoCanvas = lazy(() => import('./PhotoCanvas'));

export function LiquidPhoto({ name, alt, className = '' }: { name: string; alt: string; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const visible = useInView(frame, { amount: 0.05 });
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
  const { level } = useMotionPolicy();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [started, setStarted] = useState(false);
  const pointerX = useSpring(0.5, { stiffness: 140, damping: 25 });
  const pointerY = useSpring(0.5, { stiffness: 140, damping: 25 });
  const hover = useSpring(0, { stiffness: 100, damping: 24 });
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const bendTarget = useTransform(velocity, value => Math.max(-0.018, Math.min(0.018, value / 100000)));
  const bend = useSpring(bendTarget, { stiffness: 100, damping: 22 });
  const allowed = fine && level !== 'reduced' && !failed;
  const active = allowed && visible && tabVisible;
  const failure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const loaded = useCallback(() => setReady(true), []);
  useEffect(() => { if (active) setStarted(true); }, [active]);
  useEffect(() => {
    const change = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => { if (!active) hover.set(0); }, [active, hover]);
  // Keep the HTML image, its alt and caption present even when the GPU layer fails.
  return <div ref={frame} className={`relative overflow-hidden ${className}`}
    onPointerMove={event => {
      if (!active || event.pointerType !== 'mouse') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - bounds.left) / bounds.width);
      pointerY.set(1 - (event.clientY - bounds.top) / bounds.height);
      hover.set(level === 'full' ? 1 : 0.45);
    }} onPointerLeave={() => hover.set(0)}>
    <Photo name={name} alt={alt} className="h-full w-full" />
    {started && allowed && <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity: ready ? 1 : 0 }}>
      <SceneBoundary onError={failure} fallback={null}><Suspense fallback={null}>
        <PhotoCanvas src={`/images/${name}-1600.webp`} active={active} pointerX={pointerX} pointerY={pointerY} hover={hover} bend={bend} onReady={loaded} onFailure={failure} />
      </Suspense></SceneBoundary>
      <p className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/90 to-transparent px-4 py-3 font-mono text-[0.65rem]">La cava</p>
    </div>}
  </div>;
}
