# MODELO MAESTRO — CONTRATO DE COMPRAVENTA DE VEHÍCULO

## NOTARÍA DÉCIMA OCTAVA DE QUITO — DRA. GLENDA ZAPATA SILVA

**Para automatización vía página web**

---

## PARTE 1: DICCIONARIO DE VARIABLES

### 1. FECHA Y LUGAR

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CIUDAD}}` | Ciudad de otorgamiento | San Francisco de Quito |
| `{{DIA_SEMANA}}` | Día de la semana en letras | lunes, martes, miércoles... |
| `{{DIA_NUMERO}}` | Día en número | 09 |
| `{{DIA_LETRAS}}` | Día en letras | nueve |
| `{{MES_LETRAS}}` | Mes en letras | febrero |
| `{{ANIO_NUMERO}}` | Año en número | 2026 |
| `{{ANIO_LETRAS}}` | Año en letras | dos mil veintiséis |

### 2. VENDEDOR

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{VENDEDOR_NOMBRE}}` | Nombres completos | JUAN CARLOS PÉREZ LÓPEZ |
| `{{VENDEDOR_CEDULA}}` | Número de cédula | 1712345678 |
| `{{VENDEDOR_CEDULA_LETRAS}}` | Cédula dígito por dígito | uno siete uno dos tres cuatro cinco seis siete ocho |
| `{{VENDEDOR_NACIONALIDAD}}` | Nacionalidad | ecuatoriana |
| `{{VENDEDOR_ESTADO_CIVIL}}` | Estado civil | soltero / casado / divorciado / viudo |
| `{{VENDEDOR_DOMICILIO}}` | Dirección domiciliaria | Av. República E7-123 y Almagro |
| `{{VENDEDOR_EDAD}}` | Edad (opcional) | 35 años |
| `{{VENDEDOR_ARTICULO}}` | Artículo (el/la) | el señor / la señora |
| `{{VENDEDOR_ARTICULO_MAYUS}}` | Artículo mayúsculas | EL VENDEDOR / LA VENDEDORA |

### 3. CÓNYUGE DEL VENDEDOR (si aplica)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CONYUGE_VEND_NOMBRE}}` | Nombres completos del cónyuge | MARÍA ELENA GÓMEZ RUIZ |
| `{{CONYUGE_VEND_CEDULA}}` | Cédula del cónyuge | 1798765432 |
| `{{CONYUGE_VEND_CEDULA_LETRAS}}` | Cédula en letras | uno siete nueve ocho... |
| `{{CONYUGE_VEND_ARTICULO}}` | Artículo | la señora / el señor |

### 4. COMPRADOR

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{COMPRADOR_NOMBRE}}` | Nombres completos | PEDRO ANTONIO SILVA MORA |
| `{{COMPRADOR_CEDULA}}` | Número de cédula | 1787654321 |
| `{{COMPRADOR_CEDULA_LETRAS}}` | Cédula dígito por dígito | uno siete ocho siete... |
| `{{COMPRADOR_NACIONALIDAD}}` | Nacionalidad | ecuatoriana |
| `{{COMPRADOR_ESTADO_CIVIL}}` | Estado civil | casado / soltero / etc. |
| `{{COMPRADOR_DOMICILIO}}` | Dirección domiciliaria | Calle Los Pinos N34-56 |
| `{{COMPRADOR_ARTICULO}}` | Artículo (el/la) | el señor / la señora |
| `{{COMPRADOR_ARTICULO_MAYUS}}` | Artículo mayúsculas | EL COMPRADOR / LA COMPRADORA |

### 5. CÓNYUGE DEL COMPRADOR (si aplica)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CONYUGE_COMP_NOMBRE}}` | Nombres completos del cónyuge | ANA LUCÍA TORRES VERA |
| `{{CONYUGE_COMP_CEDULA}}` | Cédula del cónyuge | 1756789012 |
| `{{CONYUGE_COMP_CEDULA_LETRAS}}` | Cédula en letras | uno siete cinco seis... |

