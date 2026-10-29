import { useSearchParams } from 'react-router-dom';
import { SearchField } from '../components/product/SearchField';
import { AnimatePresence } from 'motion/react';
import { PageIntro } from '../components/editorial/Editorial';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { useOverlay } from '../app/providers/OverlayProvider';
import { wines } from '../data/catalog';
import { filterWines } from '../data/commerce';

const filterLabels: Record<string, string> = { q: 'Búsqueda', tipo: 'Tipo', region: 'Región', anada: 'Añada', precio: 'Precio máximo' };
function Filters({ onFinish }: { onFinish?: () => void }) {
  const [params, setParams] = useSearchParams();
  function set(name: string, value: string) { setParams(current => { const next = new URLSearchParams(current); if (value) next.set(name, value); else next.delete(name); return next; }, { replace: true, preventScrollReset: true }); }
  const options: { name: string; values: string[] }[] = [{ name: 'tipo', values: [...new Set(wines.map(wine => wine.type))] }, { name: 'region', values: [...new Set(wines.map(wine => wine.region))] }, { name: 'anada', values: [...new Set(wines.map(wine => String(wine.vintage)))] }];
  return <div className="space-y-6"><p className="eyebrow">Afinar la selección</p>{options.map(({ name, values }) => <label key={name} className="block text-sm">{filterLabels[name]}<select value={params.get(name) ?? ''} onChange={event => set(name, event.target.value)} className="field-control mt-2"><option value="">Todos</option>{values.map(value => <option key={value}>{value}</option>)}</select></label>)}
    <label className="block text-sm">Precio máximo<select className="field-control mt-2" value={params.get('precio') ?? ''} onChange={event => set('precio', event.target.value)}><option value="">Cualquier precio</option>{[...new Set(wines.map(wine => wine.priceCents))].sort((a, b) => a - b).map(cents => <option key={cents} value={cents / 100}>Hasta S/ {cents / 100}</option>)}</select></label>
    <Button variant="secondary" onClick={() => setParams(current => { const next = new URLSearchParams(); if (current.has('orden')) next.set('orden', current.get('orden')!); if (current.has('q')) next.set('q', current.get('q')!); return next; }, { replace: true, preventScrollReset: true })}>Restablecer filtros</Button>{onFinish && <Button onClick={onFinish}>Ver resultados</Button>}
  </div>;
}
export default function CollectionPage() {
  const [params, setParams] = useSearchParams();
  const { show, close } = useOverlay();
  const order = params.get('orden') ?? 'archivo';
  const results = filterWines(wines, params);
  const active = [...params.entries()].filter(([name, value]) => name in filterLabels && value.trim());
  const filterCount = active.filter(([name]) => name !== 'q').length;
  return <><PageIntro index="01 / Colección" title="El archivo" italic="de lo extraordinario."><p>Tres piezas, tres maneras de abrir una historia. Encuentra la que acompañará tu próxima pausa.</p></PageIntro>
    <section className="container-editorial catalog-page pb-24"><form role="search" onSubmit={event => event.preventDefault()} className="collection-search"><SearchField compact value={params.get('q') ?? ''} onChange={value => setParams(current => { const next = new URLSearchParams(current); if (value) next.set('q', value); else next.delete('q'); return next; }, { replace: true, preventScrollReset: true })} /></form><div className="catalog-toolbar mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-5"><p role="status" className="font-mono text-xs text-muted">{results.length} {results.length === 1 ? 'pieza' : 'piezas'} en el archivo</p><div className="flex flex-wrap gap-4"><Button variant="secondary" className="xl:hidden" aria-haspopup="dialog" onClick={() => show({ title: 'Filtrar la colección', variant: 'drawer', children: <Filters onFinish={close} /> })}>Filtros{filterCount > 0 ? ` (${filterCount})` : ''}</Button><label className="catalog-order flex items-center gap-3 text-sm">Ordenar<select value={order} className="field-control max-w-56" onChange={event => setParams(current => { const next = new URLSearchParams(current); next.set('orden', event.target.value); return next; }, { replace: true, preventScrollReset: true })}><option value="archivo">Orden del archivo</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option><option value="nombre">Nombre A–Z</option></select></label></div></div>
      {active.length > 0 && <div className="mb-8 flex flex-wrap gap-3">{active.map(([name, value]) => <button key={name} className="active-filter button button-secondary text-xs" aria-label={`Quitar filtro ${filterLabels[name]}: ${value}`} onClick={() => setParams(current => { const next = new URLSearchParams(current); next.delete(name); return next; }, { replace: true, preventScrollReset: true })}>{filterLabels[name]}: {value} ×</button>)}<Button variant="secondary" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>Limpiar todo</Button></div>}
      <div className="grid items-start gap-12 xl:grid-cols-[15rem_1fr]"><aside className="hidden xl:sticky xl:top-32 xl:block" aria-label="Filtros de colección"><Filters /></aside><div className="min-w-0">{results.length ? <div className="catalog-products"><AnimatePresence mode="sync">{results.map(wine => <ProductCard key={wine.id} wine={wine} />)}</AnimatePresence></div> : <div className="border border-line py-20 text-center"><h2 className="text-4xl">No hay vinos con esta selección.</h2><p className="mx-auto my-6 text-muted">Prueba otro nombre o quita alguno de los filtros.</p><Button onClick={() => setParams({}, { replace: true })}>Ver toda la colección</Button></div>}</div></div>
    </section></>;
}

