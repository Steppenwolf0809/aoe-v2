# 🎨 Plan de Diseño: Landing Page AOE v2

> **Fecha:** 2026-02-07  
> **Investigación basada en:** LegalZoom, Rocket Lawyer, Stripe  
> **Estilo:** Liquid Glass + Bento Grid (alineado con `brain.md`)

---

## 📊 1. Análisis de Referencias

### LegalZoom — Patrones Identificados

| Elemento | Implementación | Aplicación AOE |
|----------|----------------|----------------|
| **Hero Section** | Mensaje claro + CTA prominente + imagen de confianza | Adaptar con animación de contrato |
| **Navegación** | Mega-menú categorizado (Business, Personal, IP) | Simplificar a 4 categorías max |
| **Wizard de Docs** | Cuestionario paso a paso con "plain English" | Wizard vertical con indicador de progreso |
| **Pricing** | 3 tiers (Basic $0, Pro $249, Premium $299) | Modelo similar: Básico, Pro, Premium |
| **Confianza** | Red de abogados + reseñas | Mostrar credenciales notaría + testimonios |
| **DIY + Ayuda** | "Doesn't mean you have to do it all by yourself" | Chatbot + consulta opcional |

**Conclusión LegalZoom:** Excelente balance entre DIY y asistencia legal. La estructura de precios por tiers es clara y el wizard usa preguntas simples en lugar de formularios técnicos.

---

### Rocket Lawyer — Patrones Identificados

| Elemento | Implementación | Aplicación AOE |
|----------|----------------|----------------|
| **Hero** | Carrusel con problemas/soluciones rotativas | Hero estático más impactante para nosotros |
| **Value Props** | "One compliance mistake = big penalty" (fear-based) | Mensajes de seguridad legal |
| **Wizard** | "Guided interview" con árbol de decisiones inteligente | Implementar lógica condicional |
| **CTA** | Trial 7 días gratis destacado | Calculadoras gratuitas como gancho |
| **Pricing** | $39.99/mes, $19.99/mes anual | Nuestro modelo: contrato único + suscripción |
| **Urgencia** | "Don't trust generic AI with your contracts" | Diferenciarnos de IA genérica |

**Conclusión Rocket Lawyer:** El modelo de suscripción con trial es efectivo. El copy usa urgencia y miedo a errores legales para convertir.

---

### Stripe — Patrones Identificados

| Elemento | Implementación | Aplicación AOE |
|----------|----------------|----------------|
| **Diseño** | Minimalista, gradientes sutiles, animaciones fluidas | ✅ Alineado con nuestro Liquid Glass |
| **Hero** | Animaciones de elementos flotantes | Inspiración para contrato animado |
| **Pricing** | Ultra-simple: "2.9% + 30¢" central | Simplificar nuestros precios |
| **Social Proof** | Logos BMW, Amazon, Maersk, Twilio | Usar logos de empresas atendidas |
| **ROI Stats** | "326% return on investment" | Mostrar ahorro vs abogado tradicional |
| **Cards** | Glassmorphism sutil con bordes luminosos | ✅ Exactamente nuestro estilo |
| **Navegación** | Sticky header con blur + transiciones suaves | Implementar igual |

**Conclusión Stripe:** El benchmark definitivo para estética. Sus componentes glass, gradientes y micro-interacciones son exactamente lo que buscamos.

---

## 🎯 2. Arquitectura de la Landing Page

### Secciones en Orden de Scroll

