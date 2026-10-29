export const navigation = [
  { to: '/coleccion', label: 'Colección' }, { to: '/catas', label: 'Catas' },
  { to: '/club', label: 'Club' }, { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
] as const;

export const routeInventory = [
  { path: '/', title: 'Inicio', phase: 'D', sections: 'Hero, colección, historia, métricas, catas, testimonios, club, newsletter' },
  { path: '/coleccion', title: 'Colección', phase: 'E', sections: 'Introducción, filtros, ordenación, catálogo, estado sin resultados' },
  { path: '/vino/:slug', title: 'Ficha del vino', phase: 'E', sections: 'Producto, compra, origen, notas, elaboración, maridaje, ficha, galería' },
  { path: '/catas', title: 'Catas', phase: 'F', sections: 'Hero, agenda, detalle, formulario de reserva' },
  { path: '/club', title: 'Club', phase: 'F', sections: 'Planes, comparación, funcionamiento, selección, FAQ, adhesión' },
  { path: '/nosotros', title: 'Nosotros', phase: 'F', sections: 'Origen, filosofía, regiones, elaboración, visita' },
  { path: '/contacto', title: 'Contacto', phase: 'F', sections: 'Información, regiones, formulario, confirmación local' },
  { path: '/checkout/datos', title: 'Datos', phase: 'G', sections: 'Progreso, identidad, validación, resumen' },
  { path: '/checkout/entrega', title: 'Entrega', phase: 'G', sections: 'Progreso, modalidad, dirección, resumen' },
  { path: '/checkout/pago', title: 'Confirmación del pedido', phase: 'G', sections: 'Progreso, revisión, consentimiento, confirmar selección' },
  { path: '/pedido-confirmado', title: 'Confirmación', phase: 'G', sections: 'Resumen del pedido, identificador, productos, total' },
  { path: '/carrito-vacio', title: 'Cava vacía', phase: 'G', sections: 'Estado vacío, regreso a colección' },
  { path: '*', title: 'Error 404', phase: 'G', sections: 'Estado de error, inicio, colección, contacto' },
] as const;
