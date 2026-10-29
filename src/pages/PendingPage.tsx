import { ButtonLink } from '../components/ui/Button';

export default function PendingPage({ title, phase }: { title: string; phase: string }) {
  return <section className="container-editorial py-24"><p className="eyebrow mb-6">TERRUÑO & CO. / Prototipo en construcción</p><h1>{title}</h1><p className="mt-8 text-muted">Esta ruta está preparada. Su contenido e interacciones se implementarán en la fase {phase} del plan.</p><div className="mt-12 flex flex-wrap gap-4"><ButtonLink to="/">Volver al inicio</ButtonLink><ButtonLink to="/fundaciones" variant="secondary">Ver fundaciones</ButtonLink></div></section>;
}

