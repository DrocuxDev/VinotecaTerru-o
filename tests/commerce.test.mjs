import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateCart, calculateTotals, filterWines, requiredCheckoutRoute, includedTax } from '../src/data/commerce.ts';
import { validate } from '../src/data/validation.ts';
const catalog = [
  { id: 'a', name: 'Reserva', edition: '01', type: 'Tinto', vintage: 2022, region: 'Ica', priceCents: 14500, available: true },
  { id: 'b', name: 'Blanco', edition: '02', type: 'Blanco', vintage: 2024, region: 'Majes', priceCents: 9500, available: true },
  { id: 'c', name: 'Rosado', edition: '03', type: 'Rosado', vintage: 2024, region: 'Ica', priceCents: 8500, available: false },
];
test('cart supports multiple additions, edits and removal without changing the input', () => {
  const empty = [];
  let items = updateCart(empty, { type: 'add', id: 'a', quantity: 2 }, catalog);
  items = updateCart(items, { type: 'add', id: 'a', quantity: 1 }, catalog);
  items = updateCart(items, { type: 'add', id: 'b', quantity: 1 }, catalog);
  assert.deepEqual(empty, []);
  assert.deepEqual(calculateTotals(items, catalog, 1500), { subtotal: 53000, shipping: 1500, total: 54500, count: 4 });
  items = updateCart(items, { type: 'set', id: 'a', quantity: 0 }, catalog);
  assert.deepEqual(items, [{ productId: 'b', quantity: 1 }]);
  assert.equal(calculateTotals(items, catalog).total, 9500);
  assert.deepEqual(updateCart(items, { type: 'clear' }, catalog), []);
});
test('cart rejects unknown, unavailable and non-finite entries, and bounds quantity', () => {
  for (const [id, quantity] of [['unknown', 1], ['c', 1], ['a', Infinity], ['a', -1], ['a', NaN]]) assert.deepEqual(updateCart([], { type: 'add', id, quantity }, catalog), []);
  assert.equal(updateCart([], { type: 'add', id: 'a', quantity: 500 }, catalog)[0].quantity, 99);
});
test('URL filters combine, return an empty result and order without mutating catalog', () => {
  assert.deepEqual(filterWines(catalog, new URLSearchParams('region=Majes&tipo=Blanco&anada=2024&precio=100')).map(item => item.id), ['b']);
  assert.deepEqual(filterWines(catalog, new URLSearchParams('region=Majes&tipo=Tinto')), []);
  assert.deepEqual(filterWines(catalog, new URLSearchParams('orden=precio-asc')).map(item => item.id), ['c', 'b', 'a']);
  assert.deepEqual(catalog.map(item => item.id), ['a', 'b', 'c']);
});
test('direct checkout access recovers to the first missing prerequisite', () => {
  assert.equal(requiredCheckoutRoute(2, 0, true, true), '/carrito-vacio');
  assert.equal(requiredCheckoutRoute(2, 1, false, false), '/checkout/datos');
  assert.equal(requiredCheckoutRoute(2, 1, true, false), '/checkout/entrega');
  assert.equal(requiredCheckoutRoute(1, 1, true, false), null);
  assert.equal(requiredCheckoutRoute(2, 1, true, true), null);
});
test('form validation accepts sample addresses and rejects whitespace and malformed email', () => {
  assert.deepEqual(validate({ firstName: '   ', email: 'no@' }, ['firstName', 'email']), { firstName: 'Completa este campo.', email: 'Escribe un correo válido, por ejemplo nombre@dominio.com.' });
  assert.deepEqual(validate({ firstName: 'Ada', email: ' ada@example.com ' }, ['firstName', 'email']), {});
});


test('name search ignores accents and case, combines with URL filters, and preserves catalog', () => {
  const wines = [{ ...catalog[0], name: 'Selección de Terruño' }, { ...catalog[1], name: 'Blanco de Parcela' }];
  const before = structuredClone(wines);
  assert.deepEqual(filterWines(wines, new URLSearchParams({ q: '  TERRUNO   seleccion ', tipo: 'Tinto', region: 'Ica', precio: '150' })).map(w => w.id), ['a']);
  assert.deepEqual(filterWines(wines, new URLSearchParams({ q: 'terruño', tipo: 'Blanco' })), []);
  assert.deepEqual(filterWines(wines, new URLSearchParams({ q: 'no existe' })), []);
  assert.equal(filterWines(wines, new URLSearchParams({ q: '   ' })).length, 2);
  assert.deepEqual(wines, before);
});

test('included IGV reconciles integer cents for pickup, delivery and rounding edges', () => {
  assert.deepEqual(includedTax(35000), { base: 29661, tax: 5339 });
  for (const total of [0, 1, 2, 3, 99, 100, 12500, 18500, 33000, 35000, 4504500]) {
    const { base, tax } = includedTax(total);
    assert.ok(Number.isInteger(base) && Number.isInteger(tax));
    assert.equal(base + tax, total);
    assert.ok(base >= 0 && tax >= 0);
  }
  const items = [{ productId: 'a', quantity: 2 }, { productId: 'b', quantity: 1 }];
  for (const shipping of [0, 2000]) {
    const totals = calculateTotals(items, catalog, shipping);
    const { base, tax } = includedTax(totals.total);
    assert.equal(base + tax, totals.subtotal + shipping);
  }
});
