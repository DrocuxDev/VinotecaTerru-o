import { ButtonLink } from '../components/ui/Button';
import { Photo } from '../components/editorial/Editorial';
export function NotFoundPage() {
  return <section className="container-editorial py-16 md:py-24"><div className="grid items-center gap-12 lg:grid-cols-2"><div><p className="eyebrow mb-6">404 / Fuera del archivo</p><h1 className="text-[clamp(3rem,5vw,5rem)]">No encontramos<br />esta página.</h1><p className="mt-8 text-muted">El enlace puede haber cambiado. Vuelve al inicio o consulta los vinos de la colección.</p><div className="mt-10 flex flex-wrap gap-4"><ButtonLink to="/">Volver al inicio</ButtonLink><ButtonLink to="/coleccion" variant="secondary">Ver colección</ButtonLink><ButtonLink to="/contacto" variant="secondary">Contacto</ButtonLink></div></div><div className="relative overflow-hidden rounded-t-full"><Photo name="vineyard" alt="Paisaje de viñedo de referencia." className="aspect-[3/4] opacity-50" /><span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-editorial text-[clamp(7rem,18vw,16rem)] text-cream">404</span></div></div></section>;
}

