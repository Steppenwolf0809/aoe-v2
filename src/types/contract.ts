export interface ContractData {
  vehiculo: {
    placa: string
    marca: string
    modelo: string
    anio: number
    color: string
    motor: string
    chasis: string
    avaluo: number
  }
  comprador: {
    cedula: string
    nombres: string
    direccion: string
    telefono: string
    email: string
  }
  vendedor: {
    cedula: string
    nombres: string
    direccion: string
    telefono: string
    email: string
  }
}

export type ContractStatus = 'DRAFT' | 'PAID' | 'GENERATED' | 'DOWNLOADED'

export type DocumentType =
  | 'VEHICLE_CONTRACT'
  | 'POWER_OF_ATTORNEY'
  | 'DECLARATION'
  | 'PROMISE'
  | 'TRANSFER'
  | 'TRAVEL_AUTH'
  | 'CUSTOM'
