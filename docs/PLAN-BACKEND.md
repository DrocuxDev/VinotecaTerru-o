# Plan de backend — TERRUÑO & CO.

**Fecha:** 27 de octubre de 2026
**Estado:** propuesta. No hay backend implementado todavía.
**Punto de partida:** frontend React + Vite completo como demo local (13 vistas, catálogo estático, cava en `localStorage`, checkout en memoria y formularios que solo muestran una confirmación en pantalla).

---

## 1. Resumen ejecutivo

El frontend ya define con claridad qué necesita el negocio: catálogo, cava, checkout, catas, club, contacto y newsletter. El backend debe convertir esa demo en un sistema con datos reales, reglas de negocio y trazabilidad, sin romper la experiencia visual.

Se proponen **dos etapas separadas**, para no mezclar "demo persistente" con "comercio real":

| Etapa | Qué resuelve | Duración estimada* |
|---|---|---|
| **A. Backend de demostración** | Catálogo y contenido desde base de datos, formularios que sí guardan y envían correo, pedidos simulados persistidos, panel de lectura | 3–4 semanas |
| **B. Comercio real** | Pagos, stock, envíos, cuentas, suscripciones, facturación electrónica, panel completo y operación | +7–10 semanas |

\* Con una persona a tiempo completo, sin contar demoras externas (aprobación de pasarela, SUNAT, contenido legal). A tiempo parcial, duplicar.

**Stack recomendado:** TypeScript en todo el proyecto, Node.js 24 + Fastify, PostgreSQL + Prisma, Zod para contratos compartidos, React Query en el frontend, despliegue gestionado (Neon + Railway/Fly.io + Cloudflare R2/Pages) y pasarela de pago peruana con checkout alojado.

**Regla central:** el servidor manda. Precios, stock, totales, cupos y estados se calculan y validan en el backend; el navegador nunca es fuente de verdad.

---

## 2. Qué existe hoy y qué falta

### Ya existe

- Contratos de datos en `src/data/contracts.ts` (`Wine`, `Tasting`, `ClubPlan`, `CartItem`).
- Catálogo ilustrativo en `src/data/catalog.ts` (3 vinos, 3 catas, 3 planes, 2 modalidades de entrega).
- Lógica pura probada en `src/data/commerce.ts` y `src/data/validation.ts` (9 pruebas).
- Cava en `localStorage` con esquema v1 y límite de 1–99 unidades.
- Checkout en memoria con guardas por paso e identificador `DEMO-XXXXXXXX`.
- `LocalForm` compartido para newsletter, contacto, catas y club; hoy no envía nada.
- Build estático en `dist/`, fallback SPA y recursos locales.

### Falta

- Persistencia real de catálogo, pedidos, reservas, mensajes y suscriptores.
- Autenticación, sesiones y roles.
- Cálculo y validación de totales en servidor.
- Stock, reservas de stock y prevención de sobreventa.
- Pagos, webhooks, reembolsos y conciliación.
- Envíos, tarifas y seguimiento.
- Correos transaccionales y doble opt-in.
- Panel de administración y auditoría.
- Facturación electrónica (SUNAT) si hay venta real.
- Entornos, CI/CD, observabilidad, copias de seguridad y pruebas de integración.

---

## 3. Decisiones de producto que deben cerrarse antes de codificar

| # | Decisión | Opciones | Recomendación |
|---|---|---|---|
| 1 | ¿Se venderá de verdad? | Demo persistente / comercio real | Empezar por A y activar B con feature flag |
| 2 | Pasarela | Culqi / Mercado Pago / Niubiz / ambas | Mercado Pago Checkout Pro; Culqi como alternativa local |
| 3 | Envíos | Recojo / Lima / todo Perú / internacional | Recojo + Lima en el primer corte |
| 4 | Club | Solo leads / suscripción con cobro recurrente | Leads primero; cobro recurrente después |
| 5 | Catas | Reserva con pago / solicitud sin pago | Solicitud sin pago al inicio |
| 6 | Facturación | Boleta/factura electrónica SUNAT | Sí, vía PSE/OSE homologado |
| 7 | Contenido | Admin propio / headless CMS | Admin propio mínimo, CMS solo si lo edita un equipo no técnico |
| 8 | Cuentas | Checkout invitado / cuentas opcionales / obligatorias | Invitado + cuenta opcional |
| 9 | Idioma | Solo español / multiidioma | Solo español |
| 10 | Hosting | PaaS gestionado / nube propia | Neon + Railway o Fly.io + Cloudflare |

