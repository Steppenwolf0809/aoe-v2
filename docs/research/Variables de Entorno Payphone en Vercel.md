# **Arquitectura de Implementación, Gestión de Variables de Entorno y Estrategias de Despliegue para Payphone Ecuador en Infraestructura Vercel**

## **1\. Resumen Ejecutivo y Alcance de la Integración Financiera**

La implementación de pasarelas de pago en arquitecturas modernas basadas en la nube representa uno de los desafíos más críticos en el desarrollo de software actual, especialmente en mercados emergentes como el de Ecuador. La intersección entre la agilidad que ofrecen plataformas de "Frontend Cloud" como **Vercel** y los requisitos de cumplimiento, seguridad y estabilidad de instituciones financieras como **Payphone**, demanda un enfoque riguroso en la gestión de la configuración. Este reporte técnico exhaustivo analiza la documentación pública de Payphone y las mejores prácticas de Vercel para establecer una guía definitiva sobre las variables de entorno necesarias para un entorno de producción robusto.

El objetivo central de este documento es trascender la simple enumeración de credenciales. Se busca proporcionar una comprensión profunda de la *topología de la transacción*, donde cada variable de entorno no es solo una cadena de caracteres, sino un componente vital que controla el flujo de dinero, la seguridad de los datos del tarjetahabiente y la experiencia del usuario final. En el contexto ecuatoriano, donde la digitalización de los pagos ha crecido exponencialmente, la capacidad de procesar transacciones mediante API RESTful de manera segura, escalable y resiliente es un diferenciador competitivo fundamental.

Payphone, como facilitador de pagos, opera bajo un modelo que abstrae la complejidad de la red bancaria tradicional, permitiendo cobros mediante tarjeta de crédito, débito y saldo propio a través de una API accesible.1 Sin embargo, al desplegar esta integración sobre Vercel (utilizando frameworks como Next.js), los desarrolladores se enfrentan a la naturaleza efímera de las funciones serverless, la gestión de estados en el borde (Edge) y la necesidad de asegurar secretos en un entorno que es inherentemente público en su capa de presentación. Este reporte desglosa cómo orquestar estas variables para garantizar la integridad transaccional, el cumplimiento de normativas implícitas de seguridad y la optimización del rendimiento operativo.

## ---

**2\. Paradigmas de Integración y Arquitectura Serverless**

Antes de definir las variables específicas, es imperativo establecer el modelo arquitectónico sobre el cual operan. La integración de Payphone en Vercel no es una conexión monolítica; es un sistema distribuido donde las variables de entorno actúan como los enlaces de configuración que permiten la comunicación segura entre componentes desacoplados.

### **2.1 El Modelo de Responsabilidad Compartida en Vercel**

Vercel opera bajo un paradigma serverless, lo que significa que no existe un servidor persistente esperando conexiones. En su lugar, las funciones (API Routes o Serverless Functions) se instancian bajo demanda. Esto tiene implicaciones profundas para la gestión de credenciales de Payphone:

* **Inmutabilidad en Tiempo de Ejecución:** Las variables de entorno se inyectan en el momento del arranque del contenedor de la función. No pueden cambiarse dinámicamente sin un redespliegue.  
* **Segregación Cliente-Servidor:** En frameworks como Next.js, existe una barrera estricta entre el código que se ejecuta en el navegador del usuario y el que se ejecuta en los servidores de Vercel. Payphone requiere credenciales sensibles (Tokens Bearer) que **jamás** deben cruzar al lado del cliente.3

### **2.2 La API REST de Payphone: Sale vs. Links**

El análisis de la documentación y los recursos disponibles identifica dos mecanismos principales de integración, cada uno con requisitos de configuración distintos:

