'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileInput } from '@/lib/validations/profile'
import { updateProfile, deleteAccount } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProfileFormProps {
  initialFullName: string
  initialPhone?: string | null
  email?: string
}

export function ProfileForm({
  initialFullName,
  initialPhone,
  email,
}: ProfileFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formMessage, setFormMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialFullName,
      phone: initialPhone || '',
    },
  })

  const onSubmit = async (data: ProfileInput) => {
    setIsSaving(true)
    setFormMessage(null)
    setFormError(null)

    const result = await updateProfile(data)
    if (result.success) {
      setFormMessage('Perfil actualizado correctamente.')
      router.refresh()
    } else {
      setFormError(result.error)
    }

    setIsSaving(false)
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Esta accion eliminara tu cuenta y los datos asociados. Esta seguro de continuar?'
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setFormError(null)
    setFormMessage(null)

    const result = await deleteAccount()

    if (result.success) {
      router.replace('/iniciar-sesion')
      router.refresh()
      return
    }

    setFormError(result.error)
    setIsDeleting(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="fullName"
          label="Nombre completo"
          placeholder="Tu nombre completo"
          error={errors.fullName?.message}
          disabled={isSaving || isDeleting}
          {...register('fullName')}
        />

        <Input
          id="phone"
          label="Telefono"
          placeholder="0991234567"
          error={errors.phone?.message}
          disabled={isSaving || isDeleting}
          {...register('phone')}
        />

        {email && (
          <Input
            id="email"
            label="Email"
            value={email}
            disabled
            hint="El email se gestiona desde tu cuenta de autenticacion."
            readOnly
          />
        )}

        {formMessage && (
          <p className="text-sm text-accent-success" role="status">
            {formMessage}
          </p>
        )}

        {formError && (
          <p className="text-sm text-accent-error" role="alert">
            {formError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            disabled={!isDirty || isSaving || isDeleting}
          >
            Guardar cambios
          </Button>
        </div>
      </form>

      <div className="pt-6 border-t border-[var(--glass-border)]">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          Zona de peligro
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Eliminar tu cuenta removera tu acceso al dashboard y los datos
          vinculados.
        </p>
        <Button
          type="button"
          variant="danger"
          isLoading={isDeleting}
          disabled={isSaving || isDeleting}
          onClick={handleDeleteAccount}
        >
          Eliminar cuenta
        </Button>
      </div>
    </div>
  )
}