Sin estas respuestas, el plan puede ejecutarse, pero varias fases cambiarían de tamaño.

---

## 4. Arquitectura propuesta

### 4.1 Vista general

```text
Navegador
  │  HTTPS
  ▼
CDN / frontend estático (Cloudflare Pages, Vercel o Netlify)
  │  /api/* (mismo dominio, proxy inverso)
  ▼
API Node.js + Fastify (Railway / Fly.io / Render)
  ├── PostgreSQL gestionado (Neon / Supabase / RDS)
  ├── Object storage + CDN para imágenes (Cloudflare R2 / S3)
  ├── Pasarela de pago (checkout alojado + webhooks)
  ├── Proveedor de correo (Resend / Postmark)
  ├── Facturación electrónica (PSE/OSE, fase B)
  └── Observabilidad (Sentry + logs estructurados + uptime)
```

Servir la API bajo el **mismo dominio** (`/api`) simplifica cookies, CSRF y CORS. Si se separa en `api.dominio.com`, configurar CORS con lista explícita y credenciales.

### 4.2 Stack

| Capa | Elección | Motivo |
|---|---|---|
| Runtime | Node.js 24 LTS | Coherente con el frontend y el entorno actual |
| Lenguaje | TypeScript estricto | Contratos compartidos y menos errores |
| Framework | Fastify 5 | Rendimiento, validación por esquema, ecosistema maduro |
| Validación | Zod + `fastify-type-provider-zod` | Un solo esquema para API, frontend y tests |
| ORM | Prisma | Migraciones claras, tipado y buena DX |
| Base de datos | PostgreSQL 16+ | Transacciones, bloqueos, integridad y reportes |
| Frontend data | TanStack Query | Caché, reintentos, invalidación y estados de carga |
| Autenticación | Sesiones opacas en cookie `HttpOnly` + Argon2id | Más simple y seguro que JWT para este caso |
| Correo | Resend + React Email | Plantillas versionadas y buena entregabilidad |
| Imágenes | R2/S3 + `sharp` | Ya se usa `sharp` en el proyecto |
| Tests | Vitest + Testcontainers + Playwright | Unidad, integración real y recorridos |
| CI/CD | GitHub Actions | Build, tests, migraciones y despliegue |
| Observabilidad | Sentry + pino + request-id | Errores, trazas y correlación |

Redis **no es necesario al inicio**. Se añade solo si aparecen colas, rate limiting distribuido o sesiones a gran escala.

### 4.3 Estructura del repositorio

Se mantiene el frontend donde está y se añaden dos carpetas. No hace falta migrar a un monorepo completo todavía.

```text
terruno-co/
  src/                    # frontend actual (sin mover)
  shared/                 # contratos Zod y tipos usados por ambos lados
    contracts/
    money.ts
  server/
    package.json
    src/
      app.ts
      env.ts
      db/
        schema.prisma
        migrations/
        seed.ts
      modules/
        catalog/
        orders/
        payments/
        inventory/
        reservations/
        club/
        forms/
        auth/
        admin/
      jobs/
      lib/
    tests/
  docs/
```

`src/data/contracts.ts` se convierte en un re-export de `shared/contracts` para no romper imports existentes.

---

## 5. Modelo de datos

Todos los importes se guardan como **enteros en céntimos** (`priceCents`) y moneda explícita (`PEN`). Nunca `float`.

### 5.1 Catálogo

| Tabla | Campos principales |
|---|---|
| `product` | id, slug único, name, type, vintage, region, description, priceCents, currency, edition, tone, status (`draft`/`active`/`archived`), createdAt, updatedAt |
| `wine_detail` | productId, varieties[], technical (JSON validado), tastingNotes, pairing, elaboration |
| `product_image` | id, productId, src, alt, width, height, position, isPrimary |
| `inventory` | productId, onHand, reserved, lowStockThreshold, updatedAt |
| `inventory_movement` | id, productId, delta, reason (`sale`, `cancel`, `adjustment`, `return`), orderId, actorId, createdAt |
| `shipping_method` | id, code (`pickup`/`delivery`), label, priceCents, detail, active |
| `shipping_zone` | id, name, regions[], priceCents, freeOverCents, active |

