# MODELO MAESTRO v2 — CONTRATO DE COMPRAVENTA DE VEHÍCULO

## ABOGADOS ONLINE ECUADOR

**Versión:** 2.0 — Actualizada 20 de febrero de 2026
**Cambios respecto a v1:** Resolución de género, soporte pasaporte, nacionalidad obligatoria, antecedentes condicionales expandidos, cláusula de observaciones, eliminación de "COPIAS: DOS", corrección de duplicación "por sus propios derechos".

---

# PARTE 1: DICCIONARIO DE VARIABLES

## 1. FECHA Y LUGAR

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CIUDAD}}` | Ciudad de otorgamiento | San Francisco de Quito |
| `{{DIA_NUMERO}}` | Día en número | 20 |
| `{{DIA_LETRAS}}` | Día en letras | veinte |
| `{{MES_LETRAS}}` | Mes en letras | febrero |
| `{{ANIO_NUMERO}}` | Año en número | 2026 |
| `{{ANIO_LETRAS}}` | Año en letras | dos mil veintiséis |

## 2. VENDEDOR

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{VEND_NOMBRE}}` | Nombres completos en MAYÚSCULAS | NAYIBE PATRICIA GARCIA CABARCAS |
| `{{VEND_SEXO}}` | Sexo (M/F) — campo del formulario | F |
| `{{VEND_NACIONALIDAD}}` | Nacionalidad | ecuatoriana / colombiana / argentina |
| `{{VEND_TIPO_DOC}}` | Tipo de documento (cedula/pasaporte) | cedula |
| `{{VEND_DOC_NUMERO}}` | Número de documento | 1721690376 |
| `{{VEND_DOC_LETRAS}}` | Documento en letras (solo si es cédula) | uno siete dos uno seis nueve cero tres siete seis |
| `{{VEND_ESTADO_CIVIL}}` | Estado civil (sin resolver género) | casado / soltero / divorciado / viudo / unión de hecho |
| `{{VEND_DOMICILIO}}` | Dirección domiciliaria | Agustín Guerrero E5-100 y Japón |

**Variables derivadas automáticamente del sexo:**

| Variable derivada | Si VEND_SEXO = M | Si VEND_SEXO = F |
|---|---|---|
| `{{VEND_ARTICULO}}` | el señor | la señora |
| `{{VEND_PORTADOR}}` | portador | portadora |
| `{{VEND_CASADO}}` | casado | casada |
| `{{VEND_SOLTERO}}` | soltero | soltera |
| `{{VEND_DIVORCIADO}}` | divorciado | divorciada |
| `{{VEND_VIUDO}}` | viudo | viuda |
| `{{VEND_DOMICILIADO}}` | domiciliado | domiciliada |
| `{{VEND_DENOMINACION}}` | "EL VENDEDOR" | "LA VENDEDORA" |
| `{{VEND_PROPIETARIO}}` | legítimo propietario | legítima propietaria |
| `{{VEND_SATISFECHO}}` | satisfecho | satisfecha |
| `{{VEND_CANCELADO}}` | cancelado | cancelada |

**Variables derivadas del tipo de documento:**

| Variable derivada | Si VEND_TIPO_DOC = cedula | Si VEND_TIPO_DOC = pasaporte |
|---|---|---|
| `{{VEND_TEXTO_DOC}}` | cédula de ciudadanía número {{VEND_DOC_LETRAS}} (No. **{{VEND_DOC_NUMERO}}**) | pasaporte número **{{VEND_DOC_NUMERO}}** |

> **Nota:** Para pasaportes NO se convierte a letras porque contienen letras y números mezclados.

## 3. CÓNYUGE DEL VENDEDOR (si aplica)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CON_VEND_NOMBRE}}` | Nombres completos en MAYÚSCULAS | CARLOS ANDRÉS ORDOÑEZ LÓPEZ |
| `{{CON_VEND_SEXO}}` | Sexo (M/F) | M |
| `{{CON_VEND_TIPO_DOC}}` | Tipo de documento | cedula |
| `{{CON_VEND_DOC_NUMERO}}` | Número de documento | 0987651122 |
| `{{CON_VEND_DOC_LETRAS}}` | Documento en letras (solo cédula) | cero nueve ocho siete seis cinco uno uno dos dos |

