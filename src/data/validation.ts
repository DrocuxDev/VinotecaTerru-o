export type Errors = Record<string, string>;
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export function validate(fields: Record<string, string>, required: string[], emailField = 'email'): Errors {
  const errors: Errors = {};
  for (const name of required) if (!fields[name]?.trim()) errors[name] = 'Completa este campo.';
  if (required.includes(emailField) && fields[emailField]?.trim() && !validEmail(fields[emailField])) errors[emailField] = 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
  return errors;
}
export function focusError(form: HTMLFormElement, errors: Errors) {
  const control = form.elements.namedItem(Object.keys(errors)[0]);
  if (control instanceof HTMLElement) control.focus();
}