### 5.2 Pedidos y pagos

| Tabla | Campos principales |
|---|---|
| `order` | id interno, publicToken (128 bits), number legible, customerId?, status, subtotalCents, shippingCents, discountCents, taxCents, totalCents, currency, paymentStatus, fulfillmentStatus, createdAt |
| `order_item` | orderId, productId, **nameSnapshot**, **priceCentsSnapshot**, quantity, lineTotalCents |
| `order_address` | orderId, type (`billing`/`shipping`), name, street, city, region, postal, phone, reference |
| `order_event` | orderId, type, payload (JSON), actor, createdAt — historial inmutable |
| `payment` | id, orderId, provider, providerReference, amountCents, status, method, rawStatus, createdAt |
| `payment_event` | id, provider, eventId único, type, payload, processedAt — idempotencia de webhooks |
| `refund` | id, paymentId, amountCents, reason, status, providerReference |
| `discount_code` | id, code único, type, value, minSubtotalCents, startsAt, endsAt, maxRedemptions, active |
| `discount_redemption` | discountId, orderId, customerId?, createdAt |
| `idempotency_key` | key, scope, requestHash, responseJson, createdAt, expiresAt |

### 5.3 Personas y accesos

| Tabla | Campos principales |
|---|---|
| `customer` | id, email único normalizado, firstName, lastName, phone?, emailVerifiedAt, createdAt |
| `customer_address` | id, customerId, label, street, city, region, postal, phone, isDefault |
| `session` | id, tokenHash, customerId?, adminUserId?, expiresAt, ip, userAgent, createdAt |
| `admin_user` | id, email, passwordHash (Argon2id), role (`owner`/`ops`/`content`), active, lastLoginAt |
| `audit_log` | id, actorId, action, entity, entityId, before/after (JSON redactado), ip, createdAt |
| `consent` | id, email?, customerId?, type (`newsletter`/`terms`/`cookies`), version, grantedAt, ip |

### 5.4 Catas, club y formularios

| Tabla | Campos principales |
|---|---|
| `tasting` | id, slug, title, region, description, location, priceCents, heroImage, status |
| `tasting_session` | id, tastingId, startsAt, capacity, seatsTaken, status (`scheduled`/`full`/`cancelled`) |
| `reservation` | id, publicToken, sessionId, name, email, phone?, attendees, status (`pending`/`confirmed`/`waitlist`/`cancelled`), notes, createdAt |
| `club_plan` | id, code, name, priceCents, frequency, benefits[], active |
| `club_lead` | id, planId, name, email, phone?, status, createdAt |
| `club_subscription` | (fase B) id, customerId, planId, status, providerSubscriptionId, nextBillingAt |
| `contact_message` | id, name, email, subject, message, status, createdAt |
| `newsletter_subscriber` | id, email, status (`pending`/`confirmed`/`unsubscribed`), confirmToken, confirmedAt, source |
| `outbox_event` | id, type, payload, attempts, availableAt, processedAt — correos y tareas asíncronas |

### 5.5 Invariantes

1. El total del pedido se recalcula en servidor con precios de base de datos y tarifa de envío vigente.
2. `order_item` guarda copia del nombre y precio; cambiar el catálogo no altera pedidos históricos.
3. El stock se descuenta en una transacción con bloqueo (`SELECT ... FOR UPDATE`) o `UPDATE ... WHERE onHand - reserved >= quantity`.
4. La creación de pedido y los webhooks son **idempotentes**.
5. El pedido solo es visible públicamente con `publicToken` no adivinable; nunca por id secuencial.
6. Los estados siguen una máquina explícita; no se aceptan transiciones arbitrarias.
7. Los correos se encolan en `outbox_event`; un fallo de correo no revierte la compra.

---

## 6. API propuesta (`/api/v1`)

### Público