**Variables derivadas del sexo del cónyuge:**

| Variable derivada | Si CON_VEND_SEXO = M | Si CON_VEND_SEXO = F |
|---|---|---|
| `{{CON_VEND_ARTICULO}}` | el señor | la señora |
| `{{CON_VEND_PORTADOR}}` | portador | portadora |

## 4. COMPRADOR

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{COMP_NOMBRE}}` | Nombres completos en MAYÚSCULAS | CARLOS PÉREZ |
| `{{COMP_SEXO}}` | Sexo (M/F) | M |
| `{{COMP_NACIONALIDAD}}` | Nacionalidad | ecuatoriana |
| `{{COMP_TIPO_DOC}}` | Tipo de documento (cedula/pasaporte) | cedula |
| `{{COMP_DOC_NUMERO}}` | Número de documento | 1234567899 |
| `{{COMP_DOC_LETRAS}}` | Documento en letras (solo cédula) | uno dos tres cuatro cinco seis siete ocho nueve nueve |
| `{{COMP_ESTADO_CIVIL}}` | Estado civil | soltero |
| `{{COMP_DOMICILIO}}` | Dirección domiciliaria | Agustín Guerrero E5-100 |

**Variables derivadas:** misma lógica que el vendedor (COMP_ARTICULO, COMP_PORTADOR, COMP_DOMICILIADO, COMP_DENOMINACION, etc.)

## 5. CÓNYUGE DEL COMPRADOR (si aplica)

Misma estructura que cónyuge del vendedor.

## 6. VEHÍCULO

| Variable | Descripción | Obligatorio | Ejemplo |
|----------|-------------|-------------|---------|
| `{{VEH_PLACA}}` | Placa | Sí | PFD-1427 |
| `{{VEH_MARCA}}` | Marca | Sí | DONGFENG |
| `{{VEH_MODELO}}` | Modelo completo | Sí | RICH 6 AC 2.5 CD 4X2 TM DIESEL |
| `{{VEH_TIPO}}` | Tipo | Sí | CAMIONETA |
| `{{VEH_ANIO}}` | Año (número) | Sí | 2023 |
| `{{VEH_ANIO_LETRAS}}` | Año en letras | Auto | dos mil veintitrés |
| `{{VEH_MOTOR}}` | Número de motor | Sí | U02950981 |
| `{{VEH_CHASIS}}` | Chasis/VIN | Sí | LJNTGU537PN406979 |
| `{{VEH_COLOR}}` | Color | Sí | NEGRO |
| `{{VEH_CILINDRAJE}}` | Cilindraje en cc | Sí | 2500 |
| `{{VEH_CILINDRAJE_LETRAS}}` | Cilindraje en letras | Auto | dos mil quinientos |
| `{{VEH_CARROCERIA}}` | Carrocería | Sí | METÁLICA |
| `{{VEH_CLASE}}` | Clase | Sí | CAMIONETA |
| `{{VEH_PAIS}}` | País de origen | Sí | CHINA |
| `{{VEH_COMBUSTIBLE}}` | Combustible | Sí | DIÉSEL |
| `{{VEH_PASAJEROS}}` | Número de pasajeros | Sí | 5 |
| `{{VEH_PASAJEROS_LETRAS}}` | Pasajeros en letras | Auto | cinco |
| `{{VEH_SERVICIO}}` | Servicio | Sí | USO PARTICULAR |
| `{{VEH_TONELAJE}}` | Tonelaje | Opcional | 0.75 |
| `{{VEH_RAMV}}` | RAMV/CPN | Opcional | U02040301 |

## 7. DATOS FINANCIEROS

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{PRECIO_NUMERO}}` | Precio en números | 23.455,00 |
| `{{PRECIO_LETRAS}}` | Precio en letras (auto) | VEINTITRÉS MIL CUATROCIENTOS CINCUENTA Y CINCO DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA |
| `{{FORMA_PAGO}}` | Forma de pago | transferencia bancaria / efectivo / cheque certificado |

