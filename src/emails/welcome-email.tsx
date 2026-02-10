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
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    clientName?: string;
}

export const WelcomeEmail = ({
    clientName = 'Cliente',
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>¡Bienvenido a Abogados Online Ecuador! 🚀</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logoText}>Abogados Online Ecuador</Text>
                        <Text style={logoSubtext}>LegalTech & Notaría 18</Text>
                    </Section>

                    <Section style={content}>
                        <Heading style={h1}>¡Hola {clientName}!</Heading>
                        <Text style={text}>
                            Es un gusto saludarte. Soy **Jose Luis Zapata** de **Abogados Online Ecuador**.
                        </Text>
                        <Text style={text}>
                            Hemos recibido tu interés en nuestros servicios legales digitales. Queremos que sepas que estamos aquí para hacer tus trámites más rápidos, seguros y transparentes.
                        </Text>

                        <Heading as="h2" style={h2}>¿Qué sigue ahora?</Heading>
                        <Section style={list}>
                            <Text style={listItem}>
                                <strong>1. Explora:</strong> Puedes seguir usando nuestras calculadoras y generadores en la web.
                            </Text>
                            <Text style={listItem}>
                                <strong>2. Chat Directo:</strong> Si tienes una duda rápida, escríbenos a nuestro [WhatsApp manejado por IA](https://wa.me/593979317579).
                            </Text>
                            <Text style={listItem}>
                                <strong>3. Seguridad:</strong> Todos tus datos y documentos están protegidos con altos estándares de cifrado.
                            </Text>
                        </Section>

                        <Text style={text}>
                            Estamos listos para acompañarte en tu próxima gestión legal.
                        </Text>

                        <Section style={btnContainer}>
                            <Button style={button} href="https://wa.me/593979317579">
                                Hablar por WhatsApp
                            </Button>
                        </Section>

                        <Text style={signature}>
                            Saludos cordiales,<br />
                            <strong>Jose Luis Zapata</strong><br />
                            Legal Experience Lead | Fundador AoE
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

export default WelcomeEmail;

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

const h2 = {
    color: '#1e40af',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '24px 0 12px',
};

const text = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '0 0 16px',
};

const list = {
    margin: '0 0 24px',
};

const listItem = {
    color: '#475569',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0 0 10px',
};

const btnContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
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