```
┌─────────────────────────────────────────────────────────────┐
│ 1. NAVIGATION BAR                                           │
│    Logo | Servicios | Calculadoras | Precios | Blog | CTA   │
├─────────────────────────────────────────────────────────────┤
│ 2. HERO SECTION (100vh)                                     │
│    "Tu Contrato Legal en Minutos"                           │
│    + Animación de Contrato Ensamblándose                    │
│    + CTA Principal + CTA Secundario                         │
├─────────────────────────────────────────────────────────────┤
│ 3. TRUST BAR                                                │
│    "Más de X contratos generados • 12+ años de experiencia" │
│    + Logos de certificaciones/socios                        │
├─────────────────────────────────────────────────────────────┤
│ 4. SERVICIOS (Cards Glassmorphism)                          │
│    - Contratos Vehiculares                                  │
│    - Calculadoras Notariales                                │
│    - Consultas Legales                                      │
│    - Verificación QR (próximamente)                         │
├─────────────────────────────────────────────────────────────┤
│ 5. CÓMO FUNCIONA (Wizard Preview)                           │
│    3 pasos con animación secuencial                         │
│    1. Completa el formulario → 2. Paga seguro → 3. Descarga │
├─────────────────────────────────────────────────────────────┤
│ 6. CALCULADORAS GRATUITAS (Lead Magnet)                     │
│    Preview interactivo con resultados sample                │
├─────────────────────────────────────────────────────────────┤
│ 7. PRICING TABLE                                            │
│    3 columnas: Básico | Profesional | Premium               │
├─────────────────────────────────────────────────────────────┤
│ 8. TESTIMONIOS                                              │
│    Cards con foto, nombre, empresa, quote                   │
├─────────────────────────────────────────────────────────────┤
│ 9. FAQ ACCORDION                                            │
│    Preguntas frecuentes con expand/collapse                 │
├─────────────────────────────────────────────────────────────┤
│ 10. CTA FINAL                                               │
│     "¿Listo para simplificar tu proceso legal?"             │
├─────────────────────────────────────────────────────────────┤
│ 11. FOOTER                                                  │
│     Links | Redes | Legal | Newsletter                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 3. Hero Section — Animación del Contrato

### Concepto: "El Contrato que se Arma"

Al hacer scroll, cláusulas individuales flotan desde los lados y se unen formando un documento legal completo.

### Implementación Técnica (Framer Motion + Scroll)

```tsx
// components/hero/ContractAnimation.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const clauses = [
  { id: 1, text: 'PARTES CONTRATANTES', delay: 0 },
  { id: 2, text: 'OBJETO DEL CONTRATO', delay: 0.1 },
  { id: 3, text: 'PRECIO Y FORMA DE PAGO', delay: 0.2 },
  { id: 4, text: 'OBLIGACIONES DEL VENDEDOR', delay: 0.3 },
  { id: 5, text: 'OBLIGACIONES DEL COMPRADOR', delay: 0.4 },
  { id: 6, text: 'CLÁUSULA PENAL', delay: 0.5 },
  { id: 7, text: 'FIRMAS', delay: 0.6 },
];

export function ContractAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center">
      {/* Documento base */}
      <motion.div
        className="glass-card w-[400px] h-[550px] p-8 relative overflow-hidden"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0.3, 1]) }}
      >
        {/* Header del documento */}
        <div className="text-center mb-6 border-b border-white/10 pb-4">
          <div className="text-xs text-muted uppercase tracking-widest">
            República del Ecuador
          </div>
          <div className="text-lg font-semibold text-primary mt-1">
            Contrato de Compra-Venta
          </div>
        </div>

        {/* Cláusulas animadas */}
        {clauses.map((clause, index) => {
          const startOffset = 0.1 + clause.delay;
          const endOffset = startOffset + 0.15;
          
          const x = useTransform(
            scrollYProgress,
            [startOffset, endOffset],
            [index % 2 === 0 ? -200 : 200, 0]
          );
          const opacity = useTransform(
            scrollYProgress,
            [startOffset, endOffset],
            [0, 1]
          );

          return (
            <motion.div
              key={clause.id}
              style={{ x, opacity }}
              className="clause-line py-2 border-b border-white/5"
            >
              <div className="text-xs font-medium text-accent-primary uppercase">
                Cláusula {clause.id}
              </div>
              <div className="text-sm text-secondary">{clause.text}</div>
            </motion.div>
          );
        })}

        {/* Sello/firma que aparece al final */}
        <motion.div
          className="absolute bottom-6 right-6"
          style={{
            opacity: useTransform(scrollYProgress, [0.7, 0.85], [0, 1]),
            scale: useTransform(scrollYProgress, [0.7, 0.85], [0.5, 1]),
            rotate: useTransform(scrollYProgress, [0.7, 0.85], [-20, 0]),
          }}
        >
          <div className="w-20 h-20 rounded-full border-2 border-accent-success/50 flex items-center justify-center">
            <span className="text-accent-success text-xs font-bold text-center">
              DOCUMENTO<br/>LEGAL
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Partículas flotantes decorativas */}
      <FloatingParticles />
    </div>
  );
}
```

### Variante Simplificada (Sin Scroll-Linked)

Si el scroll-linked es muy pesado, alternativa con animación auto-play:

```tsx
// Animación que corre sola al montar
const autoPlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const clauseVariants = {
  hidden: (isEven: boolean) => ({
    x: isEven ? -100 : 100,
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 20, stiffness: 100 },
  },
};
```

---

## 💎 4. Cards con Glassmorphism

### Diseño Base del Service Card

```tsx
// components/ui/GlassCard.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: 'blue' | 'purple' | 'green' | 'gold';
  href?: string;
  className?: string;
}

