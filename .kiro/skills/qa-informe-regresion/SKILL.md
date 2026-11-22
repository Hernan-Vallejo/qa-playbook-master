---
name: qa-informe-regresion
description: Genera el informe de regresión de un release - métricas de las ejecuciones automatizada y manual desde la API de Xray, bugs, bugs diferidos acordados con el PO, riesgos y veredicto GO / GO WITH RISKS / NO GO hacia PRE o PROD - y lo publica en el Test Plan de regresión con confirmación. Usar cuando el QA pide "informe de regresión", "release readiness", "INFORME_REGRESION", "cerrar la regresión".
---

# Informe de regresión

> **Para qué sirve:** da un veredicto de salida de un release, fundamentado en la evidencia de la regresión (qué se probó, qué falló y qué riesgos quedan).
> **Quién lo usa:** el QA responsable del release (por ejemplo, del Equipo Beta), a través del agente `qa-regresion`.
> **Cuándo se usa:** al terminar la ejecución de la regresión de un release.

> **Nota:** PO = *Product Owner* (responsable del producto). Xray es la herramienta de gestión de pruebas integrada con Jira. Un "punto de control" es una pausa donde Kiro muestra lo que va a hacer y espera tu confirmación antes de escribir.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.2 |
| Puntos de control | Informe de release |
| Archivos en `.qa-work/regresion-<equipo>-<release>/` | `04-informe.md`, `indice.md` |

> **Ejemplo:** para el release 2.4, el informe se guarda en `.qa-work/regresion-beta-2.4/04-informe.md` y se publica en el Test Plan "Test Plan Regresión Release 2.4".

## Propósito

Dar un veredicto de salida fundamentado en la evidencia de la regresión.

## Cuándo usarla

- Al terminar la ejecución de la regresión de un release.

## Cuándo no usarla

- Para cerrar un sprint normal → `qa-informe-sprint`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Test Plan de regresión o release | Sí | Pedirlo o buscarlo |
| Bugs diferidos acordados con el PO | No | Buscarlos y confirmarlos con el QA |
| Validación en ambiente prod-like (parecido a producción, por ejemplo PRE) | No | Preguntar si se hizo |

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`).
2. `02-qa-funcional/estructura-test-plan.md`.
3. `.qa-work/regresion-<equipo>-<release>/` (los archivos que dejó `qa-preparar-regresion`).

## Herramientas MCP

Se usan las herramientas del servidor `@atlassian` (Jira y Xray). Los nombres exactos pueden variar según el servidor instalado.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue`, `searchJiraIssuesUsingJql`, `listJiraIssueComments`, `xray_run_graphql_query` |
| Escritura (solo después de la confirmación) | `addOrEditJiraIssueComment`, `editJiraIssue`, `transitionJiraIssue` |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/regresion-<equipo>-<release>/`.
1. **Métricas** con GraphQL de Xray, igual que `qa-informe-sprint` paso 1 (status consolidado, sin `environment`, mismas reglas de estados, pass rate y cobertura), **separadas por conjunto**: automatizado, manual y total. El total sale de la consulta sobre el Test Plan de regresión. Cada conjunto sale de los test runs de su Test Execution (`Release <versión> - Regresión automatizada` y `Release <versión> - Regresión manual`, creadas por `qa-preparar-regresion`; las claves están en `03-test-plan.md`):
   ```graphql
   { getTestExecutions(jql: "key = <TE>", limit: 1) { results { testRuns(limit: 100) { total results { status { name } } } } } }
   ```
   > **Ejemplo:** esta consulta (de ejemplo; el nombre exacto depende de la versión de la API de Xray) devuelve el estado de cada test run de la Test Execution `<TE>`, por ejemplo `PROJ-231`. Se repite para la automatizada y la manual. Las re-ejecuciones (`#2`, `#3`) no suman a los totales (decisión D-47); se informan aparte. Los valores del total se vuelcan en la sección 9 del plan (`<RES_...>`).
2. **Bugs** del release por severidad (Bloqueante = Highest, Alta = High, Media = Medium, Baja = Low, Muy baja = Lowest), abiertos y resueltos. Bugs diferidos: severidad baja, movidos a un sprint futuro, con acuerdo del PO en los comentarios. Si no hay evidencia del acuerdo, no se cuentan como diferidos.
3. **Validación prod-like** si se hizo: ambiente, resultado y observaciones.
3b. **Performance.** Para cada HU del release con `Performance: aplica` (tabla de `01-alcance.md`): pedido, tarea de performance, informe final, **severidad** (Baja, Media o Alta) y decisión del líder técnico. Si falta el informe o la severidad de una prueba obligatoria, no inventarlos: es un riesgo pendiente (ver `qa-performance-informe` y `03-qa-automatizacion/plan-pruebas-performance.md`). PO = Product Owner, PA = analista de producto y TL = líder técnico (Tech Lead).
4. **Riesgos:** estado final de la tabla del plan.
5. **Veredicto:** GO a <destino> (100 % de la regresión en PASS, 0 Highest/High abiertos) / GO WITH RISKS (fallas fuera de los flujos críticos o bugs High abiertos, siempre con el acuerdo del PO documentado en Jira) / NO GO (bugs Highest abiertos, fallas en flujos críticos, o fallas o bugs High sin acuerdo documentado del PO). Fundamentar en viñetas. La performance condiciona el veredicto:
   - Severidad **Alta** → NO GO.
   - Severidad **Media** → solo GO WITH RISKS y con la aceptación documentada de PO, PA y TL en el pedido; sin ella, queda pendiente y no se da GO.
   - Prueba obligatoria sin informe o sin severidad → riesgo informado y sin GO.
   - Severidad **Baja** → no condiciona.

   > **Nota:** "flujos críticos" son los que afectan dinero, datos o permisos del usuario; en Tienda Demo, por ejemplo, el checkout y el login. Los tests de regresión en PASS significan que todos pasaron sin fallas.
