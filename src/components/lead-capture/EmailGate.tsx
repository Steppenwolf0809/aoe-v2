"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Unlock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

const gateSchema = z.object({
    email: z.string().email("Ingresa un email válido"),
    name: z.string().min(2, "Ingresa tu nombre"),
    phone: z.string().optional()
});

type GateFormData = z.infer<typeof gateSchema>;

interface EmailGateProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onUnlock: (data: GateFormData) => Promise<void>;
    isLocked?: boolean;
}

export function EmailGate({
    title = "Desbloquear Resultados Completos",
    description = "Ingresa tus datos para ver el desglose detallado y recibir la guía PDF.",
    buttonText = "Ver Presupuesto Detallado",
    onUnlock,
    isLocked = true
}: EmailGateProps) {
    const [loading, setLoading] = useState(false);
    const [unlocked, setUnlocked] = useState(!isLocked);

    const { register, handleSubmit, formState: { errors } } = useForm<GateFormData>({
        resolver: zodResolver(gateSchema)
    });

    const onSubmit = async (data: GateFormData) => {
        setLoading(true);
        try {
            await onUnlock(data);
            setUnlocked(true);
        } catch (error) {
            console.error("Error unlocking:", error);
        } finally {
            setLoading(false);
        }
    };

    if (unlocked) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-green-50/50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800"
            >
                <Unlock className="w-5 h-5 text-green-600" />
                <span className="font-medium">Resultados desbloqueados</span>
            </motion.div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto relative overflow-hidden border-orange-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />

            <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-center text-xl text-slate-800">
                    {title}
                </CardTitle>
                <CardDescription className="text-center text-slate-600">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="gate-name" className="text-sm font-medium text-slate-700">Nombre</label>
                        <Input
                            id="gate-name"
                            placeholder="Juan Pérez"
                            {...register('name')}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="gate-email" className="text-sm font-medium text-slate-700">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <Input
                                id="gate-email"
                                type="email"
                                placeholder="juan@ejemplo.com"
                                {...register('email')}
                                className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-12 mt-2 transition-all"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {buttonText} <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>

                    <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Tus datos están seguros.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
