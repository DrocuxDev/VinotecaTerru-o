import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { deliveryOptions, wines } from '../../data/catalog';
import { validate } from '../../data/validation';
import { useCart } from '../cart/CartProvider';

export type Details = { firstName: string; lastName: string; email: string };
export type Delivery = { method: 'pickup' | 'delivery'; street: string; city: string; postal: string };
export type Order = { id: string; date: string; details: Details; delivery: Delivery; lines: { id: string; name: string; quantity: number; priceCents: number }[]; subtotal: number; shipping: number; total: number };
type State = { details: Details; delivery: Delivery; order: Order | null; detailsReady: boolean; deliveryReady: boolean; setDetails: (value: Details) => void; setDelivery: (value: Delivery, confirmed?: boolean) => void; placeOrder: () => Order | null };
const Context = createContext<State | null>(null);
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  const [details, setDetailsState] = useState<Details>({ firstName: '', lastName: '', email: '' });
  const [delivery, setDeliveryState] = useState<Delivery>({ method: 'pickup', street: '', city: '', postal: '' });
  const [order, setOrder] = useState<Order | null>(null);
  const placed = useRef<Order | null>(null);
  useEffect(() => { if (cart.count > 0 && placed.current) { placed.current = null; setOrder(null); } }, [cart.count]);
  const detailsReady = Object.keys(validate(details, ['firstName', 'lastName', 'email'])).length === 0;
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const deliveryReady = deliveryConfirmed && (delivery.method === 'pickup' || Object.keys(validate(delivery, ['street', 'city'])).length === 0);
  function placeOrder() {
    if (placed.current) return placed.current;
    if (!detailsReady || !deliveryReady || !cart.count) return null;
    const shipping = deliveryOptions.find(option => option.id === delivery.method)!.priceCents;
    const result: Order = { id: `TER-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, date: new Date().toISOString(), details: { ...details }, delivery: { ...delivery }, lines: cart.items.map(item => { const wine = wines.find(value => value.id === item.productId)!; return { id: wine.id, name: wine.name, quantity: item.quantity, priceCents: wine.priceCents }; }), subtotal: cart.subtotal, shipping, total: cart.subtotal + shipping };
    placed.current = result; setOrder(result); cart.clear(); return result;
  }
  // Personal fields and order live only in memory. No storage writes from this provider.
  return <Context.Provider value={{ details, delivery, order, detailsReady, deliveryReady, setDetails: value => { placed.current = null; setDetailsState(value); }, setDelivery: (value, confirmed = false) => { placed.current = null; setDeliveryState(value); setDeliveryConfirmed(confirmed); }, placeOrder }}>{children}</Context.Provider>;
}
export function useCheckout() { const value = useContext(Context); if (!value) throw new Error('CheckoutProvider required'); return value; }
