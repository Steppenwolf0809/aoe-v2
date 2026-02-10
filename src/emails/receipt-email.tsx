import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface ReceiptEmailProps {
    clientName?: string;
    inquiryType?: string;
}

export const ReceiptEmail = ({
    clientName = 'Cliente',
    inquiryType = 'consulta general',
}: ReceiptEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Confirmación: Hemos recibido tu {inquiryType} ✓</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logoText}>Abogados Online Ecuador</Text>
                        <Text style={logoSubtext}>Soporte Legal Digital</Text>
                    </Section>

                    <Section style={content}>
                        <Heading style={h1}>¡Hola {clientName}!</Heading>
                        <Text style={text}>
                            Te confirmamos que hemos recibido correctamente tu información para el trámite de **{inquiryType}**.
                        </Text>

                        <Section style={statusBox}>
                            <Text style={statusTitle}>Estado actual:</Text>
                            <Text style={statusText}>🕒 En revisión técnica</Text>
                        </Section>

                        <Text style={text}>
                            Nuestro equipo legal validará los datos proporcionados para asegurar que todo esté en orden. Recibirás una actualización en un plazo máximo de **24 a 48 horas laborables**.
                        </Text>

                        <Text style={text}>
                            Si necesitas adjuntar algo más o tienes alguna duda urgente, puedes responder directamente a este correo o escribirnos por [WhatsApp](https://wa.me/593979317579).
                        </Text>

                        <Text style={signature}>
                            Atentamente,<br />
                            <strong>Equipo de Soporte AoE</strong><br />
                            Abogados Online Ecuador
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    <Section style={footer}>
                        <Text style={footerText}>
                            <Link style={link} href="https://abogadosonlineecuador.com">abogadosonlineecuador.com</Link>
                            <br />
                            <Link style={link} href="mailto:info@abogadosonlineecuador.com">info@abogadosonlineecuador.com</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ReceiptEmail;

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
    borderRadius: '8px',
    overflow: 'hidden' as const,
};

const header = {
    backgroundColor: '#2563eb',
    padding: '32px 20px',
    textAlign: 'center' as const,
};

const logoText = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const logoSubtext = {
    color: '#dbeafe',
    fontSize: '14px',
    margin: '4px 0 0',
};

const content = {
    padding: '40px 30px',
};

const h1 = {
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
};

const text = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 16px',
};

const statusBox = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '16px 20px',
    margin: '24px 0',
};

const statusTitle = {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 4px',
};

const statusText = {
    color: '#2563eb',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0',
};

const signature = {
    color: '#1e293b',
    fontSize: '16px',
    marginTop: '32px',
};

const hr = {
    borderColor: '#e2e8f0',
    margin: '0 30px',
};

const footer = {
    padding: '24px 30px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#94a3b8',
    fontSize: '12px',
    lineHeight: '20px',
};

const link = {
    color: '#2563eb',
    textDecoration: 'underline',
};