> **REGLA DEL CONVERSOR:** Los números del 21 al 29 se escriben en UNA SOLA PALABRA: veintiuno, veintidós, veintitrés, veinticuatro, veinticinco, veintiséis, veintisiete, veintiocho, veintinueve. NUNCA "veinte y tres".

## 8. ANTECEDENTES / CUV

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CUV_NUMERO}}` | Número del CUV | CUV-2026-00123456 |
| `{{CUV_FECHA}}` | Fecha de emisión del CUV | 09 de febrero de 2026 |
| `{{FECHA_INSCRIPCION}}` | Fecha inscripción a nombre del vendedor | 15 de marzo de 2020 |
| `{{MATRICULA_VIGENCIA}}` | Vigencia de matrícula | 31 de diciembre de 2026 |

## 9. FLAGS CONDICIONALES

| Variable | Descripción | Efecto |
|----------|-------------|--------|
| `{{ES_CASADO_VENDEDOR}}` | ¿Vendedor casado? | Activa bloque cónyuge vendedor |
| `{{ES_CASADO_COMPRADOR}}` | ¿Comprador casado? | Activa bloque cónyuge comprador |
| `{{TIPO_ANTECEDENTE}}` | Tipo de antecedente (selector) | compraventa / herencia / donación / importación |
| `{{TIENE_OBSERVACIONES}}` | ¿Hay observaciones especiales? | Activa cláusula de observaciones |

## 10. HERENCIA / POSESIÓN EFECTIVA (si TIPO_ANTECEDENTE = herencia)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CAUSANTE_NOMBRE}}` | Nombre del causante | AIDA MARÍA VÁSCONEZ ESPINOZA |
| `{{CAUSANTE_FECHA_FALLECIMIENTO}}` | Fecha de fallecimiento | 15 de enero de 2023 |
| `{{POS_EFECTIVA_NOTARIA}}` | Notaría de posesión efectiva | Notaría Sexta del Cantón Quito |
| `{{POS_EFECTIVA_FECHA}}` | Fecha de posesión efectiva | 26 de septiembre de 2023 |
| `{{HEREDEROS_LISTA}}` | Lista de herederos | ALFREDO GONZÁLEZ y ANDRÉS GONZÁLEZ |
| `{{PARENTESCO}}` | Parentesco | hijos / cónyuge e hijos |

## 11. OBSERVACIONES (campo de texto libre)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{OBSERVACIONES_TEXTO}}` | Texto libre del usuario | "El vehículo se entrega con matrícula vencida desde el 31 de diciembre de 2025. El comprador asume los costos de renovación." |

---

# PARTE 2: CONTRATO CON VARIABLES

---

**CONTRATO DE COMPRAVENTA DE VEHÍCULO**

**CUANTÍA: USD$ {{PRECIO_NUMERO}}**

---

En la ciudad de {{CIUDAD}}, Distrito Metropolitano, capital de la República del Ecuador, a los **{{DIA_LETRAS}} ({{DIA_NUMERO}}) días del mes de {{MES_LETRAS}} del año {{ANIO_LETRAS}} ({{ANIO_NUMERO}})**, comparecen a la celebración del presente contrato de compraventa:

1\. Por una parte, {{VEND_ARTICULO}} **{{VEND_NOMBRE}}**, de nacionalidad {{VEND_NACIONALIDAD}}, {{VEND_PORTADOR}} de la {{VEND_TEXTO_DOC}}, de estado civil {{VEND_ESTADO_CIVIL_RESUELTO}}

<!-- IF {{ES_CASADO_VENDEDOR}} == true -->
, {{VEND_CASADO}} con {{CON_VEND_ARTICULO}} **{{CON_VEND_NOMBRE}}**, {{CON_VEND_PORTADOR}} de la {{CON_VEND_TEXTO_DOC}}, quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal,
<!-- ELSE -->
, por sus propios y personales derechos,
<!-- ENDIF -->
{{VEND_DOMICILIADO}} en {{VEND_DOMICILIO}}, quien(es) en adelante se denominará(n) **"{{VEND_DENOMINACION}}"**; y,

