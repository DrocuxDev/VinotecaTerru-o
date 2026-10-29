import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { motionTokens } from './tokens';
import { useMediaQuery } from '../hooks/useMediaQuery';

export type Level = 'full' | 'balanced' | 'reduced';
type Preference = 'system' | Level;
const key = 'terruno:motion:v1';
const MotionContext = createContext<{ preference: Preference; level: Level; preview: boolean; setPreference: (value: Preference) => void } | null>(null);

function readPreference(): Preference {
  try {
    const value = localStorage.getItem(key);
    return value === 'full' || value === 'balanced' || value === 'reduced' ? value : 'system';
  } catch { return 'system'; }
}

export function MotionPolicy({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Preference>(readPreference);
  const [preview] = useState(() => import.meta.env.DEV && new URLSearchParams(window.location.search).get('previewMotion') === 'full');
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Only an explicitly requested local development preview may override system reduction.
  // It lasts in memory until a reload without the query; no override is saved in storage.
  const level: Level = preview ? 'full' : systemReduced || preference === 'reduced' ? 'reduced' : preference === 'full' ? 'full' : 'balanced';
  useEffect(() => {
    document.documentElement.dataset.motion = level;
    document.documentElement.dataset.motionPreview = preview ? 'true' : 'false';
    try { localStorage.setItem(key, preference); } catch { /* Session preference still works. */ }
  }, [level, preference, preview]);
  function exitPreview() {
    const url = new URL(window.location.href);
    url.searchParams.delete('previewMotion');
    window.location.replace(url);
  }
  return <MotionContext.Provider value={{ preference, level, preview, setPreference }}>
    {preview && <aside className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-gold bg-raised px-5 py-2 text-sm"><p>Vista previa temporal · animaciones completas y carga del 3D</p><button type="button" onClick={exitPreview} className="text-link text-gold">Salir y recargar</button></aside>}
    <MotionConfig reducedMotion={preview ? 'never' : level === 'reduced' ? 'always' : 'user'} transition={{ duration: level === 'reduced' ? 0 : motionTokens.container, ease: motionTokens.ease }}>{children}</MotionConfig>
  </MotionContext.Provider>;
}

export function useMotionPolicy() {
  const value = useContext(MotionContext);
  if (!value) throw new Error('MotionPolicy is required');
  return value;
}

export function MotionPreference() {
  const { preference, preview, setPreference } = useMotionPolicy();
  return <label className="block max-w-xs text-sm text-muted">Movimiento
    <select className="field-control mt-2" disabled={preview} value={preview ? 'full' : preference} onChange={event => setPreference(event.target.value as Preference)}>
      <option value="system">Según el sistema</option><option value="full">Completo</option><option value="balanced">Equilibrado</option><option value="reduced">Reducido</option>
    </select>
    {preview && <span className="mt-2 block text-xs text-gold">Vista previa completa activa. Usa «Salir y recargar» para volver a tu preferencia habitual.</span>}
  </label>;
}
