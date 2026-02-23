# Guía de Configuración — Workflows n8n + Bot API

> Resumen de todo lo implementado en el PROMPT 18 y Bot API.
> Fecha: 2026-02-23

---

## 📋 Resumen de lo que se construyó

### 1. Webhook handler mejorado (`/api/webhooks/n8n`)
El endpoint que ya existía ahora procesa 3 tipos de eventos:
- `blog.create` → Crea un borrador de blog post en Supabase
- `blog.publish` → Publica un post existente por slug
- `contract.post_sale` → Log de venta para CRM/analytics

### 2. Bot Query API (`/api/bot/query`)
Endpoint nuevo que el bot de WhatsApp usa para consultar datos reales:
- 6 calculadoras (inmobiliario, vehicular, notarial, alcabala, registro, consejo provincial)
- Búsqueda de blog, servicios, contacto, requisitos
- Estado de contratos por email o ID
- Detección de temas fuera de alcance (penal, laboral, etc.)
- Rate limiting: 200 req/min

### 3. Notificación post-venta a n8n
Después de cada pago exitoso + generación de PDF, se notifica a n8n automáticamente para:
- Enviar email de confirmación
- Notificar por WhatsApp (Wasender)
- Log en CRM

### 4. Tres workflows nuevos en n8n
| # | Workflow | ID en n8n | Estado |
|---|----------|-----------|--------|
| 03 | Blog Content Pipeline | `D6yfMw7M5pnLdLj6` | Inactivo |
| 04 | Post-Sale Automation | `E3pQGfDqhSxc1hL9` | Inactivo |
| 05 | Social Media Blog | `hlfc28f9QhL0vRs7` | Inactivo |

---

## ✅ Lo que TÚ necesitas hacer

### Paso 1: Variables de entorno en Vercel

Ve a **Vercel → tu proyecto → Settings → Environment Variables** y agrega:

| Variable | Valor | Nota |
|----------|-------|------|
| `BOT_API_SECRET` | Un token largo y seguro (ej: `sk_bot_` + 32 chars random) | Auth del bot API |
| `N8N_WEBHOOK_URL` | `https://n8n-production-8de1.up.railway.app` | Ya debería existir |
| `N8N_WEBHOOK_SECRET` | El mismo secret que ya usas en n8n | Ya debería existir |

Para generar un token seguro:
```bash
openssl rand -hex 32
# Ejemplo resultado: a1b2c3d4e5f6...
# Tu BOT_API_SECRET sería: sk_bot_a1b2c3d4e5f6...
```

**Después de agregar las variables, haz un redeploy en Vercel.**

---

### Paso 2: Configurar workflow 03 — Blog Content Pipeline

1. Abre n8n: https://n8n-production-8de1.up.railway.app
2. Busca **"03_Blog_Content_Pipeline"**
3. **Nodo "Generar Articulo (AI)"**:
   - Cambia de OpenAI a **Google Gemini** (tú dijiste que vas a usar Gemini)
   - Configura las credenciales de tu API de Gemini
4. **Nodo "Enviar a Next.js"**:
   - En los headers, reemplaza `CONFIGURAR_N8N_WEBHOOK_SECRET` con tu `N8N_WEBHOOK_SECRET` real
5. Prueba manualmente (botón "Test Workflow")
6. Si funciona, actívalo (toggle arriba a la derecha)

**Cómo probar:**
- Click "Test Workflow" → debe generar un artículo AI → enviarlo a tu app → aparecer como draft en Supabase (tabla `blog_posts`, `published = false`)
- Para publicarlo: cambia `published` a `true` en Supabase o envía evento `blog.publish`

---

### Paso 3: Configurar workflow 04 — Post-Sale Automation

1. Busca **"04_Post_Sale_Automation"**
2. **Nodo "Email Confirmacion"**:
   - Reemplaza `CONFIGURAR_RESEND_API_KEY` con tu API key de Resend real
3. **Nodo "WhatsApp Wasender"**:
   - Ya está configurado con tu API key de Wasender y el número +593 979317579
   - Envía notificación con: ID contrato, email, monto, fecha, y link de descarga
   - Si quieres desactivar temporalmente el WhatsApp: click derecho en el nodo → Disable
4. Activa el workflow

**Cómo probar:**
- Haz una compra de prueba de contrato vehicular ($11.99)
- Después del pago, el sistema automáticamente notifica a este workflow
- Verifica que llegue el email de confirmación

**URL del webhook:** `https://n8n-production-8de1.up.railway.app/webhook/contract-paid`

---

### Paso 4: Configurar workflow 05 — Social Media Blog

1. Busca **"05_Social_Media_Blog"**
2. Este workflow no necesita configuración especial
3. Actívalo
4. Para probarlo, envía un POST manual:

```bash
curl -X POST https://n8n-production-8de1.up.railway.app/webhook/blog-published \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "poder-desde-espana-estados-unidos-valido-ecuador",
    "title": "Cómo hacer un poder desde España",
    "excerpt": "Guía para poderes desde el exterior",
    "category": "Poderes",
    "tags": ["poder", "apostilla"]
  }'
```

**Resultado:** Te devuelve textos formateados para Facebook, Instagram, LinkedIn y WhatsApp que puedes copiar y pegar manualmente.

---

### Paso 5: Probar el Bot Query API

Una vez que `BOT_API_SECRET` esté en Vercel y el deploy esté listo:

