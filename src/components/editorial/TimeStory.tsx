import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useMotionPolicy } from '../../motion/MotionPolicy';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { SplitText } from '../../motion/SplitText';
import { Photo } from './Editorial';

const chapters = [
  { title: 'El origen', text: 'Todo relato comienza en un lugar. El paisaje abre la primera página: el suelo, las hileras y una forma de mirar.', photo: 'vineyard' },
  { title: 'La vendimia', text: 'Un momento que reúne cuidado y decisión. En este recorrido, la cosecha representa el encuentro entre el lugar y quienes lo trabajan.', photo: 'landscape' },
  { title: 'La espera', text: 'Después, el tiempo. Una pausa que invita a observar, conservar y compartir. Cada vino encuentra su ritmo entre el cuidado, la espera y el momento de compartir.', photo: 'cellar' },
];
export function TimeStory() {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start 112px', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666667%']);
  const { level } = useMotionPolicy();
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 720px)');
  const spatial = level !== 'reduced' && wide;
  const [chapter, setChapter] = useState(0);
  const last = useRef(0);
  useMotionValueEvent(scrollYProgress, 'change', value => {
    const next = Math.round(value * 2);
    if (last.current !== next) { last.current = next; setChapter(next); }
  });
  function go(index: number) {
    const frame = section.current;
    if (!frame) return;
    const start = window.scrollY + frame.getBoundingClientRect().top - 112;
    const distance = frame.offsetHeight - window.innerHeight + 112;
    window.scrollTo({ top: start + distance * index / 2, behavior: 'auto' });
  }
  return <div ref={section} className={spatial ? 'relative h-[220svh]' : 'relative'}>
    <div className={spatial ? 'sticky top-28 flex h-[calc(100svh-7rem)] flex-col justify-center gap-6 overflow-hidden' : ''}>
      {spatial && <><div className="flex items-center justify-between gap-6"><p className="eyebrow">Tres capítulos / desplázate para descubrir</p><a href="#despues-del-relato" className="text-link shrink-0 text-xs">Saltar relato ↓</a></div>
        <nav aria-label="Capítulos del origen" className="flex gap-6">{chapters.map((item, i) => <button key={item.title} onClick={() => go(i)} aria-current={chapter === i ? 'step' : undefined} className={chapter === i ? 'min-h-11 border-b border-gold py-2 text-sm text-gold' : 'min-h-11 border-b border-transparent py-2 text-sm text-muted'}>0{i + 1} / {item.title}</button>)}</nav></>}
      <motion.ol className={spatial ? 'flex w-[300%]' : 'space-y-16'} style={spatial ? { x } : undefined}>
        {chapters.map((item, i) => <li key={item.title} className={spatial ? 'grid w-1/3 shrink-0 grid-cols-2 items-center gap-12 pr-1' : 'grid gap-8'}>
          <div><p className="eyebrow">0{i + 1} / Capas del tiempo</p><h3 className="mt-5 text-[clamp(2.5rem,4vw,5rem)]"><SplitText text={item.title} /></h3><p className="mt-6 max-w-md text-muted">{item.text}</p></div>
          <Photo name={item.photo} alt="Fotografía de ambiente para el relato de elaboración." className={spatial ? 'h-[min(52svh,32rem)]' : 'aspect-[4/3]'} />
        </li>)}
      </motion.ol>
      {spatial && <div className="h-px bg-line" aria-hidden="true"><motion.div className="h-full origin-left bg-gold" style={{ scaleX: scrollYProgress }} /></div>}
    </div><span id="despues-del-relato" tabIndex={-1} className="absolute bottom-0" />
  </div>;
}
