---
name: qa-seguimiento-sprint
description: Muestra el avance de QA del sprint (HU por etapa, tests, ejecuciones, bugs) y actualiza el Test Plan del sprint - riesgos, HU no planificadas, reparto y vínculos faltantes - con confirmación. Usar cuando el QA pide "cómo vamos en el sprint", "SEGUIMIENTO", "actualizá los riesgos", "agregá un riesgo al Test Plan", "entró una HU nueva al sprint".
---

# Seguimiento del sprint

> **Para qué sirve:** da una foto del avance de QA durante el sprint y mantiene actualizado el Test Plan (riesgos, cambios de alcance y vínculos).
> **Quién lo usa:** el QA del equipo (por ejemplo, del Equipo Beta), a través del agente `qa-sprint`.
> **Cuándo se usa:** en cualquier momento del sprint, por ejemplo antes de la daily (reunión diaria del equipo), cuando aparece un riesgo o cuando una HU entra o sale del sprint.

> **Nota:** HU = historia de usuario. Xray es la herramienta de gestión de pruebas integrada con Jira. Un "punto de control" es una pausa donde Kiro muestra lo que va a hacer y espera tu confirmación antes de escribir.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Avance del sprint, Actualización del Test Plan |
| Archivos en `.qa-work/sprint-<equipo>-<N>/` | `03-seguimiento-<AAAA-MM-DD>.md`, `indice.md` |

> **Ejemplo:** `.qa-work/sprint-beta-12/03-seguimiento-2026-03-07.md` es el seguimiento del 7 de marzo del sprint 12 del Equipo Beta.

## Propósito

Dar al equipo de QA una foto del avance del sprint y mantener vivo el Test Plan: riesgos, cambios de alcance y trazabilidad completa.

## Cuándo usarla

- En cualquier momento del sprint (por ejemplo, antes de la daily).
- Cuando aparece o cambia un riesgo.
- Cuando entra o sale una HU del sprint.

## Cuándo no usarla

- Para crear el plan → `qa-inicio-sprint`.
- Para cerrar el sprint → `qa-informe-sprint`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Equipo | Sí | Pedirlo |
| Cambio puntual (ej. un riesgo nuevo) | No | Solo mostrar el avance y proponer cambios |

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`, por ejemplo `05-equipos/beta.md`).
2. `02-qa-funcional/estructura-test-plan.md`, sección 4 (reglas de edición: qué partes del plan se pueden modificar y cuáles no).
3. Test Plan del sprint y `.qa-work/` del sprint y de cada HU.

## Herramientas MCP

Se usan las herramientas del servidor `@atlassian` (Jira y Xray). Los nombres exactos pueden variar según el servidor instalado.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraBoardSprintData` (con `executeRead`), `searchJiraIssuesUsingJql`, `getJiraIssue`, `xray_run_graphql_query` |
| Escritura (solo después de la confirmación) | `editJiraIssue`, `createJiraIssueLink` (con `executeWrite`), `xray_add_tests_to_test_plan`, `xray_add_test_executions_to_test_plan` |

