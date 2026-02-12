import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // -----------------------------------------------------------------------
      // MIGRACIÓN LEGACY (301) - Basado en tráfico real 2025-2026
      // -----------------------------------------------------------------------

      // HUBS & ESTRUCTURA
      {
        source: '/documentos',
        destination: '/servicios',
        permanent: true,
      },
      {
        source: '/documentos-ai',
        destination: '/servicios',
        permanent: true,
      },
      {
        source: '/servicios/documentos-ai',
        destination: '/servicios',
        permanent: true,
      },

      // CALCULADORAS & SERVICIOS ESPECÍFICOS
      // Transferencias / Inmuebles
      {
        source: '/documentos/transferencia',
        destination: '/calculadoras/inmuebles',
        permanent: true,
      },
      {
        source: '/servicios/transferencia',
        destination: '/servicios/compraventa-inmuebles',
        permanent: true,
      },

      // Promesas
      {
        source: '/documentos/promesa',
        destination: '/servicios/promesa-compraventa',
        permanent: true,
      },
      {
        source: '/servicios/promesa',
        destination: '/servicios/promesa-compraventa',
        permanent: true,
      },

      // Poderes
      {
        source: '/servicios/poderes',
        destination: '/calculadoras/notarial',
        permanent: true,
      },
      {
        source: '/documentos/poderes',
        destination: '/calculadoras/notarial',
        permanent: true,
      },

      // Declaraciones
      {
        source: '/servicios/declaraciones',
        destination: '/calculadoras/notarial',
        permanent: true,
      },
      {
        source: '/documentos/declaraciones',
        destination: '/calculadoras/notarial',
        permanent: true,
      },

      // Permisos de Salida / Viaje
      {
        source: '/servicios/viaje',
        destination: '/calculadoras/notarial',
        permanent: true,
      },
      {
        source: '/documentos/viaje',
        destination: '/calculadoras/notarial',
        permanent: true,
      },

      // Contratos Genéricos -> Vehicular (Producto Estrella)
      {
        source: '/documentos/contratos',
        destination: '/calculadoras/vehiculos',
        permanent: true,
      },
      {
        source: '/servicios/contratos',
        destination: '/calculadoras/vehiculos',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
