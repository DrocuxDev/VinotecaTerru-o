# Recursos — 26 de octubre de 2026

## Aportados por el usuario

| Recurso | Uso y proporción | Preparación y procedencia |
|---|---|---|
| `public/models/terruno-bottle.glb` | Visor conceptual real en hero y Gran Reserva | Original `wine bottle 3d model.glb` de Descargas, generado por el usuario con Tripo. Se optimiza copia; original intacto. 20.000 triángulos / 1.830.944 bytes. Texturas JPEG/PNG originales incrustadas conservadas. |
| `source-assets/terruno-bottle.png` | Fuente de la imagen principal, 1152 × 1536 (3:4) | Copia de `Meshy_AI_Terruno_Wine_Bottle_Concept.png`, proporcionada por el usuario. 1.879.640 bytes. No se generó ni rediseñó en esta entrega. |
| `public/images/terruno-bottle.webp` | Hero, fallback 3D y producto conceptual Gran Reserva. 1000 px de ancho, 3:4 | Conversión/redimensionado de la imagen del usuario; 46.318 bytes. Alt: botella conceptual TERRUÑO, etiqueta crema y cápsula burdeos. |
| `public/images/terruno-bottle-500.webp` | Variante responsive de la misma imagen, 500 px de ancho | Mismo origen y diseño. |

No se acredita que la botella conceptual corresponda a un producto comercial concreto. Los otros dos vinos tienen representaciones SVG propias. La referencia original del GLB es externa al proyecto, pero el modelo optimizado está incluido y el build no depende de Descargas.

## Fotografía de ambiente local

Las imágenes de stock no representan la bodega TERRUÑO ni sus viñedos. Se identifican como referencias en la interfaz y se sirven localmente. Versiones de 800/1600 px, WebP, recorte CSS `cover`; no se revisaron visualmente.

| Archivo base | Autor / fuente | Tamaño 800 / 1600 |
|---|---|---|
| `vineyard` | Spencer DeMera — https://unsplash.com/photos/vineyard-rows-bathed-in-warm-golden-hour-sunlight-IKMOdY6zB8w | 97.752 / 281.334 bytes |
| `cellar` | Jametlene Reskp — https://unsplash.com/photos/a-bunch-of-wine-barrels-lined-up-in-a-cellar-nCqucqW7DAo | 141.780 / 527.034 bytes |
| `landscape` | Sophie Gerrie — https://unsplash.com/photos/vineyard-rows-with-new-growth-at-sunset-RCPFjWlv-Oo | 77.194 / 240.212 bytes |

Licencia indicada por las páginas consultadas: https://unsplash.com/license. La procedencia también está en `photos.json`. Ninguna fotografía se presenta como una ubicación exacta de Ica o Majes.

## Ilustraciones y fuentes

- `public/images/gran-reserva.svg`, `blanco-de-parcela.svg`, `rosado-de-ladera.svg`: ilustraciones geométricas creadas por código para la demo, 600 × 800, 3:4, con colores y etiquetas propios. Gran Reserva usa actualmente la imagen aportada por el usuario; su SVG queda como fuente alternativa.
- `public/assets/bottle-study.svg`: muestra geométrica inicial, 600 × 800. Fallback de imágenes de producto ausentes.
- Croquis de regiones: dibujo editorial SVG propio, sin coordenadas reales.
- Cormorant Garamond 400 normal/italic, Inter 400/500 y JetBrains Mono 400: paquetes Fontsource locales con licencia SIL OFL incluida en `node_modules/@fontsource/*/LICENSE`; fallback tipográfico y carga swap.
- Flechas y numeración son texto o trazos propios. Las copias decorativas se excluyen del árbol accesible.

## Faltantes antes de una versión comercial

Fotografías de los vinos reales, perspectivas/etiquetas propias de cada producto, instalaciones, experiencias, parcelas y sedes verificadas. Fotografías repetidas de ambiente se documentan como reutilización provisional. Faltan también las fichas comerciales y técnicas aprobadas. Ninguno de esos faltantes se presenta como confirmado.
