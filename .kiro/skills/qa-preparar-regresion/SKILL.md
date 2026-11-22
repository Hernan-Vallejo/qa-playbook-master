---
name: qa-preparar-regresion
description: Prepara la regresión de una salida productiva o release - define el alcance desde épicas, iniciativa o HU, selecciona en Xray los tests con Regresión = Sí, los separa en automatizados y manuales por el campo Automatizado, y crea el Test Plan de regresión, Test Sets, Test Executions, vínculos y carpeta de evidencias con confirmación. Usar cuando el QA pide "preparar regresión", "PREPARAR_REGRESION", "armar el Test Plan de regresión", "preparar el release".
---

# Preparar regresión

> **Para qué sirve:** arma la regresión de un release, es decir, el conjunto de pruebas que confirma que lo que ya funcionaba sigue funcionando después de los cambios nuevos.
> **Quién lo usa:** el QA responsable del release (por ejemplo, del Equipo Beta), a través del agente `qa-regresion`.
> **Cuándo se usa:** en el sprint anterior a una salida productiva, o cuando se decide regresionar un release.

> **Nota:** HU = historia de usuario. Una épica agrupa varias HU. Xray es la herramienta de gestión de pruebas integrada con Jira. Un Test Set es una agrupación de tests; una Test Execution es una corrida de esos tests con sus resultados. Un "punto de control" es una pausa donde Kiro muestra lo que va a hacer y espera tu confirmación antes de escribir.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.2 |
| Puntos de control | Alcance del release, Selección de tests, Test Plan de regresión |
| Archivos en `.qa-work/regresion-<equipo>-<release>/` | `indice.md`, `01-alcance.md`, `02-seleccion.md`, `03-test-plan.md` |

> **Ejemplo:** para el release 2.4 del Equipo Beta, la carpeta es `.qa-work/regresion-beta-2.4/` y el plan se llama "Test Plan Regresión Release 2.4".

## Propósito

Armar una regresión mínima efectiva para el release: cubrir lo que el cambio puede romper, apoyada en la suite automatizada, con los casos manuales identificados y todo trazado.

## Cuándo usarla

- El sprint anterior a una salida productiva o cuando se decide regresionar un release.

## Cuándo no usarla

- En un sprint normal → la regresión recomendada de cada HU sale de `qa-analisis-hu`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Release (nombre o versión, por ejemplo `2.4`) | Sí | Pedirlo |
| Épicas, iniciativa o HU del release | Sí | Pedirlas u ofrecer buscarlas (versión de Jira, épica) |
| Sprints que abarca | No | El sprint activo; confirmar si son uno o dos |
| Destino | No | Preguntar PRE (preproducción) o PROD (producción) |
| Fechas | No | Las del sprint |

