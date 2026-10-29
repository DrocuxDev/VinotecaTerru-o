import { useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../features/cart/CartProvider';
import { useCheckout } from '../features/checkout/CheckoutProvider';
import { currency, deliveryOptions, wines } from '../data/catalog';
import { focusError, validate } from '../data/validation';
import type { Errors } from '../data/validation';
import { FormField } from '../components/ui/FormField';
import { Button, ButtonLink } from '../components/ui/Button';
import { useMotionPolicy } from '../motion/MotionPolicy';
import { useOverlay } from '../app/providers/OverlayProvider';
import { CartDrawer } from '../components/cart/CartDrawer';
import { PurchaseTotals } from '../components/cart/PurchaseTotals';
import { requiredCheckoutRoute } from '../data/commerce';

function Guard({ step, children }: { step: number; children: ReactNode }) {
  const cart = useCart();
  const checkout = useCheckout();
  if (!cart.count && checkout.order && step === 2) return <Navigate to="/pedido-confirmado" replace />;
  const route = requiredCheckoutRoute(step, cart.count, checkout.detailsReady, checkout.deliveryReady);
  if (route) return <Navigate to={route} replace state={{ message: route === '/carrito-vacio' ? 'Añade un vino a tu cava para continuar con el pedido.' : 'Completa los datos de este paso antes de continuar.' }} />;
  return children;
}
function Summary() {
  const cart = useCart();
  const { delivery, deliveryReady } = useCheckout();
  const { show } = useOverlay();
  const shipping = deliveryOptions.find(option => option.id === delivery.method)!.priceCents;
  return <aside className="purchase-summary lg:sticky lg:top-8"><p className="eyebrow mb-6">Tu selección / {cart.count} unidades</p><ul className="space-y-6">{cart.items.map(item => { const wine = wines.find(value => value.id === item.productId)!; return <li key={item.productId} className="grid grid-cols-[3rem_1fr] items-center gap-4"><img src={wine.images[0].src} alt="" width={60} height={80} className="aspect-[3/4] object-contain" /><div><p className="font-editorial text-2xl">{wine.name}</p><p className="mt-1 text-xs text-muted">{item.quantity} × {currency(wine.priceCents)} = {currency(wine.priceCents * item.quantity)}</p></div></li>; })}</ul><button className="text-link mt-6 text-sm" onClick={() => show({ title: 'Tu cava', variant: 'drawer', children: <CartDrawer /> })}>Editar selección</button><PurchaseTotals subtotal={cart.subtotal} shipping={deliveryReady ? shipping : null} deliveryLabel={deliveryOptions.find(option => option.id === delivery.method)!.label} /></aside>;
}
function CheckoutLayout({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  const { level } = useMotionPolicy();
  const location = useLocation();
  const steps = [{ title: 'Tus datos', path: '/checkout/datos' }, { title: 'Entrega', path: '/checkout/entrega' }, { title: 'Confirmación', path: '/checkout/pago' }];
  return <Guard step={step}><section className="checkout-page container-editorial py-12 md:py-16"><nav aria-label="Progreso de compra" className="mb-12"><ol className="checkout-steps grid grid-cols-3 gap-3 border-b border-line pb-5">{steps.map((item, index) => <li key={item.path} aria-current={index === step ? 'step' : undefined} className={index <= step ? 'text-gold' : 'text-muted'}><span className="mb-3 block font-mono text-xs">0{index + 1}</span>{index < step ? <Link className="text-link text-sm" to={item.path}>{item.title}</Link> : <span className="block text-sm">{item.title}</span>}</li>)}</ol><motion.div className="h-px origin-left bg-gold" initial={level === 'reduced' ? false : { scaleX: step / 3 }} animate={{ scaleX: (step + 1) / 3 }} transition={{ duration: level === 'reduced' ? 0 : 0.3 }} /></nav><div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]"><div className="min-w-0"><p className="eyebrow mb-5">Tu pedido</p><h1 className="text-[clamp(2.75rem,5vw,5rem)]">{title}</h1>{location.state?.message && <p role="status" className="mt-6 border-l-2 border-gold pl-4 text-sm text-muted">{location.state.message}</p>}<div className="mt-8">{children}</div></div><Summary /></div></section></Guard>;
}
export function DetailsPage() {
  const checkout = useCheckout();
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate(checkout.details, ['firstName', 'lastName', 'email']); setErrors(next);
    if (Object.keys(next).length) { focusError(event.currentTarget, next); return; }
    checkout.setDetails({ ...checkout.details }); navigate('/checkout/entrega');
  }
  return <CheckoutLayout step={0} title="Empecemos por ti."><p className="mb-8 text-muted">Completa tus datos para preparar el pedido.</p><form noValidate onSubmit={submit} className="space-y-6"><div className="grid gap-6 sm:grid-cols-2"><FormField name="firstName" label="Nombre" required autoComplete="off" maxLength={100} value={checkout.details.firstName} onChange={event => checkout.setDetails({ ...checkout.details, firstName: event.target.value })} error={errors.firstName} /><FormField name="lastName" label="Apellidos" required autoComplete="off" maxLength={100} value={checkout.details.lastName} onChange={event => checkout.setDetails({ ...checkout.details, lastName: event.target.value })} error={errors.lastName} /></div><FormField name="email" label="Correo electrónico" type="email" required autoComplete="off" maxLength={254} value={checkout.details.email} onChange={event => checkout.setDetails({ ...checkout.details, email: event.target.value })} error={errors.email} /><div className="flex flex-wrap gap-4 pt-4"><Button type="submit">Continuar a entrega</Button><ButtonLink variant="secondary" to="/coleccion">Volver a colección</ButtonLink></div></form></CheckoutLayout>;
}
export function DeliveryPage() {
  const checkout = useCheckout();
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = checkout.delivery.method === 'delivery' ? validate(checkout.delivery, ['street', 'city']) : {};
    setErrors(next);
    if (Object.keys(next).length) { focusError(event.currentTarget, next); return; }
    checkout.setDelivery({ ...checkout.delivery }, true); navigate('/checkout/pago');
  }
  return <CheckoutLayout step={1} title="El siguiente destino."><form noValidate onSubmit={submit} className="space-y-6"><fieldset><legend className="mb-5">Modalidad de entrega</legend><div className="space-y-4">{deliveryOptions.map(option => <label key={option.id} className={`flex cursor-pointer items-start gap-4 border p-5 ${checkout.delivery.method === option.id ? 'border-gold bg-surface' : 'border-line'}`}><input type="radio" name="method" value={option.id} checked={checkout.delivery.method === option.id} onChange={() => checkout.setDelivery({ ...checkout.delivery, method: option.id })} className="mt-1 accent-gold" /><span><span className="block">{option.label} · {currency(option.priceCents)}</span><span className="mt-2 block text-sm text-muted">{option.detail}</span></span></label>)}</div></fieldset>{checkout.delivery.method === 'delivery' && <div className="space-y-6 border-t border-line pt-6"><FormField name="street" label="Dirección" required autoComplete="off" maxLength={200} value={checkout.delivery.street} onChange={event => checkout.setDelivery({ ...checkout.delivery, street: event.target.value })} error={errors.street} hint="Incluye calle, número y referencia de acceso." /><div className="grid gap-6 sm:grid-cols-2"><FormField name="city" label="Ciudad" required autoComplete="off" value={checkout.delivery.city} onChange={event => checkout.setDelivery({ ...checkout.delivery, city: event.target.value })} error={errors.city} /><FormField name="postal" label="Código postal (opcional)" autoComplete="off" maxLength={10} value={checkout.delivery.postal} onChange={event => checkout.setDelivery({ ...checkout.delivery, postal: event.target.value })} /></div></div>}<div className="flex flex-wrap gap-4 pt-4"><Button type="submit">Continuar a revisión</Button><ButtonLink variant="secondary" to="/checkout/datos">Volver a datos</ButtonLink></div></form></CheckoutLayout>;
}
export function PaymentPage() {
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitted = useRef(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) { setError('Confirma que has revisado tu selección y los datos de entrega.'); (event.currentTarget.elements.namedItem('orderConsent') as HTMLInputElement)?.focus(); return; }
    if (submitted.current) return;
    submitted.current = true; setBusy(true);
    const order = checkout.placeOrder();
    if (!order) { submitted.current = false; setBusy(false); setError('La selección cambió. Revisa la cava y los pasos anteriores.'); return; }
    navigate('/pedido-confirmado', { replace: true });
  }
  return <CheckoutLayout step={2} title="Todo, en su lugar."><div className="mb-8 divide-y divide-line border-y border-line"><section className="py-6"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-3xl">Tus datos</h2><Link className="text-link text-sm" to="/checkout/datos">Editar</Link></div><p className="mt-3 text-muted">{checkout.details.firstName} {checkout.details.lastName}<br />{checkout.details.email}</p></section><section className="py-6"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-3xl">Entrega</h2><Link className="text-link text-sm" to="/checkout/entrega">Editar</Link></div><p className="mt-3 text-muted">{checkout.delivery.method === 'pickup' ? deliveryOptions.find(option => option.id === 'pickup')!.detail : <>{checkout.delivery.street}<br />{checkout.delivery.city} {checkout.delivery.postal}<br />{deliveryOptions.find(option => option.id === 'delivery')!.detail}</>}</p></section></div><form noValidate onSubmit={submit} className="space-y-6"><label className="flex min-h-11 items-start gap-4 text-sm"><input name="orderConsent" type="checkbox" checked={accepted} onChange={event => { setAccepted(event.target.checked); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'payment-error' : undefined} className="mt-1 accent-gold" /><span>He revisado mi selección y los datos de entrega.</span></label>{error && <p id="payment-error" role="alert" className="text-sm text-error">{error}</p>}<div className="flex flex-wrap gap-4"><Button type="submit" busy={busy}>Confirmar selección</Button><ButtonLink to="/checkout/entrega" variant="secondary">Volver a entrega</ButtonLink></div></form></CheckoutLayout>;
}

