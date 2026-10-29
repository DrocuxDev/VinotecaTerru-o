import { useState } from 'react';
import type { PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ButtonLink } from '../../components/ui/Button';
import { SpecimenArch, SpecimenBottle } from '../../components/editorial/Specimen';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motionTokens } from '../tokens';
import { amplitudeFor } from './types';
import type { SceneProps } from './types';

/**
 * C01 / FX01 + FX07. The text plane is legible and the CTA is usable from the first frame;
 * only the scenographic wrapper opens from a vertical slit. Pointer tilt is limited to 3.5°
 * on fine pointers in the full level.
 */
export function HeroScene({ level }: SceneProps) {
  const [run, setRun] = useState(0);
  const amp = amplitudeFor(level);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const tiltEnabled = level === 'full' && finePointer;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 22 });
  const sy = useSpring(py, { stiffness: 160, damping: 22 });
  const rotateY = useTransform(sx, v => v * 3.5);
  const rotateX = useTransform(sy, v => v * -3.5);
  const bottleX = useTransform(sx, v => v * 10);
  const bottleY = useTransform(sy, v => v * 8);
  const archX = useTransform(sx, v => v * -4);

  function track(event: PointerEvent<HTMLDivElement>) {
    if (!tiltEnabled) return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width - 0.5) * 2);
    py.set(((event.clientY - box.top) / box.height - 0.5) * 2);
  }
  const reset = () => { px.set(0); py.set(0); };
  const hero = motionTokens.hero;
  const lines = ['La alquimia', 'del tiempo'];

  return <div className="grid items-center gap-10 lg:grid-cols-12">
    <div className="relative z-10 lg:col-span-7">
      <p className="eyebrow mb-6">C01 · FX01 / FX07 — Abertura del hero</p>
      <h3 aria-label="La alquimia del tiempo en cada copa." className="font-editorial text-[clamp(2.75rem,6vw,6rem)] leading-[1.02]">
        {lines.map((line, i) => <span key={`${run}-${line}`} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
          <motion.span className="block" initial={amp ? { y: `${32 * amp}%`, opacity: 0.55 } : false} animate={{ y: '0%', opacity: 1 }} transition={{ duration: hero * 0.7, delay: 0.05 + i * 0.05, ease: motionTokens.ease }}>{line}</motion.span>
        </span>)}
        <span key={`${run}-em`} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
          <motion.em className="block text-gold" initial={amp ? { y: `${32 * amp}%`, opacity: 0.55 } : false} animate={{ y: '0%', opacity: 1 }} transition={{ duration: hero * 0.7, delay: 0.15, ease: motionTokens.ease }}>en cada copa.</motion.em>
        </span>
      </h3>
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink to="/coleccion">Explorar colección</ButtonLink>
        <button type="button" className="button button-secondary" onClick={() => { reset(); setRun(r => r + 1); }}>Repetir entrada<span className="button-indicator" aria-hidden="true">↺</span></button>
      </div>
      <p className="mt-6 text-sm text-muted">Título y acción permanecen legibles y activos durante toda la entrada (máx. {Math.round(hero * 1000)} ms). Inclinación al puntero: {tiltEnabled ? 'activa (±3,5°)' : 'desactivada en este nivel o dispositivo'}.</p>
    </div>
    <div className="min-w-0 lg:col-span-5" style={{ perspective: 1100 }} onPointerMove={track} onPointerLeave={reset}>
      <motion.div key={run} className="relative aspect-[3/4] overflow-hidden border border-line bg-surface"
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        initial={amp ? { clipPath: 'inset(0% 48% 0% 48%)' } : level === 'reduced' ? { opacity: 0 } : false}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
        transition={{ duration: amp ? hero * 0.8 : 0.18, ease: motionTokens.ease }}>
        <motion.div className="absolute inset-0" style={tiltEnabled ? { x: archX } : undefined}>
          <motion.div className="absolute inset-0" initial={amp ? { scale: 1 + 0.12 * amp } : false} animate={{ scale: 1 }} transition={{ duration: hero, ease: motionTokens.ease }}>
            <SpecimenArch className="h-full w-full" />
          </motion.div>
        </motion.div>
        <motion.div className="absolute inset-x-[20%] bottom-[8%] top-[10%]" style={tiltEnabled ? { x: bottleX, y: bottleY } : undefined}>
          <motion.div className="h-full w-full" initial={amp ? { y: `${14 * amp}%`, opacity: 0 } : false} animate={{ y: '0%', opacity: 1 }} transition={{ duration: hero * 0.85, delay: 0.12, ease: motionTokens.ease }}>
            <SpecimenBottle className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
          </motion.div>
        </motion.div>
      </motion.div>
      <p className="mt-3 font-mono text-xs text-muted">Pieza geométrica provisional · no representa un vino del catálogo</p>
    </div>
  </div>;
}
