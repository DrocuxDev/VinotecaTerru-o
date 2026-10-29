import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useMotionPolicy } from '../../motion/MotionPolicy';

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { level } = useMotionPolicy();
  return <motion.div className={className} initial={level === 'reduced' ? false : { opacity: 0.75 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: level === 'reduced' ? 0 : 0.55, delay: Math.min(delay, 0.2) }}>{children}</motion.div>;
}
export function PageIntro({ index, title, italic, children }: { index: string; title: string; italic?: string; children?: ReactNode }) {
  return <section className="container-editorial page-intro"><p className="page-category">{index.replace(/^\d+\s*\/\s*/, '')}</p><h1>{title}{italic && <span className="page-title-continuation">{italic}</span>}</h1>{children && <div className="page-intro-copy">{children}</div>}</section>;
}
export function SectionTitle({ index, title, children }: { index: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><div><p className="section-category">{index.replace(/^\d+\s*\/\s*/, '')}</p><h2>{title}</h2></div>{children}</div>;
}
export function Photo({ name, alt, className = '', priority = false }: { name: string; alt: string; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <figure className={`photo-frame ${className}`}>
    {failed ? <div className="flex h-full min-h-64 items-center justify-center bg-raised p-8"><p className="font-editorial text-3xl text-gold">El tiempo deja su huella.</p></div> : <img src={`/images/${name}-1600.webp`} srcSet={`/images/${name}-800.webp 800w, /images/${name}-1600.webp 1600w`} sizes="(min-width: 1024px) 60vw, 100vw" width="1600" height="1067" alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />}
    <figcaption>{({ vineyard: 'Viñedos', cellar: 'La cava', landscape: 'El paisaje' } as Record<string, string>)[name] ?? 'TERRUÑO & CO.'}</figcaption>
  </figure>;
}
export function FAQ({ items }: { items: { title: string; text: string }[] }) {
  return <div className="editorial-faq divide-y divide-line border-y border-line">{items.map(item => <details key={item.title} className="group py-6"><summary className="flex min-h-11 cursor-pointer items-center justify-between gap-6 font-editorial text-2xl">{item.title}<span aria-hidden="true" className="font-sans text-lg text-gold group-open:rotate-45">+</span></summary><p className="mt-4 text-muted">{item.text}</p></details>)}</div>;
}
