// Constantes del dominio legal ecuatoriano

export const SITE_NAME = 'Abogados Online Ecuador'
export const SITE_URL = 'https://abogadosonlineecuador.com'
export const SITE_DESCRIPTION =
  'Plataforma legal tecnológica para generación de contratos, calculadoras notariales y servicios legales en Ecuador.'

export const NOTARIA_INFO = {
  nombre: 'Notaría 18 de Quito',
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
  { href: '/servicios', label: 'Servicios' },
  { href: '/calculadoras', label: 'Calculadoras' },
  { href: '/precios', label: 'Precios' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
] as const
