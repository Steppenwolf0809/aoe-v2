import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ContratoGeneradoEmailProps {
  clientName: string
  vehiclePlaca: string
  vehicleMarca: string
  vehicleModelo: string
  downloadUrl: string
}

export const ContratoGeneradoEmail = ({
  clientName = 'Cliente',
  vehiclePlaca = 'ABC1234',
  vehicleMarca = 'CHEVROLET',
  vehicleModelo = 'SPARK GT',
  downloadUrl = 'https://abogadosonlineecuador.com/contratos/download',
}: ContratoGeneradoEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Tu contrato de compraventa vehicular está listo - Abogados Online
        Ecuador
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header con logo */}
          <Section style={header}>
            <Text style={logoText}>Abogados Online Ecuador</Text>
            <Text style={logoSubtext}>Servicio legal digital independiente</Text>
          </Section>

          {/* Saludo */}
          <Heading style={h1}>¡Tu contrato está listo!</Heading>
          <Text style={text}>
            Hola <strong>{clientName}</strong>, tu contrato de compraventa
            vehicular ha sido generado exitosamente y está listo para su uso.
          </Text>

          {/* Detalles del vehículo */}
          <Section style={vehicleBox}>
            <Text style={vehicleLabel}>VEHÍCULO</Text>
            <Text style={vehiclePlacaText}>{vehiclePlaca}</Text>
            <Text style={vehicleDetails}>
              {vehicleMarca} {vehicleModelo}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Instrucciones */}
          <Heading as="h2" style={h2}>
            ¿Qué sigue?
          </Heading>

          <Section style={stepsSection}>
            <Text style={stepText}>
              <strong>1. Descarga tu contrato</strong>
              <br />
              Encontrarás el PDF adjunto en este email o usa el botón de abajo
              para descargarlo.
            </Text>

            <Text style={stepText}>
              <strong>2. Revisa el documento</strong>
              <br />
              Verifica que todos los datos estén correctos antes de firmar.
            </Text>

            <Text style={stepText}>
              <strong>3. Firma el contrato</strong>
              <br />
              Coordina la legalización de firmas en la notaría de tu
              preferencia con ambas partes.
            </Text>

            <Text style={stepText}>
              <strong>4. Realiza la transferencia</strong>
              <br />
              Con el contrato legalizado, procede a tramitar la transferencia
              en la ANT.
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button href={downloadUrl} style={button}>
              Descargar Contrato PDF
            </Button>
            <Text style={downloadNote}>
              El link de descarga es válido por 24 horas
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Información de contacto */}
          <Section style={contactSection}>
            <Heading as="h3" style={h3}>
              ¿Necesitas ayuda?
            </Heading>
            <Text style={text}>
              Estamos aquí para asistirte en todo el proceso:
            </Text>
            <Text style={contactText}>
              📱 WhatsApp:{' '}
              <Link
                href="https://wa.me/593998765432"
                style={link}
              >
                +593 99 876 5432
              </Link>
            </Text>
            <Text style={contactText}>
              📧 Email:{' '}
              <Link
                href="mailto:info@abogadosonlineecuador.com"
                style={link}
              >
                info@abogadosonlineecuador.com
              </Link>
            </Text>
            <Text style={contactText}>
              📍 Dirección: Av. 12 de Octubre y Cordero, Quito
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            © {new Date().getFullYear()} Abogados Online Ecuador
            <br />
            <Link
              href="https://www.abogadosonlineecuador.com"
              style={footerLink}
            >
              www.abogadosonlineecuador.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 40px',
  backgroundColor: '#1e40af',
  textAlign: 'center' as const,
}

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const logoSubtext = {
  color: '#93c5fd',
  fontSize: '14px',
  margin: '4px 0 0 0',
  padding: '0',
}

const h1 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '32px 40px 16px',
  padding: '0',
  lineHeight: '1.3',
}

const h2 = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '32px 40px 16px',
  padding: '0',
}

const h3 = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  padding: '0',
}

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 40px 16px',
}

const vehicleBox = {
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
  textAlign: 'center' as const,
}

const vehicleLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  margin: '0 0 8px',
}

const vehiclePlacaText = {
  color: '#1e40af',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  fontFamily: 'monospace',
  letterSpacing: '2px',
}

const vehicleDetails = {
  color: '#334155',
  fontSize: '16px',
  margin: '0',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
}

const stepsSection = {
  margin: '0 40px',
}

const stepText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 40px',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '0 auto',
}

const downloadNote = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '12px 0 0',
  textAlign: 'center' as const,
}

const contactSection = {
  margin: '0 40px',
}

const contactText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '0 40px',
}

const footerLink = {
  color: '#2563eb',
  textDecoration: 'underline',
}

export default ContratoGeneradoEmail