> **Nota:** las pruebas de regresión se ejecutan en QA (o en PRE si el equipo lo indica expresamente), nunca en PROD. "Destino" es el ambiente al que saldrá el release una vez aprobado; no es donde se prueba.

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`): proyecto, etiquetas de funcionalidad, ubicación de Xray y de las evidencias, integrantes.
2. `02-qa-funcional/estructura-test-plan.md` y `02-qa-funcional/plantillas/test-plan-regresion.html`.
3. Documentación funcional de las carpetas del perfil (`04-funcionalidades/`).
4. Catálogo de etiquetas (`02-qa-funcional/catalogo-etiquetas.md`), para los filtros.
5. Proceso general de regresión: `01-estandares-globales/proceso-test-plan-regresion.md`.

## Herramientas MCP

Se usan las herramientas del servidor `@atlassian` (Jira y Xray). Los nombres exactos pueden variar según el servidor instalado. Las carpetas de evidencias se crean en el repositorio documental del equipo (por ejemplo SharePoint o Drive) o en `evidencias/` del repositorio; esta skill no depende de un servidor MCP para eso.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `atlassianUserInfo`, `getJiraIssue`, `searchJiraIssuesUsingJql`, `getJiraProjectVersions` y `getJiraBoardSprintData` (con `executeRead`), `xray_get_tests`, `xray_run_graphql_query` |
| Escritura (solo después de la confirmación) | `createJiraIssue`, `editJiraIssue`, `transitionJiraIssue`, `createJiraIssueLink` (con `executeWrite`), `xray_create_test_set`, `xray_create_test_execution`, `xray_add_tests_to_test_plan`, `xray_add_test_executions_to_test_plan` |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/regresion-<equipo>-<release>/` e `indice.md`; crearlos si faltan.
1. **¿Ya existe?** Buscar `project = <PROYECTO> AND issuetype = "Test Plan" AND labels = <etiqueta del equipo> AND summary ~ "Regresión" AND summary ~ "<release>"` (por ejemplo `project = PROJ AND issuetype = "Test Plan" AND labels = beta AND summary ~ "Regresión" AND summary ~ "2.4"`). La etiqueta del equipo (`alfa`, `beta`, `gamma` o `delta`) evita confundir el plan con el de otro equipo del mismo proyecto. Si existe, mostrarlo y no crear otro. Buscar también el Test Plan del sprint (patrón del perfil, por ejemplo "Test Plan Sprint 12 - Equipo Beta"): es el plan al que se vincula la regresión. Si no existe, avisar y sugerir `qa-sprint` en modo `INICIO_SPRINT`; esta skill no crea Test Plans de sprint.
2. **Alcance.** Leer épicas, iniciativa e HU del release. Identificar funcionalidades impactadas, flujos y endpoints compartidos, bugs del release y bugs abiertos de severidad baja que podrían diferirse (dejarse para un sprint futuro). Leer la regresión recomendada en los análisis de las HU (`.qa-work/<CLAVE-HU>/02-analisis.md` o comentarios QA). Leer también en cada análisis la línea `Performance: aplica / no aplica`. Para las que aplican, seguir la cadena de trazabilidad de performance: pedido de la prueba, tarea de performance en el proyecto `AUTO`, informe (ver `qa-performance-informe`), severidad y decisión del líder técnico. Una HU con disparador de performance y sin la línea `Performance` se avisa al QA.

   > **Nota:** un "disparador" es una característica de la HU que obliga a considerar pruebas de performance (por ejemplo, un cambio que afecta el listado de productos con muchos registros). Los criterios están en `03-qa-automatizacion/plan-pruebas-performance.md`.
3. **[PUNTO DE CONTROL] Alcance del release · esperando tu confirmación.** Mostrar épicas, HU, funcionalidades, flujos incluidos y excluidos con su motivo, y la propuesta de etiquetas de funcionalidad para filtrar (por ejemplo `catalogo`, `carrito`, `checkout`, `login`). Mostrar también la tabla de **performance** (HU, disparador, pedido, tarea, informe, severidad, decisión del líder técnico y estado: Completa / En curso / Pendiente). Una prueba obligatoria pendiente se propone como riesgo del Test Plan. Guardar en `01-alcance.md` y esperar la aprobación.
4. **Selección de tests.** Por cada funcionalidad aprobada:
   - Automatizados: `project = PROJ AND issuetype = Test AND labels in (<funcionalidades>) AND "Regresión" = "Sí" AND "Automatizado" = "SI"`.
   - Manuales: `project = PROJ AND issuetype = Test AND labels in (<funcionalidades>) AND "Regresión" = "Sí" AND "Automatizado" = "NO"`.
   - Excluir los tests en estado no aplicable o deprecados.
   - Tests con Regresión = Sí sin valor en Automatizado: `project = PROJ AND issuetype = Test AND labels in (<funcionalidades>) AND "Regresión" = "Sí" AND "Automatizado" is EMPTY`. Listarlos aparte; el QA decide y se propone completar el campo.

   > **Nota:** `<funcionalidades>` son las etiquetas de funcionalidad del catálogo (`02-qa-funcional/catalogo-etiquetas.md`, sección 4.4), por ejemplo `labels in (login, carrito, checkout)`. Si querés limitar por equipo, agregá `AND labels = <etiqueta del equipo>`. `Regresión` y `Automatizado` son campos personalizados de los tests en Jira, con estos valores: `Regresión` = `Sí` / `No` (con tilde) y `Automatizado` = `SI` / `NO` (en mayúsculas, sin tilde). Si en tu proyecto los campos tienen otro nombre o se identifican por su id interno (por ejemplo `customfield_10040`, que cambia entre instancias), reemplazalos en el JQL y anotá el cambio en el perfil del equipo.
