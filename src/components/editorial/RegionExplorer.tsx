import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { regions } from '../../data/catalog';
import { useMotionPolicy } from '../../motion/MotionPolicy';
import { Photo } from './Editorial';

export function RegionExplorer() {
  const [index, setIndex] = useState(0);
  const id = useId();
  const region = regions[index];
  const { level } = useMotionPolicy();
  return <div><div className="mb-8 flex flex-wrap gap-4" role="tablist" aria-label="Regiones de TERRUÑO">{regions.map((item, i) => <button key={item.id} id={`${id}-${item.id}`} role="tab" aria-selected={index === i} aria-controls={`${id}-panel`} tabIndex={index === i ? 0 : -1} className={`button ${index === i ? 'button-primary' : 'button-secondary'}`} onClick={() => setIndex(i)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - i; setIndex(next); document.getElementById(`${id}-${regions[next].id}`)?.focus(); } }}>{item.name}</button>)}</div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${region.id}`} tabIndex={0} className="grid gap-8 lg:grid-cols-12"><motion.div key={region.id} initial={level === 'reduced' ? false : { opacity: 0.4, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="lg:col-span-7"><Photo name={region.photo} alt={`Paisaje de viñedos que acompaña el relato de ${region.name}.`} className="aspect-[4/3]" /></motion.div><div className="lg:col-span-5"><p className="eyebrow">{region.subtitle}</p><h3 className="mt-4 text-5xl">{region.name}</h3><p className="mt-6 text-muted">{region.text}</p><svg viewBox="0 0 400 150" className="mt-8 w-full" aria-label={`Croquis de las regiones. Región elegida: ${region.name}.`} role="img"><path d="M40 120C90 70 110 100 160 65S280 80 360 20" stroke="#51434a" fill="none" strokeWidth="2" /><path d="M40 130C100 100 160 120 220 90S310 85 370 55" stroke="#51434a" fill="none" />{regions.map((item, i) => <g key={item.id}><circle cx={i ? 290 : 120} cy={i ? 60 : 85} r={index === i ? 9 : 4} fill={index === i ? '#c7a15a' : '#c6bcae'} /><text x={i ? 290 : 120} y={i ? 100 : 125} fill="#f2e9da" textAnchor="middle" fontSize="12">{item.name}</text></g>)}</svg><p className="mt-2 text-xs text-muted">Ica y Majes</p><p className="mt-6 border-t border-line pt-6 text-sm text-muted">Consulta las experiencias de cada región en nuestra agenda.</p></div></div>
  </div>;
}
