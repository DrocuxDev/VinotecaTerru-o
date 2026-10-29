import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import { ProductImage, ProductName } from '../components/product/ProductImage';
import { ProductCard } from '../components/product/ProductCard';
import { BottleViewer } from '../components/product/BottleViewer';
import { Gallery } from '../components/editorial/Gallery';
import { Photo, SectionTitle } from '../components/editorial/Editorial';
import { CartDrawer, QuantityControl } from '../components/cart/CartDrawer';
import { useCart } from '../features/cart/CartProvider';
import { useOverlay } from '../app/providers/OverlayProvider';
import { currency, wines } from '../data/catalog';
import { NotFoundPage } from './NotFoundPage';

export default function WinePage() {
  const { slug } = useParams();
  const wine = wines.find(value => value.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [inspect, setInspect] = useState(false);
  const cart = useCart();
  const { show } = useOverlay();
  const location = useLocation();
  const navigate = useNavigate();
  if (!wine) return <NotFoundPage />;
  const technical = () => show({ title: 'Ficha técnica', variant: 'drawer', children: <div><p className="eyebrow mb-6">{wine.name} / Ficha del vino</p><dl className="divide-y divide-line">{Object.entries(wine.technical).map(([label, value]) => <div key={label} className="py-5"><dt className="text-sm text-muted">{label}</dt><dd className="mt-2">{value}</dd></div>)}</dl></div> });
  return <>
    <section className="container-editorial wine-detail pt-8 pb-16"><div className="mb-8">{location.state?.collection ? <button className="text-link text-sm text-muted" onClick={() => navigate(-1)}>← Volver a la colección</button> : <ButtonLink to="/coleccion" variant="secondary">← Colección</ButtonLink>}</div>
      <div className="grid items-start gap-12 lg:grid-cols-2"><div className="min-w-0">{inspect && wine.id === 'gran-reserva' ? <BottleViewer initiallyOpen /> : <ProductImage wine={wine} shared priority />}{wine.id === 'gran-reserva' && <Button variant="secondary" className="mt-6 w-full" onClick={() => setInspect(value => !value)}>{inspect ? 'Ver imagen' : 'Inspeccionar modelo 3D'}</Button>}</div>
        <div className="lg:sticky lg:top-32"><p className="eyebrow mb-6">Archivo {wine.edition} / {wine.type} / {wine.region}</p><ProductName wine={wine} as="h1" className="text-[clamp(3rem,5vw,6rem)]" /><p className="mt-4 font-mono text-xs text-gold">Cosecha {wine.vintage} · TERRUÑO & CO.</p><p className="mt-8 text-lg text-muted">{wine.description}</p><div className="wine-detail-price my-8 border-y border-line py-6"><p className="font-editorial text-4xl">{currency(wine.priceCents)}</p><p className="mt-2 text-xs text-muted">Precio por botella · IGV incluido.</p></div><p className="block text-sm text-muted">Cantidad</p><QuantityControl name={wine.name} value={quantity} onChange={setQuantity} /><div className="mt-4 flex flex-wrap gap-4"><Button onClick={() => cart.add(wine.id, quantity)}>Añadir a cava</Button><Button variant="secondary" onClick={() => show({ title: 'Tu cava', variant: 'drawer', children: <CartDrawer /> })}>Abrir cava</Button></div><button className="text-link mt-6 text-sm" onClick={technical} aria-haspopup="dialog">Desplegar ficha técnica ↗</button></div>
      </div>
    </section>
    <section className="bg-surface section-space"><div className="container-editorial"><SectionTitle index="La pieza, en detalle" title="Todo empieza en el origen." /><div className="grid gap-12 md:grid-cols-2">{[
      ['Origen', `Procedente de ${wine.region}, una de las regiones que dan identidad a nuestra colección.`],
      ['Notas de cata', `${wine.description}`],
      ['Elaboración', `Una selección de ${wine.varieties.join(' y ')} que expresa el carácter de esta edición.`],
      ['En la mesa', 'Consulta con nosotros para elegir una combinación que acompañe tu mesa.'],
    ].map(([title, text], index) => <article key={title} className="border-t border-line pt-6"><p className="eyebrow">0{index + 1}</p><h3 className="my-4 text-3xl">{title}</h3><p className="text-muted">{text}</p></article>)}</div></div></section>
    <section className="container-editorial section-space"><SectionTitle index="Mirar más cerca" title="La forma de una historia." /><Gallery key={wine.id} label={`Galería de ${wine.name}`} slides={[
      { id: 'bottle', title: 'La botella', content: <ProductImage wine={wine} /> },
      { id: 'label', title: 'El papel y la etiqueta', content: <div className="aspect-[3/4] overflow-hidden bg-surface"><img src={wine.images[0].src} width={600} height={800} alt={`Acercamiento a la etiqueta de ${wine.name}.`} className="h-full w-full scale-[2.5] object-cover object-[50%_66%]" /></div> },
      { id: 'capsule', title: 'El último detalle', content: <div className="aspect-[3/4] overflow-hidden bg-surface"><img src={wine.images[0].src} width={600} height={800} alt={`Acercamiento a la cápsula de ${wine.name}.`} className="h-full w-full origin-[50%_20%] scale-[2] object-cover" /></div> },
      { id: 'cellar', title: 'El tiempo en la cava', content: <Photo name="cellar" alt="Barricas en una cava. Barricas de madera." className="aspect-[3/4]" /> },
    ]} /></section>
    <section className="container-editorial section-space border-t border-line"><SectionTitle index="Continuar el recorrido" title="Otras piezas del archivo." /><div className="grid gap-12 md:grid-cols-2">{wines.filter(value => value.id !== wine.id).map(value => <ProductCard wine={value} key={value.id} />)}</div></section>
  </>;
}
