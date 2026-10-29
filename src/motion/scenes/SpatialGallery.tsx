import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import type { PanInfo } from 'motion/react';
import { SpecimenBottle, specimenTones } from '../../components/editorial/Specimen';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { amplitudeFor } from './types';
import type { SceneProps } from './types';

const slides = ['Frontal', 'Etiqueta', 'Detalle', 'Cava', 'Paisaje'].map((name, i) => ({ id: `s${i}`, name, tone: specimenTones[i % specimenTones.length] }));
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * C03 / FX06. Active plate centred, neighbours on rotated side planes. Arrows, direct selection,
 * keyboard (←/→/Home/End) and horizontal drag/swipe. Drag starts only after direction lock so
 * vertical page scroll keeps working on touch (touch-action: pan-y). No autoplay.
 */
export function SpatialGallery({ level }: SceneProps) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const compact = useMediaQuery('(max-width: 767px)');
  const amp = amplitudeFor(level) * (compact ? 0.6 : 1);
  const reduced = level === 'reduced';
  const labelId = useId();
  const last = slides.length - 1;
  const go = (next: number) => setIndex(Math.max(0, Math.min(last, next)));

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const map: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: last };
    if (event.key in map) { event.preventDefault(); go(map[event.key]); }
  }
  function onDragEnd(_: unknown, info: PanInfo) {
    setDragging(false);
    const threshold = 60;
    // A normal gesture moves at most one plate; velocity only helps reach that one step.
    if (info.offset.x < -threshold || info.velocity.x < -500) go(index + 1);
    else if (info.offset.x > threshold || info.velocity.x > 500) go(index - 1);
  }
  const settle = reduced ? { duration: 0.16 } : { type: 'spring' as const, stiffness: 210, damping: 30, mass: 0.9 };

  return <div>
    <p className="eyebrow mb-6">C03 · FX06 — Vitrina espacial</p>
    <section aria-roledescription="carrusel" aria-labelledby={labelId} className="select-none">
      <h4 id={labelId} className="sr-only">Galería de estudio</h4>
      <div tabIndex={0} onKeyDown={onKey} aria-label="Láminas. Usa las flechas izquierda y derecha para cambiar." className="relative overflow-hidden rounded-[var(--radius-editorial)] py-6" style={{ perspective: 1400 }}>
        <motion.div className={`relative mx-auto aspect-[3/4] w-[min(62vw,22rem)] touch-pan-y ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          drag="x" dragDirectionLock dragSnapToOrigin dragElastic={0.18} dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setDragging(true)} onDragEnd={onDragEnd} style={{ transformStyle: 'preserve-3d' }}>
          {slides.map((slide, i) => {
            const offset = i - index;
            const distance = Math.abs(offset);
            const visible = reduced ? offset === 0 : distance <= 2;
            return <motion.div key={slide.id} role="group" aria-roledescription="lámina" aria-label={`${pad(i + 1)} de ${pad(slides.length)}: ${slide.name}`}
              // Off-centre plates are inert: no accidental focus, no hit-testing; use arrows or index.
              inert={offset !== 0} aria-hidden={offset !== 0}
              className="absolute inset-0 border border-line bg-surface p-6"
              initial={false}
              animate={{
                x: reduced ? 0 : `${offset * (compact ? 78 : 70)}%`,
                rotateY: -Math.sign(offset) * Math.min(distance, 1) * 32 * amp,
                z: -distance * 160 * amp,
                scale: reduced ? 1 : 1 - Math.min(distance, 2) * 0.08,
                opacity: visible ? (offset === 0 ? 1 : 0.5) : 0,
              }}
              transition={settle}
              style={{ zIndex: slides.length - distance, transformOrigin: offset < 0 ? 'right center' : offset > 0 ? 'left center' : 'center' }}>
              <div className="flex h-full flex-col">
                <div className="min-h-0 flex-1 bg-raised p-6"><SpecimenBottle tone={slide.tone} className="h-full w-full" /></div>
                <p className="mt-4 flex justify-between font-mono text-xs text-muted"><span>{pad(i + 1)}</span><span>{slide.name}</span></p>
              </div>
            </motion.div>;
          })}
        </motion.div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <button type="button" className="button button-secondary" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Lámina anterior">←</button>
          <button type="button" className="button button-secondary" onClick={() => go(index + 1)} disabled={index === last} aria-label="Lámina siguiente">→</button>
        </div>
        <p className="font-mono text-sm text-gold" aria-live="polite" aria-atomic="true"><span className="sr-only">Lámina </span>{pad(index + 1)} / {pad(slides.length)}<span className="sr-only">: {slides[index].name}</span></p>
        <div className="flex gap-1" role="group" aria-label="Ir a lámina">
          {slides.map((slide, i) => <button key={slide.id} type="button" onClick={() => go(i)} aria-current={i === index ? 'true' : undefined} aria-label={`${pad(i + 1)}: ${slide.name}`}
            className="flex h-11 w-11 items-center justify-center"><span className={`block h-px w-6 transition-colors ${i === index ? 'bg-gold' : 'bg-line'}`} /></button>)}
        </div>
      </div>
    </section>
    <p className="mt-6 text-sm text-muted">Inicio y final explícitos (sin bucle) y sin rotación automática. {reduced ? 'Modo reducido: sin planos laterales; cambio por fundido de 160 ms.' : `Asentamiento por muelle (~450 ms); rotación lateral ${Math.round(32 * amp)}°.`}</p>
  </div>;
}
