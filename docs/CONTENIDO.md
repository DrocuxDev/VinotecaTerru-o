# Contenido vigente — TERRUÑO & CO.

Fecha: 28 de octubre de 2026. Estado: paso 2 aplicado parcialmente al frontend.

## Fuentes

- src/data/catalog.ts: vinos, catas, planes, entrega y regiones.
- src/data/content.ts: marca, lema, introducción, relato compartido y mensajes generales.
- Figma de referencia: página 33:2 del archivo iQXggvnOlFp1JeEQFppT11; lectura estructural previa, sin revisión visual.

Todos los datos comerciales y las descripciones sensoriales son ilustrativos para el laboratorio.

## Catálogo unificado

| Vino | Precio | Añada | Región | Variedades del concepto |
|---|---|---|---|---|
| Gran Reserva | S/185 | 2021 | Ica | Cabernet Franc y Syrah |
| Blanco de Parcela | S/145 | 2022 | Majes | Torrontés y Chenin |
| Rosado de Ladera | S/125 | 2020 | Ica | Malbec y Petit Verdot |

Precios, añadas, variedades y descripciones proceden de la colección destacada de escritorio ya leída. Se usan automáticamente en portada, colección, fichas, recomendaciones, cava y checkout. No equivalen a fichas comerciales validadas.

## Catas

| Experiencia | Precio por persona | Fecha ilustrativa | Estado ilustrativo |
|---|---|---|---|
| Cata vertical | S/180 | 21/11/2026, 17:00 | Disponible |
| Cata de parcelas | S/160 | 05/12/2026, 16:00 | Lista de espera |
| Cata nocturna | S/210 | 19/12/2026, 18:00 | Sin cupos |

Nombres, descripciones y precios proceden de la portada de Figma. Fechas, regiones, sedes pendientes, cupos y estados son ejemplos locales conservados; falta contrastarlos con la pantalla especializada de Figma. La portada y la agenda consumen los mismos registros. Los identificadores internos se conservan para mantener enlaces de experiencia existentes.

## Entrega

Recojo: S/0. Entrega: tarifa fija ilustrativa de S/20 por pedido, tomada del ejemplo de checkout de Figma. No se promete una zona, sede ni plazo de servicio reales. El precio se define una sola vez en deliveryOptions. Formularios, cálculo de pedidos y resumen consumen esos datos. No hay transporte ni cobro conectados.

Paso 3 implementado: el IGV se desglosa dentro del precio final, sin recargos. Antes de confirmar modalidad, la entrega y el total figuran por confirmar. Al confirmar, se desglosa el total de productos y entrega. La base se redondea una vez a céntimos y el IGV se obtiene como diferencia para que ambos sumen exactamente el total.

## Textos y secciones

- Lema compartido: «La alquimia del tiempo, en cada copa».
- Portada: introducción y relato alineados con el texto leído de Figma; acceso a reservar cata; tres catas con descripción y precio.
- Nosotros: usa el mismo relato de marca que la portada.
- Footer y aviso general: mensaje breve de demostración; se mantienen las aclaraciones específicas en compra y formularios.
- Fichas: variedades y descripción coinciden con catálogo y ficha técnica; crianza, parcela y maridaje siguen pendientes de información definitiva.
- Planes del club: se conservan Descubrimiento, Coleccionista y Archivo privado (S/180, S/320 y S/480 trimestrales). La tabla comparativa deriva de los mismos beneficios y frecuencias. Su correspondencia exacta con Figma sigue pendiente.

## Diferencias deliberadas y pendientes

Se conservan las métricas de las tres ediciones, dos regiones y una invitación del prototipo, junto con una cita editorial identificada. No se publica «96 puntos» ni «12 catas» como datos reales. La región se muestra como Ica en los datos; el texto editorial puede usar Valle de Ica.

No se añadieron cupón, asistente, aviso de edad, pagos ni contactos reales. Los paneles internos de diseño del catálogo de Figma no se reproducen en la tienda React.

El plan Starter volvió a rechazar la lectura el 28/10/2026. No se modificó Figma y no se afirma que todas sus pantallas ya coincidan. Quedan pendientes: entregar las dos pantallas móviles vacías, armonizar confirmación y cava vacía, retirar paneles internos y contrastar planes, secciones, textos especializados y políticas entre tamaños.

No se inspeccionó visualmente el sitio, no se publicaron cambios y no se crearon commits.

## Comprobaciones de esta actualización

TypeScript y compilación de producción completados correctamente el 28/10/2026. Git diff --check no detectó errores de formato. Vite mantiene la advertencia de chunks superiores a 500 kB; no se hizo perfilado ni comprobación visual. No se ejecutaron pruebas de navegador.

## Presentación como trabajo final grupal — 28/10/2026

Por indicación del usuario, TERRUÑO se presenta como trabajo final grupal. Se retiraron de la interfaz la banda y las notas de demostración, las etiquetas de precios y datos de ejemplo y la referencia a pagos simulados. El catálogo usa available como disponibilidad; los pedidos locales usan prefijo TER. Los formularios confirman datos completados y el checkout confirma la selección sin afirmar envíos de correo ni cobros efectuados.

El cambio es de presentación: el alcance implementado sigue siendo frontend, con catálogo local, cava en navegador y pedido en memoria. La documentación histórica conserva sus notas originales; no describe una versión desplegada con servicios operativos.
