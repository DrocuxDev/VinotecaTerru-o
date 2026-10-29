# Validación — 26 de octubre de 2026

## Animaciones avanzadas y modelo en colección

- `npm run build` correcto tras la integración final; incluye TypeScript estricto. La comprobación inicial detectó un import sin uso, que se retiró antes de la compilación final.
- JavaScript inicial: 165,32 KB gzip. Three/Fiber compartidos y diferidos: 239,08 KB gzip; escena de botella: 14,96 KB gzip; efecto fotográfico: 1,35 KB gzip. CSS: 8,09 KB gzip. Vite mantiene su advertencia de chunks mayores de 500 KB sin comprimir.
- Implementadas las cinco familias descritas en `ANIMACIONES-AVANZADAS.md`, más el visor de Gran Reserva dentro de `/coleccion`. La navegación a la ficha está separada de los controles del visor.
- Se revisó el código de suscripciones, estados reducido/táctil y pausa de escenas. No se ejecutaron pruebas de navegador, capturas, mediciones GPU ni revisión visual. El build no comprueba la compilación GLSL en una GPU real.
- El usuario confirmó que el modelo aparecía en portada antes de solicitar su incorporación a colección. La apariencia y carga de los efectos nuevos siguen pendientes de su comprobación.

## Ejecutado

- `npm run build`: correcto; incluye `tsc --noEmit` con configuración estricta y Vite 7.3.7.
- `npm test`: cinco pruebas de lógica correctas, cero fallos, aproximadamente 184 ms en la pasada registrada. Cubren operaciones y totales en céntimos, entradas inválidas/límites de cantidad, filtros/ordenación por URL, recuperación de checkout y validación de formularios. No prueban la UI ni las animaciones.
- `node scripts/http-smoke.mjs`: catorce URL HTTP servidas con HTML de SPA, GLB con cabecera válida y WebP disponible. Incluye las trece rutas, un slug desconocido y una ruta inexistente; los pasos de compra son tres de esas rutas. El servidor temporal local se detiene al terminar. No ejecuta React en navegador: el 200 de fallback no acredita el contenido o guardas en ejecución.
- Inspección binaria y optimización del GLB: 175.526 → 20.000 triángulos, 6.349.644 → 1.830.944 bytes. Se preservan las texturas y sus bordes UV; falta revisar la calidad visual.
- Conversión de la imagen del usuario: PNG 1152 × 1536, 1.879.640 bytes; WebP de 1000 px, 46.318 bytes, y variante de 500 px.
- Dependencias fijadas y lockfile actualizado. La instalación final informó cero vulnerabilidades; se actualizó Sharp a 0.35.5 al detectar un aviso en una versión anterior.

## Tamaños de build registrados

- JavaScript inicial: aproximadamente aprox. 497 KB / **159,3 KB gzip**. Dentro del presupuesto de 200–250 KB gzip para la aplicación sin 3D.
- CSS: aproximadamente 33,52 KB / 7,63 KB gzip.
- Visor 3D diferido (Three.js + React Three Fiber + loader + entorno): aproximadamente 931,50 KB / **252,55 KB gzip**. Vite advierte sobre este chunk superior a 500 KB sin comprimir; está separado y se carga después del contenido principal o por acción explícita. La advertencia no se ocultó elevando el límite.
- Páginas secundarias y laboratorios separados en chunks. Modelo de 1,83 MB fuera del JS inicial.
- Esas cifras son del bundler, no resultados de LCP/INP/CLS o velocidad en dispositivos.

## No ejecutado por instrucción del usuario

Ninguna revisión visual, apertura de navegador, inspección de Figma, visor del modelo ni captura. No se midieron FPS, CPU/GPU, LCP, INP, CLS, contraste, zoom, teclado móvil, lectores de pantalla o comportamiento táctil.

No se ejecutaron pruebas de navegador ni recorridos completos de compra/reserva/club. Las guardas, continuidad, foco y restauración de scroll están implementadas, pero requieren validación real. No se acredita todavía paridad visual en 390/820/1440 px ni las 39 combinaciones del plan.

## Pendientes para cerrar H

1. Recorrer las trece vistas y anchos intermedios, incluyendo las cuatro adaptaciones móviles que el registro histórico dejaba pendientes.
2. Revisar orientación, etiqueta y silueta del GLB optimizado; confirmar calidad de materiales y coste del visor.
3. Teclado, Escape, foco, retorno, menú, galería, formularios, rutas profundas y navegación rápida con/sin movimiento reducido.
4. Medir y ajustar carga, render y principales interacciones en dispositivos documentados.
5. Sustituir el contenido comercial de ejemplo por información aprobada.

Los informes técnicos auxiliares están en `model-report.json` y `http-report.json`. La especificación original se conserva en SPEC.md; el estado vigente está en AVANCE.md.

## Aviso WebGL falso — 26 de octubre de 2026

- Causa identificada en el código instalado de React Three Fiber: `Canvas` monta su prop `fallback` como hijo DOM de `<canvas>` también cuando WebGL está disponible. El anterior componente `Unsupported` ejecutaba su efecto y cerraba el visor sin comprobar si había fallado el renderer.
- Se sustituye por texto pasivo. Los errores reales de inicialización continúan propagándose desde Fiber a `SceneBoundary`; se conservan timeout y reintento.
- `npm run build` correcto después de la corrección, incluido `tsc --noEmit`. Se mantiene la advertencia de tamaño del chunk 3D diferido (252,75 KB gzip). Sin abrir ni comprobar visualmente la web; pendiente la confirmación del usuario en su navegador.

