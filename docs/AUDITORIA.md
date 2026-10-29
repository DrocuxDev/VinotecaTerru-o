> Registro histórico de la auditoría inicial. El estado vigente y los datos ilustrativos implementados se describen en AVANCE.md (26 de octubre de 2026).

# Fase A — Inventario y pendientes

## Evidencia disponible

- Especificación completa copiada en `SPEC.md` sin modificaciones.
- Carpeta de origen: `../https-www-figma-com-design-iqxggvnolfp1jeeqfppt11/outputs/terruno-plan-diseno-react-tailwind.md` respecto a la carpeta de chats del día; para evitar dependencia externa se conserva la copia local.
- Registro histórico leído: `work/figma-resume.json` del chat de origen. Indica 13 tablet y 9 móvil adaptadas, cuatro pares móviles pendientes y ausencia de validación final. Es evidencia histórica, no estado actual verificado.
- Figma no consultado en esta entrega: se respeta la instrucción de no comprobar visualmente. No se afirma que el acceso actual esté bloqueado.
- No se encontraron fotografías, exportaciones, fuentes ni GLB en la carpeta de origen.

## Cuatro pares móviles pendientes según el registro histórico

| Original | Móvil | Evidencia |
|---|---|---|
| 33:182 | 35:120 | Par pendiente; la correspondencia nominal no está acreditada |
| 33:191 | 35:128 | Par pendiente; la correspondencia nominal no está acreditada |
| 40:1628 | 133:2 | Marco nuevo vacío según el registro |
| 40:1782 | 133:3 | Marco nuevo vacío según el registro |

El registro menciona pedido y carrito móviles sin modificar y problemas de anchura/altura en catálogo tablet. No basta para atribuir con certeza cada ruta a cada par. La especificación más reciente dice que el usuario ya ordenó el lienzo: no se retoma la antigua tarea de reordenarlo.

## Matriz de secciones y paridad requerida

En todas las filas D/T/M significa **mismo contenido y acciones requeridos en escritorio/tablet/móvil**, no comprobación realizada.

| Vista / ruta | Secciones requeridas D/T/M | Adaptación prevista | Estado actual |
|---|---|---|---|
| Inicio `/` | Hero, destacados, historia, métricas, catas, citas, club, newsletter, pie | Texto/pieza en columnas → bloques | Inicio estático del hero; resto D |
| Colección `/coleccion` | Introducción, filtros, orden, conteo, vinos, vacío | Sidebar y 3 columnas → panel y 2 → panel y 1 | Ruta preparada; fase E |
| Ficha `/vino/:slug` | Producto, precio, compra, origen, notas, elaboración, maridaje, técnica, galería | Compra sticky → lectura vertical | 404 mientras no haya producto preparado; E |
| Catas `/catas` | Hero, agenda, detalle, reserva local | Filas → bloques | Ruta preparada; F |
| Club `/club` | Planes, comparación, funcionamiento, vinos, FAQ, adhesión | Comparación ancha → tarjetas legibles | Ruta preparada; F |
| Nosotros `/nosotros` | Origen, filosofía, regiones, elaboración, visita | Escena corta → bloques | Ruta preparada; F |
| Contacto `/contacto` | Datos, regiones, mapa, formulario, confirmación | Columnas → bloques | Ruta preparada; F |
| Datos `/checkout/datos` | Pasos, campos, errores, resumen | Resumen lateral → apilado | Ruta preparada; G |
| Entrega `/checkout/entrega` | Pasos, modalidad, dirección, resumen | Resumen lateral → apilado | Ruta preparada; G |
| Pago `/checkout/pago` | Revisión, edición, método simulado, finalización | Resumen lateral → apilado | Ruta preparada; G |
| Confirmación `/pedido-confirmado` | Aviso demo, ID, selección, totales, acciones | Bloques adaptables | Ruta preparada; G |
| Cava vacía `/carrito-vacio` | Mensaje, recuperación, recomendaciones | Composición adaptable | Estado inicial, sin recomendaciones; G |
| 404 `*` | Mensaje, inicio, colección, contacto | Tipografía fluida | Estado base; tratamiento final G |

Anchuras de referencia para futuras comprobaciones: 390, 820 y 1440 px. El código usa un solo árbol semántico. No se verificaron estas anchuras ni otras.

## Contenido consolidado

- Marca y frase de hero: suministradas en el Markdown.
- Vinos: Gran Reserva, Blanco de Parcela y Rosado de Ladera son nombres suministrados. Faltan añadas, precios, regiones por vino, variedades, descripciones, notas, técnica, disponibilidad e imágenes. Se guardan como borradores, no se habilitan fichas ni compra.
- Catas: faltan fechas, nombres, lugares, aforo y precios; fuente central vacía.
- Club: faltan planes, precios, frecuencia y beneficios aprobados; fuente central vacía.
- Ica/Majes: nombres suministrados, sin direcciones exactas ni coordenadas confirmadas.
- Métricas, citas, prensa, contacto y textos legales: no suministrados. No se inventan.

## Destinos y comportamiento

Todos los enlaces de navegación conducen a rutas existentes. Las pendientes explican la fase prevista. Cava conduce al estado vacío. `/checkout` redirige a datos; sus pasos son estados de construcción y no simulan transacciones. Slugs desconocidos o sin contenido preparado y rutas desconocidas conducen a 404. No hay enlaces legales `#`, redes falsas ni botones de compra activos sin datos. El formulario de `/fundaciones` valida localmente y confirma que no hubo envío.

## Estado de fases

- A01/A03/A05/A07: inventarios y matriz documentados.
- A02/A06: revisión actual del diseño pendiente; solo evidencia histórica, sin inspección visual.
- A04: estructura consolidada; datos comerciales pendientes de suministro.
- B01/B02/B04/B05/B06/B07: fundaciones implementadas; ver resultados técnicos en VALIDACION.md.
- B03: fuentes locales y muestra SVG reservada en 3:4; fotografías/proporciones reales por confirmar.
- Salida visual de B: no comprobada por instrucción del usuario.
- C01–C06: prototipos implementados en `/prototipos` y compilados; sin inspección visual. Ver PROTOTIPOS.md.
- C07: no ejecutado (sin GLB). C08: pendiente de autorización para navegador y profiling.
- D–H: no iniciadas, excepto estados base necesarios para B.

