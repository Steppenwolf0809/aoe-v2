'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sendPresupuestoDetallado, sendLeadMagnet } from '@/actions/send-lead-magnet';
import { captureLead } from '@/actions/leads';

interface EmailGateProps {
  source: string;
  presupuestoData?: {
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
  };
  leadMagnetType?: 'checklist' | 'guia-errores';
  title?: string;
  description?: string;
  onSuccess?: () => void;
  className?: string;
}

export function EmailGate({
  source,
  presupuestoData,
  leadMagnetType,
  title = 'Recibe el desglose completo',
  description = 'Ingresa tu email y te enviaremos un PDF detallado con todos los costos',
  onSuccess,
  className,
}: EmailGateProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Por favor completa todos los campos');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Capturar lead en la base de datos
      const leadResult = await captureLead(
        {
          email: formData.email,
          name: formData.name,
          source,
        },
        { sendWelcomeEmail: false }
      );

      if (!leadResult.success) {
        throw new Error(leadResult.error || 'Error guardando lead');
      }

      // 2. Enviar el email correspondiente
      let result;

      if (presupuestoData) {
        // Enviar presupuesto detallado
        result = await sendPresupuestoDetallado({
          clientName: formData.name,
          clientEmail: formData.email,
          rol: presupuestoData.rol,
          valorInmueble: presupuestoData.valorInmueble,
          avaluoCatastral: presupuestoData.avaluoCatastral,
          desglose: presupuestoData.desglose,
          total: presupuestoData.total,
        });
      } else if (leadMagnetType) {
        // Enviar lead magnet (checklist o guía)
        result = await sendLeadMagnet({
          type: leadMagnetType,
          clientName: formData.name,
          clientEmail: formData.email,
        });
      } else {
        throw new Error('No se especificó qué enviar');
      }

      if (result.success) {
        setSubmitStatus('success');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Error al enviar el email');
      }
    } catch (error) {
      console.error('Error submitting email gate:', error);
      setSubmitStatus('error');
      setErrorMessage('Ocurrió un error. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Reset error status when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {submitStatus === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                ¡Listo! Revisa tu email
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Te hemos enviado el documento a{' '}
                <span className="font-medium text-accent-primary">
                  {formData.email}
                </span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                Si no lo ves en tu bandeja, revisa la carpeta de spam
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {description}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {submitStatus === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-500">{errorMessage}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar a mi email
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
                  Al enviar, aceptas recibir comunicaciones de Abogados Online
                  Ecuador
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
