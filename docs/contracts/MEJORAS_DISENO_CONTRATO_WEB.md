# 1. ERRORES CRÍTICOS DE CONTENIDO JURÍDICO

## 1.1. Faltan cláusulas esenciales

| Cláusula faltante | Impacto legal |
|---|---|
| **Estado del vehículo y garantías** | Sin declaración de libre gravamen detallada, sin saneamiento por evicción, sin renuncia a vicios redhibitorios. El comprador queda desprotegido. |
| **Jurisdicción y competencia** | Sin sometimiento a jueces competentes, las partes no saben dónde litigar en caso de conflicto. |
| **Cuantía** | Falta cláusula formal de cuantía (distinta al encabezado). |
| **Datos del CUV** | No se referencia el Certificado Único Vehicular, que es el documento habilitante principal. Sin esto, no hay prueba de propiedad. |
| **Vigencia de matrícula** | No se declara si la matrícula está vigente o vencida. |

## 1.2. Cláusulas existentes incompletas

**PRIMERA (Antecedentes):** Solo dice "declara ser propietario y estar libre de gravámenes" en una línea genérica. Debe incluir:
- Número y fecha del CUV
- Forma de adquisición (compraventa previa, herencia, etc.)
- Fecha de inscripción a nombre del vendedor
- Declaración detallada de ausencia de gravámenes, embargos, prohibiciones de enajenar

**SEGUNDA (Objeto):** Incompleta. Le faltan datos obligatorios del vehículo:
- Tipo, Cilindraje, Carrocería, Clase, País, Combustible, Pasajeros, Tonelaje, Servicio, RAMV/CPN

**TERCERA (Precio):** Dice solo "que EL VENDEDOR declara haber recibido". Debe incluir:
- Precio en letras Y números
- Forma de pago específica (transferencia, efectivo, cheque)
- Declaración de finiquito formal y satisfacción del vendedor

**QUINTA (Aceptación):** Una sola línea. Debe incluir:
- Declaración de que las cláusulas fueron redactadas de común acuerdo
- Número de ejemplares firmados
- Expresión fiel de voluntad de las partes

---
# 2. MEJORAS PROPUESTAS Y DECISIONES DE DISEÑO

Basado en la evaluación y la conversación con el cliente, se adoptarán las siguientes estrategias:

### 2.1. Descarga del Contrato
- **Decisión:** Se implementará la **Opción A**, generando un archivo nativo `.docx` utilizando una librería (como `docx` de npm o `docxtemplater`).
- **Justificación:** Es la solución más profesional, permite al cliente descargar, editar e imprimir el documento fácilmente. 

### 2.2. Cónyuge del Comprador
- **Decisión:** Se implementará la **Opción A**. Si el comprador elige estado civil "Casado/a", se mostrará un checkbox opcional: *"¿Comparecerá el cónyuge en el contrato?"*. Si se marca, se piden los datos; caso contrario, solo aparece el comprador.
- **Justificación:** Múltiples compradores casados pueden adquirir bienes a título personal (especialmente si hay separación de bienes), por lo que no siempre es obligatoria la firma de la cónyuge del comprador para la compra, pero sí se deja la opción por si desean incluirla.
- **Nota:** El cónyuge del *vendedor* casado sigue siendo obligatorio por defecto, para proteger al comprador de futuros reclamos sobre la sociedad conyugal.

### 2.3. Acceso al CUV (Certificado Único Vehicular)
- **Decisión:** Se adoptará la **Opción A** adaptada a móvil.
- **Implementación:** Se colocará un enlace de texto simple y visible debajo (o junto) del botón de "Subir CUV" que diga: *"¿No tienes tu CUV? Descárgalo aquí"* dirigido a la página de la ANT.
- **Justificación:** Dado que la mayoría de usuarios accede desde el celular, un enlace directo es más intuitivo y funcional que un tooltip.

### 2.4. Manejo de Datos Faltantes
- **Decisión:** Se adoptará la **Opción A (Subrayados Clásicos)**.
- **Implementación:** Si el usuario no llena un dato no obligatorio en el formulario web, en el contrato final `.docx` ese espacio se rellenará con una línea de subrayado (ej. `________________`). 
- **Justificación:** Para la cultura jurídica y notarial en Ecuador, los contratos "para rellenar a mano" siempre han usado físicamente el subrayado. Es lo más reconocible para cualquier persona que lee el documento, indicando instintivamente que falta completar esa información antes de firmar.

---
# 3. CHECKLIST DE IMPLEMENTACIÓN FUTURA

- [ ] Integrar librería para generación nativa de `.docx` desde React/Next.js.
- [ ] Construir la plantilla `.docx` base con todas las 8+ cláusulas requeridas.
- [ ] Implementar la lógica condicional en la plantilla `.docx` para:
  - Mostrar/Ocultar cónyuge del comprador.
  - Rellenar campos vacíos con guiones bajos (`_______`).
- [ ] Ajustar formulario web de comprador: Checkbox condicional "¿Comparecerá el cónyuge?" si el estado es Casado.
- [ ] Ajustar UI de "Subir CUV": Agregar enlace `<a href="link-ant">Descargar CUV en la ANT</a>`.
