import { Link } from 'react-router-dom';
import { PurchaseTotals } from './PurchaseTotals';
import { useCheckout } from '../../features/checkout/CheckoutProvider';
import { deliveryOptions } from '../../data/catalog';
import { wines, currency } from '../../data/catalog';
import { useCart } from '../../features/cart/CartProvider';
import { useOverlay } from '../../app/providers/OverlayProvider';
import { ProductImage } from '../product/ProductImage';
import { Button, ButtonLink } from '../ui/Button';

export function CartDrawer() {
  const cart = useCart();
  const { delivery, deliveryReady } = useCheckout();
  const option = deliveryOptions.find(value => value.id === delivery.method)!;
  const { close } = useOverlay();
  if (!cart.count) return <div><p className="font-editorial text-3xl">Tu próxima historia empieza aquí.</p><p className="my-6 text-muted">Tu cava está vacía.</p><ButtonLink to="/coleccion" onClick={close}>Explorar colección</ButtonLink></div>;
  return <div><ul className="divide-y divide-line">{cart.items.map(item => { const wine = wines.find(value => value.id === item.productId)!; return <li key={item.productId} className="grid grid-cols-[5rem_1fr] gap-4 py-6"><Link to={`/vino/${wine.slug}`} onClick={close} aria-label={wine.name}><ProductImage wine={wine} /></Link><div className="min-w-0"><h3 className="text-2xl">{wine.name}</h3><p className="mt-1 text-sm text-muted">{currency(wine.priceCents)} / botella</p><p className="mt-2 text-sm">Importe: {currency(wine.priceCents * item.quantity)}</p><QuantityControl name={wine.name} value={item.quantity} onChange={quantity => cart.setQuantity(item.productId, quantity)} /><button className="text-link text-sm text-muted" onClick={() => cart.setQuantity(item.productId, 0)}>Eliminar {wine.name}</button></div></li>; })}</ul><div className="mt-6 border-t border-line pt-6"><PurchaseTotals subtotal={cart.subtotal} shipping={deliveryReady ? option.priceCents : null} deliveryLabel={option.label} /><ButtonLink to="/checkout/datos" onClick={close} className="mt-6 w-full">Continuar con el pedido</ButtonLink></div></div>;
}
export function QuantityControl({ name, value, onChange }: { name: string; value: number; onChange: (quantity: number) => void }) {
  return <div className="my-3 inline-flex items-center border border-line" role="group" aria-label={`Cantidad de ${name}`}><Button variant="secondary" indicator={false} className="border-0 px-4" aria-label={`Restar una unidad de ${name}`} disabled={value <= 1} onClick={() => onChange(value - 1)}>−</Button><output className="min-w-10 text-center font-mono" aria-live="polite">{value}</output><Button variant="secondary" indicator={false} className="border-0 px-4" aria-label={`Sumar una unidad de ${name}`} disabled={value >= 99} onClick={() => onChange(value + 1)}>+</Button></div>;
}

