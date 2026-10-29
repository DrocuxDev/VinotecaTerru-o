# TERRUÑO & CO.

Trabajo final grupal: frontend de una vinoteca en React, TypeScript y Tailwind CSS, con 13 vistas, botella 3D, colección, cava y recorrido de pedido. La guía original está en [SPEC.md](SPEC.md); alcance y avance en [docs/ALCANCE-FRONTEND.md](docs/ALCANCE-FRONTEND.md) y [docs/AVANCE.md](docs/AVANCE.md).

La interfaz presenta el trabajo con lenguaje de producto. La implementación actual ejecuta catálogo, validaciones y confirmación en el cliente; los formularios no tienen envío externo y el pedido permanece en memoria. El cambio de textos no implementa un servidor ni procesamiento de pagos. Los registros históricos siguientes conservan el vocabulario y las mediciones de su fecha.

## Arranque

Requiere Node.js 22.12+ y npm. Se utilizó Node.js 24.18.0.

```sh
npm ci
npm run dev
```

Abre la URL que imprime Vite. El proyecto está en `C:\Users\USER\Desktop\terruno-co`.

```sh
npm run build
npm test
npm run preview
```

El build incluye TypeScript estricto. Las cinco pruebas de lógica tardaron menos de un segundo; no se instaló navegador de pruebas. `dist/` contiene el sitio estático. Para hosting se necesita fallback SPA a `index.html`; se incluye `public/_redirects` para servidores compatibles. No se ha publicado.

## Rutas y comportamiento

- `/`: hero con tu imagen y modelo 3D, colección espacial, historia, métricas del prototipo, catas, cita editorial, club y formulario local de newsletter.
- `/coleccion`: búsqueda por nombre con `q` en URL, filtros por tipo, región, añada y precio; ordenación; parámetros de URL y estado sin resultados. Dos columnas en tablet y filtros en panel hasta escritorio amplio.
- `/vino/:slug`: fichas de `gran-reserva`, `blanco-de-parcela` y `rosado-de-ladera`, cantidad, añadir a cava, ficha técnica y galería. El visor real está en Gran Reserva. Otros slugs muestran 404.
- `/catas`: agenda compartida con inicio, filtro por región, detalle, asistentes, reserva/lista de espera ilustrativas y confirmación local.
- `/club`: selección de tres planes por URL, comparación legible en móvil, beneficios, funcionamiento, FAQ y adhesión local.
- `/nosotros`: relato editorial, selector Ica/Majes con fotografía y croquis, capas del tiempo y enlaces de visita.
- `/contacto`: formulario validado, regiones, FAQ y explicación de privacidad.
- `/checkout/datos`, `/checkout/entrega`, `/checkout/pago`: pasos con guardas, datos en memoria, costes consistentes y método de pago ficticio sin tarjeta.
- `/pedido-confirmado`: snapshot de cantidades, precios, entrega y total con identificador DEMO. La cava se vacía al finalizar; no se envía correo.
- `/carrito-vacio`: recuperación y recomendaciones; si ya hay selección, permite abrirla.
- Ruta desconocida: 404 con recuperación. `/checkout` redirige a datos.

Herramientas de desarrollo: `/fundaciones` y `/prototipos`.

## 3D e imagen

El GLB aportado en Descargas se conserva intacto. `public/models/terruno-bottle.glb` es una copia optimizada: **20.000 triángulos, 1.830.944 bytes**, frente a 175.526 triángulos y 6.349.644 bytes del original. Conserva las texturas incrustadas; no se evaluó visualmente el resultado.

La imagen aportada por el usuario es el póster del hero y representa Gran Reserva en la demo. Se conserva una copia PNG en `source-assets/` y se sirven dos WebP; la versión mayor pesa **46.318 bytes**. No se generaron imágenes con IA en esta implementación. Los otros dos vinos usan ilustraciones SVG conceptuales propias.

Three.js y React Three Fiber se cargan en un chunk separado. El hero pinta primero texto e imagen; el visor se activa después solo en escritorio con puntero fino, si está visible, la pestaña está activa y no se solicita movimiento reducido. En celular y tablet se abre mediante el botón de inspección. Con movimiento reducido la inspección requiere una acción explícita. El botón de la ficha de Gran Reserva abre directamente el modelo. Hay controles de giro y arrastre horizontal, render bajo demanda, pausa fuera del viewport/pestaña y fallback a imagen ante carga lenta o error. No hay giro automático ni recursos HDR remotos.

El chunk 3D diferido genera la advertencia de tamaño de Vite (aprox. 252,55 KB gzip). La aplicación inicial sin ese chunk pesa aproximadamente **159,29 KB gzip**, dentro del presupuesto previsto. No son mediciones de FPS, LCP, INP o CLS.

## Estado y privacidad

La cava usa reducer/contexto y `localStorage` con esquema v1. Solo persiste identificadores y cantidades. Los precios siempre salen del catálogo. Las cantidades admiten de 1 a 99 unidades por pieza.

Los campos personales y el pedido se conservan solo en memoria. La recarga borra la sesión del checkout; las guardas recuperan al primer paso válido. Las reservas, contacto, newsletter y adhesión al club terminan en una confirmación de demostración sin transmitir datos. La preferencia visual de movimiento sí puede persistir.

Los overlays comparten un proveedor y un diálogo nativo: fondo inerte, Escape, scroll bloqueado y retorno al disparador. Las rutas anuncian su título y mueven el foco al encabezado. El modo reducido responde a la preferencia del sistema.

## Contenido provisional

