# Animaciones avanzadas — 26 de octubre de 2026

Implementación solicitada sobre la web existente. Se reutilizan Motion, Three.js y React Three Fiber; no se añaden dependencias. La especificación original permanece en SPEC.md.

## Dónde aparece cada técnica

| Técnica | Ubicación y comportamiento | Alternativa |
|---|---|---|
| Scrollytelling, pinning y scrubbing | `/nosotros`, «Lo que el tiempo deja»: tres capítulos en una pista horizontal ligada al scroll nativo; sección de 220 svh, navegación directa por capítulo, progreso y enlace para saltar. | Lectura vertical en pantallas menores de 1024 px, alturas menores de 720 px o movimiento reducido. |
| Tipografía dividida | Titular de portada y títulos del relato: entrada por letras con retrasos acotados. La frase completa se conserva para lectura accesible. | Texto inmediato con movimiento reducido. |
| Shared layout / FLIP | Imagen y nombre conservan identificadores por vino entre tarjetas y ficha. Resortes para desplazamiento y escala; reorganización del catálogo existente. Se omite la cortina en portada, colección y fichas para que no tape la continuidad. | Sin identificadores compartidos en movimiento reducido. La ficha funciona con acceso directo. |
| Shaders / DOM-to-WebGL | Fotografía de barricas en portada y fotografía principal de `/nosotros`. Plano texturizado alineado con el marco DOM, recorte cover, refracción cálida cerca del puntero y deformación acotada según velocidad de scroll. | Imagen HTML y descripción presentes siempre; efecto desactivado con puntero grueso, ancho menor de 1024 px, movimiento reducido o fallo gráfico. |
| Springs / Magnetic UI | Contenido de botones y enlaces CTA atraído hasta 4–7 px hacia el puntero, presión elástica, galería con resortes y apertura elástica del menú. | Área clicable y foco fijos. Magnetismo solo con ratón/puntero fino; movimiento reducido mantiene contenido estable. |
| Cámara 3D | La cámara de la botella en portada describe una órbita suave y acercamiento según el scroll del hero. Arrastrar o usar flechas pasa a vista libre; «Seguir recorrido» recupera la cámara guiada. | En móvil y modo reducido se mantiene la cámara frontal y los controles manuales. |

## Modelo en colección

La tarjeta Gran Reserva de `/coleccion` incorpora el visor con carga al entrar en pantalla y controles fuera de enlaces. La imagen del visor participa en la transición compartida hacia la ficha. Blanco de Parcela y Rosado de Ladera conservan sus ilustraciones: el único GLB aportado corresponde a la botella conceptual de Gran Reserva.

Con movimiento reducido, el GLB se carga al solicitar la inspección. «Ver imagen» desactiva la carga automática hasta que se vuelva a pedir el 3D; el scroll ya no la reactiva.

## Ciclo de vida y coste

- Visores diferidos. Los fotográficos se crean al entrar en pantalla y solo en dispositivos habilitados.
- Render bajo demanda; fuera de pantalla o con la pestaña oculta, `frameloop="never"`. No hay una animación GPU continua cuando todo está en reposo.
- Densidad de píxeles máxima 1,25 para fotografías y 1,5 para la botella.
- Suscripciones con limpieza al desmontar y tratamiento de fallos reales. Un fallo del shader deja visible la fotografía original.
- El timeout de la botella solo corre mientras el visor está visible; no confunde una pausa fuera de pantalla con una carga bloqueada.
- Los eventos de scroll actualizan Motion Values o uniforms; el capítulo activo solo cambia de estado al cruzar de capítulo.

## Validación y límites

Se realizó comprobación TypeScript y build durante la integración. La pasada final tras añadir el modelo a colección se registra en VALIDACION.md.

Por instrucción del usuario no se abrió ni se comprobó visualmente el sitio. No se midieron FPS, coste GPU ni dispositivos. La compilación de GLSL en el controlador del navegador y la apariencia final requieren comprobación posterior; el build de TypeScript/Vite no valida el shader en una GPU.