2\. Por otra parte, {{COMP_ARTICULO}} **{{COMP_NOMBRE}}**, de nacionalidad {{COMP_NACIONALIDAD}}, {{COMP_PORTADOR}} de la {{COMP_TEXTO_DOC}}, de estado civil {{COMP_ESTADO_CIVIL_RESUELTO}}

<!-- IF {{ES_CASADO_COMPRADOR}} == true -->
, {{COMP_CASADO}} con {{CON_COMP_ARTICULO}} **{{CON_COMP_NOMBRE}}**, {{CON_COMP_PORTADOR}} de la {{CON_COMP_TEXTO_DOC}}, quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal,
<!-- ELSE -->
, por sus propios y personales derechos,
<!-- ENDIF -->
{{COMP_DOMICILIADO}} en {{COMP_DOMICILIO}}, quien(es) en adelante se denominará(n) **"{{COMP_DENOMINACION}}"**.

Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:

---

### **PRIMERA: ANTECEDENTES.-**

<!-- IF {{TIPO_ANTECEDENTE}} == 'compraventa' -->

**1.1.-** {{VEND_DENOMINACION}} declara ser {{VEND_PROPIETARIO}} del vehículo que se describe en el presente contrato, según consta en el Certificado Único Vehicular No. **{{CUV_NUMERO}}**, emitido por la Agencia Nacional de Tránsito el {{CUV_FECHA}}, habiendo adquirido la propiedad del mismo mediante transferencia de dominio inscrita el {{FECHA_INSCRIPCION}}.

<!-- ENDIF -->

<!-- IF {{TIPO_ANTECEDENTE}} == 'herencia' -->

**1.1.-** {{VEND_DENOMINACION}} declara(n) que mediante Acta Notarial de Posesión Efectiva otorgada ante la {{POS_EFECTIVA_NOTARIA}} con fecha {{POS_EFECTIVA_FECHA}}, se concedió la posesión efectiva proindiviso de los bienes dejados por **{{CAUSANTE_NOMBRE}}**, quien falleció el {{CAUSANTE_FECHA_FALLECIMIENTO}}, a favor de {{HEREDEROS_LISTA}} en calidad de {{PARENTESCO}}. Entre los bienes del causante se encuentra el vehículo descrito en este contrato, según el Certificado Único Vehicular No. **{{CUV_NUMERO}}** emitido por la Agencia Nacional de Tránsito el {{CUV_FECHA}}.

<!-- ENDIF -->

<!-- IF {{TIPO_ANTECEDENTE}} == 'donacion' -->

**1.1.-** {{VEND_DENOMINACION}} declara ser {{VEND_PROPIETARIO}} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante escritura pública de donación, según consta en el Certificado Único Vehicular No. **{{CUV_NUMERO}}**, emitido por la Agencia Nacional de Tránsito el {{CUV_FECHA}}.

<!-- ENDIF -->

<!-- IF {{TIPO_ANTECEDENTE}} == 'importacion' -->

**1.1.-** {{VEND_DENOMINACION}} declara ser {{VEND_PROPIETARIO}} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante importación directa debidamente nacionalizada, según consta en el Certificado Único Vehicular No. **{{CUV_NUMERO}}**, emitido por la Agencia Nacional de Tránsito el {{CUV_FECHA}}.

<!-- ENDIF -->

**1.2.-** Según el referido Certificado Único Vehicular, el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, embargos y prohibiciones de enajenar, encontrándose en perfecto estado legal para su transferencia de dominio.

**1.3.-** {{VEND_DENOMINACION}} declara que el vehículo se encuentra con su matrícula vigente hasta el {{MATRICULA_VIGENCIA}}, según los registros de la Agencia Nacional de Tránsito.

---

### **SEGUNDA: OBJETO.-**

