# Desplegar TERRUÑO & CO. en Vercel

Fecha: 28 de octubre de 2026. Estado: configuración local preparada; despliegue pendiente de acceso a la cuenta.

## Archivos preparados

vercel.json identifica Vite, instala con npm ci, compila con npm run build y publica dist. La regla de reescritura entrega index.html al abrir directamente una ruta de React, como /coleccion o /vino/gran-reserva. Los archivos estáticos del build siguen siendo servidos por Vercel.

.vercelignore reduce el envío de archivos al desplegar desde terminal: excluye originales de imágenes, documentación, pruebas y herramientas de preparación. Se conservan src, public, package.json, package-lock.json, tsconfig.json, vite.config.ts e index.html, necesarios para compilar. El modelo GLB y las imágenes web están en public y sí se publican.

.gitignore excluye .vercel, donde la CLI guarda la vinculación local al proyecto.

## Opción recomendada ahora: carpeta local

El repositorio remoto fue reiniciado para el trabajo del equipo y todavía no contiene el frontend completo. Se puede desplegar directamente desde la carpeta del escritorio sin publicar commits en GitHub.

1. Crear o iniciar sesión en https://vercel.com/.
2. Abrir PowerShell y ejecutar:

```powershell
Set-Location -LiteralPath 'C:\Users\USER\Desktop\terruno-co'
npx vercel login
npx vercel
```

La primera ejecución de npx puede pedir instalar Vercel CLI temporalmente. Autorizar la instalación. El inicio de sesión abre la autorización de Vercel; realizarlo personalmente sin compartir contraseñas ni tokens.

Durante la vinculación:

- Confirmar que se quiere configurar esta carpeta.
- Elegir la cuenta o equipo al que debe pertenecer el proyecto.
- Crear un proyecto nuevo si no hay uno destinado a TERRUÑO.
- Nombre sugerido: terruno-co; si está ocupado, elegir otro disponible.
- Directorio del código: ./.
- Framework: Vite. Build: npm run build. Salida: dist. La configuración está guardada en vercel.json.

La CLI devuelve una URL de vista previa. Comprobar los enlaces y recursos antes de producción. Para publicar la versión final:

```powershell
npx vercel --prod
```

Vercel devuelve la URL pública de producción. Para actualizarla, repetir ese último comando desde la misma carpeta después de guardar los cambios.

## Alternativa posterior: GitHub

Cuando el equipo haya integrado el frontend completo, en Vercel elegir Add New → Project e importar DrocuxDev/VinotecaTerru-o. Usar raíz ./ si package.json está en la raíz; si el equipo lo coloca dentro de una subcarpeta, seleccionar esa carpeta. Vite, build y salida se toman de la configuración del proyecto. No importar ahora el repositorio vacío de código: no tiene una aplicación que compilar.

## Comprobar después de publicar

Abrir inicio, /coleccion y /vino/gran-reserva mediante enlace directo y recarga; una ruta inexistente debe mostrar el 404 de React. Revisar /images/terruno-bottle.webp y /models/terruno-bottle.glb. Los pasos de checkout sin carrito/datos redirigen intencionadamente al primer requisito pendiente.

La URL de vista previa puede requerir iniciar sesión por la protección del proyecto. Para la entrega, verificar que la URL de producción sea accesible a los evaluadores.

El despliegue publica la implementación frontend actual: los formularios siguen sin envío externo y no se conectan pagos o persistencia de pedidos por desplegar la web.

## Fuentes oficiales

- https://vercel.com/docs/frameworks/frontend/vite
- https://vercel.com/docs/cli/deploy
- https://vercel.com/docs/projects/deploy-from-cli