1. **API Sale (Cobro Directo/Botón de Pagos):** Permite iniciar una transacción desde la aplicación, recibiendo los datos de la tarjeta o enviando una solicitud de pago a la app del usuario.1 Esta modalidad requiere una gestión intensiva de variables para manejar callbacks (responseUrl), tiempos de espera y verificaciones de estado.  
2. **Links de Pagos:** Generación de enlaces para cobro asíncrono.4 Aunque más simple, en un entorno Vercel de producción, aún requiere autenticación segura para generar los enlaces dinámicamente.

Este reporte se centrará en la implementación de **API Sale**, ya que representa el escenario de mayor complejidad y control, requiriendo un manejo granular de las variables de entorno para orquestar la experiencia de usuario completa dentro del dominio del comercio.

## ---

**3\. Taxonomía Exhaustiva de Variables de Entorno para Producción**

La transición de un entorno de pruebas (Sandbox) a producción (Live) es el punto de fallo más común en integraciones fintech. Un error en una variable de entorno puede resultar en transacciones procesadas en modo de prueba (pérdida de dinero real) o transacciones reales rechazadas por configuraciones de prueba (pérdida de ventas). A continuación, se detalla la taxonomía completa de las variables requeridas.

### **3.1 Variables de Identidad y Autenticación (Nivel Crítico)**

Estas variables establecen "quién" es la aplicación ante los ojos de Payphone. Su compromiso implica la capacidad de un atacante para realizar reembolsos no autorizados o acceder a históricos transaccionales.

#### **3.1.1 PAYPHONE\_API\_TOKEN (El Secreto Maestro)**

Esta es la variable más sensible del sistema. Payphone utiliza un esquema de autenticación basado en **Bearer Tokens** estándar.

* **Definición:** Es una cadena alfanumérica de alta entropía que actúa como la llave de autorización para todas las solicitudes HTTP hacia la API.  
* **Origen:** Se genera en el panel de desarrolladores de Payphone ("Console" o "Developer Dashboard"). Es crucial generar un *nuevo* token específicamente para producción, revocando o separando cualquier token utilizado durante la fase de desarrollo.3  
* **Configuración en Vercel:** Debe añadirse en la sección "Environment Variables" del proyecto, desmarcando las opciones de disponibilidad para el navegador. Solo debe estar accesible en el entorno Production y Preview (si se usa un sandbox compartido), pero nunca expuesta al cliente.  
* **Uso Técnico:** Se inyecta en el encabezado Authorization.  
  HTTP  
  Authorization: Bearer process.env.PAYPHONE\_API\_TOKEN

* **Riesgo de Exposición:** Si esta variable se prefija erróneamente con NEXT\_PUBLIC\_ en Next.js, se incluirá en el bundle de JavaScript del navegador, permitiendo a cualquier usuario extraerla y realizar operaciones fraudulentas.

#### **3.1.2 PAYPHONE\_STORE\_ID (Identificador de Sucursal)**

Aunque muchas implementaciones pueden inferir la tienda por el token, la arquitectura de Payphone permite que un solo comercio (empresa) tenga múltiples tiendas o puntos de venta.

* **Definición:** Un identificador único (generalmente un UUID o entero largo) que vincula la transacción a una sucursal específica para efectos de contabilidad y conciliación bancaria.  
* **Contexto en Producción:** En entornos empresariales grandes, es posible que se necesiten múltiples variables de entorno (ej. PAYPHONE\_STORE\_ID\_QUITO, PAYPHONE\_STORE\_ID\_GUAYAQUIL) si la aplicación Vercel sirve a múltiples regiones físicas, seleccionando la variable adecuada en tiempo de ejecución basada en la lógica de negocio.  
* **Privacidad:** Aunque menos sensible que el token, se recomienda mantenerlo en el lado del servidor (process.env.PAYPHONE\_STORE\_ID) para evitar la enumeración de la estructura interna del negocio por parte de competidores.

### **3.2 Variables de Infraestructura y Enrutamiento**

Estas variables definen "dónde" ocurren las transacciones. La distinción entre las URLs de Sandbox y Producción es fundamental.