| Método | Ruta | Uso |
|---|---|---|
| GET | `/products` | Catálogo con filtros `type`, `region`, `vintage`, `maxPrice`, `sort`, paginación |
| GET | `/products/:slug` | Ficha + imágenes + detalle técnico |
| GET | `/tastings` | Agenda con sesiones y cupos |
| GET | `/tastings/:slug` | Detalle y sesiones |
| GET | `/club/plans` | Planes vigentes |
| POST | `/forms/contact` | Mensaje de contacto (rate limit + honeypot) |
| POST | `/forms/newsletter` | Alta con doble opt-in |
| GET | `/forms/newsletter/confirm/:token` | Confirmación |
| GET | `/forms/newsletter/unsubscribe/:token` | Baja |
| POST | `/reservations` | Solicitud de cata o lista de espera |
| POST | `/club/leads` | Interés en un plan |
| POST | `/checkout/quote` | Totales y disponibilidad sin crear pedido |
| POST | `/orders` | Crear pedido; requiere `Idempotency-Key` |
| GET | `/orders/:publicToken` | Estado y resumen para confirmación |
| POST | `/payments/webhook/:provider` | Webhook firmado |

### Cuenta (fase B)

| Método | Ruta |
|---|---|
| POST | `/auth/register` |
| POST | `/auth/login` |
| POST | `/auth/logout` |
| POST | `/auth/refresh` |
| POST | `/auth/verify-email` |
| POST | `/auth/password-reset` |
| GET | `/me` |
| GET | `/me/orders` |
| CRUD | `/me/addresses` |

### Administración (protegida)

| Recurso | Operaciones |
|---|---|
| Productos | listar, crear, editar, archivar, publicar |
| Imágenes | subir por URL prefirmada, ordenar, eliminar |
| Stock | consultar, ajustar con motivo, ver movimientos |
| Pedidos | listar/filtrar, ver detalle, cambiar fulfillment, reembolsar |
| Reservas | listar, confirmar, cancelar, mover a lista de espera |
| Club | planes y leads; suscripciones en fase B |
| Formularios | mensajes, suscriptores, exportar CSV |
| Contenido | catas, regiones, textos editables |
| Auditoría | historial por entidad |

Toda respuesta de error usa un formato estable:

```json
{ "error": { "code": "OUT_OF_STOCK", "message": "No hay unidades suficientes.", "details": { "productId": "gran-reserva" } } }
```

---

## 7. Flujos críticos

### 7.1 Checkout

1. El frontend envía líneas `{ productId, quantity }`, modalidad de entrega y datos de contacto.
2. `POST /checkout/quote` valida catálogo, stock y tarifas; devuelve totales calculados.
3. `POST /orders` con `Idempotency-Key` crea el pedido en estado `pending_payment` y **reserva stock** por 20 minutos.
4. Se crea la intención de pago en la pasarela y se devuelve la URL/Token de checkout.
5. El usuario paga fuera del sitio (checkout alojado) y vuelve a `/pedido/:token`.
6. El webhook firmado confirma el pago: `paid`, descuenta stock definitivamente y encola correos.
7. Si expira el tiempo sin pago, un trabajo libera la reserva y marca `expired`.
8. La confirmación consulta el pedido por `publicToken`, no por estado local.

**Nunca** se acepta del cliente el precio, el total ni el estado del pago.

### 7.2 Webhooks de pago

- Verificar firma con el secreto del proveedor.
- Guardar el evento en `payment_event` con `eventId` único antes de procesar.
- Responder `200` rápido; procesar en un job si hace falta.
- Reintentos seguros: el mismo evento no duplica pedidos ni correos.
- Job de conciliación diario contra la pasarela para detectar pagos huérfanos.

### 7.3 Stock y sobreventa

- `reserved` se incrementa al crear el pedido y se libera al expirar o cancelar.
- `onHand` se descuenta al confirmar el pago.
- Ajustes manuales dejan rastro en `inventory_movement`.
- Prueba obligatoria: 20 compras simultáneas de la última unidad → exactamente 1 éxito.

### 7.4 Catas

- Capacidad por sesión, no por cata.
- Reserva con transacción y bloqueo; si no hay cupo, ofrecer lista de espera.
- El estado `full` se calcula con `seatsTaken >= capacity`, no se escribe a mano.
- Confirmación por correo con token de cancelación.

