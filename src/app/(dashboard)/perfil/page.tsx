import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Perfil | Dashboard | Abogados Online Ecuador',
}

export default function PerfilPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Mi Perfil</h1>
      {/* TODO: implementar ProfileForm */}
    </div>
  )
}
