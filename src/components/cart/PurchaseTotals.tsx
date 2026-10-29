import { currency } from '../../data/catalog';
import { includedTax } from '../../data/commerce';

type Props = { subtotal: number; shipping: number | null; deliveryLabel?: string; totalLabel?: string };
export function PurchaseTotals({ subtotal, shipping, deliveryLabel = 'Entrega', totalLabel = 'Total' }: Props) {
  const confirmed = shipping !== null;
  const total = subtotal + (shipping ?? 0);
  const { base, tax } = includedTax(total);
  return <div className="purchase-totals" aria-live="polite" aria-atomic="true">
    <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
      <div className="flex flex-wrap justify-between gap-2"><dt>Productos · IGV incluido</dt><dd>{currency(subtotal)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2"><dt>{confirmed ? deliveryLabel : 'Entrega pendiente'}</dt><dd>{confirmed ? currency(shipping) : 'Por confirmar'}</dd></div>
      <div className="flex flex-wrap justify-between gap-2 text-muted"><dt>{confirmed ? 'Base imponible' : 'Base de productos'}</dt><dd>{currency(base)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2 text-muted"><dt>{confirmed ? 'IGV 18% incluido' : 'IGV de productos · 18% incluido'}</dt><dd>{currency(tax)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-lg"><dt>{totalLabel}</dt><dd className="text-gold">{confirmed ? currency(total) : 'Por confirmar'}</dd></div>
    </dl>
    <p className="mt-3 text-xs text-muted">{confirmed ? 'La base y el IGV forman parte del total; no son cargos adicionales.' : 'Confirma la modalidad en Entrega para conocer el total. El desglose corresponde solo a productos.'}</p>
  </div>;
}