### 7.5 Club

- **Fase A:** `club_lead` y correo de interés. Sin cobro.
- **Fase B:** suscripción con cobro recurrente; requiere proveedor con soporte de suscripciones, gestión de reintentos, cancelación y cumplimiento de la normativa de débitos recurrentes.

### 7.6 Formularios

- Validación Zod en servidor con los mismos límites del frontend.
- Honeypot + tiempo mínimo de llenado + rate limit por IP y por email.
- Correo interno al equipo + auto-respuesta al usuario.
- Newsletter con doble opt-in y enlace de baja en cada envío.
- Retención definida y borrado a solicitud.

---

## 8. Autenticación y autorización

- Sesiones opacas: token aleatorio de 256 bits, guardado **hasheado** en base de datos; cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Contraseñas con Argon2id y política mínima; verificación de correo.
- Rotación de sesión al iniciar sesión y al cambiar contraseña.
- CSRF: `SameSite=Lax` + comprobación de `Origin`/`Referer` en mutaciones; doble token si se requiere más rigor.
- Roles de administración: `owner` (todo), `ops` (pedidos, stock, reservas), `content` (catálogo y textos).
- Rutas de admin fuera del bundle público o cargadas con `lazy` y protegidas en servidor.
- Límite de intentos de login y bloqueo temporal progresivo.
- Registro de accesos y acciones sensibles en `audit_log`.

---

## 9. Seguridad, privacidad y cumplimiento

### Técnico

- HTTPS obligatorio; HSTS.
- Validación de entrada con Zod y límites de tamaño.
- Consultas parametrizadas vía Prisma; sin SQL concatenado.
- Escape de salida en el frontend (React ya lo hace; no usar `dangerouslySetInnerHTML` con datos de usuario).
- Rate limiting global y específico en login, formularios y checkout.
- Secretos en el gestor del proveedor, nunca en el repositorio.
- Logs con `requestId`, sin contraseñas, tokens, correos completos ni datos de tarjeta.
- Dependencias auditadas en CI; Dependabot o Renovate.
- Copias de seguridad automáticas con prueba de restauración.
- Cifrado en tránsito y en reposo (el proveedor de PostgreSQL lo ofrece).

### Legal (Perú) — requiere revisión profesional

- **Datos personales:** Ley 29733 y su reglamento; aviso de privacidad, base legal, finalidad, plazo de conservación y derechos ARCO.
- **Consumo:** libro de reclamaciones virtual visible; términos, política de cambios/devoluciones y atención al cliente.
- **Alcohol:** venta solo a mayores de 18; verificación en entrega; advertencias sanitarias; restricciones de venta y publicidad.
- **Tributario:** comprobantes electrónicos (boleta/factura) vía PSE/OSE; IGV incluido en el precio mostrado.
- **Cookies:** banner solo si se usan analítica o marketing no esenciales; consentimiento previo y granular.
- **Pagos:** no almacenar datos de tarjeta; usar checkout alojado o tokenización del proveedor (PCI DSS SAQ-A).

Este documento no sustituye asesoría legal ni contable.

---

## 10. Pagos

### Recomendación

| Proveedor | Uso | Notas |
|---|---|---|
| **Mercado Pago** | Checkout Pro: tarjetas, Yape y otros medios | Buena cobertura LATAM, suscripciones y webhooks documentados |
| **Culqi** | Alternativa local | Fuerte en Perú, Yape y tarjetas; requiere comercio aprobado |
| **Niubiz** | Solo si el negocio ya lo exige | Integración más pesada |

Empezar con **una** pasarela. La segunda se añade detrás de la misma interfaz.

### Abstracción

```ts
interface PaymentProvider {
  createCheckout(input: CreateCheckoutInput): Promise<{ providerRef: string; redirectUrl: string }>;
  verifyWebhook(headers: Record<string, string>, rawBody: string): WebhookEvent;
  refund(paymentId: string, amountCents: number): Promise<RefundResult>;
}
```

- El monto se envía desde el servidor, no desde el navegador.
- Se guarda `providerReference` y se concilia.
- Reembolsos totales y parciales con estado propio.
- Pruebas en modo sandbox antes de producción.
- Comisiones y tiempos de abono: confirmar por contrato; no asumir porcentajes.

