import type { Wine, CartItem } from './contracts';

export type CartAction = { type: 'add'; id: string; quantity: number } | { type: 'set'; id: string; quantity: number } | { type: 'clear' };
export function updateCart(items: CartItem[], action: CartAction, catalog: Wine[]): CartItem[] {
  if (action.type === 'clear') return [];
  if (!catalog.some(wine => wine.id === action.id && wine.available) || !Number.isFinite(action.quantity) || (action.type === 'add' && action.quantity <= 0)) return items;
  const current = items.find(item => item.productId === action.id)?.quantity ?? 0;
  const quantity = Math.max(0, Math.min(99, Math.floor(action.type === 'add' ? current + action.quantity : action.quantity)));
  if (!quantity) return items.filter(item => item.productId !== action.id);
  return items.some(item => item.productId === action.id) ? items.map(item => item.productId === action.id ? { ...item, quantity } : item) : [...items, { productId: action.id, quantity }];
}
export function calculateTotals(items: CartItem[], catalog: Wine[], shipping = 0) {
  const subtotal = items.reduce((sum, item) => sum + (catalog.find(wine => wine.id === item.productId)?.priceCents ?? 0) * item.quantity, 0);
  return { subtotal, shipping, total: subtotal + shipping, count: items.reduce((sum, item) => sum + item.quantity, 0) };
}
export function filterWines(catalog: Wine[], params: URLSearchParams): Wine[] {
  const maximum = Number(params.get('precio'));
  const terms = normalizeSearch(params.get('q') ?? '').split(' ').filter(Boolean);
  const filtered = catalog.filter(wine => terms.every(term => normalizeSearch(wine.name).includes(term)) && (!params.get('tipo') || wine.type === params.get('tipo')) && (!params.get('region') || wine.region === params.get('region')) && (!params.get('anada') || String(wine.vintage) === params.get('anada')) && (!maximum || wine.priceCents <= maximum * 100));
  const order = params.get('orden') ?? 'archivo';
  return filtered.sort((a, b) => order === 'precio-asc' ? a.priceCents - b.priceCents : order === 'precio-desc' ? b.priceCents - a.priceCents : order === 'nombre' ? a.name.localeCompare(b.name, 'es') : a.edition.localeCompare(b.edition));
}
export function requiredCheckoutRoute(step: number, count: number, detailsReady: boolean, deliveryReady: boolean) {
  if (!count) return '/carrito-vacio';
  if (step > 0 && !detailsReady) return '/checkout/datos';
  if (step > 1 && !deliveryReady) return '/checkout/entrega';
  return null;
}

/** Case, accents and repeated whitespace do not change a name search. */
export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim().replace(/\s+/g, ' ');
}
/** Prices include illustrative IGV. Round the base once, keep the remainder as tax. */
export function includedTax(totalCents: number) {
  const base = Math.round(totalCents * 100 / 118);
  return { base, tax: totalCents - base };
}
