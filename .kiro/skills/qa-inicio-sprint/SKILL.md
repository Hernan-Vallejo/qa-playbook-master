---
name: qa-inicio-sprint
description: Arranca el sprint de QA de un equipo - lee el sprint activo del board, analiza HU, pendientes del sprint anterior, bugs y tareas QA, define responsable y reparto, y crea el Test Plan del sprint desde la plantilla homologada y las carpetas de evidencias. Usar cuando el QA dice "arrancó el sprint", "INICIO_SPRINT", "preparar sprint", "crear el Test Plan del sprint" o terminó la Planning.
---

# Inicio de sprint

> **Para qué sirve:** deja creado, al comienzo del sprint, el Test Plan (documento de Jira/Xray que reúne el alcance, las pruebas y los riesgos de QA del sprint) del equipo, con sus carpetas de evidencias.
> **Quién lo usa:** el QA del equipo (por ejemplo, del Equipo Alfa) o el responsable del Test Plan, a través del agente `qa-sprint` o de `qa-maestro`.
> **Cuándo se usa:** al terminar la Planning (reunión donde el equipo decide qué entra al sprint) o el primer día del sprint.

> **Nota:** HU = historia de usuario. MCP = *Model Context Protocol*, el mecanismo por el que Kiro se conecta a herramientas externas como Jira (`@atlassian`) o GitHub (`@github`). Xray es la herramienta de gestión de pruebas que se integra con Jira. Un "punto de control" es una pausa donde Kiro muestra lo que va a hacer y espera tu confirmación antes de escribir.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Planificación del sprint, Test Plan |
| Archivos en `.qa-work/sprint-<equipo>-<N>/` | `indice.md`, `01-planificacion.md`, `02-test-plan.md` |

> **Ejemplo:** para el sprint 12 del Equipo Alfa, la carpeta de trabajo es `.qa-work/sprint-alfa-12/` y el Test Plan se llama "Test Plan Sprint 12 - Equipo Alfa". `.qa-work/` es el espacio donde los agentes guardan borradores y avances para que se puedan revisar y retomar.

## Propósito

Dejar creado, al inicio del sprint, el Test Plan del equipo con el alcance, las HU y su QA, los pendientes del sprint anterior, los bugs a verificar, las tareas QA y los riesgos iniciales. Todo lo que se haga después en las HU se asocia a este plan.

## Cuándo usarla

- Al terminar la Planning o el primer día del sprint.
- Si `qa-maestro` avisó que no existe el Test Plan del sprint.

## Cuándo no usarla

- Para actualizar un Test Plan ya creado → `qa-seguimiento-sprint`.
- Para una regresión de release → agente `qa-regresion`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Equipo (o board) | Sí | Deducirlo del perfil que indique el QA; si no, pedirlo |
| Sprint | No | El sprint activo del board del perfil |
| Responsable y reparto | Sí | Tomarlo del perfil. Si dice "Por completar", preguntarlo (ver paso 3) |

> **Nota:** el "board" es el tablero de Jira del equipo. El "reparto" es qué QA se ocupa de qué HU.

## Contexto que lee

1. Perfil del equipo: `05-equipos/<equipo>.md` (por ejemplo `05-equipos/alfa.md`): proyecto, board, patrón del nombre del Test Plan, integrantes, reparto, ubicación de las carpetas de evidencias y estrategia propia.
2. Estructura y plantilla: `02-qa-funcional/estructura-test-plan.md` y `02-qa-funcional/plantillas/test-plan-sprint.html`.
3. Catálogo de etiquetas (`02-qa-funcional/catalogo-etiquetas.md`, sección 4.1): etiqueta de Equipo (`alfa`, `beta`, `gamma` o `delta`), que se pone al Test Plan y se usa en los JQL de las HU.
4. Usuario de la sesión: `atlassianUserInfo` (devuelve quién está conectado en Jira, para asignarle el plan).

## Herramientas MCP

Se usan las herramientas del servidor `@atlassian` (Jira y Xray). Los nombres exactos pueden variar según el servidor instalado; si alguno no existe, avisar al QA en lugar de improvisar.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `atlassianUserInfo`, `getJiraBoardSprintData` (con `executeRead`), `searchJiraIssuesUsingJql`, `getJiraIssue`, `xray_run_graphql_query` |
| Escritura (solo después de la confirmación) | `createJiraIssue`, `editJiraIssue`, `transitionJiraIssue`, `addOrEditJiraIssueComment` |

