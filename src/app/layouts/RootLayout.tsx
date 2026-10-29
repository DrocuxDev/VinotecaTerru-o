import { useEffect, useRef, useState } from 'react';
import { Link, ScrollRestoration, useLocation, useNavigation } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { Header } from '../../components/navigation/Header';
import { Footer } from '../../components/navigation/Footer';
import { routeInventory } from '../../data/navigation';
import { OverlayProvider } from '../providers/OverlayProvider';
import { RouteTransition } from '../../motion/RouteTransition';
import { useCart } from '../../features/cart/CartProvider';
import { wines } from '../../data/catalog';

export function RootLayout() {
  const location = useLocation();
  const navigation = useNavigation();
  const { notice, count } = useCart();
  const checkout = location.pathname.startsWith('/checkout');
  const main = useRef<HTMLElement>(null);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const devTitles: Record<string, string> = { '/fundaciones': 'Fundaciones', '/prototipos': 'Prototipos' };
    const wine = wines.find(value => location.pathname === `/vino/${value.slug}`);
    const title = wine?.name ?? devTitles[location.pathname] ?? routeInventory.find(route => route.path === location.pathname)?.title ?? 'Página no encontrada';
    document.title = `${title} — TERRUÑO & CO.`;
    setAnnouncement(title);
    const heading = main.current?.querySelector<HTMLElement>('[data-route-present="true"] h1');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    else main.current?.focus({ preventScroll: true });
  }, [location.pathname]);
  return <OverlayProvider><LayoutGroup id="terruno-site">
    <a href="#contenido" className="sr-only fixed left-4 top-4 z-[var(--layer-notice)] bg-cream p-4 text-background focus:not-sr-only">Saltar al contenido</a>
    {checkout ? <header className="border-b border-line py-5"><div className="container-editorial flex flex-wrap items-center justify-between gap-4"><Link to="/" className="font-editorial text-2xl">TERRUÑO & CO.</Link><Link to="/coleccion" className="text-link text-sm">Seguir explorando</Link></div></header> : <Header />}
    {navigation.state !== 'idle' && <p role="status" className="fixed right-6 bottom-6 z-[var(--layer-notice)] bg-raised px-6 py-3 text-sm">Abriendo el siguiente capítulo…</p>}
    <main ref={main} id="contenido" tabIndex={-1} className="editorial-site min-h-[60svh] focus:outline-none"><RouteTransition /></main>
    <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    <div className="sr-only" role="status" aria-live="polite">{notice ? `${notice} ${count} unidades en la cava.` : ''}</div>
    <AnimatePresence>{notice && <motion.div key={notice} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-hidden="true" className="pointer-events-none fixed right-6 bottom-6 z-[var(--layer-notice)] max-w-[calc(100%-3rem)] border border-gold bg-surface px-6 py-4 text-sm">{notice}</motion.div>}</AnimatePresence>
    <Footer /><ScrollRestoration />
  </LayoutGroup></OverlayProvider>;
}