### 6. VEHÍCULO

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{VEH_PLACA}}` | Placa | PBX1234 |
| `{{VEH_MARCA}}` | Marca | CHEVROLET / KIA / TOYOTA |
| `{{VEH_MODELO}}` | Modelo completo | SPARK GT AC 1.2 5P 4X2 TM |
| `{{VEH_TIPO}}` | Tipo | AUTOMÓVIL / JEEP / CAMIONETA |
| `{{VEH_ANIO}}` | Año de fabricación (número) | 2020 |
| `{{VEH_ANIO_LETRAS}}` | Año en letras | dos mil veinte |
| `{{VEH_MOTOR}}` | Número de motor | B12D1234567 |
| `{{VEH_CHASIS}}` | Número de chasis/VIN | KL1MJ6A49LC123456 |
| `{{VEH_COLOR}}` | Color | BLANCO / NEGRO / GRIS |
| `{{VEH_CILINDRAJE}}` | Cilindraje en cc | 1206 |
| `{{VEH_CILINDRAJE_LETRAS}}` | Cilindraje en letras | mil doscientos seis |
| `{{VEH_CARROCERIA}}` | Carrocería | METÁLICA |
| `{{VEH_CLASE}}` | Clase | AUTOMÓVIL / VEHÍCULO UTILITARIO |
| `{{VEH_PAIS}}` | País de origen | COREA / JAPÓN / ESTADOS UNIDOS |
| `{{VEH_PASAJEROS}}` | Número de pasajeros | 5 |
| `{{VEH_PASAJEROS_LETRAS}}` | Pasajeros en letras | cinco |
| `{{VEH_COMBUSTIBLE}}` | Combustible | GASOLINA / DIÉSEL / HÍBRIDO |
| `{{VEH_TONELAJE}}` | Tonelaje | 0.75 / 1.00 |
| `{{VEH_SERVICIO}}` | Servicio | USO PARTICULAR / PÚBLICO |
| `{{VEH_RAMV}}` | RAMV/CPN (si disponible) | U02040301 |

### 7. DATOS FINANCIEROS

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{PRECIO_NUMERO}}` | Precio en números | 15,000.00 |
| `{{PRECIO_LETRAS}}` | Precio en letras | QUINCE MIL DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA |
| `{{FORMA_PAGO}}` | Forma de pago | transferencia bancaria / efectivo / cheque certificado |

### 8. ANTECEDENTES / CUV

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CUV_NUMERO}}` | Número de Certificado Único Vehicular | CUV-2026-00123456 |
| `{{CUV_FECHA}}` | Fecha de emisión del CUV | 09 de febrero de 2026 |
| `{{FORMA_ADQUISICION}}` | Forma de adquisición | compraventa / posesión efectiva / donación / importación |
| `{{FECHA_INSCRIPCION}}` | Fecha inscripción a nombre del vendedor | 15 de marzo de 2020 |
| `{{MATRICULA_VIGENCIA}}` | Vigencia de matrícula | 31 de diciembre de 2026 |

### 9. FLAGS CONDICIONALES (booleanos)

| Variable | Descripción | Efecto |
|----------|-------------|--------|
| `{{ES_CASADO_VENDEDOR}}` | ¿Vendedor casado? (true/false) | Activa bloque de cónyuge vendedor |
| `{{ES_CASADO_COMPRADOR}}` | ¿Comprador casado? (true/false) | Activa bloque de cónyuge comprador |
| `{{TIENE_INFRACCIONES}}` | ¿Tiene infracciones pendientes? (true/false) | Activa cláusula Art. 416 COIP |
| `{{ES_HERENCIA}}` | ¿Vehículo adquirido por herencia? (true/false) | Activa bloque de posesión efectiva |
| `{{TIENE_PODER}}` | ¿Vende por poder? (true/false) | Activa bloque de apoderado |
| `{{ES_DIPLOMATICO}}` | ¿Vehículo diplomático? (true/false) | Activa bloques SENAE y Cancillería |
| `{{VENDEDORES_MULTIPLES}}` | ¿Más de un vendedor? (true/false) | Pluraliza vendedor |

### 10. PODER ESPECIAL (si aplica)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{PODERDANTE_NOMBRE}}` | Nombre del poderdante | ARIEL OSCAR RIVA |
| `{{PODERDANTE_CEDULA}}` | Cédula/Pasaporte del poderdante | SUNB95407 |
| `{{APODERADO_NOMBRE}}` | Nombre del apoderado | CARLA MARZOCCA |
| `{{APODERADO_CEDULA}}` | Cédula/Pasaporte del apoderado | AAG582554 |
| `{{PODER_NOTARIA}}` | Notaría donde se otorgó el poder | Notaría Décima Octava de Quito |
| `{{PODER_FECHA}}` | Fecha de otorgamiento del poder | 21 de enero de 2025 |

