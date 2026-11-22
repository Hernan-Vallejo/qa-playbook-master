---
inclusion: auto
name: qa-jira-xray
description: Reglas para leer y escribir en Jira, Xray y el repositorio de evidencias del equipo. Usar al consultar HU, crear o vincular Tests, Test Sets, Test Executions, Test Plans o bugs, comentar en Jira, transicionar issues o crear carpetas de evidencias.
---
# Jira, Xray y repositorio de evidencias

> **Para qué sirve:** reúne las reglas para leer y escribir en Jira (tickets), Xray (gestión de pruebas dentro de Jira) y el repositorio de evidencias del equipo: nombres de los artefactos, campos, etiquetas, vínculos, bugs, comentarios y métricas.
> **Quién lo usa:** Kiro (`inclusion: auto`: se carga solo cuando la tarea trata de Jira, Xray o evidencias) y los QA que quieren saber cómo se nombra y se vincula cada cosa.
> **Cuándo se usa:** al consultar una HU (historia de usuario), crear o vincular Tests, Test Sets, Test Executions o Test Plans, reportar bugs, comentar o transicionar issues y organizar las carpetas de evidencias.

> **Nota:** en este playbook los datos de ejemplo corresponden a la **Tienda Demo** (tienda online con login, catálogo, carrito y checkout) de la empresa ficticia Acme. En un proyecto real se reemplazan por los de tu sitio de Jira. Los identificadores internos de campos de Jira (los números de cada campo personalizado) no se anotan acá: se consultan en tu instancia de Jira, y las herramientas se refieren a los campos por su nombre.

## Datos del sitio

| Dato | Valor de ejemplo |
| :--- | :--- |
| Jira | `https://acme.atlassian.net` (en tu proyecto: la URL de tu sitio de Jira) |
| Proyecto de las historias | `PROJ` (historias `PROJ-123`, casos `PROJ-123-CP01`) |
| Proyecto de tareas de automatización | `AUTO` (por ejemplo `AUTO-45`) |
| Repositorio de evidencias | Carpeta compartida del equipo (SharePoint, Drive u otro). Ejemplo de ruta base: `Documentos/QA/Evidencias de Testing` |
| Links a issues | `https://acme.atlassian.net/browse/<CLAVE>` |

## Equipos

Equipos, proyectos de Jira, boards e integrantes: `05-equipos/indice-equipos.md`. Cada equipo tiene su perfil en `05-equipos/` con proyecto, board, rutas, versiones, reparto y las carpetas de `04-funcionalidades/` que usa.

Visiones de `04-funcionalidades/` disponibles: `vision-cliente` (lo que ve el comprador de la Tienda Demo) y `vision-administracion` (lo que ve el personal que administra la tienda).

## Lectura

- Leer el issue completo: summary, descripción, criterios de aceptación, componentes, épica, links y comentarios relevantes.
- En JQL (el lenguaje de búsqueda de Jira), los issuetypes van en inglés: `Story`, `Test`, `Bug`, `Task`. `Historia` o `Tarea` fallan si el sitio está configurado en inglés.
- HU a probar: las que tienen el campo "Requiere pruebas de testing" en `Sí`. Es un campo propio de cada instancia de Jira: si tu sitio no lo tiene, el equipo define otro criterio y lo anota en su perfil.
- Antes de diseñar casos, consultar en Xray los tests existentes de la funcionalidad para no duplicar.

## Artefactos y nombres

> **Nota:** *Test* es un caso de prueba en Xray; *Test Set* agrupa Tests; *Test Execution* es una corrida de Tests con sus resultados; *Test Plan* organiza todo lo que se prueba en un sprint o una regresión.

| Artefacto | Nombre | Estado final |
| :--- | :--- | :--- |
| Test (tipo Cucumber) | `<Área>.<Capa>.<título>`. Área = visión (ej. `Cliente`); Capa = `FRONT`, `BFF`, `BACK` o `BACKOFFICE` | Finalizada |
| Test Set | `<CLAVE-HU> <título de la HU>` | Finalizada |
| Test Execution | `<CLAVE-HU> <título de la HU>` | Por hacer al crearla, En curso al empezar a ejecutar y **Finalizada** al terminar la ejecución |
| Re-ejecución | Mismo nombre de la Test Execution + ` #2`, ` #3` | Igual que la Test Execution |
| Test Plan del sprint | Patrón del perfil, uno por equipo y sprint, desde `02-qa-funcional/plantillas/test-plan-sprint.html`. Lo crea `qa-sprint`. Ejemplo: `Test Plan Sprint 12 - Equipo Alfa` | En curso |
| Test Plan de regresión | `Test Plan Regresión Release <release>` (o el patrón del perfil), desde `02-qa-funcional/plantillas/test-plan-regresion.html`. Lo crea `qa-regresion`. Ejemplo: `Test Plan Regresión Release 2.4` | En curso |

