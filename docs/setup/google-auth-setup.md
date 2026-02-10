# Setup: Inicio de sesion con Google (Supabase)

Este documento explica las variables que necesitas y el proceso completo para habilitar `Continuar con Google` en AOE v2.

## 1. Variables obligatorias en tu app

Agrega estas variables en `.env.local` (local) y en Vercel (produccion):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Variables recomendadas (no bloquean Google login, pero si otros flujos)

```env
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
```

Importante:
- `SUPABASE_SERVICE_ROLE_KEY` es secreta. Nunca exponerla en cliente.
- `NEXT_PUBLIC_*` si se exponen al cliente por diseno.

## 2. De donde sacar cada valor

### Supabase -> Project Settings -> API
- `NEXT_PUBLIC_SUPABASE_URL` -> `Project URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> `anon public`
- `SUPABASE_SERVICE_ROLE_KEY` -> `service_role` (secret)

### App URL
- Local: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Produccion: `NEXT_PUBLIC_APP_URL=https://tu-dominio.com`

## 3. Configurar Google OAuth en Supabase

En Supabase Dashboard:
1. Ir a `Authentication` -> `Providers` -> `Google`.
2. Activar Google provider.
3. Pegar `Client ID` y `Client Secret` de Google Cloud.
4. Guardar.

## 4. Configurar URLs de Auth en Supabase

En `Authentication` -> `URL Configuration`:

- `Site URL`:
  - Local: `http://localhost:3000`
  - Produccion: `https://tu-dominio.com`

- `Redirect URLs` (agregar ambas):
  - `http://localhost:3000/auth/callback`
  - `https://tu-dominio.com/auth/callback`

Nota: tu app ya usa callback en `src/app/(auth)/auth/callback/route.ts`.

## 5. Configurar OAuth Client en Google Cloud

En Google Cloud Console:
1. Crear o abrir proyecto.
2. Configurar `OAuth consent screen`.
3. Crear credencial `OAuth 2.0 Client ID` (tipo Web Application).
4. En `Authorized redirect URIs` agregar:

```text
https://<tu-project-ref>.supabase.co/auth/v1/callback
```

5. Copiar `Client ID` y `Client Secret` y pegarlos en Supabase (paso 3).

## 6. Variables que te faltaban en este proyecto

Si no las tienes aun en `.env.local`, agrega al menos:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
```

## 7. Checklist de validacion

1. Reiniciar servidor:

```bash
npm run dev
```

2. Ir a `/iniciar-sesion`.
3. Click en `Continuar con Google`.
4. Debe redirigir a Google.
5. Al volver, debe entrar por `/auth/callback` y luego a `/dashboard`.

## 8. Errores comunes

### `redirect_uri_mismatch`
- Falta o esta mal la URI en Google Cloud o Supabase.
- Revisar exactamente:
  - `https://<project-ref>.supabase.co/auth/v1/callback`

### Vuelve a login sin sesion
- `Site URL` o `Redirect URLs` mal configuradas en Supabase.
- `NEXT_PUBLIC_APP_URL` no coincide con la URL real.

### `supabaseKey is required`
- Normalmente falta `SUPABASE_SERVICE_ROLE_KEY` en entorno para flujos admin.

---

Ultima actualizacion: 2026-02-10
