import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { amplitudeFor } from './types';
import type { SceneProps } from './types';

/** Placeholder chapter copy describing the structure only; approved narrative is pending (AUDITORIA.md). */
const chapters = [
  { id: 'origen', index: '01', title: 'Origen', text: 'Lámina del terreno: trazos del suelo y de las regiones. El texto definitivo de Ica y Majes está pendiente de suministro.' },
  { id: 'vendimia', index: '02', title: 'Vendimia', text: 'Lámina de la cosecha: el momento del corte. Fechas y variedades se incorporarán con el contenido aprobado.' },
  { id: 'crianza', index: '03', title: 'Crianza', text: 'Lámina del tiempo en barrica y botella. No se inventan datos enológicos para completar el relato.' },
];
const sheetColors = ['#2b2125', '#3a2a2f', '#4a3238'];

function Sheet({ i, progress, amp }: { i: number; progress: MotionValue<number>; amp: number }) {
  // Each sheet lifts away during its own third of the section; the last one stays as resting state.
  const start = i / chapters.length;
  const end = (i + 1) / chapters.length;
  const lift = i === chapters.length - 1 || amp === 0 ? 0 : 1;
  const y = useTransform(progress, [start, end], ['0%', `${-62 * amp * lift}%`]);
  const rotateX = useTransform(progress, [start, end], [0, 18 * amp * lift]);
  const opacity = useTransform(progress, [start, end * 0.98, end], [1, 1 - 0.75 * lift, 1 - 0.9 * lift]);
  return <motion.div aria-hidden="true" className="absolute inset-0 border border-line p-8" style={{ y, rotateX, opacity, zIndex: chapters.length - i, background: sheetColors[i], transformOrigin: 'center top' }}>
    <svg viewBox="0 0 400 300" className="h-full w-full" fill="none">
      {i === 0 && <><path d="M0 220 C80 180 140 240 220 200 S340 150 400 180" stroke="#c7a15a" opacity=".7" /><path d="M0 250 C90 220 160 270 240 235 S350 200 400 220" stroke="#51434a" /><circle cx="130" cy="205" r="4" fill="#c7a15a" /><circle cx="300" cy="170" r="4" fill="#c7a15a" /></>}
      {i === 1 && <>{Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${30 + k * 42} 260 V${120 + (k % 3) * 20}`} stroke="#7b223b" strokeWidth="2" />)}<path d="M0 260 H400" stroke="#c7a15a" opacity=".6" /></>}
      {i === 2 && <><ellipse cx="200" cy="150" rx="120" ry="90" stroke="#c7a15a" opacity=".6" /><path d="M80 150 H320 M200 60 V240" stroke="#51434a" /></>}
    </svg>
    <p className="absolute bottom-6 left-8 font-mono text-xs text-muted">{chapters[i].index} / {chapters[i].title}</p>
  </motion.div>;
}

/**
 * C05 / FX04. Native scroll drives a bounded sticky scene (~200svh) on wide screens with motion enabled.
 * All chapter text is in the DOM and readable at every scroll position; the sheets are decorative.
 * Narrow screens and the reduced level get a plain vertical sequence with no sticky pinning.
 */
export function TimeLayers({ level }: SceneProps) {
  const wide = useMediaQuery('(min-width: 1024px)');
  const amp = amplitudeFor(level);
  const scene = wide && amp > 0;
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', value => setActive(Math.min(chapters.length - 1, Math.floor(value * chapters.length))));

  if (!scene) return <div>
    <p className="eyebrow mb-6">C05 · FX04 — Capas del tiempo (secuencia vertical)</p>
    <div ref={section}><ol className="space-y-8">
      {chapters.map((chapter, i) => <li key={chapter.id} className="grid gap-6 border-t border-line pt-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden"><Sheet i={i} progress={scrollYProgress} amp={0} /></div>
        <div><p className="font-mono text-xs text-gold">{chapter.index}</p><h4 className="mt-2 font-editorial text-4xl">{chapter.title}</h4><p className="mt-4 text-muted">{chapter.text}</p></div>
      </li>)}
    </ol></div>
    <p className="mt-6 text-sm text-muted">{wide ? 'Modo reducido: bloques de lectura sin fijación ni desplazamiento espacial.' : 'Pantalla estrecha: secuencia corta de bloques; sin escena fija.'}</p>
  </div>;

  return <div>
    <p className="eyebrow mb-6">C05 · FX04 — Capas del tiempo (escena con scroll nativo)</p>
    <div ref={section} className="relative h-[200svh]">
      <div className="sticky top-24 grid h-[calc(100svh-8rem)] grid-cols-12 items-center gap-10">
        <ol className="col-span-5 space-y-8">
          {chapters.map((chapter, i) => <li key={chapter.id} className={`border-l pl-6 transition-colors duration-300 ${i === active ? 'border-gold' : 'border-line'}`}>
            <p className="font-mono text-xs text-gold">{chapter.index}</p>
            <h4 className={`mt-1 font-editorial text-4xl transition-colors duration-300 ${i === active ? 'text-cream' : 'text-muted'}`}>{chapter.title}</h4>
            <p className="mt-2 text-muted">{chapter.text}</p>
          </li>)}
        </ol>
        <div className="col-span-7" style={{ perspective: 1400 }}>
          <div className="relative aspect-[4/3]">{chapters.map((chapter, i) => <Sheet key={chapter.id} i={i} progress={scrollYProgress} amp={amp} />)}</div>
        </div>
      </div>
    </div>
    <p className="mt-6 text-sm text-muted">Los tres capítulos permanecen legibles en todo momento; el índice resalta la lámina visible. Rueda, tacto, teclado y barra de desplazamiento avanzan igual.</p>
  </div>;
}
