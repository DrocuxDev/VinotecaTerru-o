import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { motion } from 'motion/react';
import { useMotionPolicy } from '../../motion/MotionPolicy';

export function Overlay({ open, onClose, title, children, variant = 'dialog' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; variant?: 'dialog' | 'drawer' | 'menu' | 'search' }) {
  const { level } = useMotionPolicy();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); // Native top layer makes background inert and contains keyboard focus.
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} className={`overlay ${variant === 'drawer' ? 'overlay-drawer' : variant === 'menu' ? 'overlay-menu' : variant === 'search' ? 'overlay-search' : ''}`} onCancel={event => { event.preventDefault(); closeRef.current(); }}>
    {open && <motion.div initial={level === 'reduced' ? false : { opacity: 0.5, x: variant === 'drawer' ? 32 : 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}><div className={variant === 'search' ? 'wine-search-heading' : 'mb-8 flex items-start justify-between gap-4'}><h2 id={titleId} className={variant === 'search' ? undefined : 'text-4xl'}>{title}</h2><Button autoFocus variant="secondary" onClick={onClose}>Cerrar</Button></div>
    {children}</motion.div>}
  </dialog>;
}
