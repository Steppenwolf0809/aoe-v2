---
page: n8n-workflows
---
# Prompt 18: n8n Workflows Configuration

Lee el brain.md.

Crea los archivos de workflow exportables para n8n:

1. `n8n/blog-content-pipeline.json`
   - Trigger: webhook o schedule
   - AI genera borrador de blog post
   - Webhook a Next.js para guardar como draft
   - Notificación para revisión

2. `n8n/post-sale-automation.json`
   - Trigger: webhook de pago exitoso
   - Llamar PDF service
   - Guardar en Supabase Storage
   - Enviar email con Resend
   - Actualizar estado del contrato

3. `n8n/social-media.json`
   - Trigger: nuevo blog post publicado
   - Formatear para LinkedIn
   - Formatear para Instagram/Facebook

4. Webhook receiver en `api/webhooks/n8n/route.ts`
   - Verificar `N8N_WEBHOOK_SECRET`
   - Procesar payload según tipo de evento

Estos son JSONs para importar en n8n desplegado en Railway.
