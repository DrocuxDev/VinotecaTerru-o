# Avance de TERRUÑO & CO. — 26 de octubre de 2026

Proyecto actual: `C:\Users\USER\Desktop\terruno-co`.

La implementación continúa la especificación original de SPEC.md. Las trece vistas y los recorridos de demostración están implementados en código. La revisión visual, el perfil de rendimiento y la validación con dispositivos siguen pendientes por instrucción del usuario. No se declara cumplida la definición de terminado visual del plan.

## Estado por fase

Actualización del 26 de octubre: se incorporan las cinco familias de animación avanzada solicitadas y el visor de Gran Reserva en `/coleccion`. Distribución, alternativas y límites en `ANIMACIONES-AVANZADAS.md`. Incluye relato horizontal, letras, continuidad de nombre e imagen, shaders fotográficos, magnetismo con resortes y cámara 3D guiada por scroll. Pendiente la comprobación visual, no autorizada.

| Fase | Resultado actual | Pendiente |
|---|---|---|
| A | Inventario de rutas, datos centralizados, procedencia y faltantes documentados | Diseño Figma actual, cuatro marcos móviles, contenido comercial aprobado |
| B | React/TypeScript/Tailwind, fuentes locales, tokens, UI, router, overlays y política de movimiento | Verificación visual de componentes |
| C | Prototipos conservados en `/prototipos`; integración de gestos en el sitio; GLB optimizado con visor real | C08: perfil CPU/GPU y revisión de calidad después de simplificar |
| D | Portada con hero, colección espacial, relato, cifras del prototipo, agenda, cita editorial, club, newsletter y pie | Fotografías definitivas, métricas/citas comerciales aprobadas si se quieren incorporar |
| E | Filtros y orden por URL, tres fichas, galerías, técnica, cantidades, cava persistente, estado vacío, continuidad | Revisión visual y recorrido de retorno con navegador |
| F | Agenda/reserva local, planes/comparación/adhesión, relato/capas/regiones, contacto/FAQ | Vías de contacto, fechas, precios, fichas y sedes reales |
| G | Datos, entrega, método simulado, validación, guardas, resumen y confirmación con snapshot | Recorridos de navegador/teclado y datos definitivos |
| H | Build, TypeScript estricto, cinco pruebas de lógica, comprobación HTTP y documentación | Capturas, 39 combinaciones visuales, lectores de pantalla, dispositivos, LCP/INP/CLS y profiling |

## Rutas

`/`, `/coleccion`, `/vino/:slug`, `/catas`, `/club`, `/nosotros`, `/contacto`, `/checkout/datos`, `/checkout/entrega`, `/checkout/pago`, `/pedido-confirmado`, `/carrito-vacio`, `*` (404).

`/checkout` redirige a datos. `/fundaciones` y `/prototipos` son herramientas de desarrollo adicionales, fuera del recuento de trece vistas.

Slugs habilitados: `gran-reserva`, `blanco-de-parcela`, `rosado-de-ladera`. Cualquier otro slug muestra 404.

## Efectos

| Efecto | Implementación |
|---|---|
| FX01 | Abertura vertical del plano del hero; texto/CTA disponibles desde el comienzo |
| FX02 | `layoutId` por producto/imagen en colección, portada y ficha; enlace directo independiente |
| FX03 | Modelo GLB con materiales originales, iluminación de estudio y controles de giro/arrastre |
| FX04 | Capas fotográficas con scroll nativo; escritorio corto, móvil/reducido en bloques |
| FX05 | Menú compartido en diálogo nativo con dos planos articulados y menor rotación |
| FX06 | Galería con perspectiva, flechas, selección directa, Inicio/Fin, teclado y drag horizontal |
| FX07 | Titular del hero por líneas; frase accesible completa y sin copias anunciadas |
| FX08 | Abertura de rutas sin bloquear puntero; salida breve; nueva navegación sustituye destino |
| FX09 | Reordenación de tarjetas con layout y filtros visibles en URL |
| FX10 | Respuesta de presión/indicador de CTA sin desplazar su área clicable |
| FX11 | Estado inmediato, contador, anuncio accesible y miniatura decorativa de añadido |
| FX12 | Plan activo avanza y gana borde; beneficios permanecen visibles sin hover |
| FX13 | Ficha técnica en drawer con entrada breve y foco/scroll nativos |
| FX14 | Región elegida coordina fotografía, texto y croquis editorial |
| FX15 | Tres pasos accesibles, línea de progreso y transiciones cortas de checkout |
| FX16 | Confirmación por grupos con resumen inmutable del pedido ficticio |

Estas son implementaciones en código, no efectos acreditados por capturas o perfilado. El modo reducido respeta el sistema y elimina las entradas espaciales automáticas; las interacciones esenciales siguen disponibles.

