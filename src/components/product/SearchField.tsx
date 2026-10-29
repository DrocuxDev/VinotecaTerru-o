import { useId } from 'react';
import type { Ref } from 'react';

export function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
}

type Props = { value: string; onChange: (value: string) => void; inputRef?: Ref<HTMLInputElement>; describedBy?: string; compact?: boolean };
export function SearchField({ value, onChange, inputRef, describedBy, compact = false }: Props) {
  const id = useId();
  return <div className={`wine-search-field ${compact ? 'wine-search-field-compact' : ''}`}>
    <label htmlFor={id}>Buscar por nombre</label>
    <div className="wine-search-input-line">
      <SearchIcon />
      <input ref={inputRef} id={id} name="q" type="search" value={value} maxLength={100} onChange={event => onChange(event.target.value)} placeholder="Nombre del vino…" autoComplete="off" spellCheck={false} aria-describedby={describedBy} />
      {value && <button type="button" className="wine-search-clear" onClick={event => { event.currentTarget.parentElement?.querySelector('input')?.focus(); onChange(''); }} aria-label="Limpiar búsqueda"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>}
    </div>
  </div>;
}
