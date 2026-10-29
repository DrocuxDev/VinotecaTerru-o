import { siteContent } from '../../data/content';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { focusError, validate } from '../../data/validation';
import type { Errors } from '../../data/validation';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';

export function LocalForm({ purpose, submitLabel = 'Enviar solicitud', messageField = false, attendees }: { purpose: string; submitLabel?: string; messageField?: boolean; attendees?: number }) {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const next = validate(fields, ['name', 'email', ...(messageField ? ['subject', 'message'] : [])]);
    setErrors(next);
    if (Object.keys(next).length) { focusError(event.currentTarget, next); return; }
    event.currentTarget.reset(); setDone(true);
    requestAnimationFrame(() => result.current?.focus());
  }
  if (done) return <div ref={result} tabIndex={-1} className="border border-gold bg-surface p-8"><p className="eyebrow mb-4">Formulario completado</p><h3>{siteContent.formSuccess}</h3><p className="mt-4 text-muted">{purpose}.</p><Button variant="secondary" className="mt-6" onClick={() => setDone(false)}>Volver al formulario</Button></div>;
  return <form noValidate onSubmit={submit} className="local-form space-y-6"><p className="text-sm text-muted">Los campos con * son obligatorios.</p><FormField name="name" label="Nombre" autoComplete="off" required error={errors.name} /><FormField name="email" label="Correo electrónico" type="email" autoComplete="off" required error={errors.email} />
    {attendees && <label className="block text-sm">Asistentes<select name="attendees" className="field-control mt-2" defaultValue="1">{Array.from({ length: attendees }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>}
    {messageField && <><label className="block text-sm" htmlFor="contact-subject">Motivo *</label><select id="contact-subject" name="subject" className="field-control" aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined} defaultValue=""><option value="">Selecciona un motivo</option><option>Una visita</option><option>La colección</option><option>El club</option><option>Otra consulta</option></select>{errors.subject && <p id="subject-error" className="text-sm text-error">{errors.subject}</p>}<label htmlFor="contact-message" className="block text-sm">Mensaje *</label><textarea id="contact-message" className="field-control min-h-40" name="message" required maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <p id="message-error" className="text-sm text-error">{errors.message}</p>}</>}
    <Button type="submit">{submitLabel}</Button>
  </form>;
}
