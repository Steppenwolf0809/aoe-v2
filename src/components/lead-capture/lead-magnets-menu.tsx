'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Mail, FileCheck, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface LeadMagnetOption {
  icon: ReactNode
  label: string
  description: string
  action: () => void
  highlight?: boolean
}

interface LeadMagnetsMenuProps {
  options?: LeadMagnetOption[]
  onEmailClick?: () => void
  onChecklistClick?: () => void
  onWhatsAppClick?: () => void
  whatsappUrl?: string
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function LeadMagnetsMenu({
  options,
  onEmailClick,
  onChecklistClick,
  onWhatsAppClick,
  whatsappUrl = 'https://wa.me/593979317579?text=Hola%2C%20quiero%20agendar%20una%20asesor%C3%ADa%20gratuita',
  className,
}: LeadMagnetsMenuProps) {
  const defaultOptions: LeadMagnetOption[] = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Recibe el desglose completo por email',
      description: 'Te enviamos un PDF con todos los costos detallados',
      action: onEmailClick || (() => {}),
      highlight: true,
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      label: 'Descarga la Checklist de Documentos',
      description: 'Todo lo que necesitas tener listo para tu trámite',
      action: onChecklistClick || (() => {}),
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Agenda asesoría gratuita',
      description: 'Habla directo con un abogado por WhatsApp',
      action: onWhatsAppClick || (() => window.open(whatsappUrl, '_blank')),
    },
  ]

  const items = options || defaultOptions

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5">
        <p className="text-sm font-medium text-[var(--text-secondary)] mb-4 text-center">
          ¿Qué te gustaría hacer?
        </p>

        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, i) => (
            <motion.button
              key={i}
              type="button"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={item.action}
              className={cn(
                'w-full flex items-center gap-4 p-3.5 rounded-xl border text-left cursor-pointer',
                'transition-all duration-200',
                item.highlight
                  ? 'bg-accent-primary/10 border-accent-primary/30 hover:bg-accent-primary/15'
                  : 'bg-bg-secondary border-[var(--glass-border)] hover:bg-bg-tertiary hover:border-[var(--glass-border-hover)]',
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  item.highlight
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'bg-bg-tertiary text-[var(--text-secondary)]',
                )}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium',
                  item.highlight ? 'text-text-primary' : 'text-[var(--text-secondary)]',
                )}>
                  {item.label}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}
