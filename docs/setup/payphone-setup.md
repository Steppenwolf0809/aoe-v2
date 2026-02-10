# Configuración de PayPhone

## Paso 1: Crear cuenta en PayPhone Business

1. Ve a https://pay.payphonetodoesposible.com
2. Haz clic en **"Registrarse"** o **"Crear cuenta"**
3. Completa el formulario de registro con los datos de la notaría:
   - Nombre del negocio: **Notaría Décima Octava de Quito**
   - RUC/Cédula
   - Email comercial
   - Teléfono de contacto

## Paso 2: Verificar la cuenta

1. Revisa tu email para el link de verificación
2. Completa el proceso de verificación de identidad
3. Sube los documentos requeridos (RUC, cédula, etc.)

## Paso 3: Configurar modo Desarrollador

1. Inicia sesión en el dashboard de PayPhone
2. Ve a **Configuración** (⚙️) en el menú lateral
3. Selecciona **Desarrolladores** o **API/Integraciones**
4. Activa el **Modo Desarrollador** (si está disponible)

## Paso 4: Obtener credenciales

### Token de autenticación (Bearer Token)

1. En la sección de Desarrolladores, busca **"Token de API"** o **"Bearer Token"**
2. Haz clic en **"Generar Token"** o **"Mostrar Token"**
3. Copia el token completo (incluye el prefijo "Bearer" si lo tiene)
4. Pégalo en `.env.local`:
   ```env
   PAYPHONE_TOKEN=Bearer_tu_token_aqui
   ```

### Store ID (ID de Tienda)

1. En la misma sección, busca **"Store ID"** o **"ID de Comercio"**
2. Copia el ID de tu tienda
3. Pégalo en `.env.local`:
   ```env
   PAYPHONE_STORE_ID=tu_store_id_aqui
   ```

## Paso 5: Configurar Webhook (Opcional)

Para recibir notificaciones automáticas de pagos completados:

1. En Configuración > Webhooks
2. Agrega la URL de tu webhook:
   ```
   https://tudominio.com/api/webhooks/payment
   ```
3. Selecciona los eventos:
   - ✅ Pago completado
   - ✅ Pago fallido
   - ✅ Pago cancelado

## Paso 6: Configurar URL de respuesta

En la configuración de PayPhone, asegúrate de que las URLs de respuesta están configuradas:

- **URL de éxito**: `https://tudominio.com/dashboard/contratos/pago`
- **URL de error**: `https://tudominio.com/dashboard/contratos/pago`

> **Nota:** PayPhone redirigirá al usuario a estas URLs después del pago.

## Paso 7: Probar en Sandbox (Recomendado)

PayPhone normalmente ofrece un ambiente de pruebas:

1. Busca **"Modo Sandbox"** o **"Ambiente de Pruebas"**
2. Actívalo para hacer pruebas sin cargos reales
3. Usa las tarjetas de prueba proporcionadas por PayPhone
4. Una vez confirmado que funciona, cambia a producción

## Paso 8: Verificar variables en Vercel

Si despliegas en Vercel, también agrega las variables ahí:

1. Ve a tu proyecto en Vercel
2. **Settings** > **Environment Variables**
3. Agrega:
   - `PAYPHONE_TOKEN`
   - `PAYPHONE_STORE_ID`
4. Selecciona los ambientes: Production, Preview, Development

## Comisiones de PayPhone

- **Comisión base:** 5% del monto de la transacción
- **IVA:** 15% sobre la comisión (0.75% del total)
- **Total:** ~5.75% del monto

**Ejemplo:**
- Monto del contrato: $9.99
- Comisión PayPhone: $0.50
- IVA: $0.07
- **Total a cobrar al cliente:** $10.56

## Recursos adicionales

- 📚 [Documentación oficial de PayPhone](https://developers.payphone.app/)
- 💬 Soporte: support@payphone.app
- 📞 Call center: 1800-PAYPHONE

## Troubleshooting

### Error: "Invalid token"
- Verifica que copiaste el token completo
- Asegúrate de incluir "Bearer " si es necesario
- Regenera el token si ha expirado

### Error: "Store not found"
- Verifica que el Store ID sea correcto
- Asegúrate de que la cuenta esté verificada

### Pago no se procesa
- Verifica que estés en modo producción (no sandbox)
- Revisa los logs en el dashboard de PayPhone
- Confirma que el webhook esté configurado correctamente

---

**Última actualización:** 2026-02-09
