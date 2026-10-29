import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, ButtonLink } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { useOverlay } from '../app/providers/OverlayProvider';
import { MotionPreference, useMotionPolicy } from '../motion/MotionPolicy';
import { routeInventory } from '../data/navigation';

const swatches = [
  ['Fondo', 'bg-background', '#100D0F'], ['Superficie', 'bg-surface', '#191316'],
  ['Elevada', 'bg-raised', '#241C20'], ['Crema', 'bg-cream', '#F2E9DA'],
  ['Secundario', 'bg-muted', '#C6BCAE'], ['Oro', 'bg-gold', '#C7A15A'],
  ['Acción', 'bg-burgundy', '#7B223B'], ['Borde', 'bg-line', '#51434A'],
] as const;

export default function FoundationsPage() {
  const { show, close } = useOverlay();
  const { level } = useMotionPolicy();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Introduce un correo con formato nombre@dominio.com.');
      event.currentTarget.querySelector('input')?.focus(); return;
    }
    setError(''); setMessage('Validación completada.');
  }
  return <div className="container-editorial space-y-16 py-16">
    <section><p className="eyebrow mb-6">Fase B / Entorno de componentes</p><h1>Fundaciones.</h1><p className="mt-6 text-muted">Sistema compartido para las trece vistas. Esta página es una herramienta de desarrollo y no forma parte del recorrido comercial.</p></section>
    <section aria-labelledby="palette"><h2 id="palette">01. Material y color</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">{swatches.map(([name, color, hex]) => <div key={name}><div className={`h-24 border border-line ${color}`} /><p className="mt-3 text-sm">{name}</p><p className="font-mono text-xs text-muted">{hex}</p></div>)}</div></section>
    <section className="grid gap-8 border-t border-line pt-12 md:grid-cols-2"><div><p className="eyebrow mb-4">02 / Tipografía</p><h2>El tiempo,<br /><em>hecho materia.</em></h2></div><div className="space-y-4"><p className="text-lg">Inter organiza la lectura y los controles con un cuerpo estable.</p><p className="font-mono text-sm text-gold">ARCHIVO / CORMORANT · INTER · JETBRAINS</p><p className="text-muted">Fuentes locales. Un único árbol de contenido, retícula adaptable y espacio reservado para las imágenes.</p></div></section>
    <section className="border-t border-line pt-12"><h2>03. Acciones y estados</h2><div className="mt-8 flex flex-wrap gap-4"><Button onClick={() => setMessage('Acción de muestra activada.')}>Acción principal</Button><Button variant="secondary" onClick={() => show({ title: 'Una lámina del archivo', children: <><p className="mb-8 text-muted">Diálogo base: Escape cierra, el fondo queda inerte y el foco vuelve al control de apertura.</p><Button onClick={close}>Entendido</Button></> })}>Abrir diálogo</Button><Button variant="secondary" onClick={() => show({ title: 'Panel de muestra', variant: 'drawer', children: <p>Base compartida para menú, filtros y cava. Un único overlay puede estar abierto.</p> })}>Abrir panel</Button><Button disabled>Deshabilitado</Button><Button busy>Procesando</Button><ButtonLink to="/coleccion" variant="secondary">Enlace de navegación</ButtonLink></div></section>
    <section className="grid gap-12 border-t border-line pt-12 md:grid-cols-2"><div><h2>04. Campos</h2><form className="mt-8 space-y-6" noValidate onSubmit={submit}><FormField label="Correo electrónico" type="email" name="email" required autoComplete="off" value={email} onChange={event => setEmail(event.target.value)} error={error} hint="Introduce un correo válido." /><FormField label="Campo deshabilitado" disabled value="Estado de muestra" readOnly /><Button type="submit">Validar muestra</Button></form></div><div><h2>05. Movimiento</h2><div className="mt-8"><MotionPreference /></div><p className="mt-6 text-muted">Nivel efectivo: {level === 'reduced' ? 'reducido' : level === 'full' ? 'completo' : 'equilibrado'}. El sistema puede imponer movimiento reducido.</p><p className="mt-4 text-muted">Los efectos FX01–FX16 están integrados en el sitio. Su validación visual y de rendimiento sigue pendiente.</p></div></section>
    <p role="status" aria-live="polite" className="min-h-8 text-gold">{message}</p>
    <section className="border-t border-line pt-12"><h2>06. Mapa de rutas</h2><ul className="mt-8 divide-y divide-line">{routeInventory.map(route => <li key={route.path} className="grid gap-2 py-4 md:grid-cols-3"><span>{route.title}</span><code className="break-all text-sm text-muted">{route.path}</code><span className="text-sm text-muted">Implementación: fase {route.phase}</span></li>)}</ul></section>
  </div>;
}