const gradients = {
  blue: 'from-blue-500/20 to-cyan-500/20',
  purple: 'from-purple-500/20 to-pink-500/20',
  green: 'from-emerald-500/20 to-teal-500/20',
  gold: 'from-amber-500/20 to-orange-500/20',
};

export function GlassCard({
  title,
  description,
  icon,
  gradient = 'blue',
  href,
  className,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 20 }}
      className={cn(
        // Base glass styles
        'relative overflow-hidden rounded-2xl',
        'bg-white/[0.03] backdrop-blur-xl',
        'border border-white/[0.08]',
        'p-6 cursor-pointer group',
        className
      )}
    >
      {/* Gradient orb background */}
      <div
        className={cn(
          'absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl',
          'bg-gradient-to-br opacity-30 group-hover:opacity-50 transition-opacity',
          gradients[gradient]
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon container */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            'bg-gradient-to-br',
            gradients[gradient]
          )}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-secondary leading-relaxed">
          {description}
        </p>

        {/* Arrow indicator */}
        <motion.div 
          className="mt-4 flex items-center gap-2 text-accent-primary text-sm font-medium"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          Explorar
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, transparent 55%)',
        }}
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}
```

### Grid de Servicios

```tsx
// components/sections/ServicesSection.tsx
export function ServicesSection() {
  const services = [
    {
      title: 'Contratos Vehiculares',
      description: 'Genera contratos de compra-venta de vehículos en minutos. Válidos legalmente y listos para imprimir.',
      icon: <CarIcon className="w-6 h-6 text-white" />,
      gradient: 'blue' as const,
    },
    {
      title: 'Calculadoras Notariales',
      description: 'Calcula costos notariales y de registro antes de cualquier transacción. 100% gratuito.',
      icon: <CalculatorIcon className="w-6 h-6 text-white" />,
      gradient: 'green' as const,
    },
    {
      title: 'Consultas Legales',
      description: 'Conecta con abogados especializados para resolver tus dudas legales.',
      icon: <ChatIcon className="w-6 h-6 text-white" />,
      gradient: 'purple' as const,
    },
    {
      title: 'Verificación QR',
      description: 'Próximamente: verifica la autenticidad de documentos con código QR seguro.',
      icon: <QrCodeIcon className="w-6 h-6 text-white" />,
      gradient: 'gold' as const,
      badge: 'Próximamente',
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Soluciones Legales Digitales
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para tus trámites legales en un solo lugar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 🎨 5. Paleta de Colores Refinada

### Colores Principales (Confianza Legal + Modernidad)

```css
/* globals.css - Variables CSS extendidas */

:root {
  /* === FONDOS OSCUROS (Base) === */
  --bg-primary: #050506;         /* Negro casi puro */
  --bg-secondary: #0c0c0e;       /* Negro con hint azul */
  --bg-tertiary: #141418;        /* Gris muy oscuro */
  --bg-elevated: #1c1c21;        /* Cards elevadas */

  /* === SUPERFICIES GLASS === */
  --glass-bg: rgba(255, 255, 255, 0.025);
  --glass-bg-hover: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-border-hover: rgba(255, 255, 255, 0.12);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  /* === AZULES LEGALES (Confianza) === */
  --legal-navy: #0f172a;         /* Navy profundo */
  --legal-blue-deep: #1e3a5f;    /* Azul legal formal */
  --legal-blue: #2563eb;         /* Azul primario brillante */
  --legal-blue-light: #60a5fa;   /* Azul para highlights */
  --legal-blue-glow: #3b82f6;    /* Para glows y acentos */

  /* === GRADIENTES MODERNOS === */
  /* Gradiente Hero Principal */
  --gradient-hero: linear-gradient(
    135deg,
    #0f172a 0%,      /* Navy */
    #1e1b4b 25%,     /* Indigo oscuro */
    #172554 50%,     /* Azul navy */
    #0c4a6e 75%,     /* Cyan oscuro */
    #134e4a 100%     /* Teal oscuro */
  );

  /* Gradiente para CTAs */
  --gradient-cta: linear-gradient(
    135deg,
    #2563eb 0%,      /* Azul */
    #7c3aed 100%     /* Púrpura */
  );

  /* Gradiente para cards premium */
  --gradient-premium: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.1) 0%,
    rgba(124, 58, 237, 0.1) 100%
  );

  /* Gradiente para bordes animados */
  --gradient-border: conic-gradient(
    from 0deg,
    #3b82f6,
    #8b5cf6,
    #ec4899,
    #f59e0b,
    #10b981,
    #3b82f6
  );

  /* === ACENTOS === */
  --accent-primary: #3b82f6;     /* Azul brillante */
  --accent-secondary: #8b5cf6;   /* Púrpura */
  --accent-success: #10b981;     /* Verde esmeralda */
  --accent-warning: #f59e0b;     /* Ámbar */
  --accent-error: #ef4444;       /* Rojo */
  --accent-gold: #fbbf24;        /* Dorado premium */

  /* === GRISES SOFISTICADOS === */
  --gray-50: #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;

  /* === TEXTO === */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-accent: var(--accent-primary);
}
```

### Aplicación de Gradientes

```tsx
// components/sections/HeroSection.tsx
export function HeroSection() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Orbs de luz ambiental */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-500" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="w-2 h-2 bg-accent-success rounded-full animate-pulse" />
          <span className="text-sm text-secondary">
            Más de 1,000+ contratos generados
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Tu Contrato Legal
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            en Minutos
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10"
        >
          Genera contratos vehiculares válidos legalmente, calcula costos notariales
          y simplifica tus trámites legales con tecnología moderna.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" size="lg">
            Generar Mi Contrato
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="glass" size="lg">
            Calculadora Gratuita
          </Button>
        </motion.div>
      </div>

      {/* Contract Animation (a la derecha en desktop) */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
        <ContractAnimation />
      </div>
    </section>
  );
}
```

---

## 💰 6. Pricing Table

### Diseño Basado en Stripe (Simplicidad + Confianza)

```tsx
// components/sections/PricingSection.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const plans = [
  {
    name: 'Básico',
    price: '15',
    unit: 'por contrato',
    description: 'Perfecto para necesidades puntuales',
    features: [
      'Contrato vehicular estándar',
      'Validez legal inmediata',
      'Descarga en PDF',
      'Soporte por email',
    ],
    cta: 'Comenzar',
    popular: false,
  },
  {
    name: 'Profesional',
    price: '25',
    unit: 'por contrato',
    description: 'Para transacciones más complejas',
    features: [
      'Todo lo del plan Básico',
      'Cláusulas personalizadas',
      'Asistencia en tiempo real',
      'Revisión legal incluida',
      'Modificaciones ilimitadas',
    ],
    cta: 'Elegir Profesional',
    popular: true,
  },
  {
    name: 'Premium',
    price: '49',
    unit: 'por mes',
    description: 'Acceso ilimitado para negocios',
    features: [
      'Todo lo del plan Profesional',
      'Contratos ilimitados',
      'Plantillas exclusivas',
      'Consulta con abogado (1/mes)',
      'Prioridad en soporte',
      'API para integración',
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Precios Simples y Transparentes
          </motion.h2>
          <p className="text-secondary text-lg">
            Sin costos ocultos. Sin sorpresas. Paga solo por lo que necesitas.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative rounded-2xl p-8
                ${plan.popular 
                  ? 'bg-gradient-to-b from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/50' 
                  : 'bg-white/[0.03] border border-white/[0.08]'
                }
              `}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-accent-primary text-white text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-xl font-semibold text-white mb-2">
                {plan.name}
              </h3>
              
              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-secondary text-sm">{plan.unit}</span>
              </div>

              {/* Description */}
              <p className="text-secondary text-sm mb-6">
                {plan.description}
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-3 rounded-xl font-medium transition-all mb-6
                  ${plan.popular
                    ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }
                `}
              >
                {plan.cta}
              </motion.button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted text-sm mt-12"
        >
          ✓ Pagos seguros con Stripe · ✓ Garantía de satisfacción · ✓ Cancelación en cualquier momento
        </motion.p>
      </div>
    </section>
  );
}
```

---

## 📱 7. Componentes Adicionales

### Navigation Bar (Sticky + Glass)

```tsx
// components/navigation/Navbar.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const blur = useTransform(scrollY, [0, 100], [0, 12]);

  return (
    <motion.header
      style={{
        backgroundColor: `rgba(5, 5, 6, ${bgOpacity})`,
        backdropFilter: `blur(${blur}px)`,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05]"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AO</span>
          </div>
          <span className="font-semibold text-white">Abogados Online</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Servicios', 'Calculadoras', 'Precios', 'Blog'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm text-secondary hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-secondary hover:text-white transition-colors hidden sm:block"
          >
            Iniciar Sesión
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors"
          >
            Comenzar
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
}
```

---

## 🎬 8. Especificaciones de Animación

### Tokens de Animación Globales

```tsx
// lib/animations.ts
export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: 'spring', damping: 20, stiffness: 300 },
  springBouncy: { type: 'spring', damping: 15, stiffness: 400 },
};

export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: transitions.spring,
};
```

### Easing Curves

```css
/* Easings personalizados */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
```

---

## ✅ 9. Checklist de Implementación

### Prioridad ALTA (MVP Landing)
- [ ] Hero Section con animación de contrato
- [ ] Navigation Bar sticky con glass effect
- [ ] Services Cards con Glassmorphism
- [ ] Pricing Table (3 columnas)
- [ ] CTA sections con gradientes

### Prioridad MEDIA
- [ ] Trust Bar con estadísticas animadas
- [ ] "Cómo Funciona" con pasos animados
- [ ] Testimonials carousel
- [ ] FAQ accordion

### Prioridad BAJA
- [ ] Preview interactivo de calculadora
- [ ] Animaciones de scroll parallax
- [ ] Footer completo
- [ ] Newsletter signup

---

## 🔗 10. Recursos y Referencias

### Inspiración Visual
- [Stripe.com](https://stripe.com) — Pricing, gradients, glass effects
- [Linear.app](https://linear.app) — Animaciones, dark theme
- [Raycast.com](https://raycast.com) — Micro-interacciones
- [Vercel.com](https://vercel.com) — Landing structure

### Librerías Requeridas
```bash
# Ya incluidas en brain.md
npm install framer-motion@11
# Para iconos
npm install @heroicons/react lucide-react
```

### Tipografías
```html
<!-- En layout.tsx o _document -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

---

> 📝 **Nota:** Este plan está alineado con las reglas de `brain.md`. Usar Tailwind CSS v4 + Framer Motion para implementación. Todos los componentes deben tener micro-interacciones obligatorias.
