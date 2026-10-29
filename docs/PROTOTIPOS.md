> Registro del laboratorio de fase C. Los gestos se integraron después en el sitio y se añadió el GLB del usuario; estado vigente en AVANCE.md. El perfil visual y de rendimiento sigue pendiente.

# Fase C — Prototipos de riesgo visual

Fecha: 23 de octubre de 2026. Laboratorio aislado en `/prototipos` ([PrototypesPage.tsx](../src/pages/PrototypesPage.tsx)); herramienta de desarrollo, fuera del recorrido comercial. Usa piezas geométricas provisionales (`src/components/editorial/Specimen.tsx`), no productos ni precios.

> Restricción vigente: sin navegador, capturas ni inspección visual. Todo lo siguiente está **implementado y compilado**, no comprobado visualmente ni perfilado.

## Prototipos

| ID | Gesto | Archivo | Completo / equilibrado | Reducido (C06) | Puntos a verificar en navegador |
|---|---|---|---|---|---|
| C01 · FX01/FX07 | Hero desde abertura vertical, botella en plano propio, líneas de título | `motion/scenes/HeroScene.tsx` | clip-path de rendija → completo (~680 ms), fondo escala 1,12→1, botella sube; inclinación ±3,5° solo nivel completo + puntero fino; equilibrado = 55 % de amplitud | Fundido 180 ms, sin profundidad ni inclinación | Título y CTA legibles desde el primer frame (opacidad inicial 0,55, nunca 0); coste de clip-path |
| C02 · FX02 | Continuidad tarjeta → ficha | `motion/scenes/ProductContinuity.tsx` | `layoutId` por pieza y rol (imagen, nombre), 540 ms / 420 ms; texto con `layout="position"` para evitar distorsión | Sin layout compartido; fundido 160 ms | Proporción 3:4 sin salto; foco a nombre al abrir y al botón de origen al volver; el cambio de tamaño tipográfico es instantáneo (decisión deliberada) |
| C03 · FX06 | Vitrina con planos laterales | `motion/scenes/SpatialGallery.tsx` | rotateY 32° (19° en móvil), translateZ, escala; muelle ~450 ms; drag con bloqueo de dirección y `touch-action: pan-y`; máx. un paso por gesto | Solo lámina activa, fundido 160 ms; drag, teclado y botones iguales | Flechas, ←/→/Inicio/Fin, índice 01/05 con `aria-live`, láminas no activas `inert`; sin autoplay ni bucle |
| C04 · FX05 | Menú con dos planos articulados | `motion/scenes/SpatialMenu.tsx` | `<dialog>` nativo; planos con bisagra exterior ±78° (35 % en móvil, panel único) | Fundido sin rotación | Escape/Cerrar reproducen salida y luego cierran; foco vuelve al disparador; bloqueo de scroll |
| C05 · FX04 | Capas del tiempo con scroll nativo | `motion/scenes/TimeLayers.tsx` | Escena sticky de 200 svh solo ≥1024 px; tres láminas se levantan por tercios con `useScroll`; índice resalta capítulo | Bloques verticales sin sticky (también en <1024 px) | Los tres textos siempre en el DOM y visibles; ningún scroll-jacking |

Cada prototipo está envuelto en `SceneBoundary`: si falla, se muestra un aviso y la página sigue utilizable.

**C06**: selector de variante en el laboratorio (política global / completo / equilibrado / reducido). Si el sistema pide movimiento reducido, el selector se bloquea en reducido; la preferencia del sistema sigue siendo un suelo.

**C07**: no ejecutado. No existe GLB/UV/materiales; no se instala Three.js. FX03 sigue condicionado.

**C08**: no ejecutado (requiere navegador y profiling). No se ha seleccionado una variante ganadora por evidencia; la tabla anterior es la propuesta a validar.

## Coste en el build

- Chunk diferido `PrototypesPage`: 158,7 KB / **52,4 KB gzip**. Contiene sobre todo los componentes animables de Motion (`motion.*`, layout, drag, scroll), que la entrada inicial no usaba.
- JS inicial sin cambios significativos: 106,8 KB gzip (antes 106,25).
- Previsión para la fase D: si el hero entra en la portada, el JS inicial rondaría ~160 KB gzip, dentro del presupuesto de 200–250 KB. Si hace falta reducir, evaluar `LazyMotion` + `m.*`.

## Riesgos detectados durante la implementación

- Las láminas laterales de la galería son `inert`: no se pueden seleccionar con un clic sobre ellas (se usan flechas e índice). Decidir en E si se permite clic en vecinas.
- El drag de la galería solo se inicia sobre la lámina activa.
- `clip-path` animado en el hero y `rotateX` en capas: candidatos a revisar en el perfil C08 en móviles medios.
- La continuidad C02 es dentro de una misma ruta. La continuidad entre `/coleccion` y `/vino/:slug` (E07) necesita además coordinación con el router y el caso sin origen (enlace directo / Atrás).

## Para cerrar la fase C (requiere autorización de inspección)

1. Recorrer `/prototipos` en 390, 820 y 1440 px con los tres niveles.
2. Teclado y lector de pantalla en galería y menú; tacto real en galería.
3. Perfil de frame en C01, C03 y C05; descartar o simplificar lo que no pase.

