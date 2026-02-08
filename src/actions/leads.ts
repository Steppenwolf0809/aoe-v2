"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const leadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string(), // 'inmobiliario', 'vehicular', 'checklist', etc.
  metadata: z.record(z.string(), z.any()).optional()
});

type LeadInput = z.infer<typeof leadSchema>;

export async function submitLead(data: LeadInput) {
  const result = leadSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Datos inválidos' };
  }

  const supabase = await createClient(); // Await createClient() for server actions

  try {
    const { error } = await supabase
      .from('leads')
      .insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        source: result.data.source,
        metadata: result.data.metadata || {},
        status: 'new', // pending contact
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("Supabase error submitting lead:", error);
      return { success: false, error: 'Error guardando datos' };
    }

    // TODO: Enviar email con Resend aquí (siguiente paso)

    return { success: true };
  } catch (e) {
    console.error("Server action exception:", e);
    return { success: false, error: 'Error del servidor' };
  }
}
