# TERRUÑO & CO. — Plan maestro de diseño e implementación

React + TypeScript + Tailwind CSS. Experiencia editorial, responsive y espacial.

**Estado:** propuesta de diseño y plan de ejecución. Las decisiones creativas de movimiento que siguen son nuevas; no se presentan como animaciones ya verificadas en Figma. Este documento no acredita que el sitio esté implementado.

**Referencia:** https://www.figma.com/design/iQXggvnOlFp1JeEQFppT11/Sin-t%C3%ADtulo?node-id=33-3

## 1. Resultado que se quiere construir

Una bodega que se experimenta como un archivo vivo del tiempo: el usuario recorre piezas, descubre capas y conserva la continuidad de los objetos entre las pantallas. La sensación futurista nace de la profundidad, las transformaciones y la precisión de respuesta.

La dirección mantiene fondos casi negros y ciruela, tipografía crema, acentos dorados y botones burdeos. Cormorant Garamond conserva la voz editorial; Inter organiza la lectura y JetBrains Mono identifica cosechas, regiones y datos. Las fotografías cálidas siguen siendo el vínculo material con el vino.

La experiencia debe resultar extraordinaria desde el primer recorrido y comprensible al comprar, reservar o consultar información. El visitante siempre identifica dónde está, cómo avanzar y cómo volver.

La sofisticación se concentrará en tres gestos reconocibles:

1. **La botella continua:** una misma pieza visual conecta colección, ficha y cava.
2. **Las capas del tiempo:** origen, vendimia y crianza aparecen como planos que se descubren al recorrer la página.
3. **La apertura espacial:** el menú, las galerías y ciertos cambios de página se abren con perspectiva y máscaras de precisión.

El resto de movimientos acompaña esos gestos. Una pantalla no debe reunir todos los recursos a la vez.

## 2. Alcance y límites del prototipo

Se construye el frontend visual completo de las 13 vistas. Incluye navegación, filtros locales, ordenación, galería, selector de planes, formularios con validación, carrito de demostración y checkout simulado.

Las catas y el contacto terminan con una confirmación explícita de demostración. El checkout usa datos ficticios y nunca necesita números de tarjeta reales. El pedido confirmado representa el resultado de esa simulación. Se conservarán textos y precios suministrados, distinguiendo los ejemplos de información confirmada.

El trabajo de este plan comprende proyecto, componentes, recursos, animaciones, comportamiento responsive, documentación y validación. La publicación o conexión con servicios se decide por separado.

Antes de implementar, se verifica el estado actual del diseño. El último estado conocido era: 13 vistas de tablet adaptadas, 9 de móvil adaptadas y cuatro vistas móviles pendientes. Las anteriores adaptaciones también necesitan revisión. El usuario ya ordenó las filas del lienzo.

Si sigue bloqueado el acceso a Figma, se trabaja con las referencias y exportaciones disponibles, registrando qué medidas, imágenes y detalles siguen sin comprobarse. Una composición recordada no equivale a una reproducción exacta.

## 3. Arquitectura de información

| Vista | Ruta propuesta en React | Propósito | Acción principal |
|---|---|---|---|
| Inicio | / | Presentar marca, colección y experiencias | Explorar colección |
| Colección | /coleccion | Explorar y filtrar vinos | Ver vino / añadir a cava |
| Ficha del vino | /vino/:slug | Comprender y seleccionar un vino | Añadir a cava |
| Catas | /catas | Explorar experiencias | Abrir reserva de demostración |
| Club | /club | Comparar suscripciones | Seleccionar plan |
| Nosotros | /nosotros | Explicar origen y elaboración | Explorar regiones / visitar |
| Contacto | /contacto | Consultar ubicación y contactar | Enviar formulario de demostración |
| Datos | /checkout/datos | Iniciar selección de compra | Continuar a entrega |
| Entrega | /checkout/entrega | Elegir modalidad y dirección | Continuar a pago |
| Pago | /checkout/pago | Revisar resumen y simular finalización | Finalizar demostración |
| Confirmación | /pedido-confirmado | Mostrar resultado del recorrido | Seguir explorando |
| Cava vacía | /carrito-vacio | Recuperar la exploración | Ver colección |
| Error | Ruta no encontrada | Recuperar la navegación | Volver al inicio |

/checkout puede redirigir a /checkout/datos; no se cuenta como una pantalla adicional.

La cabecera comparte Colección, Catas, Club, Nosotros, Contacto y Cava. El logotipo vuelve al inicio. Cava abre el panel de selección si contiene elementos; si está vacía, conduce al estado correspondiente.

La ficha usa una plantilla por slug. Gran Reserva, Blanco de Parcela y Rosado de Ladera comparten estructura y tienen datos e imágenes propios. Solo se habilitan productos cuyo contenido se haya preparado; un slug inexistente muestra 404.

PC, tablet y móvil utilizan el mismo árbol semántico y la misma fuente de datos. Se modifica la composición por ancho disponible, no se mantienen tres copias independientes del producto.

## 4. Lenguaje de composición

### 4.1 Espacio

- Eje editorial asimétrico: texto y producto ocupan pesos diferentes pero se relacionan por alineaciones constantes.
- Espacio negativo como marco de la botella y de la lectura.
- Marcos de imagen con proporciones explícitas, evitando alturas arbitrarias.
- Líneas finas que conectan encabezados, índices y cambios de capítulo.
- Superposiciones solo en áreas escenográficas delimitadas. Ningún solapamiento decorativo invade precios, formularios o controles.
- Una sección densa se sigue de otra más abierta; el ritmo evita una secuencia interminable de tarjetas idénticas.
- Los capítulos narrativos pueden ocupar un viewport; catálogo y formularios crecen con su contenido.

### 4.2 Materialidad

Fotografía de vidrio, piedra, papel, madera y luz cálida. Sombras amplias y discretas indican separación de planos. La refracción aparece solo en detalles escenográficos. Las superficies de lectura mantienen suficiente opacidad.

### 4.3 Profundidad

Tres planos habituales: ambiente, objeto y contenido. El objeto puede avanzar o cambiar de encuadre; el texto permanece legible. Las distancias aparentes no implican recorrer metros de scroll.