---

## 11. Envíos

Fase A: recojo y entrega local con tarifas fijas.

Fase B:

- Zonas (Lima, Ica, resto de Perú) con tarifas y umbral de envío gratis.
- Operador logístico (Olva, Shalom u otro) o reparto propio.
- Restricción de horarios y verificación de mayoría de edad en la entrega.
- Seguimiento y estados: `preparing`, `shipped`, `delivered`, `returned`.
- Dirección validada y teléfono obligatorio para entrega.
- Política de devoluciones y productos dañados.

---

## 12. Correos y notificaciones

Transaccionales:

| Evento | Destinatario |
|---|---|
| Verificación de correo | Cliente |
| Recuperación de contraseña | Cliente |
| Pedido creado / pago pendiente | Cliente |
| Pago confirmado + resumen | Cliente y equipo |
| Pedido enviado / entregado | Cliente |
| Reserva recibida / confirmada / cancelada | Cliente |
| Mensaje de contacto | Equipo + auto-respuesta |
| Confirmación de newsletter | Cliente |
| Reembolso procesado | Cliente |

- Plantillas con React Email y versión de texto.
- Envío asíncrono vía outbox, con reintentos y registro de errores.
- SPF, DKIM y DMARC configurados en el dominio.
- Enlace de baja en marketing; los correos transaccionales no lo llevan.
- Modo sandbox en desarrollo; nunca enviar a direcciones reales desde staging.

---

## 13. Panel de administración

Mínimo para operar:

1. **Pedidos:** listado con filtros, detalle, historial, cambio de estado, reembolso.
2. **Productos:** precio, stock, estado, imágenes, ficha técnica.
3. **Reservas:** asistentes, cupos, confirmación y lista de espera.
4. **Formularios:** mensajes, suscriptores, exportación.
5. **Contenido:** catas y textos editables.
6. **Auditoría:** quién cambió qué y cuándo.

Opciones:

- Rutas protegidas dentro del mismo SPA (`/admin`), con carga diferida. Menos infraestructura.
- Aplicación separada (React Admin o Refine) en `admin.dominio.com`. Más aislamiento.

Recomendación: mismo repositorio, rutas protegidas al inicio; separar solo si crece el equipo.

---

## 14. Infraestructura y operación

### Entornos

| Entorno | Uso | Datos |
|---|---|---|
| Local | Desarrollo | PostgreSQL en Docker o Neon de desarrollo; correo sandbox |
| Staging | Revisión y QA | Datos sintéticos; pasarela sandbox |
| Producción | Clientes | Datos reales; accesos restringidos |

### CI/CD

En cada pull request:

1. `npm run check` y tests del frontend.
2. Tests del backend (unitarios + integración con PostgreSQL efímero).
3. Lint, formato y auditoría de dependencias.
4. Build de frontend y backend.
5. Migraciones verificadas contra una base limpia.

En `main`: despliegue a staging automático y a producción con aprobación manual. Migraciones antes de arrancar la nueva versión, compatibles hacia atrás.

### Observabilidad

- Logs JSON con `requestId`, ruta, estado y duración; sin PII.
- Sentry para errores de API y frontend.
- Métricas: latencia p95, tasa de error, pedidos/min, pagos fallidos, stock bajo.
- Alertas a correo/Slack: caída, errores 5xx, webhooks fallidos, backup fallido.
- Healthcheck `/health` y `/ready` (base de datos incluida).

### Copias de seguridad

- PostgreSQL con point-in-time recovery si el proveedor lo ofrece.
- Backup diario adicional a almacenamiento cifrado.
- Prueba de restauración trimestral documentada.

---

## 15. Migración del frontend

La UI no se reescribe: se sustituyen las fuentes de datos por capas con degradación controlada.