Por el presente contrato, {{VEND_DENOMINACION}} transfiere en favor de {{COMP_DENOMINACION}}, a título de venta, el dominio, posesión y todos los derechos que le(s) corresponde(n) sobre el siguiente vehículo automotor:

- **PLACA:** {{VEH_PLACA}}
- **MARCA:** {{VEH_MARCA}}
- **MODELO:** {{VEH_MODELO}}
- **TIPO:** {{VEH_TIPO}}
- **AÑO DE MODELO:** {{VEH_ANIO_LETRAS}} ({{VEH_ANIO}})
- **NÚMERO DE MOTOR:** {{VEH_MOTOR}}
- **NÚMERO DE CHASIS/VIN:** {{VEH_CHASIS}}
- **COLOR:** {{VEH_COLOR}}
- **CILINDRAJE:** {{VEH_CILINDRAJE_LETRAS}} ({{VEH_CILINDRAJE}}) cc
- **CARROCERÍA:** {{VEH_CARROCERIA}}
- **CLASE:** {{VEH_CLASE}}
- **PAÍS DE ORIGEN:** {{VEH_PAIS}}
- **COMBUSTIBLE:** {{VEH_COMBUSTIBLE}}
- **NÚMERO DE PASAJEROS:** {{VEH_PASAJEROS_LETRAS}} ({{VEH_PASAJEROS}})
- **SERVICIO:** {{VEH_SERVICIO}}

---

### **TERCERA: PRECIO Y FORMA DE PAGO.-**

**3.1.-** El precio de la presente compraventa es la suma de **{{PRECIO_LETRAS}} (USD$ {{PRECIO_NUMERO}})**, cantidad que {{VEND_DENOMINACION}} declara haber recibido a su entera satisfacción mediante **{{FORMA_PAGO}}** realizada por {{COMP_DENOMINACION}}, otorgando el más amplio y eficaz finiquito de pago.

**3.2.-** Con el pago del precio señalado, {{VEND_DENOMINACION}} se da por {{VEND_CANCELADO}} y {{VEND_SATISFECHO}} de la obligación contraída por {{COMP_DENOMINACION}}.

---

### **CUARTA: ESTADO DEL VEHÍCULO Y GARANTÍAS.-**

**4.1.-** {{VEND_DENOMINACION}} declara expresamente que el vehículo objeto de la presente compraventa se encuentra completamente libre de todo gravamen, hipoteca, prenda, embargo, prohibición de enajenar o cualquier otra limitación de dominio, según se acredita con el Certificado Único Vehicular antes mencionado.

**4.2.-** {{VEND_DENOMINACION}} garantiza a {{COMP_DENOMINACION}} el saneamiento por evicción del bien vendido, comprometiéndose a responder por cualquier reclamo de terceros sobre la propiedad del vehículo.

**4.3.-** {{COMP_DENOMINACION}} declara conocer perfectamente el estado físico y mecánico del vehículo, manifestando su total conformidad con el mismo y renunciando expresamente a todo reclamo por vicios redhibitorios o defectos ocultos que pudiera presentar el automotor.

---

### **QUINTA: GASTOS.-**

Todos los gastos que origine la transferencia de dominio del vehículo, tales como derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos por **{{COMP_DENOMINACION}}**.

---

### **SEXTA: JURISDICCIÓN Y COMPETENCIA.-**

Para todos los efectos legales derivados del presente contrato, las partes se someten a los jueces competentes de la ciudad de {{CIUDAD}}, renunciando expresamente a fuero especial que pudieren tener.

---

<!-- IF {{TIENE_OBSERVACIONES}} == true -->

### **SÉPTIMA: OBSERVACIONES.-**

{{OBSERVACIONES_TEXTO}}

<!-- ENDIF -->

---

### **{{NUM_CLAUSULA_ACEPTACION}}: ACEPTACIÓN Y RATIFICACIÓN.-**

Las partes aceptan íntegramente las cláusulas del presente contrato, declarando que han sido redactadas de común acuerdo y que las mismas son expresión fiel de su voluntad. El presente contrato se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada una de las partes.

