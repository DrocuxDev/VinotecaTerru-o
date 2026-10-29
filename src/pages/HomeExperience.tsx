import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { SplitText } from '../motion/SplitText';
import { LiquidPhoto } from '../components/editorial/LiquidPhoto';
import { Link } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import { BottleViewer } from '../components/product/BottleViewer';
import { ProductImage, ProductName } from '../components/product/ProductImage';
import { Gallery } from '../components/editorial/Gallery';
import { Photo, Reveal, SectionTitle } from '../components/editorial/Editorial';
import { LocalForm } from '../components/forms/LocalForm';
import { siteContent } from '../data/content';
import { currency, formatDate, tastings, wines } from '../data/catalog';
import { useCart } from '../features/cart/CartProvider';
import { useMotionPolicy } from '../motion/MotionPolicy';

export function HomePage() {
  const { level } = useMotionPolicy();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const { add } = useCart();
  return <>
    <section ref={hero} className="container-editorial hero-section">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7"><p className="eyebrow mb-8">Bodega boutique peruana</p>
          <h1 aria-label="La alquimia del tiempo en cada copa." className="hero-title">{['La alquimia', 'del tiempo', 'en cada copa.'].map((line, index) => <span key={line} className="block overflow-hidden pb-2" aria-hidden="true"><SplitText text={line} className={`block ${index === 2 ? 'italic text-gold' : ''}`} delay={index * 0.05} /></span>)}</h1>
          <p className="mt-6 max-w-md text-muted">{siteContent.heroDescription}</p>
          <div className="mt-10 flex flex-wrap gap-4"><ButtonLink to="/coleccion">Explorar colección</ButtonLink><Link className="text-link text-sm" to="/catas">Reservar cata</Link></div>
        </div>
        <motion.div className="min-w-0 lg:col-span-5" initial={level === 'reduced' ? false : { clipPath: 'inset(0 48% 0 48%)' }} animate={{ clipPath: 'inset(0 0% 0 0%)' }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}><BottleViewer autoLoad cameraProgress={scrollYProgress} /></motion.div>
      </div>
      <div className="home-caption mt-12 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-muted"><span>Un origen que se descubre</span><a href="#coleccion" className="inline-flex min-h-11 items-center text-gold">Recorre el archivo ↓</a></div>
    </section>
    <section id="coleccion" className="section-space bg-surface"><div className="container-editorial"><SectionTitle index="La colección" title="Vinos de autor para colecciones y catas."><Link to="/coleccion" className="text-link text-sm">Ver toda la colección ↗</Link></SectionTitle>
      <Gallery label="Colección destacada" slides={wines.map(wine => ({
        id: wine.id,
        title: wine.name,
        content: <Link to={`/vino/${wine.slug}`} className="block" aria-label={`Ver ${wine.name}`}><ProductImage wine={wine} shared /></Link>,
        details: <article className="featured-wine-caption">
          <Link to={`/vino/${wine.slug}`}><p className="product-provenance">{wine.type} de {wine.region} · {wine.vintage}</p><ProductName wine={wine} className="featured-wine-name" /></Link>
          <p className="featured-wine-description">{wine.description}</p>
          <div className="featured-wine-purchase"><p>{currency(wine.priceCents)} <span>por botella</span></p><Button variant="secondary" onClick={() => add(wine.id)}>Añadir a cava</Button></div>
        </article>,
      }))} />

    </div></section>
    <section className="container-editorial section-space"><div className="grid items-center gap-12 lg:grid-cols-2"><Reveal><LiquidPhoto name="cellar" alt="Barricas en una cava. Barricas de madera en una cava." className="aspect-[4/5]" /></Reveal><Reveal><p className="eyebrow mb-6">Nuestra historia</p><h2>{siteContent.storyTitle}</h2><p className="mt-8 text-muted">{siteContent.story}</p><p className="mt-5 text-muted">Cada pieza de este archivo conecta el origen con el gesto de servir. Una historia que se abre en capas y continúa alrededor de una mesa.</p><ButtonLink to="/nosotros" variant="secondary" className="mt-8">Abrir nuestra historia</ButtonLink></Reveal></div>
      <dl className="mt-16 grid gap-8 border-y border-line py-10 sm:grid-cols-3">{[['03', 'Vinos de la colección'], ['02', 'Regiones de origen'], ['01', 'Una invitación a descubrir']].map(([number, label]) => <div key={label}><dt className="text-sm text-muted">{label}</dt><dd className="mt-3 font-editorial text-6xl text-gold">{number}</dd></div>)}</dl>
    </section>
    <section className="section-space bg-surface"><div className="container-editorial"><SectionTitle index="Catas" title="La próxima copa."><Link className="text-link text-sm" to="/catas">Explorar las catas ↗</Link></SectionTitle><div className="divide-y divide-line border-t border-line">{tastings.map(tasting => <Reveal key={tasting.id} className="grid items-center gap-6 border-b border-line py-8 md:grid-cols-[3rem_1fr_auto]"><span className="agenda-mark" aria-hidden="true">—</span><div><p className="eyebrow">{formatDate(tasting.date)} / {tasting.region}</p><h3 className="mt-3 text-4xl">{tasting.title}</h3><p className="mt-3 text-sm text-muted">{tasting.description}</p><p className="mt-3 text-gold">{currency(tasting.priceCents)} <span className="text-xs text-muted">por persona</span></p></div><ButtonLink to={`/catas?experiencia=${tasting.id}`} variant="secondary">Descubrir experiencia</ButtonLink></Reveal>)}</div></div></section>
    <section className="container-editorial section-space text-center"><p className="eyebrow">Una nota de TERRUÑO</p><blockquote className="mx-auto mt-8 max-w-4xl font-editorial text-[clamp(2rem,4.5vw,4.5rem)] leading-tight">“El tiempo se cuenta mejor<br /><em>cuando se comparte.”</em></blockquote><p className="mt-6 text-xs text-muted">TERRUÑO & CO.</p></section>
    <section className="relative isolate overflow-hidden bg-surface"><Photo name="landscape" alt="Viñedo al atardecer. Fotografía de referencia para la atmósfera del club." className="absolute inset-0 -z-20 opacity-35" /><div className="absolute inset-0 -z-10 bg-linear-to-r from-background via-background/70 to-transparent" /><div className="container-editorial section-space"><div className="max-w-2xl"><p className="eyebrow mb-6">El club</p><h2>El gusto de<br /><em>pertenecer.</em></h2><p className="mt-8 text-muted">Continúa el recorrido con una selección que llega como un nuevo capítulo. Explora los planes del club y encuentra tu ritmo.</p><ul className="my-8 grid gap-4 border-y border-line py-6 text-sm sm:grid-cols-2"><li>↗ Selecciones periódicas</li><li>↗ Encuentros alrededor del vino</li></ul><ButtonLink to="/club">Descubrir el club</ButtonLink></div></div></section>
    <section className="container-editorial section-space"><div className="grid gap-12 md:grid-cols-2"><div><p className="eyebrow mb-6">Cartas de TERRUÑO</p><h2>Hay historias<br /><em>por descorchar.</em></h2><p className="mt-6 text-muted">Un espacio para los próximos capítulos, las piezas del archivo y los encuentros por venir.</p></div><LocalForm purpose="Has completado el formulario de suscripción" submitLabel="Suscribirme" /></div></section>
  </>;
}
