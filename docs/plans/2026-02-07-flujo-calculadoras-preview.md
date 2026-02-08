# 🔄 Previsualización de Flujos: Calculadoras AOE v2

> **Objetivo:** Validar la experiencia de usuario (UX) antes de implementar.
> **Enfoque:** Mostrar transparencia en gastos externos primero, y luego presentar nuestros honorarios.

---

## 1. 🏠 Presupuestador Inmobiliario (El "Lead Magnet" Principal)

Este flujo está diseñado para **ganar confianza** antes de pedir el email o mostrar nuestros honorarios completos.

```mermaid
graph TD
    A[Inicio: Wizard] -->|Datos Básicos| B(Paso 1: ¿Qué buscas?)
    B -->|Comprar/Vender| C(Paso 2: Valores y Fechas)
    C -->|Calculando...| D[Resultados Parciales: GASTOS DE TERCEROS]
    
    style D fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    
    D -->|Muestra| D1[Impuestos Municipales: ~$1,600]
    D -->|Muestra| D2[Registro Propiedad: ~$450]
    D -->|Muestra| D3[Gastos Notariales: ~$580]
    
    D -->|Bloqueo| E{MURO DE VALOR}
    
    E -->|¿Quieres el desglose completo + PDF?| F[Formulario: Nombre + Email]
    
    F -->|Envía Datos| G[✅ Resultados DESBLOQUEADOS]
    
    style G fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    
    G -->|Muestra| H1[Desglose detallado línea por línea]
    G -->|Muestra| H2[Honorarios Legales AOE: $500]
    G -->|Muestra| H3[TOTAL FINAL ESTIMADO]
    
    G -->|Call to Action| I[📅 Agendar Reunión / Descargar PDF]
```

### 🧠 Psicología del Flujo:
1. **El Gancho:** El usuario ve los impuestos (el "dolor") gratis. Siente que la herramienta funciona.
2. **El Intercambio:** Para ver el "informe oficial", da su email.
3. **La Venta:** Una vez dentro, ve nuestros honorarios ($500) como parte de una solución integral, no como una barrera inicial.

---

## 2. 🚗 Cotizador Vehicular (SaaS Rápido)

Este flujo es transaccional y directo. El objetivo es vender el contrato por $9.99.

```mermaid
graph TD
    Start[Inicio: Cotizador] -->|Datos del Vehículo| Step1(Ingresa Valor: $15,000)
    Step1 -->|Calculando...| Result[Resultado Estimado]
    
    style Result fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    
    Result -->|Desglose| R1[Notaría (Firmas): ~$30]
    Result -->|Desglose| R2[Impuesto 1%: ~$150]
    
    Result -->|La Oferta| Offer[📜 Tu Contrato Listo: $9.99]
    
    Offer -->|Opción A| Pay[💳 Pagar y Descargar]
    Offer -->|Opción B| Whatsapp[💬 Consultar en WhatsApp]
    
    Pay -->|Éxito| Download[📥 Descarga PDF Inmediata]
```

### 🧠 Psicología del Flujo:
1. **Transparencia:** Mostramos que la notaría es cara ($340+), haciendo que nuestros $9.99 parezcan irrelevantes.
2. **Sin Fricción:** No pedimos email obligatorio antes de mostrar el precio. El usuario decide rápido.

---

## 3. 📋 Servicios Menores (Poderes, Divorcios)

Flujo simplificado para capturar leads de servicios específicos.

```mermaid
graph LR
    A[Landing Poderes] -->|Click| B(Mini-Wizard)
    B -->|Tipo de Poder| C{¿General o Especial?}
    C -->|Calcula| D[Precio Fijo: $50]
    D -->|CTA| E[💬 Iniciar Trámite en WhatsApp]
```
