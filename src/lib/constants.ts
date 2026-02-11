// Constantes del dominio legal ecuatoriano

export const SITE_NAME = 'Abogados Online Ecuador'
export const SITE_URL = 'https://abogadosonlineecuador.com'
export const SITE_DESCRIPTION =
  'Plataforma legal tecnológica para generación de contratos, calculadoras notariales y servicios legales en Ecuador.'

export const NOTARIA_INFO = {
  nombre: 'Abogados Online Ecuador',
  notario: 'Jose Luis',
  ciudad: 'Quito',
  provincia: 'Pichincha',
  pais: 'Ecuador',
} as const

export const DOCUMENT_TYPES = {
  VEHICLE_CONTRACT: 'Contrato de Compra-Venta Vehicular',
  POWER_OF_ATTORNEY: 'Poder General',
  DECLARATION: 'Declaración Juramentada',
  PROMISE: 'Promesa de Compra-Venta',
  TRANSFER: 'Cesión de Derechos',
  TRAVEL_AUTH: 'Autorización de Viaje',
  CUSTOM: 'Documento Personalizado',
} as const

export const CALCULATOR_TYPES = {
  NOTARIAL: 'notarial',
  ALCABALAS: 'alcabalas',
  PLUSVALIA: 'plusvalia',
  REGISTRO: 'registro-propiedad',
  CONSEJO_PROVINCIAL: 'consejo-provincial',
} as const

export const NAV_LINKS = [
  { href: '/servicios', label: 'Servicios', badge: null },
  { href: '/calculadoras', label: 'Calculadoras', badge: 'Gratis' },
  { href: '/blog', label: 'Blog', badge: null },
  { href: '/contacto', label: 'Contacto', badge: null },
] as const

export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/593979317579',
  email: 'mailto:info@abogadosonlineecuador.com',
  facebook: 'https://facebook.com/abogadosonlineecuador',
  instagram: 'https://instagram.com/abogadosonlineecuador',
} as const
