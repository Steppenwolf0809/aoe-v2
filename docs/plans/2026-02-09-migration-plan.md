# Plan de Migración SEO y Redirecciones 301

> **Objetivo:** Migrar el tráfico de `www.abogadosonlineecuador.com` (Legacy) a la nueva plataforma v2 sin perder autoridad SEO y garantizando 0 errores 404.

## 1. Inventario de URLs Legacy
Basado en data de Search Console (últimos 12 meses), estas son las URLs que reciben tráfico y deben ser redirigidas obligatoriamente.

| Prioridad | URL Antigua | Clics (12m) | Impresiones | Estado |
|-----------|-------------|-------------|-------------|--------|
| 🔴 ALTA | `/calculadoras` | 635 | 26,112 | CRÍTICO - Top Traffic |
| 🔴 ALTA | `/` (Home) | 27 | 713 | CRÍTICO |
| 🟡 MEDIA | `/contacto` | 0 | 111 | Importante |
| 🟡 MEDIA | `/documentos-ai` | 0 | 16 | Niche |
| 🟡 MEDIA | `/servicios` | 0 | 13 | Estructura |
| 🟡 MEDIA | `/documentos/transferencia` | 0 | 11 | Servicio específico |
| 🟢 BAJA | `/documentos` | 0 | 9 | - |
| 🟢 BAJA | `/servicios/promesa` | 0 | 8 | - |
| 🟢 BAJA | `/servicios/poderes` | 0 | 6 | - |
| 🟢 BAJA | `/servicios/transferencia` | 0 | 6 | - |
| 🟢 BAJA | `/servicios/declaraciones` | 0 | 4 | - |
| 🟢 BAJA | `/documentos/promesa` | 0 | 3 | - |
| 🟢 BAJA | `/documentos/contratos` | 0 | 1 | - |
| 🟢 BAJA | `/documentos/viaje` | 0 | 1 | - |
| 🟢 BAJA | `/servicios/viaje` | 0 | 1 | - |
| 🟢 BAJA | `/documentos/poderes` | 0 | 1 | - |
| 🟢 BAJA | `/documentos/declaraciones` | 0 | 1 | - |
| 🟢 BAJA | `/servicios/contratos` | 0 | 1 | - |

---

## 2. Mapa de Redirecciones (301 Permanent)

La validación de destino se basa en la nueva estructura de `AOE v2` definida en `brain.md`.

### A. Core Pages
| Origen | Destino v2 | Lógica |
|--------|------------|--------|
| `/` | `/` | Home a Home |
| `/calculadoras` | `/calculadoras` | Hub de calculadoras |
| `/contacto` | `/contacto` | Página de contacto |
| `/servicios` | `/servicios` | Hub de servicios |
| `/documentos` | `/servicios` | Simplificación de estructura |
| `/documentos-ai` | `/servicios` | (Temporal) Redirigir a servicios hasta tener feature equivalente |

### B. Servicios Específicos & Calculadoras
| Origen | Destino v2 | Lógica |
|--------|------------|--------|
| `/documentos/transferencia` | `/calculadoras/inmuebles` | Intención de usuario: Calcular costo de transferencia |
| `/servicios/transferencia` | `/servicios/transferencia-de-dominio` | Página informativa del servicio |
| `/documentos/promesa` | `/servicios/promesas-compraventa` | Página de servicio |
| `/servicios/promesa` | `/servicios/promesas-compraventa` | Unificación de URL |
| `/servicios/poderes` | `/calculadoras/servicios` | Intención: Costo o trámite de poder |
| `/documentos/poderes` | `/calculadoras/servicios` | Unificación |
| `/servicios/declaraciones` | `/calculadoras/servicios` | Trámite notarial menor |
| `/documentos/declaraciones` | `/calculadoras/servicios` | Unificación |
| `/servicios/viaje` | `/calculadoras/servicios` | Permisos de salida del país |
| `/documentos/viaje` | `/calculadoras/servicios` | Unificación |
| `/documentos/contratos` | `/calculadoras/vehiculos` | (Asumiendo mayor volúmen es vehicular, o redirigir a hub `/contratos`) |
| `/servicios/contratos` | `/calculadoras/vehiculos` | Idem |

---

## 3. Implementación Técnica

### `next.config.ts`
Implementaremos los redirects usando la función `redirects()` de Next.js. Esto asegura que el servidor retorne el status `301 Moved Permanently` antes de renderizar nada.

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ... otras configs
  async redirects() {
    return [
      // --- HUBS ---
      {
        source: '/documentos',
        destination: '/servicios',
        permanent: true,
      },
      {
        source: '/documentos-ai',
        destination: '/servicios',
        permanent: true,
      },

      // --- CALCULADORAS & SERVICIOS ESPECÍFICOS ---
      // Transferencias / Inmuebles
      {
        source: '/documentos/transferencia',
        destination: '/calculadoras/inmuebles', 
        permanent: true,
      },
      {
        source: '/servicios/transferencia',
        destination: '/servicios/transferencia-de-dominio',
        permanent: true,
      },
      
      // Promesas
      {
        source: '/documentos/promesa',
        destination: '/servicios/promesa-compraventa',
        permanent: true,
      },
      {
        source: '/servicios/promesa',
        destination: '/servicios/promesa-compraventa',
        permanent: true,
      },

      // Poderes
      {
        source: '/servicios/poderes',
        destination: '/calculadoras/servicios', // O página específica si existe
        permanent: true,
      },
      {
        source: '/documentos/poderes',
        destination: '/calculadoras/servicios',
        permanent: true,
      },

      // Declaraciones
      {
        source: '/servicios/declaraciones',
        destination: '/calculadoras/servicios',
        permanent: true,
      },
      {
        source: '/documentos/declaraciones',
        destination: '/calculadoras/servicios',
        permanent: true,
      },

      // Permisos de Salida / Viaje
      {
        source: '/servicios/viaje',
        destination: '/calculadoras/servicios',
        permanent: true,
      },
      {
        source: '/documentos/viaje',
        destination: '/calculadoras/servicios',
        permanent: true,
      },
      
      // Contratos Genéricos -> Vehicular (Producto Estrella)
      {
        source: '/documentos/contratos',
        destination: '/calculadoras/vehiculos',
        permanent: true,
      },
       {
        source: '/servicios/contratos',
        destination: '/calculadoras/vehiculos',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

---

## 4. Plan de Verificación

### Script de Validación Automática
Crearemos un script en `scripts/verify-redirects.ts` para testear automáticamente que las URLs antiguas retornen 301 y apunten al lugar correcto.

### Verificación en Google Search Console
1. **Día 0 (Deploy):** Usar la herramienta "Inspeccionar URL" en GSC con una URL antigua (ej: `/calculadoras`) para confirmar que Google ve la redirección.
2. **Semana 1:** Monitorear el reporte de "Páginas" > "No se han encontrado (404)" para capturar cualquier URL que se nos haya pasado (ej: viejos posts de blog, campañas antiguas).

---

## 5. Próximos Pasos

1. [ ] Aprobar este mapa de redirecciones.
2. [ ] Implementar cambios en `next.config.ts`.
3. [ ] Crear script de verificación.
4. [ ] Deploy a Vercel y test final.
