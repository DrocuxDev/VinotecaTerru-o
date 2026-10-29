import { motion } from 'motion/react';
import { PurchaseTotals } from '../components/cart/PurchaseTotals';
import { currency, formatDate, deliveryOptions } from '../data/catalog';
import { useCheckout } from '../features/checkout/CheckoutProvider';
import { ButtonLink } from '../components/ui/Button';
import { PageIntro } from '../components/editorial/Editorial';
import { useMotionPolicy } from '../motion/MotionPolicy';

export default function OrderConfirmedPage() {
  const { order } = useCheckout();
  const { level } = useMotionPolicy();
  if (!order) return <><PageIntro index="El archivo" title="Empecemos" italic="una nueva historia."><p>No hay una confirmación en esta sesión. Puedes iniciar una nueva selección desde la colección.</p></PageIntro><div className="container-editorial pb-24"><ButtonLink to="/coleccion">Explorar colección</ButtonLink></div></>;
  return <><PageIntro index="Tu pedido" title="Una historia" italic="para recordar."><p>Gracias, {order.details.firstName}. Aquí tienes el resumen de tu selección.</p></PageIntro><motion.section className="container-editorial pb-24" initial={level === 'reduced' ? false : { y: 16, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}><div className="order-receipt max-w-4xl"><div className="flex flex-wrap justify-between gap-4 border-b border-line pb-6 font-mono text-xs text-gold"><p>{order.id}</p><p>{formatDate(order.date)}</p></div><h2 className="mt-8 text-4xl">Resumen del pedido.</h2><ul className="mt-8 divide-y divide-line">{order.lines.map(line => <li className="flex flex-wrap justify-between gap-4 py-5" key={line.id}><span>{line.quantity} × {line.name}</span><span>{currency(line.priceCents * line.quantity)}</span></li>)}</ul><PurchaseTotals subtotal={order.subtotal} shipping={order.shipping} deliveryLabel={deliveryOptions.find(option => option.id === order.delivery.method)!.label} totalLabel="Total" /><section className="mt-8 border-t border-line pt-6"><h3 className="text-2xl">Datos y entrega</h3><p className="mt-3 break-words text-sm text-muted">{order.details.firstName} {order.details.lastName}<br />{order.details.email}</p><p className="mt-3 break-words text-sm text-muted">{order.delivery.method === 'pickup' ? deliveryOptions[0].detail : <>{order.delivery.street}<br />{order.delivery.city} {order.delivery.postal}<br />{deliveryOptions[1].detail}</>}</p></section></div><div className="mt-10 flex flex-wrap gap-4"><ButtonLink to="/coleccion">Seguir explorando</ButtonLink><ButtonLink to="/catas" variant="secondary">Descubrir experiencias</ButtonLink></div></motion.section></>;
}
