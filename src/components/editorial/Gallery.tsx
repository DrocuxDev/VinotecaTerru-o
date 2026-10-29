import { useId, useState } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import type { PanInfo } from 'motion/react';
import { useMotionPolicy } from '../../motion/MotionPolicy';
import { Button } from '../ui/Button';

export type GallerySlide = { id: string; title: string; content: ReactNode; details?: ReactNode };
export function Gallery({ slides, label }: { slides: GallerySlide[]; label: string }) {
  const [index, setIndex] = useState(0);
  const { level } = useMotionPolicy();
  const titleId = useId();
  const reduced = level === 'reduced';
  const go = (value: number) => setIndex(Math.min(slides.length - 1, Math.max(0, value)));
  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: slides.length - 1 };
    if (event.key in keys) { event.preventDefault(); go(keys[event.key]); }
  }
  function dragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -55 || info.velocity.x < -500) go(index + 1);
    else if (info.offset.x > 55 || info.velocity.x > 500) go(index - 1);
  }
  return <section aria-roledescription="carrusel" aria-labelledby={titleId} className={`min-w-0 ${slides.some(slide => slide.details) ? 'featured-gallery' : ''}`}><h3 id={titleId} className="sr-only">{label}</h3>
    <div className="gallery-stage" style={{ perspective: 1300 }} tabIndex={0} onKeyDown={onKey} aria-label="Usa flechas, Inicio o Fin para cambiar de pieza.">
      <motion.div className="gallery-deck touch-pan-y" drag="x" dragDirectionLock dragSnapToOrigin dragElastic={0.12} dragConstraints={{ left: 0, right: 0 }} onDragEnd={dragEnd}>
        {slides.map((slide, i) => { const offset = i - index; return <motion.div key={slide.id} className="gallery-slide" role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${slides.length}: ${slide.title}`} aria-hidden={i !== index} inert={i !== index} initial={false} animate={{ x: reduced ? 0 : `${offset * 88}%`, rotateY: reduced ? 0 : -Math.sign(offset) * (level === 'full' ? 24 : 12), scale: reduced ? 1 : offset === 0 ? 1 : 0.85, opacity: offset === 0 ? 1 : reduced || Math.abs(offset) > 1 ? 0 : 0.65 }} transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 150, damping: 25, mass: 0.8 }} style={{ zIndex: slides.length - Math.abs(offset), pointerEvents: i === index ? 'auto' : 'none' }}>{slide.content}</motion.div>; })}
      </motion.div>
    </div>
    {slides[index].details && <div className="gallery-details" role="group" aria-label={`Información de ${slides[index].title}`}>{slides[index].details}</div>}
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4"><Button variant="secondary" indicator={false} disabled={index === 0} aria-label="Pieza anterior" onClick={() => go(index - 1)}>←</Button><p className="font-mono text-xs text-gold" aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · {slides[index].title}</p><Button variant="secondary" indicator={false} disabled={index === slides.length - 1} aria-label="Pieza siguiente" onClick={() => go(index + 1)}>→</Button></div>
    <div className="mt-3 flex flex-wrap justify-center" role="group" aria-label="Elegir pieza">{slides.map((slide, i) => <button key={slide.id} aria-label={`Ver ${slide.title}`} aria-current={i === index ? 'true' : undefined} onClick={() => go(i)} className="flex h-11 w-11 items-center justify-center"><span className={`h-px w-6 ${i === index ? 'bg-gold' : 'bg-line'}`} /></button>)}</div>
  </section>;
}
