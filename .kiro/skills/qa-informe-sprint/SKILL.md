---
name: qa-informe-sprint
description: Genera el informe de cierre de QA del sprint - métricas desde la API de Xray, bugs por severidad, semáforo, riesgos, pendientes y resumen del trabajo de cada QA - y lo publica en el Test Plan del sprint con confirmación. Usar cuando el QA pide "informe de cierre", "cerrar el sprint", "CIERRE_SPRINT", "resumen QA del sprint".
---

# Informe de cierre del sprint

> **Para qué sirve:** cierra el sprint con una evaluación objetiva de la calidad: qué se probó, qué pasó, qué quedó pendiente y con qué riesgo.
> **Quién lo usa:** el QA del equipo (por ejemplo, del Equipo Gamma), a través del agente `qa-sprint`.
> **Cuándo se usa:** al terminar el sprint o en la Review (reunión final donde el equipo muestra lo construido).

> **Nota:** HU = historia de usuario. Xray es la herramienta de gestión de pruebas integrada con Jira. Un "punto de control" es una pausa donde Kiro muestra lo que va a hacer y espera tu confirmación antes de escribir.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Informe del sprint |
| Archivos en `.qa-work/sprint-<equipo>-<N>/` | `04-informe-cierre.md`, `indice.md` |

## Propósito

Cerrar el sprint con una evaluación objetiva de la calidad: qué se probó, qué pasó, qué quedó pendiente y con qué riesgo.

## Cuándo usarla

- Al terminar el sprint o en la Review.

## Cuándo no usarla

- Para un release → `qa-informe-regresion`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Equipo | Sí | Pedirlo |
| Test Plan del sprint | No | Buscarlo con el patrón del perfil (por ejemplo "Test Plan Sprint 12 - Equipo Gamma"). Si no existe, avisar y ofrecer `qa-inicio-sprint`: no hay nada que cerrar |

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`, por ejemplo `05-equipos/gamma.md`).
2. `02-qa-funcional/estructura-test-plan.md`.
3. `01-estandares-globales/definicion-dor-dod.md` (DoR = *Definition of Ready*, cuándo una HU está lista para empezar; DoD = *Definition of Done*, cuándo está terminada).

## Herramientas MCP

Se usan las herramientas del servidor `@atlassian` (Jira y Xray). Los nombres exactos pueden variar según el servidor instalado.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraBoardSprintData` (con `executeRead`), `searchJiraIssuesUsingJql`, `getJiraIssue`, `listJiraIssueComments`, `xray_run_graphql_query` |
| Escritura (solo después de la confirmación) | `addOrEditJiraIssueComment`, `editJiraIssue`, `transitionJiraIssue` |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/sprint-<equipo>-<N>/`.
1. **Métricas (GraphQL de Xray)** sobre el Test Plan:

   ```graphql
   { getTestPlans(jql: "key = <PLAN>", limit: 1) { results { tests(limit: 100) { total results { issueId status { name } } } testExecutions(limit: 50) { total results { jira(fields: ["key","summary"]) } } } } }
   ```

   > **Nota:** la consulta pide el Test Plan cuya clave es `<PLAN>` (por ejemplo `PROJ-210`) y devuelve: `tests`, la lista de tests del plan con el estado de cada uno (`status { name }`) y el `total`; y `testExecutions`, las corridas asociadas con su clave y título. `limit: 100` es el máximo de tests por página.

   - Status sin parámetro `environment` (consolidado, es decir, el estado final sin separar por ambiente). Paginar si hay más de 100 tests.
   - PASSED → Passed; FAILED → Failed; BLOCKED y cualquier estado personalizado de bloqueo que use el equipo (por ejemplo "Falta datos" o "Dependiente") → Blocked; TO DO → No ejecutados; EXECUTING → En ejecución.
   - Ejecutados = Total − No ejecutados − En ejecución. Pass rate = Passed / Ejecutados. Cobertura = Ejecutados / Total. Dos decimales.
   - Re-ejecuciones: Test Executions con sufijo `#2`, `#3`. Manual o automatizada según el nombre. No suman a las métricas.
   - Validar que la suma de estados sea igual al total.
   - Test Sets: contarlos con el JQL de la fila "Test Sets" de la sección 11 del plan (`issue in linkedIssues("<PLAN>") AND issuetype = "Test Set"`). La consulta GraphQL de arriba no los devuelve.
   - Los valores obtenidos son los que se vuelcan en la columna "Al cierre" de la sección 11, así: Total → `<RES_TOTAL>`, Passed → `<RES_PASSED>`, Failed → `<RES_FAILED>`, Blocked → `<RES_BLOCKED>`, No ejecutados → `<RES_TODO>`, `testExecutions.total` sin contar las re-ejecuciones → `<RES_EXECUTIONS>`, Test Sets → `<RES_SETS>`, re-ejecuciones (`#2`, `#3`) → `<RES_REEJECUCIONES>`, pass rate y cobertura → `<RES_PASS_RATE>` y `<RES_COBERTURA>`.

   > **Ejemplo:** 40 tests en total, 30 Passed, 5 Failed, 1 Blocked, 4 No ejecutados, 0 En ejecución. Ejecutados = 40 − 4 − 0 = 36. Pass rate = 30 / 36 = 83,33 %. Cobertura = 36 / 40 = 90,00 %. La suma de estados (30 + 5 + 1 + 4 + 0) da 40, igual al total.
