# Configuración de Resend para Envío de Emails

## 📧 ¿Qué es Resend?

Resend es un servicio moderno de envío de emails diseñado para desarrolladores. Lo usamos en AOE v2 para enviar:
- Presupuestos detallados de escrituración
- Lead magnets (checklist, guías)
- Emails transaccionales de autenticación

## 🔑 Obtener API Key

1. **Crear cuenta en Resend**
   - Visita [https://resend.com](https://resend.com)
   - Crea una cuenta con tu email de trabajo

2. **Obtener API Key**
   - Ve a [https://resend.com/api-keys](https://resend.com/api-keys)
   - Haz clic en "Create API Key"
   - Dale un nombre descriptivo (ej: "AOE v2 Production")
   - Copia la key (empieza con `re_`)

3. **Agregar al archivo `.env.local`**
   ```bash
   RESEND_API_KEY=re_tu_api_key_aqui
   ```

## 📨 Configurar dominio de envío

Por defecto, Resend usa `onboarding@resend.dev` como remitente (solo para testing). Para producción, debes configurar tu dominio:

### Paso 1: Agregar dominio
1. Ve a [https://resend.com/domains](https://resend.com/domains)
2. Haz clic en "Add Domain"
3. Ingresa: `abogadosonlineecuador.com`

### Paso 2: Configurar registros DNS
Resend te dará 3 registros DNS para agregar:

```
Tipo: MX
Host: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Tipo: TXT
Host: @
Value: v=spf1 include:amazonses.com ~all

Tipo: TXT
Host: resend._domainkey
Value: [valor proporcionado por Resend]
```

### Paso 3: Verificar dominio
- Espera 5-10 minutos para que los DNS se propaguen
- Haz clic en "Verify DNS Records" en el dashboard de Resend
- Una vez verificado, podrás enviar desde `noreply@abogadosonlineecuador.com`

## 🧪 Testing en desarrollo

Para testing local, puedes usar el dominio de onboarding de Resend:

```typescript
from: 'Abogados Online Ecuador <onboarding@resend.dev>'
```

**Limitaciones:**
- Solo 100 emails por día
- Solo puedes enviar a tu email registrado
- Los emails van a spam

## 🚀 Uso en código

Los emails se envían a través de Server Actions:

```typescript
// Enviar presupuesto detallado
import { sendPresupuestoDetallado } from '@/actions/send-lead-magnet';

const result = await sendPresupuestoDetallado({
  clientName: 'Juan Pérez',
  clientEmail: 'juan@example.com',
  rol: 'comprador',
  valorInmueble: 100000,
  desglose: { ... },
  total: 5000,
});

// Enviar lead magnet
import { sendLeadMagnet } from '@/actions/send-lead-magnet';

const result = await sendLeadMagnet({
  type: 'checklist',
  clientName: 'María López',
  clientEmail: 'maria@example.com',
});
```

## 📊 Tracking de emails

Resend proporciona tracking automático de:
- **Delivered**: Email entregado al servidor del destinatario
- **Opened**: Email abierto por el usuario
- **Clicked**: Enlaces clickeados dentro del email
- **Bounced**: Email rebotado
- **Complained**: Marcado como spam

Puedes ver estas métricas en:
[https://resend.com/emails](https://resend.com/emails)

## 🔒 Mejores prácticas

1. **Nunca commitees la API key al repositorio**
   - Siempre usa variables de entorno
   - Agrega `.env.local` al `.gitignore`

2. **Usa diferentes keys para dev/staging/prod**
   - Crea keys separadas para cada ambiente
   - Facilita rotación y debugging

3. **Monitorea el rate limit**
   - Plan gratuito: 100 emails/día
   - Plan Starter ($20/mes): 50,000 emails/mes

4. **Verifica el dominio antes de lanzar**
   - Sin dominio verificado, los emails van a spam
   - Testing exhaustivo antes de producción

## 🆘 Troubleshooting

### Error: "API key is invalid"
- Verifica que copiaste la key completa
- La key debe empezar con `re_`
- Reinicia el servidor Next.js después de agregar la variable

### Emails no llegan
- Revisa la carpeta de spam
- Verifica que el dominio esté verificado
- Chequea los logs en el dashboard de Resend

### Rate limit exceeded
- Estás enviando más de 100 emails/día (plan gratuito)
- Upgrade al plan Starter o Business

## 📚 Recursos

- [Documentación oficial de Resend](https://resend.com/docs)
- [React Email docs](https://react.email/docs/introduction)
- [@react-pdf/renderer docs](https://react-pdf.org/)

---

**Nota:** Para producción, asegúrate de tener el dominio verificado y usar el plan adecuado según el volumen de emails esperado.
