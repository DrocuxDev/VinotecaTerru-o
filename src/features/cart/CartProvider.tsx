import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../../data/contracts';
import { wines } from '../../data/catalog';
import { updateCart, calculateTotals } from '../../data/commerce';
import type { CartAction } from '../../data/commerce';

const key = 'terruno:cart:v1';
export const cartReducer = (items: CartItem[], action: CartAction) => updateCart(items, action, wines);
function restore(): CartItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (value?.version !== 1 || !Array.isArray(value.items)) return [];
    return value.items.reduce((items: CartItem[], item: CartItem) => typeof item?.productId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 ? cartReducer(items, { type: 'set', id: item.productId, quantity: item.quantity }) : items, []);
  } catch { return []; }
}
type CartState = { items: CartItem[]; count: number; subtotal: number; notice: string; pulse: number; lastAdded: string | null; add: (id: string, quantity?: number) => void; setQuantity: (id: string, quantity: number) => void; clear: () => void };
const Context = createContext<CartState | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], restore);
  const [notice, setNotice] = useState('');
  const [pulse, setPulse] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify({ version: 1, items })); } catch { /* Memory-only cart remains usable. */ } }, [items]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 4000); return () => clearTimeout(timer); }, [notice, pulse]);
  function add(id: string, quantity = 1) {
    const wine = wines.find(value => value.id === id);
    if (!wine?.available) return;
    dispatch({ type: 'add', id, quantity }); setLastAdded(id); setPulse(value => value + 1); setNotice(`${wine.name}: cava actualizada.`);
  }
  function setQuantity(id: string, quantity: number) {
    dispatch({ type: 'set', id, quantity }); setLastAdded(null); setPulse(value => value + 1); setNotice(quantity ? 'Cantidad actualizada.' : 'Pieza eliminada de la cava.');
  }
  const { count, subtotal } = calculateTotals(items, wines);
  return <Context.Provider value={{ items, count, subtotal, notice, pulse, lastAdded, add, setQuantity, clear: () => dispatch({ type: 'clear' }) }}>{children}</Context.Provider>;
}
export function useCart() { const value = useContext(Context); if (!value) throw new Error('CartProvider required'); return value; }