La perspectiva se aplica a envoltorios escenográficos. Los campos y párrafos no se deforman ni giran.

## 5. Sistema de diseño y Tailwind

### 5.1 Tokens iniciales

Valores orientativos hasta comprobar el archivo y el contraste real:

| Token | Propuesta | Aplicación |
|---|---|---|
| background | #100D0F | Fondo principal |
| surface | #191316 | Secciones alternas |
| surface-raised | #241C20 | Paneles y tarjetas |
| text-primary | #F2E9DA | Títulos y contenido principal |
| text-secondary | #C6BCAE | Descripciones |
| accent | #C7A15A | Índices, detalles y estado seleccionado |
| action | #7B223B | CTA principal |
| border | #51434A | Separación; ajustar según uso |

La paleta se centraliza con variables CSS y se expone a Tailwind. Los colores de estado también tienen texto o icono, evitando depender únicamente del color.

Escala de separación: 4, 8, 12, 16, 24, 32, 48, 64, 96 y 128 px. Los casos intermedios deben responder a una necesidad concreta, no a ajustes aislados por pantalla.

Radios: 0–4 px para composición editorial; 8–12 px para elementos utilitarios cuando ayuden a distinguir controles. Se evita redondear todos los contenedores por defecto.

Capas: contenido 0; cabecera 30; controles flotantes 40; transición de rutas 50; drawer 60; diálogo 70; avisos 80. Se revisarán los contextos de apilamiento creados por transformaciones.

### 5.2 Tipografía

- Cormorant Garamond Regular e Italic para titulares, citas y cifras editoriales.
- Inter Regular y Medium para lectura y controles.
- JetBrains Mono Regular/Medium para vendimia, numeración y metadatos.
- Fuentes WOFF2 locales cuando la licencia y los recursos disponibles lo permitan.
- Texto general de 16–18 px; formularios de al menos 16 px.
- Etiquetas de 11–13 px; no usar metadatos pequeños para información necesaria.
- Hero con clamp: aproximadamente 48–128 px según ancho y longitud.
- Encabezados de sección: aproximadamente 36–72 px.
- Anchura de lectura habitual: 45–70 caracteres, con ajustes para las citas.
- Interlineado editorial ajustado sin recortar ascendentes o descendentes.

La división de titulares para animarlos respeta palabras y líneas reales. La etiqueta accesible conserva la frase completa; las copias decorativas quedan fuera del árbol accesible.

### 5.3 Reglas de Tailwind

Tailwind define retícula, espaciado, tamaños, estados y adaptaciones. Las animaciones complejas se centralizan en Motion y CSS específico. Los componentes no acumulan lógica temporal en cadenas de clases.

Los valores que cambian en cada frame pasan por Motion Values o variables CSS. Se evita construir nombres de clases dinámicos que el compilador no pueda detectar.