| Paso | Cambio | Archivos |
|---|---|---|
| 1 | Extraer contratos y esquemas Zod a `shared/` | `src/data/contracts.ts`, `shared/contracts/*` |
| 2 | Crear cliente HTTP con errores normalizados y `AbortSignal` | `src/lib/api.ts` |
| 3 | Añadir TanStack Query y hooks de catálogo | `src/features/catalog/` |
| 4 | Catálogo y ficha desde API, con seed estático como fallback | `src/pages/CollectionPage.tsx`, `WinePage.tsx`, `HomeExperience.tsx` |
| 5 | Formularios con `fetch`, estados de carga/error y honeypot | `src/components/forms/LocalForm.tsx` |
| 6 | Checkout: `quote` + `orders` + redirección a pasarela | `src/features/checkout/`, `CheckoutPages.tsx` |
| 7 | Confirmación por `publicToken` | `src/pages/OrderConfirmedPage.tsx`, router |
| 8 | Panel admin con carga diferida | `src/pages/admin/` |
| 9 | Feature flags: `demo`, `api`, `payments` | `src/lib/flags.ts` |

Detalles:

- Mantener `VITE_DEMO_MODE=true` mientras el contenido no esté aprobado; el sitio actual sigue funcionando sin backend.
- La cava puede seguir en `localStorage` para invitados; el servidor valida al cotizar y crear el pedido.
- No guardar datos personales en `localStorage`; la sesión de checkout sigue en memoria.
- El identificador visible del pedido se mantiene legible, pero el acceso público usa token.
- Imágenes: migrar a R2 con `srcset` y AVIF/WebP en una fase posterior, sin bloquear la API.

---

## 16. Fases de ejecución

### Etapa A — Demo persistente (3–4 semanas)

| Fase | Alcance | Salida / criterio |
|---|---|---|
| A0. Decisiones y contratos (3–5 días) | Cerrar las 10 decisiones, definir esquemas Zod, OpenAPI inicial | Contratos aprobados y compartidos |
| A1. Fundaciones (1 semana) | Repo `server/`, Fastify, Prisma, PostgreSQL, entornos, CI, healthcheck | `GET /health` verde en staging |
| A2. Catálogo (1 semana) | Tablas, seed con los 3 vinos, endpoints de lectura, hooks en frontend | Colección y ficha leen de API con fallback |
| A3. Formularios (3–5 días) | Contacto, newsletter con doble opt-in, reservas y club leads; correos | Mensaje real recibido en sandbox |
| A4. Pedidos simulados (1 semana) | `quote`, `orders`, stock reservado, confirmación por token, correos | Pedido demo persistido y consultable |
| A5. Admin mínimo y cierre (1 semana) | Pedidos, stock, reservas, mensajes; auditoría; backups | Operación básica sin tocar la base de datos |

**Resultado:** demo con datos reales y operación mínima, sin cobros.

### Etapa B — Comercio real (+7–10 semanas)

| Fase | Alcance | Salida |
|---|---|---|
| B1. Cuentas (1 semana) | Registro, login, sesiones, verificación, direcciones | Cliente puede ver sus pedidos |
| B2. Pagos (2 semanas) | Pasarela, checkout alojado, webhooks, reembolsos, conciliación | Pago sandbox end-to-end |
| B3. Envíos (1 semana) | Zonas, tarifas, operador, seguimiento | Pedido enviado y entregado |
| B4. Club y catas con cobro (1–2 semanas) | Suscripciones o reservas pagadas según decisión | Cobro recurrente o reserva confirmada |
| B5. Facturación (1–2 semanas) | PSE/OSE, boleta/factura, notas de crédito | Comprobante válido emitido |
| B6. Admin completo (1–2 semanas) | Productos, imágenes, cupones, reportes, roles | Operación diaria autónoma |
| B7. Endurecimiento y lanzamiento (2 semanas) | Pentest básico, carga, accesibilidad, legal, runbook | Go-live con monitoreo y rollback |

**Total realista:** 10–14 semanas a tiempo completo, más tiempos de aprobación de pasarela y facturación.

---

## 17. Pruebas y criterios de aceptación

### Automáticas

- **Unidad:** dinero, totales, descuentos, máquina de estados, capacidad, validaciones.
- **Integración:** PostgreSQL real efímero; creación de pedido, concurrencia de stock, webhooks duplicados, expiración.
- **Contrato:** OpenAPI vs implementación; esquemas Zod compartidos.
- **E2E (Playwright):** compra completa en sandbox, formularios, reserva, panel admin.
- **Seguridad:** intentos de manipular precios, acceso a pedidos ajenos, inyección, rate limit.
- **Carga:** catálogo y checkout con el tráfico objetivo acordado (definir antes).

