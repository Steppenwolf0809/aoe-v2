# Guía de Testing: Generación de Contratos

Esta guía te muestra 3 formas de probar la generación de PDFs de contratos sin necesidad de configurar PayPhone completamente.

---

## 🚀 Opción 1: Endpoint de Testing (Más Rápido)

### Paso 1: Crear un contrato
1. Ve a http://localhost:3000/contratos/vehicular (no requiere login)
2. Completa el wizard con datos de prueba
3. Al finalizar, obtendrás un `contractId` (cópialo de la URL)

### Paso 2: Generar PDF sin pago
Usa curl o Postman:

```bash
curl -X POST http://localhost:3000/api/dev/test-contract \
  -H "Content-Type: application/json" \
  -d '{"contractId": "tu-contract-id-aqui"}'
```

O desde el navegador (consola DevTools):
```javascript
fetch('/api/dev/test-contract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contractId: 'PEGA_EL_ID_AQUI' })
}).then(r => r.json()).then(console.log)
```

### Respuesta esperada:
```json
{
  "success": true,
  "message": "Contract PDF generated successfully (DEV MODE)",
  "data": {
    "contractId": "...",
    "pdfUrl": "...",
    "downloadToken": "...",
    "downloadUrl": "https://..."
  }
}
```

### Paso 3: Descargar el PDF
Copia el `downloadUrl` de la respuesta y ábrelo en el navegador.

---

## 💻 Opción 2: Script de Consola

Ejecuta este script en la consola del navegador (F12 > Console) mientras estás en la página de contratos:

```javascript
// Función helper para testing rápido
async function testGenerateContract(contractId) {
  console.log('🔄 Marcando contrato como pagado...')

  // Marcar como PAID
  const updateRes = await fetch('/api/dev/test-contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractId })
  })

  const result = await updateRes.json()

  if (result.success) {
    console.log('✅ PDF generado exitosamente!')
    console.log('📥 Link de descarga:', result.data.downloadUrl)

    // Abrir en nueva pestaña
    window.open(result.data.downloadUrl, '_blank')

    // Recargar página para ver cambios
    setTimeout(() => location.reload(), 2000)
  } else {
    console.error('❌ Error:', result.error)
  }

  return result
}

// Uso: testGenerateContract('contract-id-aqui')
```

### Uso rápido:
1. Abre http://localhost:3000/dashboard/contratos
2. Abre la consola (F12)
3. Pega el script completo
4. Ejecuta: `testGenerateContract('tu-contract-id')`

---

## 🧪 Opción 3: PayPhone Sandbox

### Configuración inicial:

1. **Activar modo Sandbox en PayPhone:**
   - Ve al dashboard de PayPhone
   - Configuración > Ambiente
   - Activa "Modo Pruebas" o "Sandbox"

2. **Obtener credenciales de Sandbox:**
   - En modo sandbox, obtendrás diferentes credenciales
   - Token de prueba
   - Store ID de prueba

3. **Usar tarjetas de prueba:**

   PayPhone generalmente acepta estas tarjetas de prueba:

   **Visa - Pago exitoso:**
   ```
   Número: 4242 4242 4242 4242
   Fecha: Cualquier fecha futura
   CVV: 123
   ```

   **Mastercard - Pago exitoso:**
   ```
   Número: 5555 5555 5555 4444
   Fecha: Cualquier fecha futura
   CVV: 123
   ```

   **Visa - Pago rechazado:**
   ```
   Número: 4000 0000 0000 0002
   Fecha: Cualquier fecha futura
   CVV: 123
   ```

### Flujo de prueba completo:

1. Crea un contrato en `/dashboard/contratos/nuevo`
2. Click en "Pagar y generar contrato"
3. Serás redirigido a PayPhone Sandbox
4. Usa una tarjeta de prueba
5. PayPhone te redirige de vuelta con el resultado
6. El PDF se genera automáticamente

---

## 🔍 Verificar que todo funciona

### 1. Check del endpoint de dev:
```bash
curl http://localhost:3000/api/dev/test-contract
```

Debería responder:
```json
{
  "devMode": true,
  "message": "Dev endpoints are enabled"
}
```

### 2. Verificar Supabase Storage:
1. Ve al dashboard de Supabase
2. Storage > Buckets
3. Verifica que existe el bucket `contracts` (privado)

### 3. Verificar email (Resend):
Si tienes `RESEND_API_KEY` configurada, el email se enviará automáticamente.

---

## 🐛 Troubleshooting

### Error: "This endpoint is only available in development"
- Solución: Asegúrate de estar en desarrollo (`npm run dev`), no en producción

### Error: "Contract not found"
- Verifica que el contractId sea correcto
- Asegúrate de estar autenticado
- Verifica que el contrato pertenezca a tu usuario

### Error: "Failed to upload contract PDF"
- Verifica que el bucket `contracts` exista en Supabase Storage
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurada

### Error: "Failed to generate PDF"
- Verifica que los datos del contrato estén completos
- Revisa la consola del servidor para ver el error detallado

### PDF generado pero no llega el email
- Verifica que `RESEND_API_KEY` esté configurada
- Verifica que tu email esté verificado en Resend
- Revisa los logs de Resend en su dashboard

---

## 📊 Estados del contrato

Durante el testing, verás estos estados:

1. **DRAFT** - Contrato creado, esperando pago
2. **PENDING_PAYMENT** - Redirigido a PayPhone (solo en flujo real)
3. **PAID** - Pago confirmado, generando PDF
4. **GENERATED** - PDF listo, email enviado
5. **DOWNLOADED** - Usuario descargó el PDF

---

## 🎯 Datos de prueba sugeridos

### Vendedor:
```
Nombres: Juan Carlos Pérez López
Cédula: 1712345678
Dirección: Av. República E7-123 y Almagro, Quito
Teléfono: 0998765432
Email: vendedor@test.com
```

### Comprador:
```
Nombres: María Elena García Torres
Cédula: 1787654321
Dirección: Calle Los Pinos N34-56, Quito
Teléfono: 0987654321
Email: comprador@test.com
```

### Vehículo:
```
Placa: PBX-1234
Marca: CHEVROLET
Modelo: SPARK GT AC 1.2 5P
Año: 2020
Color: BLANCO
Motor: B12D1234567
Chasis: KL1MJ6A49LC123456
Avalúo: $15,000
```

---

**Última actualización:** 2026-02-09