> **Ejemplo:** `Cliente.FRONT.Login con usuario bloqueado muestra mensaje de error` (Test); `PROJ-123 Login de usuarios` (Test Set y Test Execution). `BFF` significa *Backend For Frontend*: el servicio intermedio que prepara los datos para la pantalla. `BACKOFFICE` es la capa de administración.

> **Nota:** el **ID del caso** (`PROJ-123-CP01`, `PROJ-123-CP02`, ...) lo asigna `qa-diseno-casos` y es la referencia del caso mientras está en borrador y en el código automatizado. En Xray el test se identifica por su clave (por ejemplo `PROJ-310`) y su summary `<Área>.<Capa>.<título>`; el ID del caso se escribe en la primera línea de la descripción del test (`ID del caso: PROJ-123-CP01`) para poder relacionar ambos.

Cada HU tiene un Test Set y una Test Execution con todos sus tests, asociados al Test Plan del sprint. Estructura y reglas para editar un Test Plan: `02-qa-funcional/estructura-test-plan.md`.

## Campos

Los campos se identifican por su nombre. El Id interno de cada campo cambia entre instancias de Jira: se consulta en la tuya (por ejemplo, con la herramienta del MCP que lista los campos) antes de escribirlos.

| Campo | Dónde | Valor |
| :--- | :--- | :--- |
| Ambiente | Test, Test Set, Test Execution | `QA`. La Test Execution además lleva el entorno de testing de Xray (`testEnvironments`) con valor `QA` |
| Regresión | Test (siempre) | `Sí` o `No`. Indica si el test forma parte del paquete de regresión. Con tilde |
| Automatizado | Test | `SI` o `NO`. Indica si el test tiene un script automatizado |
| Estado Automatización | Test | `Automatizado`. Para otros valores, consultar los permitidos antes de setear |
| QA Análisis | HU | `NO_REVISADO`, `REVISADO_OK`, `REVISADO_NOOK`. Indica si QA ya revisó la HU y con qué resultado |
| Sprint | HU, Bug | Del board del equipo |
| Severidad | Bug | Se carga en el campo Priority de Jira (ver "Bugs") |

> **Nota:** si tu proyecto no tiene alguno de estos campos personalizados, se crea con el administrador de Jira o se omite la regla, y se deja asentado en el perfil del equipo. No se inventan campos ni valores.

## Etiquetas

- Las etiquetas oficiales y su formato están en `02-qa-funcional/catalogo-etiquetas.md` (la fuente única: minúsculas, palabras unidas con guion bajo). Usar solo etiquetas de ese catálogo.
- Orden: Equipo, Capa, Tipo de caso (`positivo`, `negativo` o `borde`), Funcionalidad, Historia / Servicio, y opcionales (Módulo, Versión, Extra). La visión (`vision-cliente`, `vision-administracion`) no es una etiqueta: va en el nombre del test como Área.
- Test integral: las etiquetas de cada capa que recorre más `integracion`. Preguntar antes de suponer que es integral.
- No usar etiquetas para datos que tienen campo o issuetype: `regresion`, `testing_manual`, `test_set`, `test_execution`, `test_plan`.
- Si hace falta una etiqueta nueva, proponer primero el cambio en el catálogo.

> **Nota:** la **Capa** del nombre del test (`FRONT`, `BFF`, `BACK`, `BACKOFFICE`) y la **etiqueta de capa** del catálogo (`front`, `api`, `mobile`, `performance`) son dos datos distintos. Un test de BFF o de BACK lleva la etiqueta `api`.

## Vínculos

| Relación | Cómo |
| :--- | :--- |
| HU, Test Plan o Bug "is tested by" Test Set o Test Execution | Tipo de vínculo `Test`. `inwardIssue` = Test Set o Test Execution; `outwardIssue` = HU, Test Plan o Bug. Nunca al revés |
| Tests en el Test Plan | Con la herramienta de Xray que agrega tests a un Test Plan |
| Bug → test que falló | `Blocks` si la severidad es Highest o High; `Relates` si es Medium o menor |
| Bug → HU afectada | `Relates` |
| Bug → Test Plan del sprint | `Relates`, para que el bug quede en la trazabilidad del plan |
| Bug → épica | El bug cuelga de la misma épica que la HU afectada |