#### **3.2.1 PAYPHONE\_API\_URL (Endpoint Base)**

Nunca se debe "hardcodear" (escribir directamente) la URL de la API en el código fuente. Payphone mantiene entornos estrictamente separados.

* **Valor en Producción:** Generalmente sigue el patrón https://pay.payphone.app/api (o la versión específica v2 si aplica).3  
* **Valor en Sandbox:** Apunta a servidores de prueba que simulan respuestas bancarias sin movimiento de dinero real (ej. https://pay.payphone.app/api/button/Prepare).  
* **Justificación en Vercel:** Al utilizar una variable de entorno, se permite que el mismo código fuente desplegado en la rama develop apunte al Sandbox, mientras que el despliegue en main apunta automáticamente a Producción. Esto facilita el uso de "Preview Deployments" de Vercel para validar cambios en la lógica de pagos sin riesgo financiero.

#### **3.2.2 NEXT\_PUBLIC\_APP\_URL (Dominio de Retorno)**

Esta variable es vital para cerrar el ciclo de la transacción. Payphone necesita saber a dónde redirigir al usuario o a dónde notificar el resultado.

* **Uso en responseUrl:** La API de Payphone acepta un parámetro responseUrl.3 Payphone realizará una llamada (o redirección) a esta URL con el id y clientTransactionID de la transacción.  
* **Desafío en Vercel:** Vercel genera URLs aleatorias para cada despliegue (proyecto-git-rama-usuario.vercel.app). Sin embargo, Payphone requiere una URL absoluta y pública.  
* **Configuración:** En producción, esta variable debe ser el dominio canónico de su comercio (ej. https://www.mitienda.ec).  
* **Construcción Dinámica:**  
  JavaScript  
  // Ejemplo de uso seguro  
  const callbackUrl \= \`${process.env.NEXT\_PUBLIC\_APP\_URL}/api/payments/callback\`;

  Si esta variable no está configurada correctamente, los usuarios podrían pagar y quedar en una pantalla blanca o en la página de Payphone sin retornar a su tienda, generando inconsistencia en los pedidos (pagado pero no procesado).

### **3.3 Variables de Control de Flujo y Negocio**

Estas variables ajustan el comportamiento de la integración según las reglas de negocio y las limitaciones técnicas de la plataforma.

#### **3.3.1 PAYPHONE\_TIMEOUT\_MS (Tiempo de Espera)**

Las funciones serverless de Vercel tienen límites de tiempo de ejecución (por defecto 10s o 60s dependiendo del plan). Las transacciones financieras pueden ser lentas debido a la comunicación interbancaria.

* **Recomendación:** Establecer un timeout interno para la llamada a Payphone que sea menor al timeout de la función de Vercel.  
* **Valor Sugerido:** 25000 (25 segundos) para el plan Pro de Vercel, permitiendo 5 segundos para procesar la respuesta o capturar el error antes de que Vercel mate el proceso.

#### **3.3.2 PAYPHONE\_REGION\_PREFIX (Prefijo de Transacción)**

Para evitar colisiones de IDs de transacción (clientTransactionId) entre entornos de desarrollo, pruebas y producción, es crucial usar prefijos.

* **Valor Producción:** PRD- o LIVE-  
* **Valor Desarrollo:** DEV-  
* **Uso:** const txId \= process.env.PAYPHONE\_REGION\_PREFIX \+ internalOrderId;  
* **Importancia:** Ayuda en la auditoría y evita que una prueba en desarrollo choque con un ID de pedido real si la base de datos de pedidos no está perfectamente sincronizada.

## ---

**4\. Matriz de Configuración de Variables para Vercel**

A continuación, se presenta una matriz estructurada que resume las variables críticas, su visibilidad y su propósito en el ecosistema Vercel-Payphone.

| Variable de Entorno | Tipo | Visibilidad | Valor Ejemplo (Producción) | Descripción Técnica y Crítica |
| :---- | :---- | :---- | :---- | :---- |
| PAYPHONE\_API\_TOKEN | **Secreto** | **Servidor** | eyJhbGciOi... (Bearer) | Credencial maestra. Otorga permisos de cobro y anulación. Jamás exponer al cliente. 3 |
| PAYPHONE\_STORE\_ID | Config | Servidor | 12345 / UUID | Identifica la caja o sucursal. Necesario para conciliación multi-local. |
| PAYPHONE\_API\_URL | Config | Servidor | https://pay.payphone.app/api | Endpoint base. Debe ser explícitamente el de producción para evitar el modo Sandbox. |
| NEXT\_PUBLIC\_APP\_URL | Config | **Público** | https://mitienda.ec | Raíz del dominio. Base para construir responseUrl y redirecciones de éxito/error. |
| PAYPHONE\_MODE | Lógica | Servidor | LIVE | Flag interno para activar lógicas específicas de producción (ej. desactivar logs detallados). |
| PAYPHONE\_CLIENT\_ID | Identidad | Servidor | 1234... | Identificador de aplicación (appId) si la autenticación lo requiere adicionalmente al token. 5 |
| WEBHOOK\_SECRET | Seguridad | Servidor | RandomHashString | (Implementación propia) Token para validar que la llamada al webhook es legítima. |

## ---

**5\. Arquitectura de Red y Comunicación en Vercel**

La implementación en Vercel introduce desafíos de red específicos que deben ser mitigados mediante configuración.

### **5.1 Gestión de CORS (Cross-Origin Resource Sharing)**

Si su arquitectura implica que el frontend (React/Next.js) haga llamadas asíncronas para verificar el estado de una transacción, se enfrentará a restricciones de CORS. Aunque Payphone realiza la llamada de servidor a servidor (Webhook), su frontend podría necesitar consultar su propio backend (/api/status).

* **El Problema:** Vercel no añade encabezados CORS por defecto a las API Routes.  
* **La Solución:** Definir una variable ALLOWED\_ORIGINS en producción.  
  Fragmento de código  
  ALLOWED\_ORIGINS="https://mitienda.ec,https://payphone.app"

* **Implementación:** En el archivo next.config.js o en un middleware, utilizar esta variable para establecer dinámicamente el header Access-Control-Allow-Origin. Esto es crucial para permitir que el dominio de Payphone (si interactúa vía scripts de cliente) o su propio dominio se comuniquen sin bloqueos del navegador.6

### **5.2 Whitelisting de Direcciones IP**

Históricamente, muchas pasarelas bancarias exigían una lista blanca de IPs fijas desde donde se originaban las peticiones.

* **Limitación de Vercel:** Vercel utiliza direcciones IP dinámicas y compartidas en su red de entrega de contenido (CDN) y funciones serverless. La IP de salida cambia constantemente.7  
* **Análisis Payphone:** La documentación pública de Payphone y su arquitectura moderna basada en Tokens Bearer sugieren que **no requieren whitelisting de IP** estricto para la API REST estándar.3 La autenticación recae en la seguridad del Token.  
* **Contingencia:** Si en algún nivel de seguridad avanzado Payphone requiriera IP fija (caso atípico en su API pública), la solución en Vercel implica configurar una variable PROXY\_URL (ej. apuntando a un servicio como QuotaGuard o un NAT Gateway en AWS) y enrutar todas las llamadas a la API de Payphone a través de este proxy. Sin embargo, para la mayoría de implementaciones estándar, esto no es necesario.

## ---

**6\. Ciclo de Vida de la Transacción y Manejo de Estados**

El éxito de la implementación depende de cómo las variables de entorno soportan el ciclo de vida de la transacción, especialmente en el manejo de la asincronía y las confirmaciones.

### **6.1 El Flujo de responseUrl y Webhooks**

La documentación indica que Payphone utiliza un parámetro responseUrl para notificar el resultado de la transacción.3

1. **Inicio:** El backend en Vercel construye el objeto de venta incluyendo:  
   JSON  
   {  
     "amount": 1000,  
     "responseUrl": "https://mitienda.ec/api/payphone-webhook?secret=MI\_SECRETO\_INTERNO",  
     "clientTransactionId": "PRD-ORDER-999"  
   }

2. **Notificación:** Payphone realiza un POST o GET a esa URL adjuntando el id de la transacción.

**Variable Crítica: WEBHOOK\_INTEGRITY\_SECRET** Dado que la documentación pública no detalla un mecanismo de firma criptográfica (HMAC) en los encabezados del webhook de Payphone 3, es **vital** implementar un mecanismo de verificación propio.

* **Estrategia:** Incluir un token secreto en la responseUrl como parámetro de consulta (query param).  
* **Validación:** Cuando Vercel recibe la llamada en el endpoint del webhook, debe verificar: req.query.secret \=== process.env.WEBHOOK\_INTEGRITY\_SECRET. Si no coinciden, rechazar la petición inmediatamente (403 Forbidden). Esto previene que actores maliciosos intenten inyectar transacciones falsas llamando a su endpoint público.

### **6.2 Verificación de Estado y Rate Limiting**

Payphone impone un límite de **30 consultas por minuto** en su endpoint de verificación de estado (GET /api/Sale/{id}).3 Esto es una restricción severa para sitios de alto tráfico.

* **Variable POLLING\_INTERVAL:** Si su frontend realiza encuestas (polling) para saber si el pago se completó, no debe ser agresivo.  
  * *Mala Práctica:* setInterval(checkStatus, 1000\) (1 segundo).  
  * *Buena Práctica:* Configurar NEXT\_PUBLIC\_POLLING\_INTERVAL=5000 (5 segundos) en las variables de entorno.  
* **Lógica de "Backoff":** Si el servidor recibe muchas peticiones, debe implementar una espera exponencial.  
* **Estrategia de Producción:** Confiar primariamente en la responseUrl (Webhook) para la actualización del estado en la base de datos, y usar el polling del frontend solo como mecanismo de actualización de UI, consultando su propia base de datos en lugar de la API de Payphone directamente, para no saturar el límite de tasa.

## ---

**7\. Seguridad y Cumplimiento Normativo (PCI-DSS)**

Aunque Payphone maneja la captura de datos sensibles (PAN, CVV) a través de sus interfaces seguras, la integración desde Vercel debe cumplir con estándares de seguridad para no comprometer la certificación.

### **7.1 Sanitización de Logs**

En producción, el nivel de registro (logging) debe ser estricto. Vercel almacena logs de las funciones serverless.

* **Variable LOG\_LEVEL:** Configurar a info o error. Nunca debug en producción.  
* **Riesgo:** Imprimir el objeto completo de la solicitud (console.log(req.body)) podría exponer datos personales del usuario (PII) o tokens de sesión en los logs de Vercel, violando normativas de protección de datos en Ecuador.  
* **Implementación:** Crear una utilidad de log que ofusque automáticamente campos sensibles antes de enviarlos a la salida estándar.

### **7.2 Protección contra Replay Attacks**

Un riesgo inherente a los webhooks es que Payphone (o un atacante retransmitiendo un paquete capturado) envíe la misma confirmación de pago múltiples veces.

* **Idempotencia:** Su lógica de base de datos debe ser idempotente.  
* **Mecanismo:** Antes de procesar un pago entrante por webhook, verificar si el clientTransactionId ya tiene estado COMPLETED. Si es así, devolver estado 200 OK sin procesar nuevamente el pedido (evitando duplicidad de envío de mercancía o doble crédito de saldo).

## ---

**8\. Protocolo de Despliegue a Producción (Checklist)**

Para finalizar, se presenta un protocolo paso a paso para la configuración de variables en el dashboard de Vercel antes del "Go-Live".

1. **Generación de Credenciales:**  
   * Acceder al portal de Payphone Developers.  
   * Crear una nueva aplicación tipo "Producción".  
   * Copiar el Token y StoreId generados.  
2. **Configuración en Vercel:**  
   * Ir a Settings \> Environment Variables.  
   * Añadir PAYPHONE\_API\_TOKEN (valor de prod) \-\> Seleccionar solo entorno Production.  
   * Añadir PAYPHONE\_API\_TOKEN (valor de sandbox) \-\> Seleccionar solo entorno Preview y Development.  
   * Repetir para PAYPHONE\_STORE\_ID y PAYPHONE\_API\_URL.  
3. **Validación de NEXT\_PUBLIC\_APP\_URL:**  
   * Asegurar que en producción coincida con el dominio final con certificado SSL (https://...). Payphone requiere HTTPS obligatorio.3  
4. **Prueba de Humo (Smoke Test):**  
   * Realizar una compra real de bajo monto ($1.00 USD).  
   * Verificar que el responseUrl recibió la notificación.  
   * Verificar que la consulta de estado GET retornó "Approved".  
   * Proceder a anular (Refund) la transacción desde el panel de Payphone para verificar que el ciclo completo de credenciales (permisos de escritura y anulación) es correcto.

## ---

**9\. Conclusión**

La integración de Payphone en Ecuador sobre la infraestructura de Vercel es un ejercicio de precisión en la configuración. No existe una "instalación por defecto"; la seguridad y fiabilidad del sistema dependen enteramente de la correcta segregación de entornos a través de las variables descritas.

La variable PAYPHONE\_API\_TOKEN es el activo más crítico y debe ser tratada como un secreto de estado, residiendo únicamente en el entorno de servidor. La responseUrl, construida dinámicamente con NEXT\_PUBLIC\_APP\_URL, es el nervio central que comunica el éxito financiero de vuelta a la aplicación. Finalmente, el respeto a los límites de tasa (30 RPM) y la implementación de secretos de integridad en los webhooks son las marcas de una arquitectura de grado profesional.

Al adherirse a esta taxonomía de variables y estrategias de arquitectura, los desarrolladores pueden desplegar soluciones de pago en Ecuador que no solo funcionan, sino que son resilientes, seguras y escalables, listas para soportar la creciente demanda del comercio electrónico en la región.

#### **Fuentes citadas**

1. Cómo integrar la API Sale de Payphone? \- YouTube, acceso: febrero 12, 2026, [https://www.youtube.com/watch?v=Y7KCMq91QPk](https://www.youtube.com/watch?v=Y7KCMq91QPk)  
2. Cómo integrar el botón de pago Payphone? \- YouTube, acceso: febrero 12, 2026, [https://www.youtube.com/watch?v=1LETsOWT\_qY](https://www.youtube.com/watch?v=1LETsOWT_qY)  
3. Cobro por app \- Api Payphone, acceso: febrero 12, 2026, [https://docs.payphone.app/api-implementacion\#notificaciones](https://docs.payphone.app/api-implementacion#notificaciones)  
4. Cómo integrar la API Link de Pagos Payphone? \- YouTube, acceso: febrero 12, 2026, [https://www.youtube.com/watch?v=8vq2eZYdglA](https://www.youtube.com/watch?v=8vq2eZYdglA)  
5. acceso: diciembre 31, 1969, [https://docs.payphone.app/primeros-pasos-desarrolladores](https://docs.payphone.app/primeros-pasos-desarrolladores)  
6. How can I enable CORS on Vercel?, acceso: febrero 12, 2026, [https://vercel.com/kb/guide/how-to-enable-cors](https://vercel.com/kb/guide/how-to-enable-cors)  
7. How can I allowlist IP addresses for a deployment? | Vercel Knowledge Base, acceso: febrero 12, 2026, [https://vercel.com/kb/guide/how-to-allowlist-deployment-ip-address](https://vercel.com/kb/guide/how-to-allowlist-deployment-ip-address)