### 11. HERENCIA / POSESIÓN EFECTIVA (si aplica)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{CAUSANTE_NOMBRE}}` | Nombre del causante | AIDA MARÍA VÁSCONEZ ESPINOZA |
| `{{CAUSANTE_FECHA_FALLECIMIENTO}}` | Fecha de fallecimiento | 15 de enero de 2023 |
| `{{POS_EFECTIVA_NOTARIA}}` | Notaría de posesión efectiva | Notaría Sexta de Quito |
| `{{POS_EFECTIVA_FECHA}}` | Fecha de posesión efectiva | 26 de septiembre de 2023 |
| `{{HEREDEROS_LISTA}}` | Lista de herederos | ALFREDO GONZÁLEZ y ANDRÉS GONZÁLEZ |
| `{{PARENTESCO}}` | Parentesco con causante | hijos / cónyuge e hijos |

### 12. DIPLOMÁTICO / SENAE (si aplica)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{SENAE_RESOLUCION_IMPORT}}` | Resolución SENAE importación | SENAE-DJJQ-2020-0684-RE |
| `{{CANCILLERIA_OFICIO}}` | Oficio de Cancillería | MREMH-DCP-2024-3564-O |
| `{{CANCILLERIA_FECHA}}` | Fecha del oficio | 11 de diciembre de 2024 |
| `{{SENAE_RESOLUCION_VENTA}}` | Resolución SENAE de venta | SENAE-DDEQ-2024-1269-RE |
| `{{SENAE_RESOLUCION_FECHA}}` | Fecha resolución venta | 30 de diciembre de 2024 |

---

## PARTE 2: CONTRATO CON VARIABLES

---

**CONTRATO DE COMPRAVENTA DE VEHÍCULO**

**CUANTÍA: USD$ {{PRECIO_NUMERO}}**

**COPIAS: DOS**

---

En la ciudad de {{CIUDAD}}, Distrito Metropolitano, capital de la República del Ecuador, a los **{{DIA_LETRAS}} ({{DIA_NUMERO}}) días del mes de {{MES_LETRAS}} del año {{ANIO_LETRAS}} ({{ANIO_NUMERO}})**, comparecen a la celebración del presente contrato de compraventa:

1\. Por una parte, {{VENDEDOR_ARTICULO}} **{{VENDEDOR_NOMBRE}}**, de nacionalidad {{VENDEDOR_NACIONALIDAD}}, portador(a) de la cédula de ciudadanía número {{VENDEDOR_CEDULA_LETRAS}} (No. **{{VENDEDOR_CEDULA}}**), de estado civil {{VENDEDOR_ESTADO_CIVIL}}

<!-- IF {{ES_CASADO_VENDEDOR}} == true -->
, casado(a) con {{CONYUGE_VEND_ARTICULO}} **{{CONYUGE_VEND_NOMBRE}}**, portador(a) de la cédula de ciudadanía número {{CONYUGE_VEND_CEDULA_LETRAS}} (No. **{{CONYUGE_VEND_CEDULA}}**), quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal
<!-- ENDIF CÓNYUGE VENDEDOR -->

<!-- IF {{TIENE_PODER}} == true -->
, debidamente representado(a) por {{APODERADO_NOMBRE}}, portador(a) del documento de identidad No. {{APODERADO_CEDULA}}, según poder especial otorgado ante la {{PODER_NOTARIA}} el {{PODER_FECHA}}
<!-- ENDIF PODER -->

, domiciliado(a) en {{VENDEDOR_DOMICILIO}}, por sus propios y personales derechos, quien en adelante se denominará **"{{VENDEDOR_ARTICULO_MAYUS}}"**; y,

2\. Por otra parte, {{COMPRADOR_ARTICULO}} **{{COMPRADOR_NOMBRE}}**, de nacionalidad {{COMPRADOR_NACIONALIDAD}}, portador(a) de la cédula de ciudadanía número {{COMPRADOR_CEDULA_LETRAS}} (No. **{{COMPRADOR_CEDULA}}**), de estado civil {{COMPRADOR_ESTADO_CIVIL}}