Jira no tiene operación para borrar vínculos. Si un vínculo queda mal, avisar al QA para que lo borre a mano.

## Bugs

- Issuetype `Bug`, en el proyecto de bugs del equipo. Si tu sitio de Jira está en español, el tipo puede llamarse `Error`: se usa el nombre que tenga la instancia.
- La severidad se carga en el campo Priority de Jira: Bloqueante → Highest, Alta → High, Media → Medium, Baja → Low, Muy baja → Lowest. Es distinta de la criticidad que define el PO (Product Owner, quien decide qué se prioriza para el negocio).
- Si el proyecto tiene además un campo **Ambiente**, se completa con `QA` (o el ambiente donde se encontró el defecto). Si tiene un campo **Severidad** propio, se completa con la misma severidad que en Priority.
- Contenido: título, descripción, resultado esperado, resultado actual, pasos para reproducir, evidencia, ambiente, datos usados, impacto.
- Preguntar si va al sprint actual o al backlog.

> **Ejemplo:** `Login: el usuario bloqueado no ve mensaje de error` con severidad Alta (High), ambiente QA, datos usados `locked_out_user` del sitio demo, y evidencia en la carpeta de la HU.

## Escritura

- Buscar transiciones por nombre con `listJiraIssueTransitions`. Los ids de transición cambian entre proyectos.
- Workflow de ejemplo de la Test Execution: Por hacer ↔ En curso; desde En curso a Finalizada, Cancelada o No aplica. No hay transición directa de Por hacer a Finalizada: pasar por En curso. Finalizada significa ejecución terminada, no que los tests pasaron. Una Test Execution Finalizada no se reabre: el re-test va en una nueva (`#N`). Si el workflow de tu proyecto tiene otros estados, vale el de tu proyecto.
- Escrituras en el repositorio de Xray de a una. Si Xray responde "repository is being updated", buscar el test por summary antes de reintentar y moverlo a su carpeta con la herramienta de Xray que mueve tests si quedó en la raíz.
- Antes de crear un test, buscar si ya existe uno con el mismo summary en la misma carpeta.
- Antes de crear un enlace web en una HU, listar los existentes: la misma URL dos veces crea dos enlaces.
- Antes de comentar, revisar con `listJiraIssueComments` que no exista ya el mismo comentario.

## Comentarios en Jira

Formato de los comentarios que publica Kiro (wiki markup de Jira; los asteriscos ponen el texto en negrita). Los textos entre `<...>` se reemplazan:

```text
*<Título: Análisis QA / Cierre QA / Informe>*
*Resumen*
<Breve resumen>
*Observaciones*
- <Punto con su impacto>
*Siguientes pasos*
<Acción sugerida para PO, Desarrollo o QA>
Elaborado por <USUARIO JIRA> y Kiro
```

Nunca postear JSON crudo ni texto sin formato.

## Evidencias en el repositorio documental

> **Nota:** las evidencias (capturas, videos, reportes de ejecución) se guardan en un repositorio documental del equipo: SharePoint, Drive u otro. En la plantilla de automatización, las capturas se generan primero en `evidencias/<ID-HISTORIA>/` y de ahí se copian al repositorio del equipo.

- Carpeta por HU: `<CLAVE-HU> <summary>`. Reemplazar los caracteres prohibidos `" * : < > ? / \ |` por `-`.
- Se saltean las HU de arrastre que ya tienen carpeta en un sprint anterior.
- El link de evidencias va en 4 lugares: enlace web en la HU, comentario del test-run de cada test (con la herramienta de Xray que actualiza el comentario del test-run, con formato `[texto|url]`), comentario en el Test Set y comentario en la Test Execution.
- Links solo de lectura para la organización. Nunca links de edición ni anónimos.
- Nunca borrar, mover ni pisar carpetas sin confirmación.

## Métricas

Calcularlas con la API GraphQL de Xray sobre el Test Plan, usando el status consolidado por test, sin parámetro `environment`. Los conteos hechos con JQL del tipo `testPlanTests` pueden dar números distintos a los del Test Plan: si se usan, contrastarlos con el Test Plan antes de informar.
