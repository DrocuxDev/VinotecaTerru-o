import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { SpecimenBottle, specimenTones } from '../../components/editorial/Specimen';
import { motionTokens } from '../tokens';
import type { SceneProps } from './types';

/** Lab specimens. Deliberately not wine data: names are neutral placeholders. */
const specimens = [
  { id: 'a', name: 'Muestra A', meta: 'Pieza 01 / Estudio', tone: specimenTones[0] },
  { id: 'b', name: 'Muestra B', meta: 'Pieza 02 / Estudio', tone: specimenTones[1] },
  { id: 'c', name: 'Muestra C', meta: 'Pieza 03 / Estudio', tone: specimenTones[2] },
];

/**
 * C02 / FX02. Identifiers are scoped per specimen and per role (image, name) so two products never
 * share a layoutId. Reduced level drops shared layout and uses a short fade.
 */
export function ProductContinuity({ level }: SceneProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const origin = useRef<Record<string, HTMLButtonElement | null>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const lastOpened = useRef<string | null>(null);
  const shared = level !== 'reduced';
  const duration = level === 'full' ? motionTokens.continuity : 0.42;
  const open = specimens.find(item => item.id === openId) ?? null;

  useEffect(() => {
    if (openId) { lastOpened.current = openId; heading.current?.focus({ preventScroll: true }); }
    else if (lastOpened.current) origin.current[lastOpened.current]?.focus({ preventScroll: true });
  }, [openId]);

  const layoutId = (id: string, role: 'image' | 'name') => (shared ? `specimen-${id}-${role}` : undefined);
  const transition = { duration: shared ? duration : 0.16, ease: motionTokens.ease };

  return <div>
    <p className="eyebrow mb-6">C02 · FX02 — Continuidad tarjeta → ficha</p>
    <LayoutGroup id="c02">
      <div className="relative min-h-[34rem]">
        <AnimatePresence initial={false} mode="popLayout">
          {!open ? <motion.ul key="grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            {specimens.map(item => <motion.li key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: shared ? 0.12 : 0 }}>
              <article className="border border-line bg-surface p-4">
                <motion.div layoutId={layoutId(item.id, 'image')} transition={transition} className="aspect-[3/4] bg-raised p-8">
                  <SpecimenBottle tone={item.tone} className="h-full w-full" />
                </motion.div>
                <p className="mt-4 font-mono text-xs text-muted">{item.meta}</p>
                <motion.h4 layout="position" layoutId={layoutId(item.id, 'name')} transition={transition} className="font-editorial text-3xl">{item.name}</motion.h4>
                <button ref={node => { origin.current[item.id] = node; }} type="button" className="button button-secondary mt-4 w-full" onClick={() => setOpenId(item.id)}>Ver ficha de estudio<span className="button-indicator" aria-hidden="true">↗</span></button>
              </article>
            </motion.li>)}
          </motion.ul>
          : <motion.article key={`detail-${open.id}`} aria-labelledby="c02-detail" className="grid gap-8 border border-line bg-surface p-6 md:grid-cols-12" initial={shared ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            <motion.div layoutId={layoutId(open.id, 'image')} transition={transition} className="aspect-[3/4] bg-raised p-10 md:col-span-5">
              <SpecimenBottle tone={open.tone} className="h-full w-full" />
            </motion.div>
            <div className="md:col-span-7">
              <motion.p className="font-mono text-xs text-muted" initial={{ opacity: 0, y: shared ? 12 : 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shared ? 0.22 : 0, duration: 0.3 }}>{open.meta}</motion.p>
              <motion.h4 layout="position" layoutId={layoutId(open.id, 'name')} transition={transition} className="font-editorial text-[clamp(2.5rem,5vw,4.5rem)] leading-none">
                <span ref={heading} id="c02-detail" tabIndex={-1} className="focus:outline-none">{open.name}</span>
              </motion.h4>
              <motion.div initial={{ opacity: 0, y: shared ? 16 : 0 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: shared ? 0.3 : 0, duration: 0.32 }}>
                <p className="mt-6 text-muted">Ficha de estudio para evaluar la continuidad. Nombre, añada, región y precio reales se incorporarán cuando exista contenido aprobado (fase E).</p>
                <button type="button" className="button button-primary mt-8" onClick={() => setOpenId(null)}>Volver a las muestras<span className="button-indicator" aria-hidden="true">↙</span></button>
              </motion.div>
            </div>
          </motion.article>}
        </AnimatePresence>
      </div>
    </LayoutGroup>
    <p className="mt-6 text-sm text-muted">La proporción 3:4 se conserva en ambos estados. Al abrir, el foco pasa al nombre; al volver, regresa al botón de origen. {shared ? `Recorrido compartido de ${Math.round(duration * 1000)} ms.` : 'Modo reducido: fundido de 160 ms sin desplazamiento.'}</p>
  </div>;
}
