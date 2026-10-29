import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export function FormField({ label, error, hint, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const generated = useId();
  const fieldId = id ?? generated;
  const descriptions = [props['aria-describedby'], hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ');
  return <div className="form-field">
    <label className="mb-2 block text-sm" htmlFor={fieldId}>{label}{props.required ? ' *' : ''}</label>
    <input {...props} id={fieldId} className={`field-control ${props.className ?? ''}`} aria-invalid={error ? true : undefined} aria-describedby={descriptions || undefined} />
    {hint && <p id={`${fieldId}-hint`} className="mt-2 text-sm text-muted">{hint}</p>}
    {error && <p id={`${fieldId}-error`} className="mt-2 text-sm text-error" role="alert">{error}</p>}
  </div>;
}
