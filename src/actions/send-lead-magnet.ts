'use server';

import { Resend } from 'resend';
import { renderAsync } from '@react-pdf/renderer';
import { render } from '@react-email/render';
import { PresupuestoDetalladoEmail } from '@/emails/presupuesto-detallado';
import { PresupuestoDetallado } from '@/lib/pdf/generate-presupuesto';
import { ChecklistEscrituracion } from '@/lib/pdf/checklist-escrituracion';
import { Guia5Errores } from '@/lib/pdf/guia-5-errores';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPresupuestoParams {
  clientName: string;
  clientEmail: string;
  rol: 'comprador' | 'vendedor';
  valorInmueble: number;
  avaluoCatastral?: number;
  desglose: {
    notarial: number;
    alcabalas: number;
    utilidad: number;
    registro: number;
    consejoProvincial: number;
  };
  total: number;
}

interface SendLeadMagnetParams {
  type: 'checklist' | 'guia-errores';
  clientName: string;
  clientEmail: string;
}

/**
 * Envía el presupuesto detallado por email con PDF adjunto
 */
export async function sendPresupuestoDetallado(params: SendPresupuestoParams) {
  try {
    // 1. Generar PDF del presupuesto
    const pdfData = {
      clientName: params.clientName,
      clientEmail: params.clientEmail,
      fecha: new Date().toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      rol: params.rol,
      valorInmueble: params.valorInmueble,
      avaluoCatastral: params.avaluoCatastral,
      desglose: params.desglose,
      total: params.total,
    };

    const pdfStream = await renderAsync(
      PresupuestoDetallado({ data: pdfData })
    );

    // Convertir stream a buffer para Resend
    const pdfBuffer = Buffer.from(pdfStream);

    // 2. Renderizar email HTML
    const emailHtml = render(
      PresupuestoDetalladoEmail({
        clientName: params.clientName,
        rol: params.rol,
        valorInmueble: params.valorInmueble,
        total: params.total,
        desglose: params.desglose,
      })
    );

    // 3. Enviar email con Resend
    const result = await resend.emails.send({
      from: 'Abogados Online Ecuador <noreply@abogadosonlineecuador.com>',
      to: params.clientEmail,
      subject: `Tu presupuesto de escrituración está listo - ${params.clientName}`,
      html: emailHtml,
      attachments: [
        {
          filename: `presupuesto-escrituracion-${Date.now()}.pdf`,
          content: pdfBuffer,
        },
      ],
      tags: [
        {
          name: 'category',
          value: 'lead-magnet',
        },
        {
          name: 'type',
          value: 'presupuesto-inmobiliario',
        },
      ],
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending presupuesto:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error desconocido al enviar email',
    };
  }
}

/**
 * Envía lead magnets (checklist o guía de errores) por email
 */
export async function sendLeadMagnet(params: SendLeadMagnetParams) {
  try {
    let pdfBuffer: Buffer;
    let subject: string;
    let pdfFilename: string;

    // 1. Generar el PDF correspondiente
    if (params.type === 'checklist') {
      const pdfStream = await renderAsync(ChecklistEscrituracion());
      pdfBuffer = Buffer.from(pdfStream);
      subject = '✓ Tu Checklist de Escrituración - Abogados Online Ecuador';
      pdfFilename = 'checklist-escrituracion.pdf';
    } else {
      const pdfStream = await renderAsync(Guia5Errores());
      pdfBuffer = Buffer.from(pdfStream);
      subject = '⚠️ 5 Errores que Encarecen tu Escrituración';
      pdfFilename = 'guia-5-errores-escritura.pdf';
    }

    // 2. Email simple en HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
              line-height: 1.6;
              color: #334155;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #2563eb;
              color: white;
              padding: 32px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 32px 20px;
              border: 1px solid #e2e8f0;
              border-top: none;
            }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #64748b;
              font-size: 12px;
              margin-top: 32px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Abogados Online Ecuador</h1>
            <p style="margin: 8px 0 0; color: #dbeafe;">Notaría 18 de Quito</p>
          </div>
          <div class="content">
            <h2>¡Hola ${params.clientName}!</h2>
            <p>
              Gracias por tu interés. Aquí está el documento que solicitaste.
              Lo encontrarás adjunto a este correo en formato PDF.
            </p>
            <p>
              ${
                params.type === 'checklist'
                  ? 'Este checklist te ayudará a tener todos los documentos listos para escriturar tu inmueble sin contratiempos.'
                  : 'Esta guía te mostrará los 5 errores más comunes que encarecen la escrituración y cómo evitarlos para ahorrar miles de dólares.'
              }
            </p>
            <div style="text-align: center;">
              <a href="https://abogadosonlineecuador.com" class="button">
                Agendar Cita Gratuita
              </a>
            </div>
            <p style="margin-top: 24px;">
              ¿Tienes dudas? Contáctanos por WhatsApp al
              <a href="https://wa.me/593987654321" style="color: #2563eb;">+593 98 765 4321</a>
            </p>
          </div>
          <div class="footer">
            <p>
              <strong>Abogados Online Ecuador</strong><br>
              Notaría 18 de Quito<br>
              <a href="mailto:info@abogadosonlineecuador.com" style="color: #2563eb;">info@abogadosonlineecuador.com</a><br>
              <a href="https://abogadosonlineecuador.com" style="color: #2563eb;">abogadosonlineecuador.com</a>
            </p>
          </div>
        </body>
      </html>
    `;

    // 3. Enviar email con Resend
    const result = await resend.emails.send({
      from: 'Abogados Online Ecuador <noreply@abogadosonlineecuador.com>',
      to: params.clientEmail,
      subject: subject,
      html: emailHtml,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
      ],
      tags: [
        {
          name: 'category',
          value: 'lead-magnet',
        },
        {
          name: 'type',
          value: params.type,
        },
      ],
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending lead magnet:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error desconocido al enviar email',
    };
  }
}

/**
 * Genera un PDF de presupuesto sin enviar por email (para descarga directa)
 */
export async function generatePresupuestoPDF(params: SendPresupuestoParams) {
  try {
    const pdfData = {
      clientName: params.clientName,
      clientEmail: params.clientEmail,
      fecha: new Date().toLocaleDateString('es-EC', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      rol: params.rol,
      valorInmueble: params.valorInmueble,
      avaluoCatastral: params.avaluoCatastral,
      desglose: params.desglose,
      total: params.total,
    };

    const pdfStream = await renderAsync(
      PresupuestoDetallado({ data: pdfData })
    );

    return {
      success: true,
      pdf: Buffer.from(pdfStream),
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error desconocido al generar PDF',
    };
  }
}
