---
name: qa-crear-tarea-automatizacion
description: Crea en el tablero de automatización (proyecto AUTO) la tarea de automatización de una o varias historias o bugs de cualquier equipo, con el título del perfil del equipo, vinculada a la tarea origen y, si se pide, en un sprint del tablero, después de mostrar la lista exacta y recibir confirmación. Usar cuando el QA pide "creá la tarea de automatización de PROJ-123", "creá las tareas de automatización de estas HU para el Equipo Beta", "pasá estas historias al tablero de automatización". No automatiza ni crea casos de prueba.
---
# Crear tarea de automatización

> **Para qué sirve:** crea en Jira las tareas del tablero de automatización (proyecto `AUTO`) a partir de historias o bugs de los equipos, todas con el mismo tipo, el mismo formato de título y el vínculo con su tarea origen.
> **Quién lo usa:** el QA de cualquier equipo (Alfa, Beta, Gamma, Delta) o el QA de automatización.
> **Cuándo se usa:** cuando una historia o un bug necesita automatización y todavía no tiene su tarea en `AUTO`, por ejemplo al armar el backlog de automatización de un sprint.

> **Nota:** HU = Historia de Usuario. Un *tablero* (board) es la vista de Jira donde se ordenan las tareas por sprint. Un *sprint* es la iteración de trabajo del equipo (por ejemplo, "Sprint 12").

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.2 |
| Puntos de control | Tareas a crear |
| Archivos en `.qa-work/` | Escribe `tareas-auto/<fecha>-<equipo>.md` |

## Propósito

Que toda tarea de automatización del tablero `AUTO` tenga el mismo tipo, el mismo formato de título y el vínculo con su tarea origen, para cualquier equipo.

## Cuándo usarla

- Hay historias o bugs de un equipo que necesitan automatización y todavía no tienen su tarea en `AUTO`.
- Se arma el backlog de automatización de un sprint.

## Cuándo no usarla

- La tarea `AUTO` ya existe → trabajarla con [`qa-automation`](../../agents/qa-automation.md).
- Hay que crear tests en Xray → [`qa-carga-xray`](../qa-carga-xray/SKILL.md) o [`qa-registro-automatizacion`](../qa-registro-automatizacion/SKILL.md).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Tareas origen (claves o links de Jira) | Sí | Pedirlas |
| Equipo | Sí | Lo indica el QA. Si no, deducirlo del proyecto de las claves en [`05-equipos/indice-equipos.md`](../../../05-equipos/indice-equipos.md) y confirmarlo |
| Sprint del tablero de automatización | No | Crear en el backlog y avisar |
| Descripción | No | Sin descripción, salvo que el QA la pida |

> **Ejemplo:** "Creá la tarea de automatización de PROJ-123 y PROJ-130 para el Equipo Beta, en el Sprint 12".

## Contexto que lee

1. Perfil del equipo ([`05-equipos/`](../../../05-equipos/indice-equipos.md)), sección 4: patrón "Tarea de automatización (proyecto AUTO)". Si el perfil no lo tiene, proponer `[TAE] <Equipo> - <Capa> | <título origen>` (el mismo patrón que usan los perfiles de ejemplo, donde `TAE` es *Test Automation Engineering*, ingeniería de automatización de pruebas, y la capa es `Web` o `API`), confirmarlo con el QA y proponer agregarlo al perfil.
2. Steering [`qa-jira-xray`](../../steering/qa-jira-xray.md): reglas de escritura y tipo de vínculo `Test`.
3. Usuario de la sesión: `atlassianUserInfo`.

> **Ejemplo:** para el Equipo Beta (checkout y pagos) el título queda `[TAE] Beta - Web | <título de la historia origen>`, tal como lo define el perfil `05-equipos/beta.md`.

## Datos del tablero de automatización

| Dato | Valor |
| :--- | :--- |
| Proyecto | `AUTO` (Automatización de pruebas) |
| Board | Tablero de automatización del proyecto `AUTO` (el QA indica su nombre o id si hay más de uno) |
| Tipo de issue | **Tarea** (`Task`). Nunca Historia |
| Componente | `Automatizacion` |
| Vínculo con la tarea origen | Tipo **`Test`** (singular). `inwardIssue` = tarea `AUTO`; `outwardIssue` = tarea origen. La tarea origen queda "is tested by" la tarea `AUTO` |
| Sprint | Campo Sprint de Jira, con el id del sprint del tablero buscado por nombre |