> **Nota:** `executeRead` y `executeWrite` son parámetros que indican si la llamada solo lee o también modifica datos. Todo lo que modifica requiere tu confirmación previa.

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/sprint-<equipo>-<N>/`. Si no existe el Test Plan del sprint, avisar y ofrecer `qa-inicio-sprint`.
1. **Leer el plan** (descripción en HTML) y el sprint activo.
2. **Avance.** Por cada HU del sprint con QA (las de la tabla 2.1 del plan): etapa (Analizada, Casos diseñados, Casos cargados, En ejecución o Cerrada) según Jira, Xray y `.qa-work/<CLAVE-HU>/indice.md`. Tests del plan por estado (GraphQL de Xray). Bugs abiertos por severidad (Bloqueante = Highest, Alta = High, Media = Medium, Baja = Low o Lowest).
3. **Trazabilidad.** Detectar Test Sets o Test Executions de las HU del sprint que no están vinculados al plan, tests que no están en el plan y bugs del sprint sin vínculo.

   > **Nota:** trazabilidad es poder seguir el camino HU → tests → ejecuciones → bugs. Un elemento sin vínculo al plan no aparece en las métricas.
4. **Cambios de alcance.** HU que entraron después del inicio del sprint (no están en la tabla 2.1 del plan) o que salieron.
5. **[PUNTO DE CONTROL] Avance del sprint · esperando tu confirmación.** Mostrar el tablero (formato del Entregable, sin la última línea, que se completa en el paso 6) y guardarlo en `03-seguimiento-<fecha>.md` (Borrador). Esperar la confirmación o los ajustes.
6. **Proponer cambios al plan:** riesgos nuevos o con estado distinto (comparar antes con la tabla de la sección 9 del plan, porque `qa-maestro` también agrega riesgos al analizar una HU, y no duplicar), filas para "Historias no planificadas" (sección 6.3), cambios en la tabla 2.1 y vínculos faltantes. Completar la última línea del tablero ("Cambios propuestos al Test Plan").
7. **[PUNTO DE CONTROL] Actualización del Test Plan · esperando tu confirmación.** Mostrar la sección antes y después, y los vínculos a crear. Esperar la confirmación.
8. **Escribir** según `estructura-test-plan.md` sección 4, solo las secciones confirmadas (las que esta skill puede editar son 2, 5, 6.3 y 9). Crear los vínculos (tipo `Test`, "is tested by", según el steering `qa-jira-xray`) y agregar al plan los tests y ejecuciones faltantes con las herramientas de Xray. Escribir de a una operación (regla de Xray).
9. Actualizar `indice.md` del sprint.

## Entregable

```text
Sprint <N> — día <d> de <total> — Test Plan <clave>

| HU | QA | Etapa | Tests | Pass/Fail/Pend | Bugs abiertos |
| <CLAVE> | <QA> | Casos cargados | 8 | 3/1/4 | 1 Alta |

Tests del plan: <total> | Passed <n> | Failed <n> | Blocked <n> | Pendientes <n>
Bugs: <n> abiertos (Bloqueante <n>, Alta <n>, Media <n>, Baja <n>), <n> verificados
Trazabilidad: <OK | n vínculos faltantes>
Riesgos: <n> abiertos

Cambios propuestos al Test Plan: <lista o "ninguno">
```

> **Ejemplo:** la fila `PROJ-123 | Ana QA | Casos cargados | 8 | 3/1/4 | 1 Alta` significa que la HU PROJ-123 tiene 8 tests: 3 pasaron, 1 falló y 4 están pendientes, y hay un bug abierto de severidad Alta (High). Las severidades son: Bloqueante (Highest), Alta (High), Media (Medium) y Baja (Low); en el conteo, "Baja" incluye también Muy baja (Lowest). En la tabla, "Pend" agrupa los tests Blocked, No ejecutados y En ejecución de esa HU; la línea "Tests del plan" los muestra por separado.

## Reglas

- Las métricas del avance salen de GraphQL de Xray, no de JQL `testPlanTests` (la consulta por JQL puede no reflejar el estado real de las ejecuciones).
- No editar las listas dinámicas ni las secciones de texto base de la plantilla.
- Un riesgo no se borra: se cambia su estado (Mitigado, Materializado, Cerrado).

## Errores conocidos
| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| Las listas dinámicas del plan se rompen o aparecen como links | Se reformateó el bloque `block-card` al escribir | Mantener esos bloques tal cual, según `estructura-test-plan.md` sección 4 |
| El avance por JQL `testPlanTests` no coincide con Xray | Esa consulta no refleja el estado consolidado | Usar siempre GraphQL de Xray para las métricas |
| "repository is being updated" al agregar tests al plan | Escrituras en paralelo sobre Xray | Escribir de a una; si ocurre, buscar antes de reintentar para no duplicar |
| Un vínculo quedó mal | Jira no permite borrar vínculos por API | Avisar al QA para que lo borre a mano |

## Criterios de calidad

- El avance distingue lo que está publicado en Xray de lo que está solo en borrador local.
- Cada cambio al plan tiene un motivo.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Una HU tiene Test Execution sin vincular al plan | Lo detecta y propone el vínculo |
| 2 | El QA reporta un riesgo nuevo | Propone la fila y la escribe con confirmación |
| 3 | Entró una HU después de la Planning | La propone en "Historias no planificadas" |
| 4 | No existe el Test Plan | Avisa y ofrece `qa-inicio-sprint` |