> **Nota:** JQL es el lenguaje de búsqueda de Jira. GraphQL es el lenguaje de consulta de la API de Xray. Las carpetas de evidencias se crean en el repositorio documental del equipo (por ejemplo SharePoint o Drive) o dentro de `evidencias/` en el repositorio; esta skill no depende de un servidor MCP para eso.

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/sprint-<equipo>-<N>/` e `indice.md`; crearlos si faltan.
1. **Sprint.** Leer el sprint activo del board: número, id, fechas y objetivo. Confirmar que la fecha de hoy está dentro del sprint.
2. **¿Ya existe el plan?** Buscar `project = <PROYECTO> AND issuetype = "Test Plan" AND summary ~ "<patrón del perfil con N>"` (por ejemplo `project = PROJ AND issuetype = "Test Plan" AND summary ~ "Test Plan Sprint 12 - Equipo Alfa"`; `<PROYECTO>` sale del perfil). Si existe, mostrarlo, no crear otro y ofrecer `qa-seguimiento-sprint`.
3. **Equipo de QA.** Leer integrantes, reparto y responsable del perfil. Si falta algo, preguntar:
   - ¿Trabajás solo o con otros QA? Si son varios, ¿quiénes?
   - ¿Quién es el responsable del Test Plan este sprint?
   - ¿Cómo se reparten las HU: lo deciden ustedes o lo propone Kiro?

   Proponer guardar las respuestas en el perfil (se escribe solo si el QA confirma).
4. **Relevamiento.**
   - HU del sprint con "Requiere pruebas de testing" = Sí y = No (campo de Jira que indica si la HU necesita QA; si en tu instancia tiene otro nombre, el perfil lo indica). Usar el JQL "HU a probar" de la sección 1 del perfil (por ejemplo `project = PROJ AND issuetype = Story AND labels = alfa AND "Requiere pruebas de testing" = "Sí" AND sprint = <SPRINT_ID>`) y repetirlo con `"No"` para las que no requieren QA.
   - Pendientes del sprint anterior: Test Plan anterior (mismo patrón, N-1), tests sin ejecutar o fallidos de ese plan (GraphQL de Xray), HU de ese sprint que siguen abiertas y están en este sprint, bugs del equipo abiertos que esperan verificación.
   - Tareas QA del sprint (subtareas QA de las HU y tareas asignadas a los QA).
   - HU con "Requiere pruebas de testing" = No que tienen subtareas QA abiertas: proponer cancelarlas con un comentario que justifique el motivo. Se cancelan solo con confirmación, en el punto de control Test Plan.
   - Para cada HU: capa (por prefijo o tipo, por ejemplo front o API), riesgo inicial (Alto / Medio / Bajo, con una línea de justificación) y QA propuesto según el reparto.
5. **[PUNTO DE CONTROL] Planificación del sprint · esperando tu confirmación.** Mostrar el relevamiento y guardarlo en `01-planificacion.md` (Borrador):
   - Resumen: cantidad de HU con y sin QA, pendientes, bugs a verificar, tareas.
   - Tabla HU | Título | QA | Capa | Riesgo.
   - Pendientes del sprint anterior y qué se hace con cada uno.
   - Riesgos iniciales del sprint (dependencias, despliegues, carry over, HU sin criterios claros).

   > **Nota:** "carry over" son las HU que no se terminaron en el sprint anterior y pasan al actual.

   Esperar la aprobación o los ajustes. Al aprobar, pasar a Aprobado.
6. **Armar el Test Plan.** Completar `02-qa-funcional/plantillas/test-plan-sprint.html` con los datos aprobados. La lista completa de placeholders está en `estructura-test-plan.md`, sección 5; de dónde sale cada uno:
   | Placeholder | Fuente |
   | :--- | :--- |
   | `<EQUIPO>`, `<PROYECTO>`, `<ETIQUETA_EQUIPO>` | Perfil del equipo (nombre, proyecto, etiqueta) |
   | `<SPRINT>`, `<SPRINT_ID>`, `<FECHA_INICIO>`, `<FECHA_FIN>`, `<FECHA_INICIO_ISO>`, `<FECHA_FIN_ISO>`, `<OBJETIVO_SPRINT>` | Sprint activo del board (paso 1) |
   | `<RESPONSABLE>`, `<REPARTO>` | Paso 3 |
   | `<ALCANCE>`, filas de las tablas 2.1, 2.2 y 5, fila de riesgos | Planificación aprobada (paso 5) |
   | `<ESTRATEGIA_EQUIPO>` | Fila "Estrategia propia (sección 3 del plan)" del perfil. Si dice "Por completar", preguntar al QA; si no tiene, escribir "Sin estrategia propia: aplica la estrategia base" |
   | `<VERSION_PLANTILLA>` | Versión indicada en la tabla de datos de `estructura-test-plan.md` |
   | `<TEST_PLAN_KEY>` y el link de Evidencias | Todavía no existen: se completan en el paso 8.3, después de crear el plan y las carpetas |
   | `<RES_...>` y `<RESUMEN_CIERRE>` | Se reemplazan por la palabra `pendiente`; los completa `qa-informe-sprint` |
7. **[PUNTO DE CONTROL] Test Plan · esperando tu confirmación.** Mostrar lo que se va a crear y guardarlo en `02-test-plan.md` (Borrador):
   - Nombre (por ejemplo "Test Plan Sprint 12 - Equipo Alfa"), etiquetas, asignado, estado.
   - Secciones con contenido: panel, 1, 2, 3, 5, 9 y 12 (esta última se completa en el paso 8.3). El resto queda como texto base de la plantilla o como lista dinámica.
   - Subtareas QA a cancelar (HU que no requieren pruebas), con el comentario propuesto.
   - Carpetas de evidencias a crear: una del sprint y una por HU que requiere QA (`<CLAVE-HU> <summary>`, por ejemplo `PROJ-123 Login con usuario bloqueado`; los caracteres prohibidos en nombres de carpeta se reemplazan por `-`; se saltean las HU de arrastre que ya tienen carpeta).

   Esperar la confirmación.
8. **Crear, en orden:**
   1. Carpeta del sprint y carpetas de las HU en el repositorio documental del equipo (o en `evidencias/<ID-HISTORIA>/`). Obtener el link de solo lectura de la carpeta del sprint.
   2. Test Plan con `createJiraIssue` (descripción temporal), asignado al responsable y con las etiquetas.
   3. Reemplazar `<TEST_PLAN_KEY>` (la clave del plan recién creado) y el link de la sección Evidencias (el `href` y el texto del enlace de la carpeta de evidencias, ver `02-qa-funcional/estructura-test-plan.md`, sección 5) y escribir la descripción con `editJiraIssue` (`contentFormat: html`, porque la plantilla es HTML).
   4. Transicionar el plan a En curso (buscar la transición por nombre; el nombre exacto depende del flujo de trabajo del proyecto).
   5. Cancelar las subtareas QA confirmadas, con su comentario.
9. **Verificar** que la descripción quedó completa, sin ningún placeholder `<...>` (los de cierre quedaron como `pendiente`), y que las listas dinámicas se ven.
10. **Resumen.** Pasar `02-test-plan.md` a Publicado con la clave y actualizar `indice.md`.

## Entregable

```text
Sprint <N> (<fechas>) — <equipo>
Test Plan: <clave con link> (En curso, responsable <QA>)
HU con QA: <n> | sin QA: <n> | pendientes del sprint anterior: <n> | bugs a verificar: <n>
Carpetas de evidencias: sprint <creada/existía>, HU <n creadas>, <n salteadas>
Riesgos iniciales: <n>
Siguiente paso: tomar una HU con qa-maestro ("QA <CLAVE-HU>")
```

> **Ejemplo:** `Sprint 12 (03/03 al 14/03) — Equipo Alfa`, `Test Plan: PROJ-210 (En curso, responsable Ana QA)`. Cada línea del bloque se explica sola: `<n>` es una cantidad y `<clave con link>` es la clave de Jira clickeable.

## Reglas

- Un solo Test Plan por equipo y sprint. Nunca clonar el plan anterior (se arma siempre desde la plantilla).
- No crear tests, Test Sets (agrupaciones de tests) ni Test Executions (corridas de tests) en esta skill.
- No usar la etiqueta `test_plan`: el tipo de issue ya lo indica (catálogo de etiquetas, sección 5). Al plan se le pone solo la etiqueta de Equipo.
- Si queda un placeholder sin valor (salvo los de cierre), no escribir y avisar.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| Las listas dinámicas aparecen como links | Se degradó el `block-card` (bloque de Jira que muestra una lista de issues) al escribir | Escribir el HTML tal cual sale de la plantilla, sin reformatearlo |
| El sprint activo no coincide con la fecha | El sprint todavía está "future" (futuro) | Avisar y preguntar si se usa ese sprint |
| No hay forma de crear carpetas desde Kiro | El servidor MCP del repositorio documental no tiene escritura | Avisar al QA y crear el plan sin carpetas si lo acepta; las carpetas se crean a mano después |

## Criterios de calidad

- Todas las HU que requieren QA tienen QA asignado en la tabla 2.1 del plan.
- Los pendientes del sprint anterior tienen una acción.
- Cada riesgo tiene nivel, impacto y mitigación.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Sprint nuevo sin plan | Crea el plan completo y las carpetas |
| 2 | El plan del sprint ya existe | No crea otro; ofrece seguimiento |
| 3 | Perfil sin reparto definido | Pregunta y propone guardarlo en el perfil |
| 4 | El QA no confirma | No escribe nada |
| 5 | HU con "Requiere pruebas de testing" = No y subtareas QA abiertas | Propone cancelarlas con un comentario y lo hace solo tras la confirmación del punto de control Test Plan |
| 6 | Pendientes del sprint anterior (tests sin ejecutar, bugs sin verificar) | Cada uno aparece en la sección 5 del plan con una acción |
