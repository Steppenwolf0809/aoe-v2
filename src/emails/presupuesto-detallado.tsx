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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface PresupuestoDetalladoEmailProps {
  clientName: string;
  rol: 'comprador' | 'vendedor';
  valorInmueble: number;
  total: number;
  desglose: {
    notarial: number;
    alcabalas: number;
    utilidad: number;
    registro: number;
    consejoProvincial: number;
  };
}

export const PresupuestoDetalladoEmail = ({
  clientName = 'Cliente',
  rol = 'comprador',
  valorInmueble = 100000,
  total = 5000,
  desglose = {
    notarial: 800,
    alcabalas: 1000,
    utilidad: 1000,
    registro: 200,
    consejoProvincial: 100,
  },
}: PresupuestoDetalladoEmailProps) => {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const porcentaje = ((total / valorInmueble) * 100).toFixed(2);

  return (
    <Html>
      <Head />
      <Preview>
        Tu presupuesto de escrituración está listo - Abogados Online Ecuador
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header con logo */}
          <Section style={header}>
            <Text style={logoText}>Abogados Online Ecuador</Text>
            <Text style={logoSubtext}>Servicio legal digital independiente</Text>
          </Section>

          {/* Saludo */}
          <Heading style={h1}>¡Hola {clientName}!</Heading>
          <Text style={text}>
            Gracias por usar nuestro Presupuestador Inmobiliario. Aquí está el
            desglose completo de los gastos de escrituración para tu {rol === 'comprador' ? 'compra' : 'venta'}.
          </Text>

          {/* Resumen rápido */}
          <Section style={summaryBox}>
            <Text style={summaryLabel}>TOTAL ESTIMADO</Text>
            <Text style={summaryAmount}>{formatCurrency(total)}</Text>
            <Text style={summaryPercentage}>
              {porcentaje}% del valor del inmueble
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Desglose de gastos */}
          <Heading as="h2" style={h2}>
            Desglose de Gastos
          </Heading>

          <Section style={table}>
            <Row style={tableRow}>
              <Column style={tableColConcept}>
                <Text style={tableText}>Honorarios Notariales</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableTextBold}>
                  {formatCurrency(desglose.notarial)}
                </Text>
              </Column>
            </Row>

            <Row style={tableRow}>
              <Column style={tableColConcept}>
                <Text style={tableText}>Impuesto de Alcabalas (Municipal)</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableTextBold}>
                  {formatCurrency(desglose.alcabalas)}
                </Text>
              </Column>
            </Row>

            <Row style={tableRow}>
              <Column style={tableColConcept}>
                <Text style={tableText}>Impuesto de Utilidad</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableTextBold}>
                  {formatCurrency(desglose.utilidad)}
                </Text>
              </Column>
            </Row>

            <Row style={tableRow}>
              <Column style={tableColConcept}>
                <Text style={tableText}>Registro de la Propiedad</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableTextBold}>
                  {formatCurrency(desglose.registro)}
                </Text>
              </Column>
            </Row>

            <Row style={tableRow}>
              <Column style={tableColConcept}>
                <Text style={tableText}>Consejo Provincial</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableTextBold}>
                  {formatCurrency(desglose.consejoProvincial)}
                </Text>
              </Column>
            </Row>

            <Row style={{ ...tableRow, ...totalRow }}>
              <Column style={tableColConcept}>
                <Text style={totalText}>TOTAL</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={totalAmount}>{formatCurrency(total)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Notas importantes */}
          <Section style={notesBox}>
            <Text style={notesTitle}>Notas Importantes:</Text>
            <ul style={notesList}>
              <li style={notesListItem}>
                Este presupuesto es referencial y está basado en valores
                vigentes para Quito.
              </li>
              <li style={notesListItem}>
                Los valores finales pueden variar según el avalúo catastral
                actualizado.
              </li>
              <li style={notesListItem}>
                Plazos estimados: 15 a 25 días hábiles para completar el
                proceso.
              </li>
            </ul>
          </Section>

          {/* CTA Principal */}
          <Section style={ctaSection}>
            <Button style={button} href="https://abogadosonlineecuador.com">
              Agendar Cita Gratuita
            </Button>
            <Text style={ctaSubtext}>
              O contáctanos por WhatsApp al{' '}
              <Link style={link} href="https://wa.me/593987654321">
                +593 98 765 4321
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Abogados Online Ecuador</strong>
              <br />
              Servicio legal digital independiente
              <br />
              <Link style={link} href="mailto:info@abogadosonlineecuador.com">
                info@abogadosonlineecuador.com
              </Link>
              <br />
              <Link style={link} href="https://abogadosonlineecuador.com">
                abogadosonlineecuador.com
              </Link>
            </Text>
            <Text style={disclaimer}>
              Este presupuesto es una estimación basada en tarifas vigentes. No
              constituye una cotización formal vinculante. Para un presupuesto
              exacto, se requiere revisión de documentación completa.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PresupuestoDetalladoEmail;

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 20px',
  backgroundColor: '#2563eb',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
};

const logoSubtext = {
  color: '#dbeafe',
  fontSize: '14px',
  margin: '4px 0 0',
};

const h1 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '32px 20px 16px',
  padding: '0',
};

const h2 = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '32px 20px 16px',
  padding: '0',
};

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 20px 16px',
};

const summaryBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #2563eb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 20px',
  textAlign: 'center' as const,
};

const summaryLabel = {
  color: '#1e40af',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
};

const summaryAmount = {
  color: '#2563eb',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  lineHeight: '1',
};

const summaryPercentage = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 20px',
};

const table = {
  margin: '0 20px',
};

const tableRow = {
  borderBottom: '1px solid #e2e8f0',
  padding: '12px 0',
};

const tableColConcept = {
  width: '70%',
  paddingRight: '8px',
};

const tableColAmount = {
  width: '30%',
  textAlign: 'right' as const,
};

const tableText = {
  color: '#475569',
  fontSize: '14px',
  margin: '0',
};

const tableTextBold = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const totalRow = {
  backgroundColor: '#f8fafc',
  borderBottom: 'none',
  borderTop: '2px solid #2563eb',
  padding: '16px 0',
  marginTop: '8px',
};

const totalText = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
};

const totalAmount = {
  color: '#2563eb',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
};

const notesBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px 20px',
  margin: '0 20px',
};

const notesTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const notesList = {
  color: '#92400e',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
  padding: '0 0 0 20px',
};

const notesListItem = {
  marginBottom: '6px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 20px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  margin: '0 0 16px',
};

const ctaSubtext = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const footer = {
  margin: '0 20px',
};

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
};

const disclaimer = {
  color: '#94a3b8',
  fontSize: '11px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '0',
  fontStyle: 'italic',
};