<!-- IF {{ES_CASADO_COMPRADOR}} == true -->
, casado(a) con **{{CONYUGE_COMP_NOMBRE}}**
<!-- ENDIF CÓNYUGE COMPRADOR -->

, domiciliado(a) en {{COMPRADOR_DOMICILIO}}, por sus propios y personales derechos, quien en adelante se denominará **"{{COMPRADOR_ARTICULO_MAYUS}}"**.

Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:

---

### **PRIMERA: ANTECEDENTES.-**

<!-- IF {{FORMA_ADQUISICION}} == 'compraventa' -->

**1.1.-** {{VENDEDOR_ARTICULO_MAYUS}} declara ser legítimo(a) propietario(a) del vehículo que se describe en el presente contrato, según consta en el Certificado Único Vehicular No. **{{CUV_NUMERO}}**, emitido por la Agencia Nacional de Tránsito el {{CUV_FECHA}}, habiendo adquirido la propiedad del mismo mediante transferencia de dominio inscrita el {{FECHA_INSCRIPCION}}.

<!-- ENDIF COMPRAVENTA ESTÁNDAR -->

<!-- IF {{ES_HERENCIA}} == true -->

**1.1.-** {{VENDEDOR_ARTICULO_MAYUS}} declara(n) que mediante Acta Notarial de Posesión Efectiva otorgada ante la {{POS_EFECTIVA_NOTARIA}} con fecha {{POS_EFECTIVA_FECHA}}, se concedió la posesión efectiva proindiviso de los bienes dejados por **{{CAUSANTE_NOMBRE}}**, quien falleció el {{CAUSANTE_FECHA_FALLECIMIENTO}}, a favor de {{HEREDEROS_LISTA}} en calidad de {{PARENTESCO}}. Entre los bienes del causante se encuentra el vehículo descrito en este contrato, según el Certificado Único Vehicular No. **{{CUV_NUMERO}}** emitido por la Agencia Nacional de Tránsito.

<!-- ENDIF HERENCIA -->

<!-- IF {{ES_DIPLOMATICO}} == true -->

**1.1.-** El vehículo objeto del presente contrato fue importado con exención de tributos según Resolución Nro. {{SENAE_RESOLUCION_IMPORT}}. Mediante Oficio Nro. {{CANCILLERIA_OFICIO}} del {{CANCILLERIA_FECHA}}, el Ministerio de Relaciones Exteriores y Movilidad Humana autorizó la transferencia de dominio. La autorización de venta fue aprobada mediante Resolución Nro. {{SENAE_RESOLUCION_VENTA}} del {{SENAE_RESOLUCION_FECHA}}.

<!-- ENDIF DIPLOMÁTICO -->

**1.2.-** Según el referido Certificado Único Vehicular, el vehículo objeto de la presente compraventa se encuentra libre de gravámenes y bloqueos vigentes, encontrándose en perfecto estado legal para su transferencia de dominio.

**1.3.-** {{VENDEDOR_ARTICULO_MAYUS}} declara que el vehículo se encuentra con su matrícula vigente hasta el {{MATRICULA_VIGENCIA}}, según los registros de la Agencia Nacional de Tránsito.

---

### **SEGUNDA: OBJETO.-**

Por el presente contrato, {{VENDEDOR_ARTICULO_MAYUS}} transfiere en favor de {{COMPRADOR_ARTICULO_MAYUS}}, a título de venta, el dominio, posesión y todos los derechos que tiene(n) y le(s) corresponde(n) sobre el siguiente vehículo automotor:

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
- **TONELAJE:** {{VEH_TONELAJE}} toneladas
- **SERVICIO:** {{VEH_SERVICIO}}
- **RAMV/CPN:** {{VEH_RAMV}}

---

### **TERCERA: PRECIO Y FORMA DE PAGO.-**

**3.1.-** El precio de la presente compraventa es la suma de **{{PRECIO_LETRAS}} (USD$ {{PRECIO_NUMERO}})**, cantidad que {{VENDEDOR_ARTICULO_MAYUS}} declara haber recibido a su entera satisfacción mediante **{{FORMA_PAGO}}** realizada por {{COMPRADOR_ARTICULO_MAYUS}}.

