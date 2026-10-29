import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Wine } from '../../data/contracts';
import { currency } from '../../data/catalog';
import { useCart } from '../../features/cart/CartProvider';
import { Button } from '../ui/Button';
import { ProductImage, ProductName } from './ProductImage';
import { BottleViewer } from './BottleViewer';

export function ProductCard({ wine }: { wine: Wine }) {
  const { add } = useCart();
  const location = useLocation();
  const linkState = { collection: location.pathname === '/coleccion', from: location.pathname + location.search };
  const model = wine.id === 'gran-reserva' && location.pathname === '/coleccion';
  return <motion.article layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="product-card group min-w-0" transition={{ duration: 0.3 }}>
    {model ? <BottleViewer autoLoad shared /> : <Link to={`/vino/${wine.slug}`} state={linkState} className="block" aria-label={`Descubrir ${wine.name}`}><ProductImage wine={wine} shared /></Link>}
    <Link to={`/vino/${wine.slug}`} state={linkState} className="block" aria-label={`Descubrir ${wine.name}`}><span className="product-provenance"><span>{wine.type} de {wine.region}</span><span>{wine.vintage}</span></span><ProductName wine={wine} className="product-card-name" /></Link>
    <p className="mt-3 line-clamp-3 text-sm text-muted">{wine.description}</p>
    <div className="product-card-purchase"><div><p className="product-price">{currency(wine.priceCents)}</p><p className="product-price-note">por botella</p></div><Button variant="secondary" onClick={() => add(wine.id)}>Añadir a cava</Button></div>
  </motion.article>;
}