5. **[PUNTO DE CONTROL] Selección de tests · esperando tu confirmación.** Mostrar las dos listas con cantidad, los JQL, los tests sin campo Automatizado y los gaps (funcionalidades del alcance sin tests de regresión). Guardar en `02-seleccion.md`. El QA puede sacar o agregar tests; esperar la aprobación.
6. **Armar el Test Plan** desde `02-qa-funcional/plantillas/test-plan-regresion.html` con el alcance, los JQL, los riesgos y los integrantes. Placeholders y fuente de cada uno (lista completa en `estructura-test-plan.md`, sección 5):
   | Placeholder | Fuente |
   | :--- | :--- |
   | `<EQUIPO>`, `<PROYECTO>`, `<RESPONSABLE>` | Perfil del equipo |
   | `<RELEASE>`, `<DESTINO>`, `<FECHA_INICIO>`, `<FECHA_FIN>` | Entradas |
   | `<TEST_PLAN_SPRINT>` | Nombre y clave del Test Plan del sprint (paso 1) |
   | `<ALCANCE>`, filas de las secciones 2.1 y 2.3, `<JQL_ALCANCE>` | Alcance aprobado (paso 3). Ejemplo de `<JQL_ALCANCE>`: `project = PROJ AND fixVersion = "2.4" AND issuetype = Story ORDER BY key ASC` |
   | `<JQL_AUTO>`, `<JQL_MANUAL>`, `<CANT_AUTO>`, `<CANT_MANUAL>` | Selección aprobada (paso 5) |
   | `<AMBIENTE>` | Ambiente donde se ejecuta: por defecto QA con su URL y la versión desplegada; PRE solo si el QA lo indicó |
   | `<JQL_BUGS_RELEASE>` | Bugs del release. Ejemplo: `project = PROJ AND issuetype = Bug AND fixVersion = "2.4" ORDER BY priority DESC` (o por `affectedVersion` si el equipo lo usa así) |
   | Filas de riesgos y de la sección 7 | Riesgos del paso 3 (incluida la performance pendiente) e integrantes del perfil |
   | `<TEST_SET_AUTO>`, `<TEST_EXEC_AUTO>`, `<TEST_SET_MANUAL>`, `<TEST_EXEC_MANUAL>`, `<TEST_PLAN_KEY>` y el link de Evidencias | Todavía no existen: se completan en el paso 8, después de crear esos artefactos |
   | `<RES_...>`, `<VEREDICTO>` | Se reemplazan por la palabra `pendiente`; los completa `qa-informe-regresion` |
7. **[PUNTO DE CONTROL] Test Plan de regresión · esperando tu confirmación.** Mostrar lo que se va a crear y guardarlo en `03-test-plan.md`:
   - Test Plan: `Test Plan Regresión Release <versión>` (por ejemplo "Test Plan Regresión Release 2.4"), etiqueta de Equipo (no se usa `test_plan`), asignado al responsable.
   - Test Set y Test Execution automatizados: `Release <versión> - Regresión automatizada`.
   - Test Set y Test Execution manuales: `Release <versión> - Regresión manual`.
   - Vínculos: con el Test Plan del sprint (`Relates`), con la iniciativa (`implements`) y las épicas (`is implemented by`) si se indicaron, con la HU de regresión (`Relates`) si el equipo la creó, y "is tested by" con los Test Sets y Test Executions (tipo de vínculo `Test`, según el steering `qa-jira-xray`).
   - Carpeta de evidencias dentro de la carpeta del sprint: `Regresión - Release <versión>`.

   > **Nota:** los nombres de los tipos de vínculo (`Relates`, `implements`, `is implemented by`, `is tested by`) dependen de la configuración de Jira; si alguno no existe, ver "Errores conocidos".

   Esperar la confirmación.