```bash
# Probar calculadora inmobiliaria
curl -X POST https://abogadosonlineecuador.com/api/bot/query \
  -H "Authorization: Bearer TU_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "calculate.inmobiliario", "data": {"valor": 80000}}'

# Probar info de contacto
curl -X POST https://abogadosonlineecuador.com/api/bot/query \
  -H "Authorization: Bearer TU_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "get.contact"}'

# Probar detección de scope (tema fuera de alcance)
curl -X POST https://abogadosonlineecuador.com/api/bot/query \
  -H "Authorization: Bearer TU_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "check.scope", "data": {"text": "me quieren meter preso por estafa"}}'

# Probar servicios
curl -X POST https://abogadosonlineecuador.com/api/bot/query \
  -H "Authorization: Bearer TU_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "get.services"}'

# Probar requisitos
curl -X POST https://abogadosonlineecuador.com/api/bot/query \
  -H "Authorization: Bearer TU_BOT_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "get.requirements", "data": {"tipo": "vehicular"}}'
```

---

### Paso 6: Conectar el Bot de WhatsApp (02_Bot_WhatsApp_IA)

Tu workflow `02_Bot_WhatsApp_IA` ya existe y está activo. Para que use el Bot Query API:

1. Abre el workflow en n8n
2. Agrega un nodo **HTTP Request** que llame a `/api/bot/query` con:
   - URL: `https://abogadosonlineecuador.com/api/bot/query`
   - Method: POST
   - Header: `Authorization: Bearer TU_BOT_API_SECRET`
   - Body: `{ "type": "...", "data": {...} }`
3. Usa el nodo AI para:
   - Analizar el mensaje del usuario
   - Decidir qué `type` de query hacer
   - Formatear la respuesta de forma natural

**Flujo ideal:**
```
Usuario escribe → Wasender → n8n webhook
  → AI detecta intención (ej: "cuánto cuesta escriturar")
  → HTTP Request a /api/bot/query con type: "calculate.inmobiliario"
  → AI formatea la respuesta: "Para una casa de $80,000 el costo estimado es..."
  → Wasender → respuesta al usuario
```

---

## 📁 Archivos nuevos/modificados

### Código (Next.js)
| Archivo | Qué hace |
|---------|----------|
| `src/app/api/webhooks/n8n/route.ts` | Webhook expandido con 3 eventos tipados |
| `src/app/api/bot/query/route.ts` | **NUEVO** — Bot Query API (13 tipos de consulta) |
| `src/lib/bot/rate-limiter.ts` | **NUEVO** — Rate limiter 200 req/min |
| `src/lib/bot/scope.ts` | **NUEVO** — Reglas de alcance + system prompt para AI |
| `src/lib/bot/handlers.ts` | **NUEVO** — 13 handlers de consulta |
| `src/lib/n8n.ts` | Agregado `notifyN8NContractPaid()` |
| `src/actions/blog.ts` | Agregados `createOrUpdateBlogDraft()` y `publishBlogPost()` |
| `src/app/(marketing)/contratos/pago/callback/page.tsx` | Agregada notificación post-venta a n8n |

### Workflows (n8n)
| Archivo local | Workflow en n8n |
|---------------|-----------------|
| `n8n/blog-content-pipeline.json` | 03_Blog_Content_Pipeline |
| `n8n/post-sale-automation.json` | 04_Post_Sale_Automation |
| `n8n/social-media.json` | 05_Social_Media_Blog |

---

## 🔑 API Keys pendientes

| Servicio | Key | Dónde va |
|----------|-----|----------|
| Wasender | `2e567b43f94a1b...` | Ya configurado en nodo WhatsApp Wasender del workflow 04 |
| Gemini | La que configures | Nodo AI en workflow 03 |
| BOT_API_SECRET | Generar con `openssl rand -hex 32` | Vercel + nodos HTTP de n8n |

---

## 🔒 Seguridad

- El Bot API requiere `Authorization: Bearer` header
- Rate limit: 200 requests por minuto por API key
- Los workflows de n8n validan `x-webhook-secret`
- El endpoint `/api/bot/query` NO está expuesto sin auth
- Las API keys de Wasender y Resend NO están en el código — van en los nodos de n8n directamente

---

## ❓ Preguntas frecuentes

**¿Puedo probar localmente?**
Sí, agrega `BOT_API_SECRET=sk_bot_test123` a tu `.env.local` y haz requests a `localhost:3000/api/bot/query`.

**¿Qué pasa si n8n se cae?**
Las notificaciones son fire-and-forget. Si n8n no responde en 5 segundos, el sistema sigue funcionando normalmente. No se pierden pagos ni contratos.

**¿Cómo agrego un nuevo tipo de consulta al bot?**
1. Agrega el tipo a `QueryType` en `src/lib/bot/handlers.ts`
2. Crea la función handler
3. Agrégala al mapa `handlers`
4. Agrega el tipo a `VALID_QUERY_TYPES` en `src/app/api/bot/query/route.ts`

**¿Los divorcios están soportados?**
Sí, el bot reconoce "divorcio" como servicio propio (mutuo consentimiento ante notario). Otros temas de familia (custodia, alimentos) se derivan.

**¿Roté la API key de n8n?**
Recuerda hacerlo. La que usaste temporalmente era: `eyJhbGci...`. Genera una nueva en n8n → Settings → API Keys.
