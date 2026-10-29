import { useState } from 'react';
import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useMotionPolicy } from '../motion/MotionPolicy';
import type { Level } from '../motion/MotionPolicy';
import { SceneBoundary } from '../motion/SceneBoundary';
import { HeroScene } from '../motion/scenes/HeroScene';
import { ProductContinuity } from '../motion/scenes/ProductContinuity';
import { SpatialGallery } from '../motion/scenes/SpatialGallery';
import { SpatialMenu } from '../motion/scenes/SpatialMenu';
import { TimeLayers } from '../motion/scenes/TimeLayers';

const levelNames: Record<Level, string> = { full: 'Completo', balanced: 'Equilibrado', reduced: 'Reducido' };

function Prototype({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section aria-labelledby={id} className="border-t border-line pt-12">
    <h2 id={id} className="mb-10 text-[clamp(2rem,4vw,3.5rem)]">{title}</h2>
    <SceneBoundary fallback={<p className="border border-line p-8 text-muted">El prototipo falló; la página sigue siendo utilizable. Ver consola de desarrollo.</p>}>{children}</SceneBoundary>
  </section>;
}

/**
 * Phase C laboratory: development-only page, not part of the commercial journey.
 * C06 is the per-level variant switch; it can lower but never raise above the system reduction floor.
 */
export default function PrototypesPage() {
  const { level: policyLevel, preview } = useMotionPolicy();
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)') && !preview;
  const [override, setOverride] = useState<'policy' | Level>('policy');
  const level: Level = systemReduced ? 'reduced' : override === 'policy' ? policyLevel : override;

  return <div className="container-editorial space-y-20 py-16">
    <section>
      <p className="eyebrow mb-6">Fase C / Prototipos de riesgo visual</p>
      <h1>Laboratorio<br /><em className="text-gold">de gestos.</em></h1>
      <p className="mt-6 text-muted">Cinco gestos principales aislados con su variante reducida. Herramienta de desarrollo con piezas geométricas provisionales: no contiene productos, precios ni contenido comercial.</p>
      <div className="mt-10 flex flex-wrap items-end gap-6">
        <label className="block w-64 text-sm text-muted">Variante (C06)
          <select className="field-control mt-2" value={override} onChange={event => setOverride(event.target.value as 'policy' | Level)} disabled={systemReduced}>
            <option value="policy">Política global ({levelNames[policyLevel]})</option>
            <option value="full">Completo</option><option value="balanced">Equilibrado</option><option value="reduced">Reducido</option>
          </select>
        </label>
        <p className="font-mono text-sm text-gold" role="status">Nivel efectivo: {levelNames[level]}{systemReduced ? ' · impuesto por el sistema' : ''}</p>
      </div>
    </section>
    <MotionConfig reducedMotion={level === 'reduced' ? 'always' : 'never'}>
      <div key={level} className="space-y-20">
        <Prototype id="c01" title="01. Hero con abertura y planos"><HeroScene level={level} /></Prototype>
        <Prototype id="c02" title="02. Tarjeta a ficha con continuidad"><ProductContinuity level={level} /></Prototype>
        <Prototype id="c03" title="03. Galería en perspectiva"><SpatialGallery level={level} /></Prototype>
        <Prototype id="c04" title="04. Menú espacial"><SpatialMenu level={level} /></Prototype>
        <Prototype id="c05" title="05. Capas del tiempo"><TimeLayers level={level} /></Prototype>
      </div>
    </MotionConfig>
    <section className="border-t border-line pt-12">
      <h2 className="text-[clamp(2rem,4vw,3.5rem)]">06. Pendientes de la fase</h2>
      <ul className="mt-6 list-disc space-y-2 pl-6 text-muted">
        <li>C07 — Modelo GLB integrado en portada y Gran Reserva; revisión visual pendiente.</li>
        <li>C08 — Perfil de rendimiento y selección final: requiere navegador y está pendiente de autorización.</li>
      </ul>
    </section>
  </div>;
}
