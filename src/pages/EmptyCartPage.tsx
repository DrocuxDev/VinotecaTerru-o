import { ButtonLink } from '../components/ui/Button';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { wines } from '../data/catalog';
import { useCart } from '../features/cart/CartProvider';
import { useLocation } from 'react-router-dom';
import { useOverlay } from '../app/providers/OverlayProvider';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SectionTitle } from '../components/editorial/Editorial';
export default function EmptyCartPage() {
  const { count } = useCart();
  const { show } = useOverlay();
  const location = useLocation();
  return <><section className="container-editorial py-24"><div className="grid items-center gap-12 lg:grid-cols-[1fr_20rem]"><div><p className="eyebrow mb-6">Cava / {String(count).padStart(2, '0')} unidades</p><h1>{count ? 'Tu selección está lista.' : 'Tu cava está vacía.'}</h1><p className="mt-8 text-muted">{count ? 'Las piezas de tu cava siguen disponibles. Puedes revisarlas y continuar la experiencia.' : 'Explora los vinos y añade las botellas que quieras incluir en tu selección.'}</p>{location.state?.message && <p className="mt-4 text-sm text-gold" role="status">{location.state.message}</p>}<div className="mt-10 flex flex-wrap gap-4"><ButtonLink to="/coleccion">Explorar colección</ButtonLink>{count > 0 && <Button variant="secondary" onClick={() => show({ title: 'Tu cava', variant: 'drawer', children: <CartDrawer /> })}>Abrir cava</Button>}</div></div><div aria-hidden="true" className="relative mx-auto hidden aspect-[3/4] w-full max-w-xs rounded-t-full border border-line lg:block"><span className="absolute inset-x-8 bottom-10 border-t border-gold text-center font-editorial text-6xl text-gold">{String(count).padStart(2, '0')}</span></div></div></section><section className="container-editorial section-space border-t border-line"><SectionTitle index="Una invitación" title="Empieza por una historia." /><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">{wines.map(wine => <ProductCard wine={wine} key={wine.id} />)}</div></section></>;
}
