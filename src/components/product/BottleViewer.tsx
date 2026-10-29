import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { motion } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { SceneBoundary } from '../../motion/SceneBoundary';
import { useMotionPolicy } from '../../motion/MotionPolicy';
import { Button } from '../ui/Button';

import { bottleGesture, shouldAutoLoadBottle } from './viewerPolicy';
export function canStartBottleDrag(target: EventTarget | null, enabled: boolean) {
  return enabled && target instanceof Element && !target.closest('button, a, input, select, textarea');
}
export function BottleViewer({ autoLoad = false, initiallyOpen = false, cameraProgress, shared = false }: { autoLoad?: boolean; initiallyOpen?: boolean; cameraProgress?: MotionValue<number>; shared?: boolean }) {
  const { level } = useMotionPolicy();
  const wide = useMediaQuery('(min-width: 1024px) and (pointer: fine)');
  const [followScroll, setFollowScroll] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const journey = followScroll && wide && level !== 'reduced' ? cameraProgress : undefined;
  const frame = useRef<HTMLDivElement>(null);
  const origin = useRef<{ x: number; y: number; angle: number; pointerId: number; dragging: boolean } | null>(null);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [enabled, setEnabled] = useState(initiallyOpen);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [angle, setAngle] = useState(0);
  // A fresh lazy loader and GLTF cache entry make a retry recover from failed requests.
  const BottleCanvas = useMemo(() => lazy(async () => {
    const module = await import('./BottleCanvas');
    if (attempt > 0) module.clearBottleModelCache();
    return module;
  }), [attempt]);
  const loaded = useCallback(() => setReady(true), []);
  const failure = useCallback((reason?: Error) => { setFailed(true); setEnabled(false); setReady(false); setError(reason?.message ?? 'No se pudo cargar el modelo. Comprueba la conexión y pulsa Reintentar 3D; la imagen sigue disponible.'); }, []);
  useEffect(() => {
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0)), { threshold: 0 }) : null;
    if (observer && frame.current) observer.observe(frame.current);
    else setVisible(true);
    const change = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', change); };
  }, []);
  useEffect(() => {
    if (!shouldAutoLoadBottle({ requested: autoLoad, visible, tabVisible, wide, reduced: level === 'reduced', failed, dismissed })) return;
    const timer = window.setTimeout(() => setEnabled(true), 1200);
    return () => clearTimeout(timer);
  }, [autoLoad, visible, tabVisible, wide, level, failed, dismissed]);
  useEffect(() => { if (!enabled || ready || failed || !tabVisible || !visible) return; const timeout = window.setTimeout(() => failure(new Error('La carga del modelo tardó demasiado. Comprueba la conexión y pulsa Reintentar 3D.')), 30000); return () => clearTimeout(timeout); }, [enabled, ready, failed, tabVisible, visible, failure]);
  function inspect() { setDismissed(false); setFailed(false); setError(''); setReady(false); setVisible(true); if (failed) setAttempt(value => value + 1); setEnabled(true); }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!canStartBottleDrag(event.target, enabled) || !ready || event.button !== 0 || !event.isPrimary) return;
    origin.current = { x: event.clientX, y: event.clientY, angle, pointerId: event.pointerId, dragging: false };
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const start = origin.current;
    if (!start || !enabled || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.dragging) {
      const gesture = bottleGesture(dx, dy);
      if (gesture === 'pending') return;
      if (gesture === 'vertical') { origin.current = null; return; }
      start.dragging = true;
      setFollowScroll(false);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setAngle(start.angle + dx * 0.008);
  }
  return <div className="bottle-viewer" aria-busy={enabled && !ready}>
    <motion.div ref={frame} layoutId={shared && level !== 'reduced' ? 'wine:gran-reserva:image' : undefined} transition={{ type: 'spring', stiffness: 130, damping: 25, mass: 0.85 }} className="relative aspect-[3/4] touch-pan-y overflow-hidden rounded-t-[46%] bg-surface" onPointerDown={startDrag} onPointerMove={move} onPointerUp={() => { origin.current = null; }} onPointerCancel={() => { origin.current = null; }} onLostPointerCapture={() => { origin.current = null; }}>
      <img src="/images/terruno-bottle.webp" srcSet="/images/terruno-bottle-500.webp 500w, /images/terruno-bottle.webp 1000w" sizes="(min-width: 1024px) 40vw, 100vw" width="1152" height="1536" alt="Botella TERRUÑO & CO., etiqueta crema y cápsula burdeos." fetchPriority="high" draggable={false} className={`absolute inset-0 h-full w-full object-contain ${enabled && ready && !failed ? 'opacity-0' : ''}`} />
      {enabled && !failed && <div className="absolute inset-0 z-10" style={{ width: '100%', height: '100%' }} role="img" aria-label="Modelo 3D de TERRUÑO & CO."><SceneBoundary key={attempt} onError={failure} fallback={<span className="sr-only">El visor falló; puedes seguir usando la imagen de la botella.</span>}><Suspense fallback={null}><BottleCanvas angle={angle} cameraProgress={journey} active={visible && tabVisible} onReady={loaded} onFailure={failure} /></Suspense></SceneBoundary></div>}
      {!enabled && <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center"><Button variant="secondary" onClick={inspect}>{failed ? 'Reintentar 3D' : 'Inspeccionar en 3D'}</Button></div>}
      {enabled && !ready && <p role="status" className="pointer-events-none absolute inset-x-0 bottom-6 z-20 bg-background/80 py-2 text-center text-sm text-muted">Preparando la pieza 3D…</p>}
    </motion.div>
    {enabled && <div className="bottle-controls mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Girar la botella"><Button variant="secondary" disabled={!ready} aria-label="Girar botella a la izquierda" onClick={() => { setFollowScroll(false); setAngle(value => value - Math.PI / 6); }}>←</Button><Button variant="secondary" disabled={!ready} onClick={() => { setFollowScroll(false); setAngle(0); }}>Frontal</Button><Button variant="secondary" disabled={!ready} aria-label="Girar botella a la derecha" onClick={() => { setFollowScroll(false); setAngle(value => value + Math.PI / 6); }}>→</Button>{cameraProgress && wide && level !== 'reduced' && <Button variant="secondary" disabled={!ready} aria-pressed={followScroll} onClick={() => { setFollowScroll(value => !value); setAngle(0); }}>{followScroll ? 'Vista libre' : 'Seguir recorrido'}</Button>}<Button variant="secondary" onClick={() => { setEnabled(false); setReady(false); setDismissed(true); }}>Ver imagen</Button></div>}
    <p className="mt-3 text-center text-xs text-muted">{!enabled && !failed ? 'Imagen del vino · pulsa Inspeccionar en 3D para explorar.' : failed ? 'Vista estática disponible · el recurso 3D no pudo cargarse.' : journey ? 'Modelo 3D · la cámara acompaña el scroll. Arrastra para explorar libremente.' : 'Modelo 3D · gira con los controles o arrastra horizontalmente.'}</p>
    {error && <p role="alert" className="mt-3 border border-line p-3 text-sm text-error">{error}</p>}
  </div>;
}
