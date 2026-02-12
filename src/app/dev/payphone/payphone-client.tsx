'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Config = {
  tokenSet: boolean
  tokenLength: number
  tokenLast5: string
  storeIdSet: boolean
  storeId: string
  apiUrl: string
  mode: string
  prefix: string
  appUrl: string
}

type TestResult = {
  success: boolean
  clientTransactionId?: string
  payWithCard?: string
  paymentId?: string
  error?: string
}

export function PayPhoneTestClient() {
  const searchParams = useSearchParams()
  const secret = searchParams.get('secret') ?? ''

  const [config, setConfig] = useState<Config | null>(null)
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [amount, setAmount] = useState('100')
  const [email, setEmail] = useState('dev-test@aoe.ec')

  useEffect(() => {
    fetch(`/api/dev/payphone-test?secret=${encodeURIComponent(secret)}`)
      .then((r) => {
        if (r.status === 403) {
          setAuthorized(false)
          return null
        }
        setAuthorized(true)
        return r.json()
      })
      .then((data) => data && setConfig(data.config))
      .catch(() => setAuthorized(false))
  }, [secret])

  async function runTest() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/dev/payphone-test?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount, 10),
          email,
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (authorized === false) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', fontFamily: 'monospace', textAlign: 'center' }}>
        <h1 style={{ fontSize: 20, color: '#f44' }}>403 - No autorizado</h1>
        <p style={{ color: '#888', marginTop: 8 }}>
          Agrega <code>?secret=TU_CLAVE</code> a la URL
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'monospace', padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>PayPhone Test</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>
        Prueba directa del endpoint Prepare - sin contrato, sin formularios.
      </p>

      {/* Config Status */}
      <div
        style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>ENV CONFIG</h2>
        {config ? (
          <table style={{ width: '100%', fontSize: 13 }}>
            <tbody>
              {Object.entries(config).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ padding: '4px 8px', color: '#888' }}>{key}</td>
                  <td
                    style={{
                      padding: '4px 8px',
                      color: val === false || val === 'NOT SET' || val === 'N/A' ? '#f44' : '#4f4',
                    }}
                  >
                    {String(val)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#aaa' }}>Cargando config...</p>
        )}
      </div>

      {/* Test Form */}
      <div
        style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>TEST PREPARE</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <label style={{ flex: 1 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Amount (centavos)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                background: '#222',
                border: '1px solid #444',
                borderRadius: 4,
                color: '#fff',
                marginTop: 4,
              }}
            />
          </label>
          <label style={{ flex: 2 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                background: '#222',
                border: '1px solid #444',
                borderRadius: 4,
                color: '#fff',
                marginTop: 4,
              }}
            />
          </label>
        </div>
        <button
          onClick={runTest}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#333' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace',
          }}
        >
          {loading ? 'Enviando...' : `Disparar Prepare ($${(parseInt(amount, 10) / 100).toFixed(2)})`}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            background: '#111',
            border: `1px solid ${result.success ? '#2a5' : '#f44'}`,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <h2
            style={{
              fontSize: 14,
              color: result.success ? '#2a5' : '#f44',
              marginBottom: 12,
            }}
          >
            {result.success ? 'OK - PayPhone respondio correctamente' : 'ERROR'}
          </h2>
          <pre
            style={{
              fontSize: 12,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              color: '#ccc',
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
          {result.payWithCard && (
            <a
              href={result.payWithCard}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 12,
                padding: '8px 16px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 6,
                textDecoration: 'none',
                fontSize: 13,
              }}
            >
              Abrir link de pago
            </a>
          )}
        </div>
      )}
    </div>
  )
}

