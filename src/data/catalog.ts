import type { ClubPlan, Tasting, Wine } from './contracts';

/** Illustrative dataset: prices, dates, vintages and locations are examples, not approved commercial data. */
export const wineDrafts = [];
export const wines: Wine[] = [
  { id: 'gran-reserva', slug: 'gran-reserva', name: 'Gran Reserva', type: 'Tinto', vintage: 2021, region: 'Ica', varieties: ['Cabernet Franc', 'Syrah'], priceCents: 18500, edition: '01', tone: '#7B223B', description: 'Cabernet Franc y Syrah con estructura larga y mineralidad de piedra caliza.', images: [{ src: '/images/terruno-bottle.webp', alt: 'Botella Gran Reserva de TERRUÑO & CO., etiqueta crema y cápsula burdeos.', width: 600, height: 800 }], technical: { 'Edición': 'TERRUÑO & CO.', 'Presentación': 'Botella de 750 ml', 'Añada y región': '2021 · Ica', 'Variedades': 'Cabernet Franc y Syrah' }, available: true },
  { id: 'blanco-de-parcela', slug: 'blanco-de-parcela', name: 'Blanco de Parcela', type: 'Blanco', vintage: 2022, region: 'Majes', varieties: ['Torrontés', 'Chenin'], priceCents: 14500, edition: '02', tone: '#9C884F', description: 'Torrontés y Chenin con frescura mineral y persistencia elegante.', images: [{ src: '/images/blanco-de-parcela.svg', alt: 'Botella de Blanco de Parcela, vidrio claro y cápsula dorada.', width: 600, height: 800 }], technical: { 'Edición': 'TERRUÑO & CO.', 'Presentación': 'Botella de 750 ml', 'Añada y región': '2022 · Majes', 'Variedades': 'Torrontés y Chenin' }, available: true },
  { id: 'rosado-de-ladera', slug: 'rosado-de-ladera', name: 'Rosado de Ladera', type: 'Rosado', vintage: 2020, region: 'Ica', varieties: ['Malbec', 'Petit Verdot'], priceCents: 12500, edition: '03', tone: '#B87579', description: 'Malbec y Petit Verdot con textura suave y acidez fresca.', images: [{ src: '/images/rosado-de-ladera.svg', alt: 'Botella de Rosado de Ladera, vidrio rosado y etiqueta crema.', width: 600, height: 800 }], technical: { 'Edición': 'TERRUÑO & CO.', 'Presentación': 'Botella de 750 ml', 'Añada y región': '2020 · Ica', 'Variedades': 'Malbec y Petit Verdot' }, available: true },
];
export const tastings: Tasting[] = [
  { id: 'archivo-abierto', title: 'Cata vertical', region: 'Ica', date: '2026-11-21T17:00:00-05:00', priceCents: 18000, location: 'Ica', capacity: 12, status: 'available', description: 'Vendimias 2020, 2021 y 2022. Comparativa de evolución y estructura.', images: [] },
  { id: 'entre-parcelas', title: 'Cata de parcelas', region: 'Majes', date: '2026-12-05T16:00:00-05:00', priceCents: 16000, location: 'Majes', capacity: 8, status: 'waitlist', description: 'Blancos y tintos de Majes y Valle de Ica. Foco en mineralidad y sol del sur.', images: [] },
  { id: 'sobremesa', title: 'Cata nocturna', region: 'Ica', date: '2026-12-19T18:00:00-05:00', priceCents: 21000, location: 'Ica', capacity: 10, status: 'full', description: 'Selección de vinos con iluminación dramática y narrativa editorial.', images: [] },
];
export const plans: ClubPlan[] = [
  { id: 'descubrimiento', name: 'Descubrimiento', priceCents: 18000, frequency: 'cada 3 meses', benefits: ['2 botellas por selección', 'Guía de descubrimiento', 'Acceso anticipado a la colección'] },
  { id: 'coleccionista', name: 'Coleccionista', priceCents: 32000, frequency: 'cada 3 meses', benefits: ['4 botellas por selección', 'Guía de descubrimiento', 'Acceso anticipado a la colección', 'Una cata incluida'] },
  { id: 'archivo', name: 'Archivo privado', priceCents: 48000, frequency: 'cada 3 meses', benefits: ['6 botellas por selección', 'Guía de descubrimiento', 'Acceso anticipado a la colección', 'Una cata incluida', 'Selección personalizada'] },
];
export const deliveryOptions = [{ id: 'pickup', label: 'Recojo', priceCents: 0, detail: 'Recojo en bodega. La ubicación se coordina al preparar el pedido.' }, { id: 'delivery', label: 'Entrega', priceCents: 2000, detail: 'Tarifa fija por pedido.' }] as const;
export const regions = [
  { id: 'ica', name: 'Ica', subtitle: 'El primer capítulo', text: 'El origen ocupa el centro de este archivo. Ica conecta el paisaje del sur peruano con el vino y el encuentro alrededor de la mesa.', photo: 'vineyard' },
  { id: 'majes', name: 'Majes', subtitle: 'Otra forma de mirar', text: 'Majes abre el segundo capítulo del recorrido. El paisaje y el carácter del valle acompañan una invitación a descubrir el lugar.', photo: 'landscape' },
] as const;
export const currency = (cents: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
export const formatDate = (date: string) => new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'America/Lima' }).format(new Date(date));

