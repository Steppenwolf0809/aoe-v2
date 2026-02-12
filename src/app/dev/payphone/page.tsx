import { Suspense } from 'react'
import { PayPhoneTestClient } from './payphone-client'

export default function PayPhoneTestPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'monospace', padding: 20 }}>Cargando...</div>}>
      <PayPhoneTestClient />
    </Suspense>
  )
}