**3.2.-** Con el pago del precio señalado, {{VENDEDOR_ARTICULO_MAYUS}} se da por cancelado(a) y satisfecho(a) de la obligación contraída por {{COMPRADOR_ARTICULO_MAYUS}}, otorgando el correspondiente finiquito.

---

<!-- IF {{TIENE_INFRACCIONES}} == true -->

### **CUARTA: INFRACCIONES DE TRÁNSITO.-**

Las partes dejan expresa constancia de que {{COMPRADOR_ARTICULO_MAYUS}} tiene pleno conocimiento de que el vehículo objeto del presente contrato registra infracciones de tránsito pendientes de pago, las cuales se encuentran actualmente en proceso de dar de baja de conformidad con lo establecido en el **numeral cuatro (4) del artículo cuatrocientos dieciséis (416) del Código Orgánico Integral Penal (COIP)**, habiéndose declarado la **EXTINCIÓN DE LA ACCIÓN PENAL** por fallecimiento de **{{CAUSANTE_NOMBRE}}**, quien constaba como propietario(a) del vehículo al momento de cometerse las infracciones. No obstante lo anterior, {{VENDEDOR_ARTICULO_MAYUS}} se obliga(n) al saneamiento en caso de evicción conforme a la Ley.

<!-- ENDIF INFRACCIONES -->

---

### **CUARTA: ESTADO DEL VEHÍCULO Y GARANTÍAS.-**

> *(Nota para el desarrollador: la numeración de esta cláusula se ajusta automáticamente si existe la cláusula de infracciones. Si TIENE_INFRACCIONES == true, esta pasa a ser QUINTA.)*

**4.1.-** {{VENDEDOR_ARTICULO_MAYUS}} declara expresamente que el vehículo objeto de la presente compraventa se encuentra completamente libre de todo gravamen, hipoteca, prenda, embargo, prohibición de enajenar o cualquier otra limitación de dominio, según se acredita con el Certificado Único Vehicular antes mencionado.

**4.2.-** {{VENDEDOR_ARTICULO_MAYUS}} garantiza a {{COMPRADOR_ARTICULO_MAYUS}} el saneamiento por evicción del bien vendido, comprometiéndose a responder por cualquier reclamo de terceros sobre la propiedad del vehículo.

**4.3.-** {{COMPRADOR_ARTICULO_MAYUS}} declara conocer perfectamente el estado físico y mecánico del vehículo, manifestando su total conformidad con el mismo y renunciando expresamente a todo reclamo por vicios redhibitorios o defectos ocultos que pudiera presentar el automotor.

**4.4.-** El vehículo no presenta infracciones pendientes de pago según consta en el Certificado Único Vehicular emitido por la Agencia Nacional de Tránsito.

---

### **QUINTA: GASTOS.-**

Todos los gastos que origine la transferencia de dominio del vehículo, tales como derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos por **{{COMPRADOR_ARTICULO_MAYUS}}**.

---

### **SEXTA: JURISDICCIÓN Y COMPETENCIA.-**

Para todos los efectos legales derivados del presente contrato, las partes se someten a los jueces competentes de la ciudad de {{CIUDAD}}, renunciando expresamente a fuero especial que pudieren tener.

---

### **SÉPTIMA: ACEPTACIÓN Y RATIFICACIÓN.-**

Las partes aceptan íntegramente las cláusulas del presente contrato, declarando que han sido redactadas de común acuerdo y que las mismas son expresión fiel de su voluntad. El presente contrato se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada una de las partes.

---

### **OCTAVA: CUANTÍA.-**

La cuantía de la presente compraventa asciende a la suma de **{{PRECIO_LETRAS}} (USD$ {{PRECIO_NUMERO}})**.

---

En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.

---

&nbsp;

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**{{VENDEDOR_NOMBRE}}**

C.I. {{VENDEDOR_CEDULA}}

**{{VENDEDOR_ARTICULO_MAYUS}}**

&nbsp;

<!-- IF {{ES_CASADO_VENDEDOR}} == true -->

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**{{CONYUGE_VEND_NOMBRE}}**

C.I. {{CONYUGE_VEND_CEDULA}}

**CÓNYUGE DEL VENDEDOR(A)**

<!-- ENDIF -->

&nbsp;

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**{{COMPRADOR_NOMBRE}}**

C.I. {{COMPRADOR_CEDULA}}

**{{COMPRADOR_ARTICULO_MAYUS}}**
