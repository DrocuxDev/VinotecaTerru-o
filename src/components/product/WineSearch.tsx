import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { wines, currency } from '../../data/catalog';
import { filterWines } from '../../data/commerce';
import { useOverlay } from '../../app/providers/OverlayProvider';
import { SearchField } from './SearchField';

export function WineSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { close } = useOverlay();
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') ?? '');
  const [previewId, setPreviewId] = useState(wines[0]?.id);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const frame = requestAnimationFrame(() => input.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);
  const results = filterWines(wines, new URLSearchParams({ q: query }));
  const preview = results.find(wine => wine.id === previewId) ?? results[0];
  function submit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(location.pathname === '/coleccion' ? location.search : '');
    if (query.trim()) params.set('q', query.trim()); else params.delete('q');
    close();
    navigate({ pathname: '/coleccion', search: params.toString() });
  }
  return <div className="wine-search">
    <form role="search" onSubmit={submit}>
      <SearchField value={query} onChange={setQuery} inputRef={input} describedBy="wine-search-count" />
      <div className={`wine-search-body ${preview ? 'has-preview' : ''}`}>
        {preview && <aside className="wine-search-preview" aria-hidden="true">
          <img src={preview.images[0].src} alt="" width="180" height="240" />
          <p>{preview.name}</p><span>{preview.varieties.join(' y ')}</span>
        </aside>}
        <div className="wine-search-index">
          <p id="wine-search-count" role="status" className="wine-search-count">{query.trim() ? `${results.length} ${results.length === 1 ? 'coincidencia' : 'coincidencias'}` : 'Los vinos de la colección'}</p>
          {results.length ? <ul className="wine-search-results">{results.map(wine => <li key={wine.id}>
            <Link to={`/vino/${wine.slug}`} onClick={close} onPointerEnter={() => setPreviewId(wine.id)} onFocus={() => setPreviewId(wine.id)} className="wine-search-result" data-preview-active={preview?.id === wine.id}>
              <img src={wine.images[0].src} alt="" width="40" height="54" className="wine-search-thumbnail" /><span className="wine-search-result-main"><span className="wine-search-result-name">{wine.name}</span><span className="wine-search-result-origin">{wine.vintage} · {wine.type} de {wine.region}</span></span>
              <span className="wine-search-result-price">{currency(wine.priceCents)}</span>
            </Link>
          </li>)}</ul> : <div className="wine-search-empty"><p>No encontramos ese vino.</p><span>Prueba con una parte del nombre, como “Parcela”.</span><button type="button" onClick={() => { setQuery(''); input.current?.focus(); }}>Ver los tres vinos</button></div>}
        </div>

      </div>
      <div className="wine-search-footer"><span>Selecciona un vino para abrir su ficha.</span><button type="submit" className="wine-search-submit">{query.trim() ? 'Buscar en la colección' : 'Ver toda la colección'}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button></div>
    </form>
  </div>;
}
