# TERRUÑO & CO. — Alcance final del frontend

Fecha: 28 de octubre de 2026.
Paso 1: definición de alcance y correspondencia entre diseño y aplicación.

Este documento fija el objetivo de los ajustes. Las funciones descritas como pendientes no se consideran implementadas ni verificadas por figurar aquí.

## 1. Objetivo y límites

Completar una demostración navegable en React, TypeScript y Tailwind CSS para el Laboratorio #5. Se conservan las 13 vistas principales y el recorrido de catálogo → cava → datos → entrega → revisión → confirmación.

La versión de escritorio de Figma es la referencia de contenido, jerarquía y lenguaje visual. Celular y tablet conservan la misma información y acciones esenciales con una distribución adaptada. Se usa una sola aplicación responsive, sin duplicar páginas React por dispositivo.

Referencia: https://www.figma.com/design/iQXggvnOlFp1JeEQFppT11?node-id=33-2

Página: TERRUÑO V2 — Editorial Ecommerce, nodo 33:2. Anchuras de referencia: celular 390 px, tablet 820 px y escritorio 1440 px; el comportamiento también debe adaptarse a anchos intermedios.

Alcance operativo: catálogo local, cava persistente en localStorage, checkout y formularios simulados. Datos personales y pedido permanecen en memoria. No se incluyen API, base de datos, cuentas, administración, cobros, correo ni reservas reales.

Los pasos 5 (Vercel) y 6 (organización de equipo y entrega académica) quedan pendientes para el final. Este paso no modifica el historial local ni publica código en GitHub.

## 2. Correspondencia Figma → React

Los identificadores D, T y M corresponden a escritorio, tablet y celular. Las rutas se confirmaron en src/app/router.tsx.

| Vista y ruta | Figma D / T / M | Página React y piezas principales |
|---|---|---|
| Inicio `/` | 33:3 / 59:2 / 35:2 | HomePage.tsx reexporta HomeExperience.tsx; hero, colección, relato, catas, club y newsletter |
| Colección `/coleccion` | 33:24 / 59:15 / 35:13 | CollectionPage.tsx; ProductCard, Filters, filtro y orden por URL |
| Vino `/vino/:slug` | 33:57 / 59:35 / 35:35 | WinePage.tsx; ProductImage, BottleViewer, QuantityControl, CartDrawer, galería y ficha técnica |
| Catas `/catas` | 33:72 / 59:49 / 35:46 | TastingsPage.tsx; agenda, filtro, detalle y LocalForm |
| Club `/club` | 33:97 / 59:68 / 35:63 | ClubPage.tsx; planes, comparación, beneficios, FAQ y formulario |
| Nosotros `/nosotros` | 33:159 / 59:113 / 35:103 | AboutPage.tsx; relato, regiones y componentes editoriales |
| Contacto `/contacto` | 33:145 / 59:102 / 35:94 | ContactPage.tsx; LocalForm, regiones y FAQ |
| Datos `/checkout/datos` | 33:122 / 59:84 / 35:77 | CheckoutPages.tsx: DetailsPage, CheckoutLayout, Guard y Summary |
| Entrega `/checkout/entrega` | 40:1628 / 59:157 / 133:2 | CheckoutPages.tsx: DeliveryPage; modalidades, dirección y resumen |
| Pago `/checkout/pago` | 40:1782 / 59:168 / 133:3 | CheckoutPages.tsx: PaymentPage; revisión, consentimiento y finalización simulada |
| Confirmación `/pedido-confirmado` | 33:182 / 59:135 / 35:120 | OrderConfirmedPage.tsx; resumen inmutable y recuperación sin pedido |
| Cava vacía `/carrito-vacio` | 33:191 / 59:146 / 35:128 | EmptyCartPage.tsx; estado vacío y recomendaciones |
| Página inexistente `*` | 33:173 / 59:124 / 35:112 | NotFoundPage.tsx; recuperación hacia inicio, colección y contacto |

Figma tiene una ficha de Gran Reserva como referencia; React reutiliza WinePage para tres slugs: gran-reserva, blanco-de-parcela y rosado-de-ladera. No se requieren tres componentes distintos.

Elementos compartidos: RootLayout, Header, Footer, OverlayProvider, Button, FormField, LocalForm, CartProvider, CheckoutProvider y política de movimiento. La cava con contenido se presenta en un drawer y no añade una vista al recuento.

`/checkout` es un alias a `/checkout/datos`. `/fundaciones` y `/prototipos` son herramientas adicionales de desarrollo; no forman parte de las 13 vistas de entrega.

## 3. Funciones incluidas

### Catálogo y búsqueda

- Tres vinos con ficha reutilizable, imágenes, cantidades y añadido a la cava.
- Filtros por tipo, región, añada y precio; ordenación y limpieza de filtros.
- Buscador por nombre, combinado con filtros y ordenación, con término en URL, contador y estado sin resultados.
- Buscador accesible desde la navegación, con atajo Ctrl+K o Cmd+K y cierre con Escape; sin interferir al escribir en formularios.

