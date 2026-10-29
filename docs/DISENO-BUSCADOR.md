# Dirección de diseño del buscador

Fecha: 28 de octubre de 2026.

## Diagnóstico

La primera implementación resolvía la función con el mismo campo rectangular y botones de los formularios. No diferenciaba la exploración del vino de una solicitud de contacto. El título, el campo y los resultados competían sin una jerarquía propia.

## Dirección elegida

Una carta de bodega que permite encontrar y reconocer una botella. El protagonista es el nombre del vino; la fotografía ayuda a identificarlo y la añada y el precio permiten compararlo. El diálogo muestra una lista y una botella a mayor escala; la búsqueda dentro de colección usa únicamente el campo para no repetir las tarjetas del catálogo.

Paleta del proyecto: tinta #100D0F, cava #191316, papel #F2E9DA, texto secundario #C6BCAE, latón #C7A15A y burdeos #7B223B. Se conserva el fondo oscuro de la marca. El latón señala foco y selección, sin cubrir superficies grandes.

Tipografía: Cormorant Garamond para consulta y nombres; Inter para etiquetas, atributos y acciones. El buscador no añade una tercera familia para sus metadatos. Números tabulares para precios y añadas. Alineación a la izquierda, precios alineados a la derecha.

Distribución del diálogo: título y cierre arriba; campo amplio; lista a la izquierda y fotografía del vino señalado a la derecha. En celular la imagen secundaria se oculta para priorizar campo y resultados. El cierre y el envío permanecen alcanzables con teclado y pantalla pequeña.

## Revisión antes de implementar

Se descartaron tarjetas iguales con sombras, números decorativos, titulares grandilocuentes y etiquetas de lujo. Tampoco se cambian las fuentes de toda la web. La elegancia se busca en proporciones, ritmo y contenido específico. Las líneas separan resultados comparables; la imagen tiene una función de reconocimiento.

## Habilidades consultadas

- frontend-design, Anthropic: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- web-design-guidelines, Vercel: https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md
- Reglas de interacción: https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md

Leídas como referencias para esta tarea; no instaladas globalmente. Las instrucciones existentes del usuario y la identidad del proyecto prevalecen. No se hizo revisión visual.


## Implementación

SearchField comparte el tratamiento del campo entre diálogo y colección. WineSearch presenta resultados con nombre, procedencia, añada y precio; la botella de referencia responde al foco o puntero. Se conservan enlaces nativos hacia la ficha, búsqueda por URL y combinación de filtros.

La variante search del overlay amplía únicamente este diálogo. La navegación usa una acción discreta con símbolo de búsqueda y atajo visible en escritorio. No se cargaron fuentes nuevas, librerías, imágenes generadas ni otro modelo 3D.

La imagen secundaria desaparece en celular para evitar competir con el teclado y los resultados. Los nombres largos pueden partirse, los precios usan números tabulares y el diálogo mantiene scroll propio. El foco automático del campo solo se activa con puntero fino; limpiar devuelve foco al input. Los enlaces funcionan por Tab/Enter y la imagen refleja el foco del resultado. El diálogo nativo gestiona Escape y la contención del foco. La entrada de imagen se desactiva con movimiento reducido.

La revisión se limita a código y compilación: no se afirma que el resultado visual esté validado.


## Corrección tras la captura del usuario

La captura mostró una escala excesiva del input, nombres partidos por falta de ancho, una vista lateral redundante y el outline global superpuesto a la línea de foco. Se sustituye esa composición por un diálogo de hasta 40rem, consulta de 16px y filas con miniatura, nombre, añada/procedencia y precio. Se retira la botella lateral y su estado de selección. Las dos versiones del campo (colección y diálogo) usan la misma escala compacta.

El foco del input se representa con la línea inferior reforzada; se elimina únicamente su outline rectangular. Los otros controles conservan su foco de teclado. En colores forzados se usa Highlight para mantener una señal visible. Los resultados siguen siendo enlaces nativos.

Esta corrección reemplaza las decisiones anteriores sobre campo grande y fotografía lateral. Se analiza la captura aportada, sin abrir navegador ni realizar nuevas comprobaciones visuales.

## Ajuste solicitado: botella a la izquierda

Se recupera la referencia visual por producto a la izquierda del listado para anchos desde 640px. Cambia al pasar el puntero o enfocar un enlace; si el vino deja de coincidir con la búsqueda, se muestra el primer resultado. El diálogo admite hasta 52rem y el panel lateral ocupa 10rem. Las filas mantienen la escala compacta y se retira su miniatura duplicada cuando aparece el panel. En celular se conservan las miniaturas por fila. Sin coincidencias se retira el panel.

El input y su foco inferior conservan la corrección anterior. No se hizo comprobación visual.
