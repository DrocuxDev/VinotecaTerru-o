import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motionTokens } from '../tokens';
import { amplitudeFor } from './types';
import type { SceneProps } from './types';

/**
 * C04 / FX05. Native modal dialog (inert background, focus containment, Escape) wrapping two
 * articulated planes. Perspective lives on wrappers; links never rotate once settled.
 * Escape and the close button play the exit before the dialog closes; a second request is ignored.
 */
export function SpatialMenu({ level }: SceneProps) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const compact = useMediaQuery('(max-width: 767px)');
  const amp = amplitudeFor(level) * (compact ? 0.35 : 1);
  const reduced = level === 'reduced';

  useEffect(() => {
    const node = dialog.current;
    if (!node || !open) return;
    const previous = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const requestClose = () => setOpen(false);
  const finishClose = () => {
    dialog.current?.close();
    trigger.current?.focus({ preventScroll: true });
  };
  const exitDuration = reduced ? 0.12 : 0.32;
  const enter = { duration: reduced ? 0.16 : motionTokens.editorial * 0.8, ease: motionTokens.ease };

  return <div>
    <p className="eyebrow mb-6">C04 · FX05 — Menú espacial</p>
    <button ref={trigger} type="button" className="button button-secondary" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Abrir menú de estudio<span className="button-indicator" aria-hidden="true">↗</span></button>
    <p className="mt-6 text-sm text-muted">Escape o «Cerrar» reproducen la salida ({Math.round(exitDuration * 1000)} ms) y devuelven el foco al botón. {reduced ? 'Modo reducido: fundido sin rotación.' : compact ? 'Pantalla estrecha: panel completo con rotación mínima.' : 'Dos planos articulados con bisagra en los bordes exteriores.'}</p>

    <dialog ref={dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); requestClose(); }}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-cream backdrop:bg-transparent">
      <AnimatePresence onExitComplete={finishClose}>
        {open && <motion.div key="menu" className="grid h-full grid-cols-1 md:grid-cols-2" style={{ perspective: 1600 }}
          initial={{ opacity: reduced ? 0 : 1 }} animate={{ opacity: 1 }} exit={{ opacity: reduced ? 0 : 1, transition: { duration: exitDuration } }}>
          <motion.div aria-hidden="true" className="hidden border-r border-line bg-surface md:block" style={{ transformOrigin: 'left center' }}
            initial={{ rotateY: 78 * amp, opacity: reduced ? 1 : 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 78 * amp, opacity: 0, transition: { duration: exitDuration } }} transition={enter}>
            <div className="flex h-full flex-col justify-end p-12"><p className="font-mono text-xs text-muted">Archivo / Índice</p><p className="mt-4 font-editorial text-6xl leading-none text-gold">TERRUÑO<br />&amp; CO.</p></div>
          </motion.div>
          <motion.div className="flex h-full flex-col overflow-y-auto bg-raised p-6 sm:p-12" style={{ transformOrigin: 'right center' }}
            initial={{ rotateY: -78 * amp, opacity: reduced ? 0 : 0.2 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -78 * amp, opacity: 0, transition: { duration: exitDuration } }} transition={enter}>
            <div className="flex items-start justify-between gap-4">
              <h4 id={titleId} className="font-editorial text-4xl">Explorar</h4>
              <button type="button" autoFocus className="button button-secondary" onClick={requestClose}>Cerrar<span className="button-indicator" aria-hidden="true">×</span></button>
            </div>
            <nav aria-label="Navegación de estudio" className="mt-12 flex flex-col gap-2">
              {navigation.map((item, i) => <motion.div key={item.to} initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.18 + Math.min(i, 4) * 0.045, duration: 0.3 }}>
                <Link to={item.to} onClick={requestClose} className="nav-link font-editorial text-[clamp(2.25rem,6vw,3.75rem)] leading-tight"><span className="mr-4 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>{item.label}</Link>
              </motion.div>)}
            </nav>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </dialog>
  </div>;
}