> **Nota:** `inwardIssue` y `outwardIssue` son los dos extremos del vínculo en la API de Jira. Si se invierten, el vínculo queda al revés (ver "Errores conocidos"). Los ids internos de campos (por ejemplo, el del campo Sprint) son propios de cada instancia de Jira: se consultan, no se copian de otro proyecto.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `atlassianUserInfo`, `getJiraIssue`, `searchJiraIssuesUsingJql`, `getJiraBoardSprintData` (con `executeRead`) |
| Escritura (solo después de la confirmación) | `createJiraIssue`, `createJiraIssueLink` (con `executeWrite`), `editJiraIssue` (sprint) |

> **Nota:** todas son herramientas del servidor MCP `@atlassian`.

## Tareas de performance

Si la tarea origen es el **pedido de una prueba de performance** (Tarea o Historia creada por el líder técnico del equipo, "TL"), la tarea `AUTO` se crea así en lugar del patrón del perfil:

| Dato | Valor |
| :--- | :--- |
| Tipo | Tarea |
| Épica | La épica de performance del proyecto `AUTO` (en los ejemplos, `AUTO-10` *Performance Test (armado y ejecución)*), enviada como `parent` al crear (el campo "Enlace de epic" no se edita al crear) |
| Título | `[Performance] <servicio o flujo> - <motivo>` |
| Etiquetas | `PERFORMANCE` (en mayúsculas) y la del equipo en minúscula (`alfa`, `beta`, `gamma` o `delta`), como define `plan-pruebas-performance.md`, sección 12.2 |
| Vínculo con el pedido | Tipo `Test`, igual que el resto: `inwardIssue` = tarea `AUTO`; `outwardIssue` = el pedido |
| Campos adicionales | Story Points y los campos personalizados que use el equipo. Se envían por **id** de campo (se consultan en la instancia de Jira); los campos que se resuelven por nombre pueden fallar al crear |
| Sprint | El sprint activo del tablero (`assignToSprint: "active"`), si el QA lo confirma |
| Descripción | Secciones `Resumen`, `Contexto`, `Criterios de aceptación` y `Otra información`, tomadas del pedido |

> **Nota:** `AUTO-10` es un ejemplo (el mismo de la ficha de `plan-pruebas-performance.md`): la épica real de performance la define el equipo. "Story Points" es la estimación de esfuerzo de la tarea.

Antes de crear, verificar que el pedido tenga completa la planilla de pedido de performance (ver [`plan-pruebas-performance.md`](../../../03-qa-automatizacion/plan-pruebas-performance.md)) y que no exista ya una tarea `AUTO` vinculada. Una tarea de ejecución en PRE (preproducción) que se sigue por separado (campaña de corridas) es hija de la misma épica y se vincula con tipo `Test` a la tarea `AUTO` de la prueba.

## Pasos

1. **Tareas origen.** Leer cada una con `getJiraIssue`: summary exacto, tipo y estado.
2. **Equipo y título.** Leer el patrón del perfil y armar el título de cada tarea. El título origen se copia **tal cual**, con sus corchetes; no se resume ni se mejora. Si el patrón incluye un dato que no se puede deducir (por ejemplo la capa `Web` o `API`), preguntarlo.
3. **Duplicados.** Buscar si la tarea origen ya tiene una tarea `AUTO` vinculada (`project = AUTO AND issue in linkedIssues(<CLAVE>)`). Si existe, no se crea otra: se informa.
4. **Sprint.** Si el QA indicó uno, buscar su id por nombre en el tablero.
5. **[PUNTO DE CONTROL] Tareas a crear · esperando tu confirmación.** Mostrar la tabla del punto de confirmación y guardarla en `.qa-work/tareas-auto/<fecha>-<equipo>.md` (Borrador). Esperar OK y pasarla a Aprobado.
6. **Crear, de a una:** tarea con proyecto `AUTO`, tipo Tarea, summary, componente `Automatizacion` y asignada según indique el QA; vínculo `Test` con la tarea origen; sprint si se pidió.
7. **Verificar** con `getJiraIssue` cada tarea creada: tipo, título, componente, vínculo y sprint.
8. **Resumen** con el formato del Entregable. Pasar el archivo a Publicado.