### Criterios de aceptación

- [ ] El total pagado coincide siempre con el recalculado en servidor.
- [ ] No hay sobreventa en prueba de concurrencia.
- [ ] Un webhook repetido no duplica pedido, stock ni correo.
- [ ] Un pedido solo se consulta con su token.
- [ ] Los formularios resisten spam básico y respetan rate limits.
- [ ] Migraciones reproducibles desde cero.
- [ ] Backup restaurado en un entorno limpio.
- [ ] Datos personales ausentes de logs y de `localStorage`.
- [ ] Roles de admin aplicados en servidor, no solo en la UI.
- [ ] Staging y producción separados; secretos fuera del repo.
- [ ] Runbook de incidentes y rollback documentado.
- [ ] Revisión legal de privacidad, consumo, alcohol y facturación.

---

## 18. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Aprobación de pasarela tarda | Bloquea cobros | Iniciar trámite en A0; sandbox mientras tanto |
| Integración SUNAT compleja | Bloquea facturación | Usar PSE/OSE homologado, no implementar directo |
| Sobreventa por concurrencia | Mala experiencia | Transacciones, bloqueos y prueba de carga |
| Fuga de datos personales | Legal y reputación | Minimizar datos, cifrar, redactar logs, auditar |
| Alcance crece (CMS, multiidioma, app) | Retraso | Feature flags y etapas cerradas |
| Contenido comercial sin aprobar | No se puede publicar | Mantener modo demo y seed ilustrativo |
| Logística de alcohol | Entregas fallidas | Verificación de edad y operador con experiencia |
| Correos a spam | Clientes sin confirmación | SPF/DKIM/DMARC y monitoreo de rebotes |
| Dependencia de un proveedor | Coste/portabilidad | Postgres estándar, storage S3-compatible, capa de pago abstracta |
| Suscripciones recurrentes | Complejidad legal/operativa | Posponer a fase B4 con proveedor especializado |

---

## 19. Costos aproximados (USD/mes)

Solo infraestructura; no incluye desarrollo, pasarela ni facturación.

| Concepto | Rango |
|---|---|
| PostgreSQL gestionado (Neon/Supabase) | 0–25 |
| API (Railway/Fly.io/Render) | 5–25 |
| Storage + CDN (R2/S3 + Cloudflare) | 1–10 |
| Correo transaccional (Resend/Postmark) | 0–20 |
| Sentry / monitoreo | 0–30 |
| Dominio y TLS | ~1–2 |
| **Total** | **~7–110** |

Los planes gratuitos alcanzan para staging y bajo volumen. Producción con backups y soporte suele quedar en **25–60 USD/mes** antes de comisiones por transacción.

---

## 20. Preguntas para cerrar el alcance

1. ¿La prioridad es una demo persistente o vender de inmediato?
2. ¿Pasarela preferida o ya contratada? (Culqi, Mercado Pago, Niubiz)
3. ¿Se enviará a todo Perú o solo recojo/Lima?
4. ¿El club será suscripción con cobro o captación de interesados?
5. ¿Las catas se pagarán en línea o solo se solicitarán?
6. ¿Se emitirán boletas/facturas electrónicas desde el inicio?
7. ¿Quién administrará precios, stock y pedidos? ¿Se necesita panel propio?
8. ¿Hosting/cloud preferido o restricción de proveedor?
9. ¿Ya existen dominio, correo corporativo y cuenta de pasarela?
10. ¿Hay contenido comercial aprobado (precios, añadas, sedes, políticas)?

---

## 21. Próximo paso recomendado

1. Responder las preguntas de la sección 20.
2. Cerrar la etapa elegida (A o B) y sus criterios de aceptación.
3. Ejecutar A0: contratos Zod, esquema Prisma inicial y OpenAPI.
4. Montar A1 en staging con datos seed y healthcheck.
5. Conectar el catálogo del frontend a la API manteniendo `VITE_DEMO_MODE` como respaldo.

Con las respuestas, este plan puede convertirse en un backlog ejecutable por fases, con tareas, estimaciones y criterios de salida por historia.