6. **[PUNTO DE CONTROL] Informe de release · esperando tu confirmación.** (incluye la línea de performance) Mostrar el informe y guardarlo en `04-informe.md` (Borrador). Mostrar también los valores para la sección 9 Métricas, la tabla de bugs diferidos (sección 5.2), el estado final de los riesgos (sección 6) y el texto de la sección 11 Veredicto de Release del plan (`<VEREDICTO>`: GO, GO WITH RISKS o NO GO, con su justificación). Esperar la confirmación de cada acción por separado.
7. **Publicar** el comentario y actualizar las secciones confirmadas (5.2, 6, 9 y 11; reglas de `estructura-test-plan.md`, sección 4). Transicionar el plan solo si el QA lo confirma. Proponer también pasar a **Finalizada** las Test Executions de la regresión cuya ejecución terminó (ningún test en TO DO o EXECUTING; si están en Por hacer, pasar primero por En curso), cada una con confirmación.
8. Pasar a Publicado y actualizar `indice.md`.

## Entregable

```text
Informe de Regresión — Release <release> → <destino>
Test Plan <clave> | vinculado a <plan del sprint>

1. Veredicto: GO / GO WITH RISKS / NO GO — fundamento
2. Métricas: Automatizada <pass rate> (<P>/<F>/<B>/<T>) | Manual <pass rate> | Total <pass rate>, cobertura <x %>
3. Alcance: flujos validados y excluidos
4. Bugs: por severidad, abiertos y resueltos, bloqueantes
5. Bugs diferidos acordados con el PO: tabla
6. Validación prod-like: resultado
6b. Performance: <HU con prueba> — severidad <Baja / Media / Alta>, aceptación de PO, PA y TL <sí / no / N/A>, pendientes
7. Riesgos y riesgo residual
8. Criterios de salida: Cumplido / No cumplido / Cumplido con observaciones, por criterio
9. Acciones inmediatas (ej. smoke en PRE antes de la salida; en PROD no se ejecutan pruebas)

Métricas calculadas con la API de Xray el <fecha>.
Elaborado por <USUARIO JIRA> y Kiro
```

> **Nota:** `<P>/<F>/<B>/<T>` son Passed / Failed / Blocked / No ejecutados (To do). "Pass rate" es Passed dividido por los tests ejecutados. "Smoke" es una prueba corta y rápida que confirma que lo esencial funciona en el ambiente destino. `N/A` significa que no aplica.
> **Ejemplo:** "Automatizada 100,00 % (42/0/0/0) | Manual 88,89 % (8/1/0/0) | Total 98,04 %". Aunque el total sea alto, la falla manual puede condicionar el veredicto si está en un flujo crítico.

## Reglas

- No dar GO con bugs Highest abiertos.
- Diferenciar regresión recomendada (la que se propuso hacer) de ejecutada (la que realmente se corrió).
- No inventar acuerdos con el PO: deben estar documentados en Jira.
- No dar GO con una prueba de performance de severidad Alta, ni con una Media sin la aceptación documentada de PO, PA y TL.
- Los nombres de los veredictos son siempre `GO`, `GO WITH RISKS` y `NO GO` (los mismos del agente `qa-regresion` y de la sección 11 del Test Plan).

## Errores conocidos
| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| No se encuentran las claves de las Test Executions | Falta `03-test-plan.md` o el plan lo creó otra persona | Buscarlas en la sección 8 del plan (lista de ejecuciones) y confirmarlas con el QA |
| La transición a Finalizada de una Test Execution no aparece | Está en Por hacer y el flujo exige pasar por En curso | Pasar primero por En curso, cada una con confirmación (decisión D-84) |
| La suma de estados no coincide con el total | Estado personalizado no mapeado o más de 100 tests sin paginar | Paginar y revisar los estados; informarlo en la nota al pie |

## Criterios de calidad
- Las métricas están separadas por conjunto (automatizado, manual y total) y llevan la fecha de cálculo.
- Cada punto del veredicto tiene un dato de respaldo (pass rate, bug, acuerdo o informe de performance).
- Los bugs diferidos tienen el acuerdo del PO documentado en Jira.
- Se distingue la regresión recomendada de la ejecutada.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Regresión completa sin fallas | GO con fundamento |
| 2 | Un bug Highest abierto | NO GO |
| 3 | Bugs bajos sin acuerdo documentado | No los cuenta como diferidos y lo informa |
| 4 | Regresión en PASS y prueba de performance con severidad Alta | NO GO por performance |
| 5 | Prueba de performance Media sin comentario de aceptación | No da GO WITH RISKS por esa prueba: la informa como pendiente |
| 6 | Regresión terminada con Test Executions en Por hacer | Propone En curso y Finalizada para cada una |
