# Referencia de revisión de la spec

> **Para qué sirve:** reúne los criterios, veredictos y severidades que aplica la skill `qa-sdd-revision-spec` cuando compara la historia de Jira con la spec (`requirement.md`, `design.md`, `tasks.md`).
> **Quién lo usa:** el QA de un equipo que trabaja con SDD (por ejemplo el Equipo Delta) y el agente `qa-sdd`, mientras ejecutan la revisión.
> **Cuándo se usa:** en los pasos 4 a 8 de la skill [`qa-sdd-revision-spec`](./SKILL.md), cada vez que se revisa o se vuelve a revisar una spec.

Criterios que aplica `qa-sdd-revision-spec`. La jerarquía de verdad es la del steering `qa-sdd`: HU > requirement > design > tasks. Esto significa que, si dos fuentes se contradicen, gana la de mayor jerarquía y la contradicción se informa.

> **Nota:** **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) es la forma de trabajo en la que desarrollo escribe antes una spec revisable. **HU** es la historia de usuario. Los ejemplos de esta referencia usan la historia `PROJ-142` "Consultar el estado de un pedido", de la épica `PROJ-40` "Pedidos y seguimiento".

## 1. HU ↔ requirement

### Qué se extrae de cada fuente

| Elemento | HU de Jira | requirement.md |
| :--- | :--- | :--- |
| Narrativa y título | Sí | Sí |
| Criterios de aceptación | Lista | Lista |
| Reglas de negocio | Sección o implícitas en los criterios | Sección |
| Alcance y fuera de alcance | Sección | Sección |
| Decisiones tomadas en refinamiento | Sección | Puede estar como configuración, regla o validación |
| Decisiones pendientes | Sección | Sección |
| Dependencias | Sección | Sección |
| Datos de prueba | Si los tiene | Si los tiene |

> **Nota:** una decisión de refinamiento puede aparecer en el requirement disfrazada de parámetro técnico (por ejemplo "máximo 20"). Por eso se busca en todo el requirement y no solo en la sección de decisiones.

### Veredictos por criterio

| Veredicto | Cuándo |
| :--- | :--- |
| Consistente | Dicen lo mismo, aunque con otras palabras o con más detalle que no cambia el sentido |
| Enriquecido (observación) | El requirement agrega detalle que no está en Jira. Es esperable, pero el QA valida que sea legítimo |
| Solo en Jira (observación) | El criterio no pasó al requirement |
| Solo en requirement (observación) | Criterio nuevo que no volvió a Jira |
| Contradictorio | Dicen cosas opuestas |

### Decisiones de refinamiento contra la configuración

1. Extraer **todas** las decisiones tomadas en refinamiento de la HU.
2. Para cada una, buscar en el requirement una configuración, parámetro, regla, validación, error o criterio que la contradiga o la revierta.
3. Si la decisión dice "no se hace X" y el requirement introduce X, es Contradictorio y severidad Crítica.

> **Ejemplo (inventado):** en `PROJ-142` la decisión de refinamiento dice "si el pedido pertenece a otro comprador, el sistema responde igual que ante un pedido inexistente, para no revelar que existe" (`CA-3`, `RN-PED-22`). Si el requirement trae un parámetro `ocultarExistencia = false` (o un error "El pedido pertenece a otro comprador"), la decisión está revertida: es Contradictorio y Crítica, aunque el parámetro parezca un detalle técnico. Además es un riesgo de permisos, un área crítica del módulo. Un riesgo típico es no detectarlo por tratarlo como configuración.

### Decisiones pendientes

| Situación | Cómo se informa |
| :--- | :--- |
| Pendiente en Jira, resuelta en el requirement | Esperable. Informar la resolución para que vuelva a Jira |
| Pendiente nueva en el requirement | Señalar: puede bloquear el DoR |
| Resuelta en el requirement de forma distinta a lo hablado en Jira | Contradictorio |

> **Nota:** **DoR** (*Definition of Ready*) es la lista de condiciones que una HU debe cumplir para entrar al sprint. La versión para equipos SDD está en `01-estandares-globales/definicion-dor-dod-sdd.md`.

### Front y Figma

