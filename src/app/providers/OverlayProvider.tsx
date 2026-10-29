import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Overlay } from '../../components/ui/Overlay';

type Content = { title: string; children: ReactNode; variant?: 'dialog' | 'drawer' | 'menu' | 'search' };
const Context = createContext<{ show: (value: Content) => void; close: () => void } | null>(null);
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const location = useLocation();
  const close = useCallback(() => setContent(null), []);
  useLayoutEffect(() => { setContent(null); }, [location.pathname]);
  return <Context.Provider value={{ show: setContent, close }}>{children}<Overlay open={content !== null} onClose={close} title={content?.title ?? ''} variant={content?.variant}>{content?.children}</Overlay></Context.Provider>;
}
export function useOverlay() {
  const value = useContext(Context);
  if (!value) throw new Error('OverlayProvider is required');
  return value;
}
