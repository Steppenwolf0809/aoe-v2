'use client'

import { useActionState, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submitContactForm } from '@/actions/contact'
import { cn } from '@/lib/utils'

const formSchema = z.object({
    name: z.string().min(2, { message: 'Mínimo 2 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
    phone: z.string().optional(),
    serviceType: z.string().min(1, { message: 'Selecciona un servicio' }),
    message: z.string().min(10, { message: 'Mínimo 10 caracteres' }),
})

type FormData = z.infer<typeof formSchema>

const serviceOptions = [
    { value: 'notarials', label: 'Trámites Notariales' },
    { value: 'real-estate', label: 'Compraventa Inmobiliaria' },
    { value: 'vehicle', label: 'Trámites Vehiculares' },
    { value: 'corporate', label: 'Servicios Corporativos' },
    { value: 'other', label: 'Otro' },
]

export function ContactForm() {
    const [state, formAction, isPending] = useActionState(submitContactForm, undefined)
    const [successDismissed, setSuccessDismissed] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        trigger,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            serviceType: '',
            message: '',
        },
    })

    useEffect(() => {
        if (state?.success) {
            reset()
        }
    }, [state?.success, reset])

    const showSuccess = Boolean(state?.success) && !successDismissed

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800 backdrop-blur-sm"
                    >
                        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                            ¡Mensaje enviado!
                        </h3>
                        <p className="text-green-700 dark:text-green-300">
                            Gracias por contactarnos. Nuestro equipo legal te responderá a la brevedad posible.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setSuccessDismissed(true)}
                            className="mt-4 border-green-200 hover:bg-green-100 dark:border-green-800 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300"
                        >
                            Enviar otro mensaje
                        </Button>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        action={formAction}
                        className="space-y-6 bg-white/40 dark:bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-xl"
                        onSubmit={(evt) => {
                            evt.preventDefault()
                            setSuccessDismissed(false)
                            const formEl = evt.currentTarget
                            handleSubmit(() => {
                                const formData = new FormData(formEl)
                                formAction(formData)
                            })(evt)
                        }}
                    >
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nombre Completo
                                </label>
                                <Input
                                    {...register('name')}
                                    placeholder="Tu nombre"
                                    className={cn(errors.name && 'border-red-500 focus-visible:ring-red-500')}
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Correo Electrónico
                                </label>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')}
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Teléfono (Opcional)
                                </label>
                                <Input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="+593 97 931 7579"
                                />
                            </div>

                            {/* Service Type Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Tipo de Servicio
                                </label>
                                <Select
                                    onValueChange={(val) => {
                                        setValue('serviceType', val)
                                        trigger('serviceType')
                                    }}
                                >
                                    <SelectTrigger className={cn(errors.serviceType && 'border-red-500 ring-red-500')}>
                                        <SelectValue placeholder="Selecciona un trámite" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Hidden input to ensure value is submitted with FormData */}
                                <input type="hidden" {...register('serviceType')} />

                                {errors.serviceType && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.serviceType.message}
                                    </span>
                                )}
                            </div>

                            {/* Message Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Mensaje
                                </label>
                                <Textarea
                                    {...register('message')}
                                    placeholder="Cuéntanos cómo podemos ayudarte..."
                                    className={cn(
                                        'min-h-[120px] resize-none',
                                        errors.message && 'border-red-500 focus-visible:ring-red-500'
                                    )}
                                />
                                {errors.message && (
                                    <span className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.message.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {state?.message && !state.success && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {state.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    Enviar Mensaje
                                    <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