---

### **{{NUM_CLAUSULA_CUANTIA}}: CUANTÍA.-**

La cuantía de la presente compraventa asciende a la suma de **{{PRECIO_LETRAS}} (USD$ {{PRECIO_NUMERO}})**.

---

En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.

&nbsp;

**{{VEND_NOMBRE}}** | <!-- IF ES_CASADO_VENDEDOR --> **{{CON_VEND_NOMBRE}}** <!-- ENDIF -->
C.I. {{VEND_DOC_NUMERO}} | C.I. {{CON_VEND_DOC_NUMERO}}
{{VEND_DENOMINACION}} | CÓNYUGE DE {{VEND_DENOMINACION}}

&nbsp;

**{{COMP_NOMBRE}}** | <!-- IF ES_CASADO_COMPRADOR --> **{{CON_COMP_NOMBRE}}** <!-- ENDIF -->
C.I. {{COMP_DOC_NUMERO}} | C.I. {{CON_COMP_DOC_NUMERO}}
{{COMP_DENOMINACION}} | CÓNYUGE DE {{COMP_DENOMINACION}}

---

*Documento generado por Abogados Online Ecuador • www.abogadosonlineecuador.com*

---

# PARTE 3: NOTAS TÉCNICAS PARA EL DESARROLLADOR

## Regla del conversor de números a letras

Los números del 21 al 29 van en UNA SOLA PALABRA:
- 21 = veintiuno (NO "veinte y uno")
- 22 = veintidós
- 23 = veintitrés
- 24 = veinticuatro
- 25 = veinticinco
- 26 = veintiséis
- 27 = veintisiete
- 28 = veintiocho
- 29 = veintinueve

Del 31 en adelante sí se separan: treinta y uno, treinta y dos, etc.

## Lógica de tipo de documento

```
SI tipo_doc == "cedula":
    texto = "cédula de ciudadanía número [letras] (No. [número])"
    // Convertir cada dígito a palabra: 1→uno, 7→siete, etc.

SI tipo_doc == "pasaporte":
    texto = "pasaporte número [número]"
    // NO convertir a letras (los pasaportes mezclan letras y números)
```

## Lógica de resolución de género

El formulario debe tener un selector de sexo (M/F) para cada compareciente. Con ese dato se resuelven automáticamente TODAS las concordancias gramaticales. El sistema nunca debe mostrar "portador/a" ni "casado/a" en el documento final.

## Numeración dinámica de cláusulas

Si `{{TIENE_OBSERVACIONES}} == true`:
- Observaciones = SÉPTIMA
- Aceptación = OCTAVA
- Cuantía = NOVENA

Si `{{TIENE_OBSERVACIONES}} == false`:
- Aceptación = SÉPTIMA
- Cuantía = OCTAVA

## Campos del formulario — Resumen

### Obligatorios:
- Nombre completo (texto libre)
- Sexo (M/F)
- Nacionalidad (texto con default "ecuatoriana")
- Tipo de documento (cédula/pasaporte)
- Número de documento
- Estado civil (soltero/casado/divorciado/viudo/unión de hecho)
- Domicilio
- Si casado → datos del cónyuge (nombre, sexo, tipo doc, número doc)

### Vehículo — Obligatorios:
- Placa, Marca, Modelo, Tipo, Año, Motor, Chasis, Color, Cilindraje, Carrocería, Clase, País de origen, Combustible, Pasajeros, Servicio

### Vehículo — Opcionales:
- Tonelaje, RAMV/CPN

### Antecedentes:
- Tipo (compraventa/herencia/donación/importación)
- Si herencia → causante, fecha fallecimiento, notaría, fecha posesión efectiva, herederos, parentesco
- CUV número y fecha (siempre)
- Fecha de inscripción (si compraventa)
- Vigencia de matrícula

### Financiero:
- Precio (número → se convierte automáticamente a letras)
- Forma de pago (selector: transferencia/efectivo/cheque certificado)

### Observaciones:
- ¿Tiene observaciones? (sí/no)
- Si sí → campo de texto libre