## Pérdida de contexto al desmontar — 26 de octubre de 2026

- Se elimina el listener anónimo registrado en `onCreated` sin limpieza. Fiber libera intencionalmente el contexto al desmontar; ese evento no debe marcar como fallida una instancia posterior.
- La suscripción se instala en un efecto de la escena y se retira en su limpieza. También ignora eventos de un canvas desconectado del documento.
- Cambiar de pestaña o salir del área visible conserva el canvas y pausa su render con `frameloop="never"`; al volver utiliza `demand`. Cerrar el visor o navegar sí libera la instancia.
- Cuatro pruebas de lógica con EventTarget, sin DOM ni GPU: pérdida activa, evento tras limpieza, canvas desconectado y reinstalación del efecto. Todas correctas; unos 499 ms en total. No acreditan el render del modelo en un navegador real.
- `npm run build` correcto, incluido TypeScript. Se mantiene el aviso de tamaño del chunk 3D diferido (252,85 KB gzip). Sin apertura de navegador ni comprobación visual; pendiente confirmar en el navegador del usuario.


## Corrección del visor 3D — 26 de octubre de 2026

- Se evita que el contenedor capture el puntero de botones y enlaces: el botón de inspección puede completar su clic.
- El arrastre solo captura el puntero cuando el visor está activo y el modelo ya está listo.
- Activar la inspección confirma la visibilidad del visor; IntersectionObserver dispone de alternativa cuando no existe.
- Se reserva explícitamente ancho y alto del canvas. La imagen permanece hasta el primer render del modelo.
- Fallos de WebGL, pérdida de contexto, errores de carga y timeout producen un mensaje visible y opción de reintento.
- TypeScript y build de producción correctos. Lectura técnica del GLB: 14.569 vértices, 20.000 triángulos, coordenadas finitas e índices válidos.
- No se abrió navegador ni se hicieron capturas o comprobaciones visuales. La resolución en el navegador del usuario todavía requiere su comprobación.

## Paso 4 — responsive y visor 3D (28/10/2026)

### Cambios aplicados por revisión de código

- Catálogo: una columna antes de 768px y dos desde tablet, también al mostrar sidebar. Se evita estrechar tres productos junto a los filtros en pantallas de escritorio.
- Navegación: acciones en una segunda fila en pantallas menores de 480px; compensación del scroll para el header más alto.
- Campos: 16px en móvil para evitar el zoom automático de entrada; etiquetas, controles y chips admiten texto largo.
- Diálogos/drawers: títulos y contenedores sin anchura mínima accidental y espacio inferior para el área segura.
- Checkout: pasos con ancho mínimo cero; resumen y detalle sin sticky en escritorio de menos de 700px de altura.
- Visor: autoload únicamente en escritorio con puntero fino, pestaña visible, componente visible y movimiento permitido. En celular y tablet se ofrece el botón de inspección.
- Ficha: la acción «Inspeccionar modelo 3D» abre directamente el visor, también con movimiento reducido; no exige un segundo clic dentro del visor.
- El renderer ya montado se pausa fuera de vista o pestaña. Al reactivarlo se solicita un frame; la cámara se desuscribe del scroll mientras está inactiva.
- El gesto vertical no captura el puntero ni desactiva la cámara; solo el arrastre horizontal confirmado gira la botella.
- Reintento: nueva instancia lazy y limpieza del resultado del GLTFLoader, de modo que una carga fallida en caché no bloquee el siguiente intento.
- Callback de carga: ignora modelos desmontados, canvas desconectados y contextos perdidos. Los controles de giro se habilitan al terminar la carga.
- Se mantiene el póster y el reintento ante errores reales; los mensajes sirven tanto en local como en un despliegue estático.

### Evidencia técnica

| Comprobación | Resultado | Límite |
|---|---|---|
| TypeScript y build de producción | Correctos | No ejecutan interacciones de navegador |
| Pruebas de lógica | 14 correctas, menos de un segundo de ejecución del runner | Incluyen autoload, distinción de gestos, geometría inválida, contexto, comercio y búsqueda; no simulan GPU |
| GLB | Cabecera v2, longitud, bufferViews y límites geométricos válidos; 1.830.944 bytes, 20.000 triángulos y 3 imágenes incrustadas | No evalúa materiales, orientación ni calidad visual |
| Recursos HTTP | 14 rutas entregan HTML de SPA; GLB y WebP correctos | El 200 de una ruta no acredita el comportamiento de React |
| Git diff --check | Correcto | Comprobación de formato |

La conexión local fue bloqueada en el entorno restringido; la comprobación HTTP se completó con permiso para acceder a 127.0.0.1, sin abrir navegador. El script usa un servidor temporal que se cierra al finalizar y actualiza docs/http-report.json.

Vite mantiene la advertencia de chunks superiores a 500kB. No se ha medido LCP, INP, CLS, FPS ni memoria GPU. Los cambios de este paso no certifican una mejora de rendimiento medida.

### Pendiente para cerrar la aceptación visual

Sin ejecutar por instrucción del usuario: comprobación en 390/820/1440 y anchos intermedios; teclado y tacto reales; carga y reintento en WebGL; orientación/materiales del modelo; paso de imagen a 3D; scroll con dedo; pausa/reactivación de pestaña; movimiento reducido y zoom de texto. Tampoco se han realizado capturas.

Estado: implementación y comprobaciones técnicas del paso 4 completadas; validación visual y de dispositivos pendiente. Los pasos 5 y 6 continúan reservados para el final.
