import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://abogadosonlineecuador.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/cotizar'],
      disallow: ['/api/', '/dashboard/', '/perfil/', '/contratos/', '/documentos/', '/suscripcion/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