| Tipo | Indicadores | Qué se exige |
| :--- | :--- | :--- |
| Front | Pantallas, formularios, componentes, navegación, Figma | Link de Figma en la HU o en el requirement. Flujos, estados (carga, vacío, error, éxito), mensajes y campos coherentes con Figma |
| Back | Endpoints, servicios, procesamiento, integración, base | Entrada y salida funcional, validaciones y errores esperados |
| Full-stack | Ambos | Ambos |

## 2. requirement ↔ design

### Trazabilidad

Cada criterio del requirement debe tener al menos un endpoint, componente, evento o error en el design que lo implemente.

| # | Criterio | Endpoint o componente | Errores relacionados | Estado |
| :--- | :--- | :--- | :--- | :--- |

Estados: Trazado · Parcial (falta un error, un campo o un estado) · Sin trazar.

> **Ejemplo:** el criterio "si el pedido no existe, se informa que no se encontró" debe tener en el design un endpoint `GET` de consulta de pedido y un error 404 con su mensaje. Si falta el 404, el estado es Parcial.

### Completitud de un contrato

Un **contrato** es la definición exacta de cómo se usa un endpoint. Un contrato está completo cuando tiene todos estos elementos:

| Elemento | Qué tiene que estar |
| :--- | :--- |
| Método y path | Exactos |
| Parámetros de path y query | Nombre, tipo, obligatoriedad |
| Body del request | Campos, tipos, obligatoriedad, formato |
| Respuesta 2xx | Estructura y ejemplo |
| Errores | Código de negocio, HTTP, condición que lo dispara y mensaje |
| Headers | Autenticación y correlación (identificador para seguir una petición en los logs), si aplican |
| Enums | Valores posibles y significado |
| Validaciones | Longitudes, rangos, formatos, reglas cruzadas |

### Catálogo de errores

Cada error del design se cruza con los criterios y las reglas. Se señalan:

- Errores sin condición o sin mensaje.
- Condiciones de los criterios que no tienen error definido.
- Códigos repetidos con significados distintos.
- Errores de integraciones externas sin manejo definido (timeout, 5xx, respuesta vacía).

> **Nota:** una **integración externa** es un servicio que no es parte del producto, por ejemplo el de logística que informa dónde está un envío. Qué ve el usuario cuando ese servicio tarda, falla o responde vacío debe estar definido en la spec.

### Estados

Si el design define estados (de un pedido, una operación, un archivo), se verifica que estén todos, que las transiciones estén definidas y que cada estado observable tenga cómo verse (respuesta, base o pantalla).

> **Ejemplo:** estados de un pedido (`RN-PED-08`): `CREADO` → `EN_PREPARACION` → `ENVIADO` → `ENTREGADO`, y `CANCELADO` como estado final alternativo. Se verifica que cada transición válida esté definida y que cada estado se vea en la respuesta de la API o en la pantalla.

### Alcance extra

Endpoints, campos o comportamientos del design que no corresponden a ningún criterio. Se informan con una observación para que el equipo confirme si son necesarios.

## 3. design ↔ tasks

| Situación | Cómo se informa |
| :--- | :--- |
| Task sin criterio ni elemento del design | Task huérfana |
| Criterio o elemento del design sin task | Gap de implementación |
| Task de QA | No se evalúa |

## 4. Severidad

| Severidad | Cuándo |
| :--- | :--- |
| Crítica | Criterio contradictorio, regla opuesta, alcance inconsistente, decisión de refinamiento revertida, front sin Figma, criterio sin trazar |
| Media | Criterio solo en una fuente sin justificación, regla modificada sin comunicar, contrato incompleto, error sin condición o sin mensaje |
| Baja | Diferencia de redacción sin cambio de sentido |
| Informativa | El requirement o el design enriquecen sin contradecir |

## 5. Veredictos generales

| Veredicto | Cuándo |
| :--- | :--- |
| HU ↔ requirement: Coherente | Sin discrepancias críticas ni medias |
| Con observaciones | Solo medias, bajas o informativas |
| Incoherente | Al menos una crítica |
| Spec: Lista para casos | Todo criterio trazado con resultado esperado determinista |
| Gaps menores | Faltan datos que no impiden diseñar la mayoría de los casos |
| Gaps bloqueantes | Hay criterios sin resultado esperado definible |

> **Nota:** un resultado esperado **determinista** es el que se puede comprobar sin interpretar: dice qué valor, qué mensaje o qué pantalla se espera.