El buscador es una ampliación pendiente del paso 3; los filtros ya existen.

### Cava y compra simulada

- Añadir, modificar cantidades, eliminar y recuperar la selección tras recargar.
- Estados de cava vacía y con productos; acceso a cada ficha.
- Checkout de tres pasos con validación, vuelta a pasos anteriores y guardas de acceso.
- Resumen coherente de productos, cantidades, subtotal, modalidad, entrega y total.
- Desglose informativo del IGV incluido: base + IGV = total; nunca sumar el IGV de nuevo al importe mostrado.
- Confirmación con identificador DEMO, fecha, líneas, modalidad de entrega e importes finales; aclaración de que no se produjo compra o envío.
- Recarga sin pedido: explicación y enlace para iniciar un nuevo recorrido.

El resumen y el desglose se completan en el paso 3. El coste de entrega debe mostrarse como pendiente de selección hasta que el usuario confirme su modalidad.

### Experiencias y contenido

- Catas con filtro regional, detalle, asistentes y estados de disponibilidad ilustrativos.
- Club con selección de plan, comparación, beneficios, FAQ y adhesión simulada.
- Contacto, newsletter y reservas con validación y confirmación local.
- Relato de marca, regiones, galería y enlaces de navegación funcionales.
- Un aviso breve y coherente de demostración; contenido de ejemplo identificado sin repetir avisos extensos en cada bloque.

### Responsive, movimiento y 3D

- Misma identidad, contenido principal y acciones en celular, tablet y escritorio.
- Menú adaptable, filtros en panel, tarjetas y formularios sin desbordamientos.
- Mantener las animaciones existentes con movimiento reducido y controles esenciales accesibles por teclado.
- Un único modelo conceptual para Gran Reserva, con imagen alternativa y reintento ante error. Los otros vinos conservan sus ilustraciones.
- Mantener el acceso al visor desde portada, colección y ficha de Gran Reserva; evitar carga 3D innecesaria y tratar correctamente pérdidas de contexto.

## 4. Funciones fuera de esta entrega

- Cupones y promociones; progreso hacia envío gratuito.
- Asistente de recomendaciones de cuatro preguntas.
- Modal de mayoría de edad y búsqueda de información adicional para implementarlo: se mantiene como mejora futura, sin presentarlo como función disponible.
- WhatsApp comercial, teléfonos, direcciones y contactos sociales sin datos aprobados.
- Seguimiento real de pedidos, inventario, suscripciones o reservas.
- Pasarelas, cuentas, backend y servicios externos de formularios.

En el paso 2, las referencias de Figma a funciones excluidas se retiran del recorrido final o se rotulan explícitamente como propuestas futuras. El checkout muestra únicamente un método simulado, sin captura de tarjetas.

## 5. Reglas de contenido para el paso 2

1. Marca: TERRUÑO & CO.; frase principal: «La alquimia del tiempo, en cada copa».
2. Los nombres de vino, precios y añadas se alinearán con la referencia de escritorio de Figma. Todos mantienen su carácter ilustrativo.
3. Catálogo, planes, catas y modalidades se centralizan en src/data/catalog.ts. Componentes y resúmenes no duplican importes manualmente.
4. Si dos pantallas de Figma se contradicen, prevalece la ficha o sección especializada de escritorio; el resumen de checkout se calcula desde el catálogo y la modalidad elegida.
5. La entrega se define una sola vez. En el paso 2 se resolverá la diferencia detectada entre S/15 en React y S/20 en el ejemplo de Figma; no se considera aprobada una política comercial real.
6. Fechas y sedes de catas siguen siendo ejemplos; se eligen fechas futuras para la presentación y se evita atribuir instalaciones o disponibilidad reales a fotografías de ambiente.
7. Premios, métricas y testimonios solo se conservan identificados como contenido conceptual. No se inventan reseñas verificadas ni datos de contacto.

Diferencias ya confirmadas:

| Producto | Figma: precio / añada | React actual: precio / añada |
|---|---|---|
| Gran Reserva | S/185 / 2021 | S/145 / 2022 |
| Blanco de Parcela | S/145 / 2022 | S/95 / 2024 |
| Rosado de Ladera | S/125 / 2020 | S/85 / 2024 |

Los importes y añadas de esta tabla son evidencia de la lectura previa, no cambios ejecutados. Catas, planes y textos requieren contraste detallado adicional; no se declara auditado todo el contenido de Figma.

## 6. Faltantes conocidos del diseño

- Móvil: entrega (133:2) y pago (133:3) son marcos vacíos.
- Móvil: confirmación y cava vacía usan una composición distinta de escritorio.
- Catálogo: existen paneles internos de estados dentro de las pantallas comerciales; deben trasladarse al área de documentación de diseño.
- Tablet: algunas distribuciones estrechan demasiado columnas; se deben revisar al adaptar el contenido.