Nombres de los tres vinos, marca y frase de hero proceden del plan. Precios, añadas, fechas, cupos, regiones por vino y planes son **ilustrativos**, señalados en la interfaz y centralizados en `src/data/catalog.ts`. No se inventaron notas de cata, premios, direcciones, teléfonos o testimonios de clientes. La cita de portada se identifica como editorial conceptual.

Las fotografías locales de Unsplash son imágenes de ambiente y no representan las instalaciones de TERRUÑO ni parcelas peruanas verificadas. Procedencia, licencia y recursos faltantes: [docs/RECURSOS.md](docs/RECURSOS.md).

## Validación y pendientes

TypeScript, build de producción, cinco pruebas de lógica y comprobación HTTP de rutas y recursos: ver [docs/VALIDACION.md](docs/VALIDACION.md).

Por instrucción del usuario no se abrió navegador, Figma ni visor de imágenes; no hay capturas ni validación visual. Siguen pendientes los criterios de calidad de los efectos, geometría optimizada, responsive real, teclado/tacto, lectores de pantalla y rendimiento. Las 39 combinaciones visuales del plan no están acreditadas.

Para cerrar el plan: aprobar el contenido comercial, revisar el aspecto en 390/820/1440 y anchos intermedios, ejecutar los recorridos y perfiles de H. La publicación y cualquier conexión a servicios se deciden por separado.

## Arquitectura

`src/app`: router, layout y proveedor de overlay. `src/features`: cava y sesión de checkout. `src/data`: catálogo, contratos, lógica pura y validación. `src/components`: UI, editoriales, navegación, formularios, productos y visor. `src/motion`: política, transiciones y laboratorio. `src/styles`: tokens y composición responsive. `tests/`: cinco pruebas de lógica sin navegador.

Scripts opcionales de preparación (los activos listos ya están incluidos; no se ejecutan durante el build):

```sh
node scripts/prepare-model.mjs "RUTA_AL_ORIGINAL.glb"
node scripts/prepare-bottle-image.mjs
node scripts/prepare-photos.mjs
node scripts/prepare-posters.mjs
node scripts/http-smoke.mjs
```

Referencias técnicas: [Tailwind con Vite](https://tailwindcss.com/docs/installation/using-vite), [Motion](https://motion.dev/docs/react-layout-animations), [React Router](https://reactrouter.com/), [React Three Fiber y render bajo demanda](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## Vista previa temporal de movimiento

Con el servidor de desarrollo, abre `http://127.0.0.1:5174/?previewMotion=full` para forzar temporalmente el nivel completo, incluso si el sistema solicita movimiento reducido. Se muestra una banda con «Salir y recargar» para volver al comportamiento habitual. No cambia Windows ni guarda el override en localStorage. Se mantiene durante la navegación de esa carga y termina al recargar sin el parámetro. Solo funciona en desarrollo; el build de producción respeta el sistema.

Este modo permite el movimiento y la carga automática del GLB, pero no habilita WebGL si el navegador no puede crear un contexto gráfico. Para el 3D sigue siendo necesario abrir el sitio en un navegador con WebGL disponible.


## Ajustes del laboratorio: paso 3

La navegación incorpora «Buscar» y el atajo Ctrl+K / Cmd+K. El atajo no se intercepta al escribir en campos ni al tener otro diálogo abierto. El diálogo permite abrir una ficha o enviar la búsqueda a la colección. En la colección, la búsqueda actualiza `q` y combina los filtros; ignora tildes, mayúsculas y espacios adicionales. Escape cierra el diálogo mediante el overlay compartido.

Cava, checkout y confirmación usan PurchaseTotals para compartir el cálculo y presentación de importes. La entrega y el total esperan confirmación de modalidad. Los precios incluyen IGV ilustrativo: base + IGV = total, sin sumarlo de nuevo. Ejemplo: Gran Reserva + Blanco de Parcela = S/330; entrega = S/20; total = S/350, base = S/296.61, IGV = S/53.39. La confirmación muestra los datos y dirección de ejemplo del pedido en memoria.

TypeScript, build y 11 pruebas de lógica correctos tras estos ajustes. La revisión de interacción en navegador y la comprobación visual siguen pendientes. Vite mantiene la advertencia de tamaño de chunks.


## Dirección editorial del frontend

El refinamiento iniciado en el buscador se extendió a los componentes compartidos y las páginas comerciales. Las decisiones y referencias están en [docs/DISENO-SISTEMA.md](docs/DISENO-SISTEMA.md) y [docs/DISENO-BUSCADOR.md](docs/DISENO-BUSCADOR.md). Se conserva la identidad de TERRUÑO y sus recorridos. La nueva dirección local aún debe reconciliarse con el archivo Figma cuando vuelva a estar disponible. La calidad visual y el responsive real no se han comprobado en navegador.


## Ajustes del laboratorio: paso 4

Revisados por código los tamaños de catálogo y controles, el header móvil, los campos, los paneles y el sticky en pantallas bajas. El visor distingue desplazamiento vertical de giro horizontal, pausa el render fuera de vista y al ocultar la pestaña, y permite repetir una carga fallida sin reutilizar el error del loader. El póster permanece disponible como alternativa.

Validación técnica: TypeScript, build, 14 pruebas rápidas, estructura del GLB y recursos/rutas HTTP. La validación visual, WebGL real, teclado/tacto y perfilado siguen pendientes. Véase [docs/VALIDACION.md](docs/VALIDACION.md). La preparación de Vercel y de la entrega continúa reservada para el final.

## Despliegue en Vercel

Configuración preparada en vercel.json: Vite, npm ci, npm run build, salida dist y fallback para rutas de React. El despliegue aún no se ha realizado. Guía paso a paso en [docs/DESPLIEGUE-VERCEL.md](docs/DESPLIEGUE-VERCEL.md).