8. **Crear, de a una** (cada artefacto necesita la clave del anterior):
   1. Carpeta de evidencias y su link de solo lectura.
   2. Test Plan con `createJiraIssue` (descripción temporal), con su etiqueta de Equipo y asignado al responsable.
   3. Test Sets (automatizado y manual) con sus tests, transicionados a Finalizada.
   4. Test Executions (automatizada y manual), en Por hacer, con el campo Ambiente = `QA` (o el ambiente indicado por el QA).
   5. Tests y ejecuciones agregados al plan, y los vínculos.
   6. Reemplazar `<TEST_PLAN_KEY>`, las claves de Test Sets y Test Executions y el link de Evidencias, y escribir la descripción final con `editJiraIssue` (`contentFormat: html`).
   7. Transicionar el plan a En curso (buscar la transición por nombre).
9. **Verificar** que la descripción quedó sin placeholders (salvo los de cierre en `pendiente`) y que las cantidades de tests de cada Test Set coinciden con las del paso 5. Resumir, pasar los archivos a Publicado y actualizar `indice.md`.

## Entregable

```text
Release <release> → <destino>
Test Plan de regresión: <clave> (vinculado a <plan del sprint>)
Automatizados: <n> tests — Test Set <clave> / Test Execution <clave>
Manuales: <n> tests — Test Set <clave> / Test Execution <clave>
Sin campo Automatizado: <n> (resueltos / pendientes)
Gaps: <funcionalidades sin tests de regresión>
Performance: <n> HU con prueba (<n> completas, <n> pendientes)
Evidencias: <link>
Pendiente: ejecutar la suite automatizada y la regresión manual; al terminar, qa-informe-regresion
```

> **Ejemplo:** `Release 2.4 → PRE`, `Test Plan de regresión: PROJ-230 (vinculado a Test Plan Sprint 12 - Equipo Beta)`, `Automatizados: 42 tests`, `Manuales: 9 tests`. "Suite automatizada" es el conjunto de tests que corre solo (por ejemplo, con `npx playwright test`).

## Reglas

- El campo **Automatizado** decide el conjunto: `Sí` → suite automatizada, `No` → manual. No se usan etiquetas para esto.
- Solo entran tests con **Regresión = Sí**.
- Mínima regresión efectiva: cada funcionalidad incluida tiene un motivo.
- No modificar tests existentes salvo completar campos vacíos con confirmación.
- La performance no entra al Test Plan como tests: se informa en el alcance y en los riesgos, y la resuelve `qa-informe-regresion`.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El JQL sobre el campo `Regresión` o `Automatizado` no devuelve nada | `Regresión` escrito sin tilde (`Si` en lugar de `Sí`), `Automatizado` escrito `Sí`/`No` en lugar de `SI`/`NO`, o nombre de campo distinto | Usar `"Regresión" = "Sí"` y `"Automatizado" = "SI"` o `"NO"`, y verificar el nombre del campo en Jira |
| "repository is being updated" | Escrituras en paralelo sobre Xray | Escribir de a una |
| El tipo de vínculo con la iniciativa no existe | Proyecto con otra configuración de vínculos | Avisar al QA para que lo cree a mano |

## Criterios de calidad
- Cada funcionalidad incluida o excluida del alcance tiene un motivo.
- Los dos conjuntos (automatizado y manual) suman todos los tests con Regresión = Sí de las funcionalidades del alcance, más la lista aparte de los que no tienen Automatizado.
- Los Test Sets, Test Executions y el plan quedaron vinculados entre sí y con el plan del sprint.
- Las pruebas de performance obligatorias pendientes figuran como riesgo del plan.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Release con épicas y tests de regresión | Dos conjuntos separados por Automatizado y plan creado |
| 2 | Tests con Regresión = Sí sin Automatizado | Los lista aparte y pregunta |
| 3 | Funcionalidad del alcance sin tests de regresión | La informa como gap |
| 4 | Ya existe el plan del release | No crea otro |
| 5 | Una HU del release tiene `Performance: aplica` y no tiene informe | La lista como pendiente y propone el riesgo en el plan |
| 6 | No existe el Test Plan del sprint al que vincular | Avisa, sugiere `qa-sprint` y no crea el plan de regresión sin confirmación del QA |