2. **Bugs** del sprint por severidad, abiertos y resueltos. Bugs Highest o High abiertos, con su impacto.
3. **Tablero:** HU probadas y su estado (las de la tabla 2.1 del plan más las de "Historias no planificadas"), HU no finalizadas (carry over: las que pasan al sprint siguiente), reworks (bugs sobre HU finalizadas, o HU cuyo campo "QA Análisis" quedó en `REVISADO_NOOK`, es decir, análisis de QA no aprobado).
4. **Trabajo por QA:** HU, tests creados, ejecuciones y bugs reportados por cada QA del equipo.
5. **Riesgos:** estado final de la tabla de riesgos del plan.
6. **Semáforo:** se evalúa en este orden. NO GO si el pass rate es menor a 70 % o hay bugs Highest abiertos. GO si el pass rate es 95 % o más y no hay bugs Highest ni High abiertos. Cualquier otro caso es GO WITH RISKS (pass rate de 70 % a menos de 95 %, o bugs High abiertos). Justificar en una línea.
   > **Ejemplo:** pass rate 83,33 % y 1 bug High abierto: GO WITH RISKS. Pass rate 97 % con 1 bug Highest abierto: NO GO.

   > **Nota:** GO = se puede avanzar; GO WITH RISKS = se puede avanzar aceptando riesgos explícitos; NO GO = no se recomienda avanzar. Es un semáforo escrito en texto, sin colores ni iconos.
7. **Criterios de salida:** evaluar cada fila de la tabla 4.2 del plan (criterios de aceptación validados, defectos críticos o altos abiertos, cobertura, regresión recomendada ejecutada, evidencia documentada, defectos de severidad baja) y marcarla Cumplido, No cumplido o Cumplido con observaciones, con el dato que lo respalda. Los criterios de la plantilla son el contrato del sprint; el semáforo del paso 6 es una lectura resumida, no los reemplaza. Para saber si las HU cumplieron el DoD, consultar `01-estandares-globales/definicion-dor-dod.md`.
8. **[PUNTO DE CONTROL] Informe del sprint · esperando tu confirmación.** Mostrar el informe (Entregable) y guardarlo en `04-informe-cierre.md` (Borrador). Mostrar también:
   - Los valores para la columna "Al cierre" de Métricas (sección 11) y el texto de la sección 13 del plan (`<RESUMEN_CIERRE>`: qué se probó, qué no, resultado por HU, bugs abiertos y pendientes, armado con los pasos 3 y 4).
   - La propuesta de transicionar el plan a Finalizada.

   Esperar la confirmación de cada acción por separado.
9. **Publicar** el comentario en el Test Plan, actualizar las secciones 11 y 13 (reglas de `estructura-test-plan.md`, sección 4) y transicionar el plan a Finalizada si se confirmó (buscar la transición por nombre).
10. Pasar `04-informe-cierre.md` a Publicado y actualizar `indice.md`.

## Entregable

Máximo 700 palabras, links clickeables, firma al final.

```text
Informe de Cierre QA — Sprint <N> — <equipo>
Test Plan <clave> | <fechas>

1. Estado general: <semáforo> — Pass rate <x %> — Cobertura <y %> — <P> Passed / <F> Failed / <B> Blocked / <T> No ejecutados — <n> TE / <n> TS
2. Alcance: HU probadas y su estado
3. Bugs: tabla por severidad, abiertos y resueltos, bloqueantes y su impacto
4. Ejecución: Test Executions, re-ejecuciones (manual / automatizada), trabajo por QA
5. Riesgos: tabla final y regresión recomendada (recomendada, no ejecutada)
6. Pendientes para el próximo sprint: tests no ejecutados, HU de arrastre, bugs abiertos
7. Criterios de salida: Cumplido / No cumplido / Cumplido con observaciones, por criterio
8. Conclusión: veredicto, recomendación, nivel de confianza y riesgo residual

Métricas calculadas con la API de Xray el <fecha>.
Elaborado por <USUARIO JIRA> y Kiro
```

> **Nota:** `TE` = Test Executions (corridas de pruebas) y `TS` = Test Sets (agrupaciones de tests). `<semáforo>` es GO, GO WITH RISKS o NO GO. `<USUARIO JIRA>` es el usuario conectado, que firma junto con Kiro.

## Reglas

- No inventar: si un dato no se obtiene, N/D y el motivo.
- Diferenciar severidad (la define QA, qué tan grave es el defecto) de criticidad (la define el PO, *Product Owner*, qué tan importante es para el negocio).
- Los pendientes quedan listados para que `qa-inicio-sprint` los tome en el sprint siguiente.

## Errores conocidos
| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La suma de estados no da el total | Estado personalizado no mapeado, o más de 100 tests sin paginar | Paginar y revisar los estados; si persiste, informarlo en la nota al pie |
| El pass rate de GraphQL no coincide con el de `testPlanTests` por JQL | La consulta JQL no refleja el estado consolidado | Vale GraphQL (steering `qa-jira-xray`, sección Métricas) |
| La transición a Finalizada no aparece | El nombre depende del flujo de trabajo del proyecto | Listar las transiciones disponibles y elegir por nombre; si no hay, avisar |

## Criterios de calidad
- Todas las cifras salen de Xray o Jira, con la fecha de cálculo.
- El semáforo está justificado con el pass rate y los bugs abiertos.
- Cada criterio de salida tiene un estado y su dato de respaldo.
- Los pendientes están listados para el sprint siguiente.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Sprint con tests ejecutados y bugs | Informe completo con semáforo justificado |
| 2 | La suma de estados no coincide con el total | Lo informa en la nota al pie |
| 3 | El QA confirma el comentario pero no la transición | Publica el comentario y no transiciona |
| 4 | Pass rate de 97 % con un bug Highest abierto | Semáforo NO GO, justificado con el bug |
| 5 | No existe el Test Plan del sprint | Avisa y ofrece `qa-inicio-sprint` |