## Punto de confirmación

Mostrar:

| Tarea origen | Título de la tarea AUTO | Sprint | Asignado |
| :--- | :--- | :--- | :--- |

Además: tareas origen que ya tienen tarea `AUTO` (no se crean), tipo (Tarea), componente y si van con descripción.

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

```text
Equipo: <equipo>
Tareas creadas:
- <AUTO-XXXX con link> — <título> — vinculada a <CLAVE origen> — <sprint o backlog>
Ya existían: <AUTO-… vinculadas a CLAVE…, o ninguna>
Pendiente o no realizado: <lista y motivo>
```

Links con el formato `https://acme.atlassian.net/browse/<CLAVE>` (en un proyecto real, el dominio de Jira del equipo).

Siguiente paso sugerido: crear la rama `feature/<AUTO-XXXX>-<resumen>` y trabajarla con `qa-automation` (`AUTOMATIZAR AUTO-XXXX playwright`). Si la tarea es de performance, con `qa-performance` (`ANALIZAR AUTO-XXXX`).

## Reglas

- Nada se crea sin confirmación de la lista exacta.
- Tipo Tarea siempre; vínculo `Test` siempre (singular).
- El título origen se copia literal.
- No se duplica una tarea `AUTO` que ya existe para la misma tarea origen.
- No se afirma que una tarea quedó en un sprint sin verificarlo.

## Anti-racionalización

> **Nota:** esta sección lista las excusas típicas para saltearse una regla y por qué no valen. Sirve para que el agente (y el QA) no relajen los controles "porque es obvio".

**Ley de Hierro:** tipo Tarea, vínculo `Test` y título origen literal. Los tres valores ya fallaron antes por asumir el "obvio".

| Excusa | Realidad |
| :--- | :--- |
| "Es una historia, la creo como Historia" | El tablero `AUTO` usa siempre Tarea |
| "El vínculo se llama 'Tests', como en la pantalla" | El nombre del tipo es `Test`; "Tests" falla |
| "Resumo el título para que quede más claro" | Se copia literal: es la referencia a la tarea origen |
| "Ya la puse en el sprint" | Solo si se verificó con `getJiraIssue` |

Banderas rojas: elegir Historia como tipo, usar `Tests` en el vínculo, título origen editado, "quedó en el sprint" sin verificar.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El vínculo devuelve 404 | Se usó `Tests` en lugar de `Test` | Usar `Test` |
| El vínculo quedó al revés | `inwardIssue` y `outwardIssue` invertidos | No se borra por API: avisar al QA |
| El sprint no se aplica | Id de otro tablero o sprint cerrado | Buscar el id en el tablero de automatización y usar un sprint activo o futuro |
| El perfil del equipo no tiene el patrón | Perfil sin actualizar | Proponer el patrón, confirmarlo y proponer agregarlo al perfil |

## Criterios de calidad

- Todas las tareas tienen tipo Tarea, componente `Automatizacion` y vínculo `Test` con su origen.
- El título sigue el patrón del perfil y copia literal el título origen.
- Lo creado coincide exactamente con lo confirmado.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Tres HU del checkout para el Equipo Beta | Tres tareas `[TAE] Beta - Web \| <título>` vinculadas con `Test` |
| 2 | Una HU que ya tiene tarea `AUTO` vinculada | No la crea y lo informa |
| 3 | Equipo sin patrón en su perfil | Propone el patrón, lo confirma y propone actualizar el perfil |
| 4 | El QA pide un sprint | La crea en ese sprint y lo verifica |
| 5 | El QA no confirma | No crea nada |
| 6 | Pedido de performance de un equipo | Tarea `[Performance] …` bajo la épica de performance, etiquetas `PERFORMANCE` y la del equipo, vínculo `Test` con el pedido |
| 7 | Pedido de performance con la planilla incompleta | Lo informa y no crea la tarea hasta que el TL la complete |
