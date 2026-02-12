Aquí tienes el **Informe Técnico de Configuración de Variables para Payphone**, adaptado específicamente para tu arquitectura **AOE v2** (Next.js + n8n + Railway).

Este informe consolida la documentación oficial y las mejores prácticas de seguridad para evitar errores financieros en producción.

---

# 🛡️ Informe de Integración: Variables de Entorno Payphone (API Sale & Links)

**Objetivo:** Configurar las credenciales necesarias para procesar pagos (SaaS Vehicular y Trámites) de forma segura.
**Fuente:** Documentación Técnica Payphone y Guías de Implementación Vercel/Railway.

## 1. Variables de Identidad (Credenciales Maestras)

Estas son las llaves de acceso a tu cuenta. **IMPORTANTE:** Payphone maneja dos entornos (*Pruebas* y *Producción*), cada uno tiene sus propias credenciales. No las mezcles.

### `PAYPHONE_TOKEN` (El Secreto)
Es el token de autenticación tipo "Bearer" que autoriza el cobro.
*   **Origen:** Se genera en la plataforma **Payphone Developer** > Sección "Credenciales".
*   **Formato:** Cadena larga alfanumérica.
*   **Configuración en n8n/Railway:** Debe guardarse como **Secreto** (Header Auth).
*   **Uso:** Se envía en el Header de la petición: `Authorization: Bearer <PAYPHONE_TOKEN>`.
*   **Advertencia:** Si usas el token de "Pruebas", la transacción se aprueba pero no cobra dinero real.

### `PAYPHONE_STORE_ID` (La Sucursal)
Identifica a qué "tienda" o centro de costos va el dinero.
*   **Origen:** Plataforma Payphone Developer > Icono de "Listado de Tiendas".
*   **Formato:** Un ID numérico o UUID.
*   **Uso:** Se envía en el cuerpo (JSON) de la petición como `storeId`.

---

## 2. Variables de Configuración de Entorno (Endpoints)

Para evitar "hardcodear" URLs y poder cambiar entre pruebas y producción fácilmente.

### `PAYPHONE_API_URL`
La dirección base de la API.
*   **Valor (Producción/Live):** `https://pay.payphone.app/api`.
*   **Valor (Pruebas):** Generalmente es la misma URL, pero el comportamiento cambia según el *Token* usado (si el token es de una app de pruebas, el sistema simula el cobro).
*   **Endpoints Clave a concatenar:**
    *   Para botón de pago directo: `/Sale`.
    *   Para generar link de pago: `/Links`.

### `NEXT_PUBLIC_APP_URL` (Tu Dominio)
Necesaria para que Payphone sepa a dónde devolver al usuario después de pagar.
*   **Valor:** `https://abogadosonlineecuador.com` (o tu dominio en Railway).
*   **Uso:** Se utiliza para construir el parámetro `responseUrl` dentro de la petición de pago. Ejemplo: `https://tu-web.com/pago-exitoso`.

---

## 3. Variables de Lógica de Negocio (Críticas para tu SaaS)

Estas variables controlan cómo se procesan los datos matemáticos y de seguimiento.

### `PAYPHONE_REGION_PREFIX` (Prefijo de Orden)
Para evitar colisiones de IDs entre tus pruebas y ventas reales.
*   **Recomendación:**
    *   En Desarrollo: `DEV-AOE-`
    *   En Producción: `PRD-AOE-`
*   **Uso:** Al generar el `clientTransactionId` (tu ID único de orden), antepones esta variable: `PRD-AOE-vehiculo-001`.

### `IMPUESTO_IVA_PCT` (Porcentaje de Impuesto)
Payphone exige desglosar los impuestos.
*   **Valor Actual:** `15` (por el 15% de IVA en Ecuador).
*   **Lógica de Cálculo:** Payphone requiere que envíes `amountWithTax` (base imponible) y `tax` (el valor del IVA) por separado. La suma de ambos debe dar el `amount` total.

---

## 4. La "Trampa" de los Enteros (Cuidado Aquí)

Payphone **NO** usa decimales. Usa enteros en centavos. Esto no es una variable de entorno, pero es una regla de oro para tu código en **n8n** o **Python**.

*   **Regla:** Multiplicar siempre por 100.
    *   $1.00 USD = `100`
    *   $15.50 USD = `1550`
    *   $10.00 USD = `1000`.

---

## 5. Resumen de Implementación en n8n

Para tu flujo de **n8n**, configura un nodo "HTTP Request" con estos valores dinámicos:

| Campo | Valor (Usando Expresiones) | Fuente |
| :--- | :--- | :--- |
| **Método** | POST | |
| **URL** | `{{$env["PAYPHONE_API_URL"]}}/Sale` | |
| **Header: Authorization** | `Bearer {{$env["PAYPHONE_TOKEN"]}}` | |
| **Body (JSON)** | Ver abajo | |

**Estructura del Body (JSON) para n8n:**
```json
{
  "phoneNumber": "{{telefono_cliente}}", 
  "countryCode": "593",
  "clientTransactionId": "{{$env['PAYPHONE_REGION_PREFIX']}}{{id_unico_generado}}",
  "storeId": "{{$env['PAYPHONE_STORE_ID']}}",
  "amount": 1500,  // $15.00 (SaaS Vehicular)
  "amountWithTax": 1304, // Base imponible (~$13.04)
  "tax": 196,      // IVA 15% (~$1.96)
  "reference": "Contrato Vehicular - AOE"
}
```

### ✅ Checklist de Seguridad Antes de Salir a Producción
1.  [ ] Generar credenciales nuevas en Payphone Developer marcando el entorno como **"Producción"**.
2.  [ ] Asegurar que `PAYPHONE_TOKEN` nunca esté expuesto en el frontend (Next.js) con el prefijo `NEXT_PUBLIC_`.
3.  [ ] Verificar que el cálculo de centavos sea exacto (redondeo de enteros) para evitar rechazos por montos inválidos.