import { useEffect, useState } from 'react';
import { SearchIcon } from '../product/SearchField';
import { WineSearch } from '../product/WineSearch';
import { Link, NavLink } from 'react-router-dom';
import { navigation } from '../../data/navigation';
import { useOverlay } from '../../app/providers/OverlayProvider';
import { Button } from '../ui/Button';
import { motion } from 'motion/react';
import { wines } from '../../data/catalog';
import { useCart } from '../../features/cart/CartProvider';
import { CartDrawer } from '../cart/CartDrawer';
import { useMotionPolicy } from '../../motion/MotionPolicy';

export function Header() {
  const { show, close } = useOverlay();
  const cart = useCart();
  const { level } = useMotionPolicy();
  const [scrolled, setScrolled] = useState(false);
  const openSearch = () => show({ title: 'Buscar en la colección', variant: 'search', children: <WineSearch /> });
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k' || event.altKey || event.shiftKey || event.repeat || event.isComposing) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))) return;
      if (document.querySelector('dialog[open]')) return;
      event.preventDefault();
      show({ title: 'Buscar en la colección', variant: 'search', children: <WineSearch /> });
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [show]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const openMenu = () => show({ title: 'El archivo de TERRUÑO', variant: 'menu', children:
    <div className="grid gap-8 md:grid-cols-2" style={{ perspective: 1400 }}><motion.div className="hidden border-r border-line bg-surface p-8 md:flex md:flex-col md:justify-end" initial={level === 'reduced' ? false : { rotateY: 35, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={level === 'reduced' ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 24, mass: 0.8 }} style={{ transformOrigin: 'left' }}><p className="eyebrow">Un archivo del tiempo</p><p className="mt-6 font-editorial text-6xl">La alquimia<br /><em className="text-gold">en cada copa.</em></p></motion.div><motion.nav initial={level === 'reduced' ? false : { rotateY: -12, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={level === 'reduced' ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 24, mass: 0.8 }} style={{ transformOrigin: 'right' }} aria-label="Navegación móvil" className="flex flex-col gap-4">{navigation.map(item => <NavLink key={item.to} to={item.to} onClick={close} className="nav-link font-editorial text-4xl">{item.label}</NavLink>)}</motion.nav></div>,
  });
  return <header className={`site-header sticky top-0 z-[var(--layer-header)] border-b border-line bg-background ${scrolled ? 'py-3' : 'py-5'}`}>
    <div className="container-editorial flex flex-wrap items-center justify-between gap-4">
      <Link to="/" aria-label="TERRUÑO & CO. — Inicio" className="site-wordmark"><span>TERRUÑO & CO.</span><small>Bodega boutique · Ica y Majes</small></Link>
      <nav aria-label="Navegación principal" className="hidden items-center gap-6 text-sm xl:flex">{navigation.map(item => <NavLink key={item.to} to={item.to} className="nav-link">{item.label}</NavLink>)}</nav>
      <div className="site-header-actions flex flex-wrap items-center gap-3"><button type="button" className="wine-search-trigger" onClick={openSearch} aria-haspopup="dialog" aria-keyshortcuts="Control+k Meta+k"><SearchIcon /><span>Buscar</span><kbd aria-hidden="true">⌘ / Ctrl K</kbd></button>{cart.count ? <button className="nav-link relative text-sm" onClick={() => show({ title: 'Tu cava', variant: 'drawer', children: <CartDrawer /> })} aria-haspopup="dialog" aria-label={`Cava, ${cart.count} unidades`}>Cava <motion.span key={cart.pulse} initial={level === 'reduced' ? false : { y: -4, opacity: 0.3 }} animate={{ y: 0, opacity: 1 }} className="ml-2 font-mono text-gold">{String(cart.count).padStart(2, '0')}</motion.span>{cart.lastAdded && level !== 'reduced' && <motion.img key={`piece-${cart.pulse}`} src={wines.find(wine => wine.id === cart.lastAdded)?.images[0].src} alt="" aria-hidden="true" className="pointer-events-none absolute right-0 top-full h-16 w-12 object-contain" initial={{ y: 24, opacity: 0, scale: 0.7 }} animate={{ y: -20, opacity: [0, 1, 0], scale: 0.4 }} transition={{ duration: 0.54 }} />}</button> : <Link to="/carrito-vacio" className="nav-link text-sm" aria-label="Cava, 0 unidades">Cava <span className="ml-2 font-mono text-gold">00</span></Link>}<Button variant="secondary" indicator={false} className="px-3 xl:hidden" onClick={openMenu} aria-haspopup="dialog">Menú</Button></div>
    </div>
  </header>;
}


