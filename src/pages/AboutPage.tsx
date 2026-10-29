import { siteContent } from '../data/content';
import { ButtonLink } from '../components/ui/Button';
import { PageIntro, Reveal, SectionTitle } from '../components/editorial/Editorial';
import { RegionExplorer } from '../components/editorial/RegionExplorer';
import { LiquidPhoto } from '../components/editorial/LiquidPhoto';
import { TimeStory } from '../components/editorial/TimeStory';

export default function AboutPage() {
  return <><PageIntro index="04 / Nuestro origen" title="La memoria" italic="de la tierra."><p>Mirar con atención. Dar tiempo a lo que importa. Reunir historias alrededor de una copa.</p></PageIntro><div className="container-editorial"><LiquidPhoto name="vineyard" alt="Viñedos bajo la luz del atardecer. Paisaje de viñedos." className="aspect-[16/8]" /></div>
    <section className="container-editorial section-space"><div className="grid gap-12 lg:grid-cols-2"><Reveal><p className="eyebrow mb-6">Una filosofía</p><h2>El lugar permanece.<br /><em>La historia continúa.</em></h2></Reveal><Reveal><p className="text-lg text-muted">{siteContent.story}</p><p className="mt-6 text-muted">Su lenguaje reúne la precisión de una pieza conservada y la calidez de una mesa abierta. La botella acompaña el recorrido; el origen le da sentido.</p></Reveal></div></section>
    <section className="section-space bg-surface" id="regiones"><div className="container-editorial"><SectionTitle index="Dos capítulos del mapa" title="Los lugares del relato." /><RegionExplorer /></div></section>
    <section className="container-editorial section-space"><SectionTitle index="Capas del tiempo" title="Lo que el tiempo deja." /><TimeStory /></section>
    <section className="container-editorial section-space border-t border-line"><div className="grid items-center gap-10 md:grid-cols-2"><div><p className="eyebrow mb-6">La próxima página</p><h2>Hay historias que<br /><em>se viven de cerca.</em></h2><p className="mt-6 text-muted">Explora las experiencias o déjanos una consulta sobre una visita.</p></div><div className="flex flex-wrap gap-4 md:justify-end"><ButtonLink to="/catas">Explorar experiencias</ButtonLink><ButtonLink to="/contacto" variant="secondary">Consultar una visita</ButtonLink></div></div></section></>;
}