Se usarán variantes de foco visible, movimiento reducido y capacidad de hover. Los cambios locales de tarjetas pueden usar container queries; la navegación global responde a la anchura de ventana. Estas capacidades están descritas en [estados de Tailwind](https://tailwindcss.com/docs/hover-focus-and-other-states) y [diseño responsive de Tailwind](https://tailwindcss.com/docs/responsive-design).

## 6. Responsive y paridad

| Contexto de referencia | Retícula | Márgenes iniciales | Vinos por fila | Comportamiento |
|---|---|---|---|---|
| 360–430 px | 4 columnas | 20–24 px | 1 | Lectura vertical, gestos opcionales |
| 768–1023 px | 8 columnas | 32–40 px | 2 | Composición intermedia completa |
| 1024–1439 px | 12 columnas | 40–64 px | 3 si cabe el contenido | Columnas ajustadas por capacidad |
| 1440 px y superior | 12 columnas | 64–80 px o margen fluido | 3; 4 solo si la tarjeta mantiene calidad | Contenedor editorial con máximo definido |

Estos rangos son puntos de partida. Se probarán también anchos intermedios; el salto de layout se decide por contenido.

En tablet se conservan todos los productos, beneficios, filtros, catas, enlaces y pasos de compra. Los filtros pueden pasar a un panel lateral temporal. En móvil, las columnas se apilan manteniendo un orden semántico consistente.

La cabecera pasa a menú compacto cuando ya no caben todos los enlaces con áreas táctiles adecuadas. Se conserva Cava y su contador.

El panel de compra de la ficha puede ser sticky en escritorio. En móvil se admite una barra inferior con nombre abreviado, precio y CTA, compensando safe-area y sin cubrir el último contenido. Se oculta al abrir el teclado o se recoloca para permitir la edición del formulario.

No se utiliza overflow-x:hidden global para ocultar errores de ancho. Las escenas recortan únicamente su decoración; los contenedores de contenido deben caber por sí mismos.

## 7. Sistema de movimiento

### 7.1 Jerarquía temporal

| Tipo | Duración inicial | Uso |
|---|---|---|
| Respuesta inmediata | 100–180 ms | Presión, foco, confirmación de selección |
| Microinteracción | 180–280 ms | Subrayados, iconos y cambios pequeños |
| Contenedor | 280–420 ms | Acordeón, filtros, drawer |
| Continuidad de objeto | 420–650 ms | Tarjeta a ficha, galería a ampliación |
| Cambio editorial | 500–750 ms | Transición entre capítulos o rutas principales |
| Entrada narrativa inicial | Hasta 900 ms | Hero una vez que el contenido está disponible |

Las salidas normalmente duran menos que las entradas. Los retrasos entre elementos serán de 35–60 ms, con un máximo de cinco grupos secuenciales visibles. Una cuadrícula larga no se presenta tarjeta por tarjeta durante varios segundos.

Las curvas de desplazamiento tendrán frenado progresivo. Los controles de compra tendrán amortiguación firme. Los valores de spring se ajustan en el prototipo y no se tratan como equivalentes exactos de una duración fija.

### 7.2 Propiedad de las animaciones

- CSS: estados simples, subrayados y decoraciones repetibles.
- Motion: montaje, salida, gestos, continuidad entre elementos y coordinación.
- React Three Fiber: cámara, iluminación y objeto 3D cuando exista un recurso apropiado.
- Un elemento transformable tiene un único controlador. Si necesita profundidad y transición de layout, se separan en envoltorios.
- El router controla la navegación; las animaciones no inventan una historia paralela.
- Se priorizan transform y opacity. Las máscaras complejas se limitan a superficies pequeñas o periodos breves y se verifican con profiling.

### 7.3 Escenas con scroll

El documento mantiene scroll nativo. Las escenas leen el progreso de su sección y transforman capas acotadas. El visitante puede avanzar con rueda, tacto, teclado o barra de desplazamiento.

Puede existir una escena sticky de 160–220 svh en escritorio para narrar el origen. En móvil se limita a una secuencia corta o se presenta en bloques de lectura. La imagen y el contenido mantienen valor sin fijación.

No se acumulan tres escenas sticky largas consecutivas. Los enlaces a secciones y el foco se compensan con la cabecera.

### 7.4 Interrupción y concurrencia

Una nueva navegación cancela o sustituye la transición pendiente. Escape cierra el overlay activo. Un drag interrumpido vuelve al estado estable más próximo.

Al volver con Atrás, se recuperan filtros, posición del listado y producto de origen. Las animaciones no impiden la restauración de scroll.

Si la ruta destino tarda, se muestra un estado estable y útil. No se mantiene al visitante atrapado detrás de una cortina esperando un recurso 3D.

## 8. Catálogo de efectos

| ID | Efecto y resultado perceptible | Activación / técnica | Móvil y alternativa | Criterio de aceptación |
|---|---|---|---|---|
| FX01 | Hero que emerge desde una abertura vertical, con botella en un plano distinto al texto | Entrada única; máscara y transform; fondo ya presente | Desplazamiento más corto; modo reducido sin profundidad | Título y CTA legibles antes de completar el gesto |
| FX02 | Botella que conserva continuidad entre tarjeta y ficha | Click en producto; layoutId o capa de transición con medidas | Misma asociación con recorrido más breve | Sin salto de proporción ni doble etiqueta visible |
| FX03 | Luz especular que recorre el vidrio al inspeccionar la pieza | Puntero fino o control de vista; 3D si existe GLB | Vista estática o selector de ángulos | Etiqueta estable y legible; no bloquea la compra |
| FX04 | Capas de origen que se separan como láminas de un archivo | Progreso de sección; SVG, máscaras y planos DOM | Secuencia vertical con controles opcionales | Toda información disponible al detenerse en cualquier punto |
| FX05 | Menú que se abre como dos planos articulados | Botón de menú; perspectiva en envoltorios | Panel a pantalla completa con menor rotación | Foco atrapado, Escape, restauración de foco y scroll |
| FX06 | Galería con panel central y piezas laterales en perspectiva | Flechas, drag o botones de selección | Swipe horizontal compatible con scroll vertical | Se puede alcanzar cada diapositiva con teclado |
| FX07 | Tipografía que se revela por líneas con una leve diferencia de profundidad | Entrada de sección; máscaras de línea | Misma lectura con menor recorrido | La frase completa existe para lectores de pantalla |
| FX08 | Cambio de página que recompone una abertura editorial | Navegación principal; transición coordinada | Wipe corto o fundido | La URL y el contenido destino funcionan sin animación |
| FX09 | Retícula de productos que se reorganiza al filtrar | Estado local y layout animation | Reordenación breve o instantánea | Filtros visibles, conteo correcto y estado vacío claro |
| FX10 | CTA con respuesta de presión y desplazamiento interno del indicador | Hover/focus/press; CSS o Motion | Press; sin requisito de hover | El área clicable permanece fija |
| FX11 | Cava que recibe visualmente una pieza y actualiza su conteo | Añadir; miniatura por overlay decorativo | Recorrido corto o pulso del contador | Datos y anuncio accesible actualizados aunque no haya animación |
| FX12 | Comparación de club cuyo plano activo avanza respecto a los otros | Selección de plan; transform de envoltorio y detalle | Tarjetas apiladas con selección equivalente | Beneficios visibles y plan seleccionado inequívoco |
| FX13 | Ficha técnica que se despliega como una lámina anclada al producto | Abrir panel; layout y clip acotado | Diálogo/panel con lectura vertical | Cierre, foco y scroll interno correctos |
| FX14 | Encuentro editorial de fotografía y mapa durante el cambio de región | Selector Ica/Majes; SVG y crossfade coordinado | Dos pestañas con contenido completo | Ubicación y texto coinciden con la región elegida |
| FX15 | Progreso del checkout que avanza como una línea continua | Paso válido; SVG corto y cambio de panel | Mismo flujo con estructura compacta | Atrás conserva campos y el paso actual es accesible |
| FX16 | Confirmación que ensambla tipografía y resumen del pedido | Finalizar demo; composición por grupos | Entrada simple y lectura inmediata | Se identifica claramente como pedido de demostración |

FX03 depende de recursos. Un efecto de luz sobre una fotografía no se describe como rotación real de una botella. Se reservará para imágenes con recorte adecuado o un modelo 3D disponible.

## 9. Transiciones de navegación

### 9.1 Colección a ficha: secuencia propuesta

- 0–100 ms: respuesta del click y captura del rectángulo del producto seleccionado.
- 80–260 ms: disminuye el peso visual de las tarjetas vecinas; comienza el cambio de composición.
- 120–540 ms: la pieza principal avanza al encuadre de la ficha. La relación de aspecto se conserva.
- 220–600 ms: aparecen nombre, vendimia, región y precio en dos o tres grupos.
- Hasta 650 ms: se estabiliza el layout; foco al encabezado de ficha y anuncio de navegación.

Estos intervalos son una pauta de storyboard, no bloqueos de interacción. Si no existe el elemento de origen —por enlace directo, recarga o Atrás a una página no montada— la ficha entra de manera autónoma.

Se usarán identificadores por producto y por rol: imagen, nombre y precio. Compartir un único identificador entre productos diferentes produciría asociaciones incorrectas.

### 9.2 Ficha a cava

La acción actualiza primero el estado. Una representación decorativa de la botella puede viajar al indicador de Cava, mientras el producto real conserva su posición. El usuario puede añadir varias unidades sin esperar el final de cada recorrido.

Al abrir Cava, el contenido principal pierde protagonismo y un panel muestra artículos, cantidades, subtotal y CTA. Al cerrar, vuelve el foco al control que lo abrió. Si se elimina el último artículo, aparece una recuperación clara y puede visitarse la ruta de cava vacía.

### 9.3 Navegación principal

Se propone una abertura vertical con dos planos. Su superficie mantiene la textura y la paleta de la marca. La siguiente composición aparece alineada al eje editorial anterior.

Entre páginas de contenido, la animación no supera aproximadamente 750 ms. Entre pasos de compra se reduce a 250–350 ms. El checkout evita cambios de perspectiva amplios.

Motion será el motor principal. Sus propiedades layout y layoutId permiten coordinar cambios de composición y elementos compartidos, como documenta [Motion](https://motion.dev/docs/react-layout-animations). La [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) puede evaluarse como mejora progresiva para un caso aislado; no se ejecutan dos motores sobre el mismo cambio de ruta. Se comprueba compatibilidad y se mantiene una alternativa funcional.

## 10. Plan de la página de inicio

### 10.1 Cabecera

Logotipo a la izquierda y enlaces ordenados por navegación. Cava permanece localizable. Al hacer scroll, la cabecera reduce su altura de manera breve; no debe esconderse mientras contiene foco.

Se prepara un estado inicial integrado con el hero y otro sobre superficie sólida cuando cruza contenido. El enlace activo tiene un indicador de posición que se desplaza entre destinos.

### 10.2 Hero “La alquimia del tiempo / en cada copa.”

Distribución de texto dominante y pieza fotográfica con profundidad. El título conserva una composición legible; la segunda frase en cursiva puede cruzar el eje de la primera sin invadir los controles.

La apertura dura como máximo unos 900 ms con contenido listo. El póster del producto ya está pintado; no se retrasa el hero para descargar WebGL. El CTA Explorar colección está disponible desde el inicio.

Se propone una respuesta al puntero de máximo 3–4 grados en escritorio y unos pocos píxeles de desplazamiento entre capas. La zona interactiva queda delimitada a la pieza visual.

### 10.3 Colección destacada

Tres vinos con la misma información que la referencia: imagen, nombre, vendimia, región, descripción y precio. La composición puede ser una vitrina horizontal con tres posiciones y un producto focal.

Se podrán explorar todos mediante controles visibles y navegación por teclado. Las imágenes laterales pueden tener una leve perspectiva; los nombres y precios permanecen sobre un plano de lectura.

En móvil, una tarjeta principal y un indicio de la siguiente, con índice de posición. También se mantiene el enlace Ver toda la colección.

### 10.4 Nuestra historia

Dos bloques de texto y una escena de cava. El paso de fotografía a paisaje se construye como apertura de capas. Se reserva un punto de pausa sin movimiento para leer la historia.

### 10.5 Métricas

Se conservan las cifras del diseño como contenido suministrado; se registra su condición de ejemplo si corresponde. Las cifras pueden entrar por un pequeño desplazamiento vertical. No se inventan cifras de prestigio ni se realizan conteos prolongados.

### 10.6 Próximas catas

La sección usa una única fuente de datos compartida con /catas. Se resolverán discrepancias entre nombres, precios y fechas antes de maquetar. Se proponen filas editoriales con fecha, experiencia, disponibilidad y acción.

### 10.7 Testimonios y prensa

Solo citas suministradas o claramente ilustrativas. Una cita principal y notas secundarias. El cambio de nota se plantea como una hoja que se desplaza en profundidad, sin rotación automática obligatoria.

### 10.8 Club

Una introducción visual al programa y dos beneficios destacados. La fotografía se relaciona con la composición de /club, favoreciendo continuidad al navegar.

### 10.9 Newsletter y pie

Formulario local con etiqueta, email y confirmación de demostración. Pie completo con navegación, experiencias, contacto y enlaces legales solo si existe contenido correspondiente. Los enlaces aún sin destino se resolverán explícitamente.

## 11. Plan de colección

Cabecera editorial con título, introducción y cantidad de resultados. Catálogo con filtros por los atributos presentes en los datos: tipo, región, añada y rango de precio, además de ordenación.

Los filtros se reflejan en parámetros de URL para conservarlos al compartir o volver desde una ficha. El botón de restablecimiento y los filtros activos estarán siempre visibles.

Escritorio: sidebar de aproximadamente 220–260 px y cuadrícula de productos con tarjetas de ancho útil. Tablet: priorizar una cuadrícula de dos productos y abrir filtros en panel temporal; esta decisión corrige el catálogo excesivamente largo y estrecho de la adaptación anterior. Móvil: filtros en drawer y tarjetas completas.

Cada tarjeta incluye imagen de producto consistente, metadatos, nombre, precio y dos acciones distinguibles: abrir ficha y añadir. No se anidan botones dentro de enlaces.

El cambio de filtro reorganiza tarjetas mediante layout, con una duración aproximada de 250–350 ms. La salida de un producto no arrastra a otros fuera de la pantalla.

Estados previstos: inicial, filtros activos, sin coincidencias, imagen ausente, producto no disponible en la demo y carga diferida de recursos. Se muestra una alternativa visual proporcionada cuando falta una imagen.

El panel de estados de diseño que existe en Figma se mantiene en documentación del proyecto; no se traslada como contenido comercial de la colección.

## 12. Plan de ficha del vino

Hero de producto con imagen o visor, denominación, añada, región, variedades y precio. El usuario puede inspeccionar frontal, etiqueta y detalle cuando haya recursos suficientes.

La información se organiza en origen, notas de cata, elaboración, maridaje y ficha técnica. Los datos se toman del contenido aprobado; no se inventan notas enológicas para completar huecos.

La ficha técnica se abre como panel lateral con relación visual al producto. El visor permanece separado del panel de compra para permitir lectura estable.

Acciones: cambiar cantidad, añadir a Cava y abrir la selección. La confirmación de añadido tiene texto, estado accesible y una animación opcional. El contador siempre refleja las unidades reales del estado.

La galería inferior utiliza FX06. La recomendación de vinos reutiliza tarjetas y datos de colección. El regreso al catálogo restaura los filtros y la posición.

En móvil: imagen principal, nombre y precio, información esencial, acción, detalle ampliado y recomendaciones. La barra inferior de compra se limita a los contextos donde aporta utilidad.

## 13. Plan de catas

Hero con fotografía de experiencia y título editorial. Agenda consistente con la portada, con fecha, hora si está disponible, lugar, descripción, precio y aforo suministrado.

Filtros por región o categoría solo cuando los datos lo permitan. Un índice temporal puede desplazar el foco visual entre los encuentros como un selector de capítulos.

Abrir una cata conserva visualmente su título y amplía la información en un panel. El usuario elige asistentes y completa un formulario local. El resultado se identifica como solicitud de demostración.

Estados: disponible, sin cupo ilustrativo, lista de espera ilustrativa, detalle abierto, formulario inválido y confirmación local. No se simula disponibilidad en tiempo real.

La misma interacción funciona con click, Enter y tacto. La información práctica conserva su orden en móvil.

## 14. Plan de club

Hero sobre pertenencia, selección y acceso anticipado. Los planes se presentan como piezas editoriales que comparten estructura.

Al seleccionar un plan, su plano avanza unos pocos píxeles y su borde gana definición. Los demás siguen siendo legibles. Se actualiza una zona de beneficios sin mover el foco del botón seleccionado.

La comparación completa debe poder leerse sin hover. En escritorio puede presentarse como tabla; en móvil, como grupos por beneficio con encabezados persistentes o tarjetas comparables. No se comprime una tabla de cuatro columnas hasta hacerla ilegible.

Secciones: planes, beneficios comparados, funcionamiento, selección de vinos, preguntas frecuentes y acción final. El plan elegido se mantiene al abrir el diálogo de adhesión de demostración.

El contenido del plan —precio, frecuencia y beneficios— se valida para resolver posibles inconsistencias entre los marcos.

## 15. Plan de nosotros

Relato dividido en origen, filosofía, regiones, elaboración y visita. Cada capítulo aporta contenido distinto.

La escena de capas del tiempo se concentra aquí. El visitante recorre una composición de paisaje, trazos del terreno, vendimia y botella. El título de capítulo indica qué está viendo.

El mapa usa SVG o una imagen con puntos interactivos accesibles. Ica y Majes abren su descripción y fotografía correspondiente. No se presenta una ubicación exacta inventada.

La secuencia de elaboración puede combinar un índice sticky corto con imágenes y texto. En movimiento reducido se presenta como una secuencia de bloques sin desplazamiento espacial.

La acción de visita conduce al contenido correspondiente de contacto o a un formulario local claramente definido.

## 16. Plan de contacto

Diseño con información útil desde el comienzo: vías de contacto suministradas, ubicaciones y formulario.

La escena visual toma la forma de un mapa o de dos regiones conectadas por una línea editorial. Al cambiar de región, la fotografía y la dirección se actualizan juntas.

Formulario con nombre, email, motivo y mensaje. Cada campo tiene etiqueta permanente, validación específica y error junto al control. Al enviar, se muestra confirmación local y se informa de que no hubo envío real.

Se preparan estados de foco, completado, error y confirmación. El foco del primer error debe ser visible y no quedar oculto por el teclado móvil.

No se obliga a manipular un mapa para obtener una dirección o un dato de contacto.

## 17. Checkout: datos, entrega y pago

### 17.1 Estructura común

Cabecera simplificada, indicador de tres pasos, formulario principal y resumen. La selección de Cava permanece coherente al cambiar de paso.

Las transiciones son más discretas que en las páginas narrativas: desplazamiento de 12–20 px, cambio de opacidad y avance de línea. No se rota ni se desplaza la interfaz mientras se escribe.

### 17.2 Datos

Nombre, apellidos, email y los campos adicionales realmente necesarios para la demo. Se valida al salir del campo o al continuar, evitando interrumpir cada pulsación.

Si se accede a entrega o pago sin completar requisitos, se vuelve al primer paso necesario con una explicación breve. Con Cava vacía, se conduce al estado vacío.

### 17.3 Entrega

Selector de modalidad, dirección de ejemplo cuando corresponda y resumen de condiciones suministradas. Cambiar la modalidad reorganiza solo la parte dependiente.

Los costes de envío se almacenan como valores de demostración consistentes. El resumen recalcula subtotal y total con enteros en céntimos.

### 17.4 Pago

Resumen, direcciones resumidas, posibilidad de editar pasos anteriores y selección de un método simulado. La acción se etiqueta como finalización de demostración y no requiere credenciales financieras reales.

El estado de procesamiento es local y breve. Se previene la doble finalización del mismo intento. El resultado genera un identificador ficticio y una confirmación de demo.

### 17.5 Recuperación

Atrás conserva los datos mientras dure la sesión. No se guardan datos personales del formulario en localStorage. El carrito sí puede persistir con una versión de esquema.

Los errores no borran la selección. Recargar una ruta profunda mantiene una respuesta clara aunque no exista sesión previa.

## 18. Confirmación, cava vacía y 404

Confirmación: encabezado claro de demostración, identificador ficticio, productos, cantidades, total y próximos pasos ilustrativos. Puede descargar un resumen local si se incluye en alcance; no se denomina factura fiscal.

Cava vacía: composición con ausencia deliberada de la pieza principal, mensaje breve y recomendaciones. La imagen puede ensamblarse suavemente al añadir el primer producto.

404: numeral editorial monumental, una abertura que revela una fotografía de origen y rutas claras para volver a inicio, colección o contacto. El efecto tiene una sola entrada; el visitante no queda atrapado en una escena.

Los tres estados tienen tratamiento propio y comparten el mismo lenguaje de cabecera, acciones y lectura.

## 19. Galerías y diapositivas

La galería se concibe como una vitrina espacial: pieza activa centrada, anteriores y siguientes en planos laterales con una rotación discreta. Las imágenes se desplazan; el control de posición queda estable.

El gesto inicia después de una distancia horizontal suficiente para distinguirlo del scroll vertical. Se admiten drag con puntero, swipe, botones anterior/siguiente y selección directa.

Se propone un asentamiento de 400–550 ms al soltar. La velocidad puede influir en el destino, pero un gesto normal no salta varias piezas inesperadamente.

Se utilizan índices explícitos, como 02 / 05, además de nombres accesibles. El usuario siempre puede acceder a la última imagen. Los elementos fuera de la diapositiva activa no reciben foco accidental.

La rotación automática queda desactivada de inicio. Si se añade, incluye control de pausa, se detiene con foco o hover y solo vuelve a arrancar por decisión del usuario. Esto sigue el [patrón de accesibilidad de carruseles de W3C](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

En movimiento reducido, las imágenes cambian con fundido corto o de inmediato. La información y los controles son los mismos.

## 20. Arquitectura de React

~~~text
src/
  app/
    App.tsx
    router.tsx
    providers/
    layouts/
  pages/
    HomePage.tsx
    CollectionPage.tsx
    WinePage.tsx
    TastingsPage.tsx
    ClubPage.tsx
    AboutPage.tsx
    ContactPage.tsx
    checkout/
    OrderConfirmedPage.tsx
    EmptyCartPage.tsx
    NotFoundPage.tsx
  components/
    ui/
    navigation/
    editorial/
    product/
    cart/
    forms/
  features/
    collection/
    tastings/
    club/
    checkout/
  motion/
    tokens.ts
    presets.ts
    RouteTransition.tsx
    SharedProductTransition.tsx
    MotionPolicy.tsx
    SceneBoundary.tsx
    scenes/
  data/
    wines.ts
    tastings.ts
    plans.ts
    navigation.ts
  hooks/
  styles/
    theme.css
    globals.css
    motion.css
  assets/
  tests/
~~~

Vite sirve como base local y de build. Se fijan versiones compatibles al iniciar el proyecto y se conserva lockfile. Se define un router para las 13 vistas, manejo de rutas inexistentes y restauración de navegación.

Los componentes de contenido reciben datos; los de escena reciben estado y progreso de animación. Las imágenes, precios y nombres no se repiten como constantes dentro de cada página.

El carrito se gestiona con reducer y contexto, suficiente para este alcance. El estado de paneles y modales se coordina para evitar dos overlays activos. Los filtros viven en URL; los campos del checkout en estado de sesión.

Los módulos pesados y páginas secundarias usan importación diferida con límites de Suspense y error. Una escena fallida devuelve una composición útil con póster. La relación entre carga diferida, Suspense y errores está descrita en [React — lazy](https://react.dev/reference/react/lazy).

### Contratos principales

- Wine: id, slug, nombre, añada, región, variedades, descripción, precio en céntimos, imágenes, datos técnicos y estado de disponibilidad de demo.
- Tasting: id, título, región, fecha suministrada, precio, lugar, imágenes y estado ilustrativo.
- ClubPlan: id, nombre, precio, frecuencia y lista de beneficios.
- CartItem: productId y cantidad; el precio se obtiene del catálogo de datos.
- MotionPolicy: preferencia del usuario, preferencia del sistema y nivel de efectos permitido.
- TransitionContext: ruta origen, destino, identificador opcional de producto y modo de navegación.

## 21. Componentes y estados

| Componente | Estados mínimos | Verificación |
|---|---|---|
| Button | normal, hover, focus-visible, pressed, disabled, busy | Área estable y etiqueta clara |
| Header | inicial, scrolled, menú abierto, ruta activa | Ningún enlace inaccesible por ancho |
| ProductCard | normal, foco, hover, añadido, imagen ausente | Nombre y precio siempre legibles |
| FilterPanel | cerrado, abierto, activo, vacío | Restablecer funciona y conserva foco |
| SpatialGallery | reposo, drag, transición, inicio, final | Controles alcanzan todas las imágenes |
| Drawer/Dialog | cerrado, abriendo, abierto, cerrando | Escape, fondo inerte y devolución de foco |
| FormField | vacío, foco, completado, error, deshabilitado | Etiqueta y error asociados |
| Cart | vacío, con artículos, actualización, eliminado | Totales y cantidades consistentes |
| CheckoutStepper | actual, completado, pendiente | Estado accesible y navegación válida |
| Scene | póster, carga, lista, degradada, error | La página funciona sin escena |

Las variaciones visuales se documentan antes de distribuirlas por las 13 rutas. La reutilización debe preservar la flexibilidad editorial.

## 22. Recursos y requisitos de 3D

Se crea un manifiesto con archivo, uso, proporción, recorte, formato, tamaño, licencia/procedencia y texto alternativo. Se identifican recursos repetidos por conveniencia en el Figma y se reemplazan por la imagen correcta cuando esté disponible.

Para una botella 3D real se requieren geometría GLB, UV, etiqueta de calidad, materiales y entorno de iluminación. Su preparación es una tarea de producción independiente. No se supone que existe ese modelo.

Si solo hay fotos, el primer lanzamiento utiliza planos 2.5D, recortes con transparencia y encuadres coherentes. Sigue siendo una experiencia avanzada mediante continuidad, profundidad y composición.

Si existe un GLB aceptable, se valida en un prototipo aislado: etiqueta legible, forma fiel, reflejos contenidos y coste razonable. Después se integra en hero o ficha.

El objetivo inicial del recurso 3D principal es aproximadamente 1–3 MB transferidos, sujeto a calidad real y pruebas. Se limitarán resolución de texturas, geometría y luces según la escena.

Un único canvas activo en la zona visible será el punto de partida. Se detiene el render cuando la escena reposa, sale del viewport o la pestaña no está visible. El canvas es decorativo o tiene controles DOM equivalentes. La configuración de render bajo demanda y su invalidación se apoya en [React Three Fiber — rendimiento](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## 23. Accesibilidad y control del movimiento

Se respeta prefers-reduced-motion y se añade una preferencia visible para reducir efectos. La elección se puede conservar como configuración visual local.

El modo reducido elimina parallax, recorridos amplios, rotaciones y cambios de escala intensos. Conserva indicaciones de selección y estados mediante cambios breves de opacidad o aparición inmediata. [useReducedMotion de Motion](https://motion.dev/docs/react-use-reduced-motion) permite responder al ajuste del sistema.

Objetivo de controles táctiles: 44 px como mínimo de diseño y 48 px para acciones principales cuando el espacio lo permita. El foco visible no depende de sombras poco perceptibles.

Todos los flujos se completan con teclado. Los overlays usan semántica de diálogo, trampa de foco, Escape y retorno al disparador. La navegación anuncia su destino sin duplicar el contenido saliente.

Se evita contenido que parpadee, ruido luminoso de alto contraste y audio automático. El puntero del sistema permanece visible; cualquier indicador especial se limita a una zona y es decorativo.

Texto alternativo, jerarquía de encabezados, enlaces distinguibles y contraste se verifican en la implementación. Los avisos de añadido o error se anuncian con moderación, sin narrar cada frame de animación.

## 24. Rendimiento y alternativas

Los siguientes son objetivos de diseño y validación, no resultados medidos:

| Métrica / recurso | Objetivo inicial | Cómo se comprueba |
|---|---|---|
| LCP | ≤ 2,5 s | Laboratorio bajo perfil documentado; campo cuando haya tráfico |
| INP | ≤ 200 ms | Interacciones medidas; campo al percentil 75 si existe muestra |
| CLS | ≤ 0,1 | Carga, fuentes, imágenes, apertura de paneles |
| Movimiento | Cercano a 60 fps en dispositivos de referencia | Perfil de frame y tareas largas |
| JS inicial sin 3D | Presupuesto de 200–250 KB gzip | Informe del build; revisar coste real |
| Escena 3D | Chunk separado y carga bajo demanda | Red, CPU/GPU y memoria |
| Imagen principal | Dimensiones y peso ajustados al viewport | srcset, formats y waterfall |

Los umbrales de LCP, INP y CLS se apoyan en [Web Vitals](https://web.dev/articles/vitals), que considera el percentil 75 para evaluar la experiencia real. Se establece antes de medir el dispositivo de referencia, navegador, viewport y perfil de red. Una pasada de Lighthouse no acredita el comportamiento de todos los móviles ni métricas reales de campo.

La portada pinta primero texto e imagen principal. No hay pantalla de carga con porcentaje inventado. Las escenas pesadas se descargan después de lo esencial o al acercarse a su zona.

Se generan variantes AVIF/WebP cuando los recursos lo permitan, con dimensiones reservadas y lazy loading para imágenes posteriores. Las primeras imágenes realmente necesarias reciben prioridad explícita.

Los efectos se ajustan por capacidad observada y preferencias, además del tamaño de pantalla. Un móvil potente y un portátil débil pueden necesitar políticas diferentes.

| Nivel | Recursos habilitados |
|---|---|
| Completo | Continuidad de objetos, perspectiva acotada, escena 3D si pasa las pruebas |
| Equilibrado | Mismo contenido, profundidad en DOM, póster o escena simplificada |
| Reducido | Lectura estable, cambios instantáneos o fundidos cortos |

El cambio de nivel no altera productos, información ni navegación. No se convierte la tablet en una versión vacía.

## 25. Gestión de riesgos

| Riesgo | Señal | Respuesta prevista |
|---|---|---|
| Recursos de Figma inaccesibles | Falta exportación o consulta bloqueada | Manifiesto de faltantes y referencia provisional explícita |
| Modelo de botella inexistente | Solo fotografías disponibles | Lanzamiento 2.5D y hito separado para 3D |
| Animación vistosa pero lenta | Coste de frame elevado o INP degradado | Reducir capas, eliminar blur, limitar escena y mantener continuidad |
| Distorsión de texto en layout | Letras estiradas durante una transición | Separar texto de envoltorio y animar posición |
| Desbordamiento de tablet | Tarjetas estrechas, tabla ilegible | Filtros temporales y cambio de presentación por capacidad |
| Interrupción de navegación | Varias rutas en rápida sucesión | Cancelación coordinada y estado estable de destino |
| Pérdida de foco | Foco en elemento saliente | Gestor de foco asociado al router y overlays |
| Inconsistencias de contenido | Precios o experiencias distintos | Fuente de datos única y revisión previa |
| Pérdida de contexto al volver | Listado vuelve al inicio | Estado de filtros y restauración de posición |
| Carga de WebGL fallida | Contexto no disponible o recurso rechazado | Póster útil y controles de contenido en DOM |

## 26. Secuencia minuciosa de ejecución

Cada fase termina con evidencia y un criterio de salida. La implementación de las 13 vistas comienza después de probar los movimientos más arriesgados en una muestra pequeña.

### Fase A — Auditoría y contenido

- A01. Inventariar las 13 rutas y sus equivalencias D/T/M.
- A02. Revisar las cuatro vistas móviles pendientes y registrar las diferencias.
- A03. Crear matriz de secciones por ruta y dispositivo.
- A04. Consolidar productos, precios, experiencias y planes.
- A05. Inventariar imágenes, fuentes, iconos y recursos faltantes.
- A06. Registrar el estado del acceso a Figma y las referencias realmente disponibles.
- A07. Identificar enlaces sin destino y definir su comportamiento de demostración.

**Salida:** inventario y matriz de paridad; no hay rutas esenciales olvidadas ni contenido ficticio presentado como confirmado.

### Fase B — Fundaciones

- B01. Inicializar React, TypeScript, Tailwind y build.
- B02. Definir tokens de color, espacio, tipografía y movimiento.
- B03. Preparar fuentes e imágenes de muestra con proporciones reales.
- B04. Construir retícula y contenedores.
- B05. Crear botones, enlaces, campos y estados de foco.
- B06. Implementar router, layout global y manejo de errores.
- B07. Definir política de movimiento y componentes base de overlay.

**Salida:** un pequeño entorno de componentes verificable en 390, 820 y 1440 px.

### Fase C — Prototipos de riesgo visual

- C01. Hero con imagen, abertura y planos.
- C02. Tarjeta de producto a ficha con continuidad.
- C03. Galería de diapositivas en perspectiva.
- C04. Menú espacial con teclado y tacto.
- C05. Capas del tiempo con scroll nativo.
- C06. Variante reducida de cada prototipo.
- C07. Prueba de 3D solo si existe el recurso necesario.
- C08. Perfil de rendimiento y selección de la variante que pasa.

**Salida:** cinco gestos principales funcionales con alternativas. Se descartan o simplifican los que perjudican lectura, tacto o rendimiento.

### Fase D — Portada y navegación

- D01. Implementar todas las secciones del inicio.
- D02. Conectar cabecera, pie y enlaces de contenido.
- D03. Resolver el ritmo vertical en los tres tamaños.
- D04. Integrar las fuentes de productos y catas.
- D05. Verificar entrada directa y navegación de retorno.

**Salida:** portada completa y navegable con la dirección visual establecida.

### Fase E — Colección, ficha y cava

- E01. Cuadrícula responsive y sidebar/panel de filtros.
- E02. Filtros y ordenación con URL.
- E03. Plantilla de ficha por producto.
- E04. Galería y panel técnico.
- E05. Estado de carrito, cantidades y totales.
- E06. Drawer de cava y estado vacío.
- E07. Continuidad de producto y feedback de añadido.
- E08. Restauración de listado al volver.

**Salida:** recorrido colección → ficha → cava completo con datos de demostración.

### Fase F — Catas, club, nosotros y contacto

- F01. Agenda coherente con inicio.
- F02. Detalle y reserva local de demostración.
- F03. Planes y selección de club.
- F04. Comparación accesible en móvil.
- F05. Relato de origen y mapa.
- F06. Formulario local de contacto.
- F07. FAQ y enlaces entre las cuatro rutas.

**Salida:** todas las páginas informativas y sus interacciones principales están resueltas.

### Fase G — Checkout y estados finales

- G01. Datos y validación.
- G02. Entrega y actualización de resumen.
- G03. Pago de demostración.
- G04. Confirmación coherente con selección y totales.
- G05. Acceso directo a pasos, regreso y recarga.
- G06. Estado sin carrito y 404.
- G07. Pulido del movimiento específico de compra.

**Salida:** flujo de demostración completo, sin acciones reales de pago o envío.

### Fase H — Validación y entrega

- H01. Recorrido visual de las 13 rutas en los tres tamaños de referencia.
- H02. Pruebas de anchos intermedios y orientación.
- H03. Verificación de teclado, foco, lectores de pantalla y movimiento reducido.
- H04. Medición y ajuste de carga e interacciones.
- H05. Corrección de errores observados.
- H06. Build reproducible y revisión de consola.
- H07. Documentar arranque, arquitectura, activos y limitaciones.
- H08. Capturas o grabaciones de los recorridos principales.

**Salida:** proyecto ejecutable, revisión de las 39 combinaciones principales y pendientes explícitos.

## 27. Matriz de validación

Anchuras de referencia: 390, 820 y 1440 px. Anchuras adicionales: 360, 430, 768, 1024, 1280 y 1920 px. Se incluye una prueba con zoom al 200 % y otra con teclado móvil visible.

Navegadores previstos: Chromium, Firefox y Safari cuando exista acceso a ellos. Se distingue una emulación de viewport de una comprobación en un dispositivo real.

Recorridos obligatorios:

1. Inicio → colección → filtrar → ficha → Atrás, conservando contexto.
2. Colección → añadir dos productos → cambiar cantidad → eliminar.
3. Cava → datos → entrega → pago → confirmación de demostración.
4. Acceso directo a pago sin sesión → recuperación válida.
5. Catas → detalle → formulario inválido → confirmación local.
6. Club → comparar → seleccionar → abrir adhesión.
7. Nosotros → región → contacto.
8. Menú con teclado → cambiar ruta → foco correcto.
9. Galería por flechas, drag, swipe y teclado.
10. Repetir lo anterior con movimiento reducido.
11. Desactivar/fallar el recurso 3D → página funcional.
12. Navegar rápido durante una transición → destino correcto y sin overlays bloqueados.

Se añaden pruebas automáticas a lógica de filtros, cálculo de totales, reducer de carrito, guardas de pasos y recorridos críticos. Los detalles de animación se comprueban con revisión visual y perfiles, no con pruebas que simplemente copien valores de duración.

## 28. Definición de terminado

- [ ] Las 13 vistas existen y las rutas profundas cargan correctamente.
- [ ] PC, tablet y móvil conservan secciones, datos y acciones equivalentes.
- [ ] Las cuatro vistas móviles pendientes están resueltas en React.
- [ ] El catálogo de tablet conserva una cuadrícula legible y filtros utilizables.
- [ ] No hay cortes, solapamientos accidentales ni scroll horizontal global.
- [ ] Las fuentes y la identidad de TERRUÑO & CO. están conservadas.
- [ ] Los gestos principales tienen coordinación y propósito.
- [ ] La galería ofrece todos sus controles y estados.
- [ ] El carrito y el checkout local son coherentes.
- [ ] El modo reducido mantiene toda la funcionalidad.
- [ ] Fallar una escena no impide leer o navegar.
- [ ] El proyecto cumple los presupuestos acordados o documenta la desviación medida.
- [ ] Las comprobaciones ejecutadas y las que no pudieron realizarse están registradas.
- [ ] El README permite iniciar y compilar el proyecto desde un checkout limpio.
- [ ] Los activos provisionales y el contenido ilustrativo están identificados.

## 29. Entregables

1. Proyecto React + TypeScript + Tailwind con configuración de desarrollo y producción.
2. Sistema de componentes y tokens.
3. Trece vistas y navegación coherente.
4. Datos locales de demostración y estado de selección.
5. Sistema de movimiento con modos completo, equilibrado y reducido.
6. Galería y transiciones de continuidad.
7. Manifiesto de recursos y referencias.
8. Pruebas de lógica y recorridos esenciales.
9. Evidencia visual y de rendimiento.
10. README con decisiones, límites y tareas futuras.