Figma agotó el límite de herramientas del plan Starter durante la revisión. No se editó el archivo. Corregir estos puntos pertenece al paso 2 y depende de recuperar acceso; los ajustes locales pueden avanzar por separado.

## 7. Criterios de cierre del alcance

- Las 13 vistas tienen correspondencia identificada entre Figma y React.
- Se conserva una sola aplicación con adaptación a tres tamaños de referencia.
- Buscador y resumen ampliado quedan incluidos; cupones y asistente quedan excluidos.
- Toda operación es demostrativa y funciona con datos locales.
- El paso 2 cubrirá contenido y coherencia de diseño; el paso 3, búsqueda y resumen; el paso 4, responsive, 3D y comprobaciones breves.
- Vercel y entrega académica quedan reservados para los pasos 5 y 6.

Estado del paso 1: completado documentalmente. No implica aprobación visual ni finalización de los pasos posteriores. Se mantiene la instrucción de no realizar comprobaciones visuales; las capturas y validación visual se harán cuando el usuario las autorice o las aporte.


## 8. Subpaso final — explicación de los archivos Markdown

Después de los pasos 5 y 6, explicar al usuario cada `.md` que exista en el proyecto: su propósito, qué información contiene, si describe el estado actual o una propuesta futura y cuándo conviene consultarlo. Incluir README, SPEC y los documentos de docs/, identificar referencias históricas o duplicadas y distinguir PLAN-BACKEND como propuesta fuera del alcance del laboratorio. Usar el inventario real de ese momento; no presentar planes pendientes como implementaciones terminadas.

## 9. Avance del paso 2 — 28 de octubre de 2026

La copia local se ajustó al contenido de Figma leído previamente: vinos, añadas, descripciones, variedades, catas de portada y tarifa ilustrativa de entrega. Ver CONTENIDO.md para los valores vigentes y límites de la comparación. Las columnas «React actual» de la sección 5 son el diagnóstico anterior a estos ajustes, no el catálogo vigente.

El paso 2 está parcialmente completado: faltan la edición del archivo Figma y el contraste detallado de las pantallas especializadas, bloqueados por el límite de herramientas Starter. El buscador y el resumen ampliado siguen reservados al paso 3.


## 10. Avance del paso 3 — 28 de octubre de 2026

Implementados el buscador por nombre (colección y diálogo desde la navegación, Ctrl/Cmd+K) y PurchaseTotals compartido por cava, checkout y confirmación. La búsqueda usa `q` en URL, respeta los otros filtros y normaliza mayúsculas, tildes y espacios. Los filtros se pueden restablecer conservando la búsqueda; «Limpiar todo» elimina ambos.

El resumen muestra productos, cantidades e importes de línea. Antes de confirmar modalidad, la entrega y el total figuran por confirmar; base e IGV se calculan solo sobre productos. Después de confirmar, la entrega se incorpora al total y el desglose incluye el importe completo. El IGV está incluido y no se suma otra vez. La confirmación muestra datos y modalidad del pedido guardado en memoria.

Comprobación: TypeScript, build y 11 pruebas de lógica correctos (incluyen búsqueda combinada y reconciliación de céntimos con IGV). Sin comprobación visual ni recorrido de navegador; quedan para la validación autorizada del paso 4. Vite conserva el aviso de tamaño de chunks. No se crearon commits ni se publicaron cambios.

## 11. Avance del paso 4 — 28 de octubre de 2026

Completada la revisión por código con ajustes responsive y del ciclo del visor. Evidencia en VALIDACION.md: TypeScript, build, 14 pruebas rápidas, estructura binaria del GLB y entrega HTTP de rutas y recursos. Se corrigieron autoload en pestaña oculta, reintento de descargas fallidas, doble clic de inspección en modo reducido, captura prematura de gestos y callback después del desmontaje. Se ajustaron catálogo, header móvil, campos, filtros, paneles y sticky en pantallas bajas.

La aceptación visual y de interacción real sigue pendiente. No se realizaron comprobaciones visuales ni se inició el despliegue de Vercel. El contraste completo y la edición de Figma del paso 2 siguen pendientes de acceso.

## Presentación como trabajo final grupal — 28/10/2026

Por indicación del usuario, TERRUÑO se presenta como trabajo final grupal. Se retiraron de la interfaz la banda y las notas de demostración, las etiquetas de precios y datos de ejemplo y la referencia a pagos simulados. El catálogo usa available como disponibilidad; los pedidos locales usan prefijo TER. Los formularios confirman datos completados y el checkout confirma la selección sin afirmar envíos de correo ni cobros efectuados.

El cambio es de presentación: el alcance implementado sigue siendo frontend, con catálogo local, cava en navegador y pedido en memoria. La documentación histórica conserva sus notas originales; no describe una versión desplegada con servicios operativos.