## Modelo e imagen aportados

- GLB original: `C:\Users\USER\Downloads\wine bottle 3d model.glb`, sin modificar.
- Entrada: 175.526 triángulos, 6.349.644 bytes.
- Copia web: `public/models/terruno-bottle.glb`, 20.000 triángulos, 1.830.944 bytes.
- Optimización: deduplicación, soldadura, simplificación con borde UV conservado y limpieza. Texturas originales incrustadas conservadas. No se comprobó visualmente la geometría resultante.
- Imagen original: `Meshy_AI_Terruno_Wine_Bottle_Concept.png`, aportada por el usuario. Copia dentro de `source-assets/`; original de Descargas intacto.
- Versiones WebP de 1000/500 px para hero y producto. La de 1000 px pesa 46.318 bytes; solo cambia tamaño/formato, sin rediseñar la imagen.
- El mismo modelo conceptual representa el producto de ejemplo Gran Reserva; no se le atribuye una correspondencia con una botella comercial real.

## Lo que debes revisar al continuar

Corrección del 26 de octubre: se retiró el efecto del fallback de Canvas que notificaba un error WebGL al montarse, incluso con soporte gráfico disponible. El fallback queda como texto pasivo; los errores reales del renderer siguen llegando a SceneBoundary. TypeScript y build correctos tras el cambio. Sin comprobación visual; queda pendiente confirmar la carga en el navegador del usuario.

Corrección posterior del mismo día: el aviso de pérdida de contexto ahora se desuscribe al desmontar e ignora canvas desconectados. El visor conserva su instancia al cambiar de pestaña o salir del área visible y pausa el render. Cuatro pruebas rápidas de lógica, TypeScript y build correctos. La carga en el navegador del usuario sigue pendiente de confirmar.

1. Iniciar `npm run dev` y recorrer las trece vistas cuando quieras autorizar revisión visual.
2. Revisar especialmente la botella optimizada: orientación frontal, etiqueta, reflejos y silueta.
3. Sustituir datos ilustrativos por precios, añadas, ficha técnica, agenda, planes y contacto aprobados.
4. Completar H: tamaños 390/820/1440 e intermedios, teclado/tacto, lectores de pantalla y movimiento reducido, navegación rápida y perfiles de carga.
5. La publicación y los servicios de pago, correo, reservas o suscripciones requieren trabajo posterior separado; este proyecto permanece local.


## Ajustes del laboratorio — 28 de octubre de 2026

Paso 1 documentado en ALCANCE-FRONTEND.md. Paso 2 aplicado parcialmente al frontend: precios y añadas de los tres vinos alineados con la lectura de Figma; catas de portada unificadas con la agenda; entrega fija ilustrativa de S/20 y recojo gratuito. Textos compartidos en src/data/content.ts, datos comerciales en catalog.ts y comparación de planes derivada del catálogo. Filtros de precio adaptados a los importes vigentes.

La edición de Figma y el contraste completo de sus pantallas especializadas siguen bloqueados por el límite Starter. Se mantienen métricas verificables del prototipo y cita editorial en lugar de presentar premios o prensa como hechos reales. No se realizó comprobación visual. Pasos 3 y 4 pendientes; Vercel y entrega al final; después se explicará cada archivo Markdown.


### Paso 3 — buscador y resumen de compra

Implementación local terminada: buscador por nombre con `q` en URL, diálogo de búsqueda y Ctrl/Cmd+K; comparación sin tildes y sin diferencias de mayúsculas. PurchaseTotals comparte entrega, total y desglose informativo del IGV entre cava, checkout y confirmación. El total espera confirmación de entrega; las cantidades e importes finales proceden del snapshot del pedido. La confirmación incorpora los datos y la modalidad elegida.

TypeScript, build y 11 pruebas rápidas de lógica correctos. Sin revisión visual, recorrido de teclado o navegador. Pendientes del paso 4: responsive y visor 3D. La edición y comparación completa de Figma del paso 2 sigue bloqueada por su límite Starter. Pasos 5 y 6 reservados para el final, seguidos de la explicación de cada Markdown.

### Refinamiento del buscador

Se consultaron frontend-design de Anthropic y web-design-guidelines de Vercel. El buscador usa una composición de carta de bodega, campo tipográfico compartido, lista de añadas y precios, vista secundaria de botella, variante exclusiva de diálogo y acceso discreto desde navegación. Dirección, fuentes y límites en DISENO-BUSCADOR.md. Build correcto; sin revisión visual ni publicación.

### Dirección editorial extendida al sistema

Por solicitud del usuario se amplió el refinamiento del buscador a navegación, portada, introducciones, catálogo, detalle, catas, club, formularios, compra, estados de recuperación y footer. Criterios en DISENO-SISTEMA.md. Se mantienen los datos y recorridos de los pasos anteriores. El sistema usa tipografía de lectura para metadatos, menos numeración decorativa y menos énfasis dorado repetido, con composición específica por función. Los números siguen en pasos secuenciales.

No se editó Figma. Su correspondencia visual requiere una reconciliación posterior con esta nueva dirección aprobada. El paso 4 de responsive/3D sigue pendiente de su cierre y no se declara verificación de navegador. No se realizaron capturas ni comprobaciones visuales; publicación y entrega siguen al final.

### Corrección del buscador tras la captura

Se retiró la botella lateral y se simplificaron los resultados a filas con miniatura, nombre, añada/procedencia y precio. Se redujeron ancho, márgenes y tipografía; el campo usa 16px. El foco del input utiliza solo la línea inferior, incluyendo un estado de alto contraste. Se retiraron las utilidades del título que impedían controlar su tamaño en la variante de búsqueda. Sin nueva comprobación visual.

### Corrección de la colección espacial de portada

La captura del usuario mostró que imagen, nombre, descripción y compra se transformaban como una sola lámina, superponiendo la fotografía de un vino sobre el texto del siguiente. Ahora Gallery admite detalles fuera de la escena espacial: portada entrega solo la imagen al deck y presenta únicamente la información del vino activo debajo, en flujo normal y sin opacidad reducida. Las imágenes laterales mantienen perspectiva dentro del contenedor recortado y suben a 65% de opacidad. Se conserva navegación por flechas, selección directa, teclado y arrastre, junto con movimiento reducido. La galería de detalle conserva su API y funcionamiento.

No se cambiaron los recursos fotográficos ni se realizó una nueva comprobación visual. La diferencia entre fotografía de Gran Reserva e ilustraciones de los demás vinos sigue siendo una limitación de los recursos disponibles.

### Foco automático de títulos

El recuadro dorado del hero provenía de la regla global :focus-visible aplicada al h1 que recibe foco programático al navegar. Se elimina el outline únicamente del h1 con tabindex=-1 dentro del contenido. Se conserva el foco automático para navegación asistida y los indicadores de controles interactivos. No es un problema de caché y no requiere borrar almacenamiento. Sin comprobación visual.

### Paso 4 — revisión técnica de responsive y 3D

Se corrigieron activación automática del visor en pestañas ocultas, scroll vertical capturado como giro, reintento con carga fallida en caché y el doble clic de inspección en ficha con movimiento reducido. Se añadieron guardas de carga después del desmontaje y geometría inválida, controles pendientes de carga y reactivación del render bajo demanda. Autoload reservado a escritorio visible con puntero fino; el botón permite inspección explícita en móvil/tablet.

Responsive: catálogo de dos columnas con sidebar, header móvil en dos filas cuando hace falta, campos de 16px, chips y textos largos contenidos, área segura del drawer y desactivación del sticky en pantallas bajas. Comprobación técnica: TypeScript/build, 14 pruebas rápidas, GLB estructural válido (20.000 triángulos/3 imágenes incrustadas) y 14 rutas HTTP más GLB/WebP. Detalles y límites en VALIDACION.md. No se hizo revisión visual ni se crearon commits.

Pendientes: aceptación visual y dispositivos del paso 4; contraste/edición restante de Figma; Vercel y entrega de los pasos 5/6; explicación final de Markdown.

## Presentación como trabajo final grupal — 28/10/2026

Por indicación del usuario, TERRUÑO se presenta como trabajo final grupal. Se retiraron de la interfaz la banda y las notas de demostración, las etiquetas de precios y datos de ejemplo y la referencia a pagos simulados. El catálogo usa available como disponibilidad; los pedidos locales usan prefijo TER. Los formularios confirman datos completados y el checkout confirma la selección sin afirmar envíos de correo ni cobros efectuados.

El cambio es de presentación: el alcance implementado sigue siendo frontend, con catálogo local, cava en navegador y pedido en memoria. La documentación histórica conserva sus notas originales; no describe una versión desplegada con servicios operativos.

## Paso 5 — preparación de Vercel

Por solicitud del usuario se inicia el paso 5. Se prepararon vercel.json, .vercelignore y exclusión de .vercel en Git. La integración está disponible para conectar; no hay CLI Vercel instalada ni vinculación .vercel existente en el proyecto. La guía DESPLIEGUE-VERCEL.md explica la publicación desde carpeta local y la alternativa posterior desde GitHub. Publicación pendiente de iniciar sesión o conectar Vercel y seleccionar la cuenta/equipo de destino. No se publicó código en GitHub ni se crearon commits.
