---
name: qa-plan-automatizacion
description: Arma el plan de automatización de una tarea - resuelve el framework, reúne los casos de prueba en Gherkin (Xray, qa-maestro, pegados o diseñados desde una HU), revisa la cobertura automatizada existente y decide por caso si se reusa, se extiende, se automatiza de cero o no se automatiza. Usar cuando el QA o el agente qa-automation pide "planificá la automatización", "PLANIFICAR", "qué hay que automatizar de esta HU", "armá el plan para Playwright". No implementa código.
---
# Plan de automatización

> **Para qué sirve:** decide qué casos de prueba se automatizan, en qué framework y en qué archivos, antes de escribir una sola línea de código. El resultado es un plan (`01-plan.md`) que el QA aprueba.
> **Quién lo usa:** el QA de automatización, directamente o a través del agente `qa-automation` (ver [`qa-automation.md`](../../agents/qa-automation.md)).
> **Cuándo se usa:** al empezar una tarea de automatización (clave `AUTO-`, por ejemplo `AUTO-45`) y antes de implementar.

> **Nota:** HU = Historia de Usuario. Gherkin = formato de casos en lenguaje natural (Dado / Cuando / Entonces), ver [`qa-gherkin`](../../steering/qa-gherkin.md). Xray = herramienta de gestión de pruebas dentro de Jira. MCP = *Model Context Protocol*, el mecanismo por el que Kiro se conecta a herramientas externas (`@atlassian`, `@github`, etc.). POM = *Page Object Model*, el patrón donde cada pantalla tiene una clase con sus localizadores y acciones.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Contexto, Plan de automatización |
| Archivos en `.qa-work/<CLAVE>/automatizacion/` | Escribe `indice.md` y `01-plan.md` |

> **Nota:** `.qa-work/` es la carpeta de trabajo local donde los agentes dejan sus borradores. `<CLAVE>` es la clave de la tarea (por ejemplo `AUTO-45`). `indice.md` lista las etapas y su estado (Borrador, Aprobado, Publicado).

## Propósito

Decidir qué casos se automatizan, en qué framework y dónde, sin duplicar cobertura existente ni inventar comportamiento, para que la skill de implementación del framework trabaje sobre un alcance aprobado.

> **Nota:** el framework de front incluido en este playbook es Playwright con Page Object Model, en la plantilla [`plantilla-automation/`](../../../plantilla-automation/README.md). Karate (API) y las pruebas mobile son frameworks opcionales que el equipo puede sumar; no vienen incluidos en la plantilla. Si el equipo suma una skill de implementación propia (por ejemplo, una para Playwright), el plan es su entrada.

## Cuándo usarla

- Al empezar una tarea de automatización (`AUTO-`).
- Para automatizar casos de una HU ya probada manualmente, aunque sea antigua.

## Cuándo no usarla

- No hay casos en Gherkin y no se pueden obtener → [`qa-analisis-hu`](../qa-analisis-hu/SKILL.md) y [`qa-diseno-casos`](../qa-diseno-casos/SKILL.md) primero (ver [contratos](../../../00-introduccion/kiro/contratos.md)).
- El plan está aprobado y hay que escribir código → la skill de implementación del framework.
- Un test existente falla → la skill de reparación del framework.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la tarea | Sí | Pedirla |
| Framework | Sí | Deducirlo del pedido, del archivo o de la rama (ver [contratos](../../../00-introduccion/kiro/contratos.md)); si no se puede, preguntar |
| Origen de los casos | Sí | Preguntar: Test Set, HU o claves de tests en Xray; `.qa-work/<CLAVE-HU>/04-casos.md`; Gherkin pegado; o HU a analizar |
| HU relacionada | No | Tomarla de la tarea o de los vínculos de los tests |
| Profundidad | No | Estándar |

> **Ejemplo:** "Planificá la automatización de AUTO-45, casos del Test Set de PROJ-123, framework Playwright".

## Contexto que lee

1. Contratos (framework, entradas, salidas, trabajo local): [`contratos.md`](../../../00-introduccion/kiro/contratos.md).
2. Steering del proyecto del framework. En la plantilla de Playwright es [`pw-proyecto.md`](../../../plantilla-automation/.kiro/steering/pw-proyecto.md).
3. Perfil del equipo ([`05-equipos/`](../../../05-equipos/indice-equipos.md)) y documentación funcional de la HU, si hay HU.
4. Tests, Page Objects y datos existentes del módulo en el repositorio del framework (en la plantilla de Playwright: `tests/sin-sesion/`, `tests/con-sesion/`, `tests/api/`, `pages/`, `api/`, `fixtures/` y `data/`).
5. Usuario de la sesión: `atlassianUserInfo`.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `atlassianUserInfo`, `getJiraIssue`, `searchJiraIssuesUsingJql` y las herramientas de lectura de Xray del servidor `@atlassian` (tests y consultas GraphQL). Lectura de código del repositorio con `git` local o con `@github` |
| Escritura | Solo `.qa-work/`. No escribe en Jira, Xray ni en el repositorio del framework |

> **Nota:** `searchJiraIssuesUsingJql` consulta Jira con JQL (*Jira Query Language*), por ejemplo `project = PROJ AND issue in linkedIssues(PROJ-123)`.

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE>/automatizacion/` e `indice.md`; crearlos si faltan. Si `01-plan.md` existe, mostrar su estado y retomarlo.
1. **Framework.** Resolverlo según los contratos. Verificar que el repositorio esté abierto en el workspace (`QA-WORKSPACE`) y que tenga las piezas obligatorias (en Playwright: `pages/`, `tests/`, `data/`, `fixtures/`, `config/`, `playwright.config.ts` y el steering `pw-proyecto`). Si falta algo, informarlo y no seguir. Si el framework pedido es mobile o Karate y no está incluido en el repositorio, avisarlo y seguir solo con la confirmación del QA. Si el caso es de API y el equipo no sumó Karate, preguntar si se resuelve con las pruebas de API de la plantilla (`tests/api/`, cliente de Playwright). Si es una prueba de performance, derivar a [`qa-performance`](../../agents/qa-performance.md).
2. **Rama.** Verificar con `git -C <repo> branch --show-current` que se trabaja en la rama de la tarea (formato `feature/<CLAVE>-<resumen>`, por ejemplo `feature/AUTO-45-login-negativos`). Si no, avisar; la crea el QA.
3. **Casos.** Obtenerlos del origen indicado. Por cada caso: clave del test en Xray (o "nuevo"), summary (título), Gherkin, y los valores actuales de Regresión y Automatizado. Si no hay Gherkin, frenar y proponer `qa-analisis-hu` + `qa-diseno-casos`.
4. **[PUNTO DE CONTROL] Contexto · esperando tu confirmación.** Mostrar framework, repositorio, rama, origen y lista de casos. Esperar OK.
5. **Cobertura existente.** Buscar en el repositorio, por intención y por el ID del caso en el título del test (por ejemplo `PROJ-123-CP01`), si cada caso ya está automatizado. Registrar archivo y test.
6. **Decisión por caso** con la tabla de decisiones. En Playwright, definir también la carpeta del test: `tests/sin-sesion/` si el caso prueba el login o recorre el flujo desde cero, `tests/con-sesion/` si el login es solo una precondición, o `tests/api/` si es de API (regla 11 de `pw-proyecto.md`). Se pueden agrupar casos en un mismo test parametrizado solo si comparten precondiciones, flujo y resultado esperado, y cada caso conserva su ID y su trazabilidad.
7. **Datos y dependencias.** Por caso: datos de prueba necesarios (por ejemplo, el usuario `standard_user` o `locked_out_user` del set de QA), servicios o mocks, validaciones en la base de QA (consultas de solo lectura), riesgos.
8. **[PUNTO DE CONTROL] Plan de automatización · esperando tu confirmación.** Mostrar el plan (ver "Entregable"), guardarlo en `01-plan.md` (Borrador) y esperar OK. Al aprobar, pasarlo a Aprobado y actualizar `indice.md`.

## Decisiones

| Decisión | Cuándo |
| :--- | :--- |
| `REUSE` | Ya hay un test automatizado que cubre el caso completo. Solo falta trazarlo (ID en el título y registro en Xray) |
| `EXTEND_EXISTING` | Hay un archivo `.spec.ts` o un test del mismo flujo; se agrega el caso ahí |
| `NEW_AUTOMATION` | No hay cobertura; se crea un test nuevo (y, si la pantalla es nueva, su Page Object) |
| `UNIT_COVERED` | El comportamiento ya lo cubren pruebas unitarias o de contrato del desarrollo, con evidencia |
| `MANUAL_EXCEPTION` | No es automatizable con costo razonable (dependencia física, validación visual subjetiva, proceso externo). Se justifica |
| `BLOCKED_DATA` | Automatizable, pero faltan datos o ambiente. Se indica qué falta y a quién se pide |

Nunca se quita cobertura existente salvo que la tarea lo pida explícitamente (deprecación).

> **Nota:** `REUSE` y los demás valores se escriben tal cual en el plan, en inglés y en mayúsculas, para que el resto de las skills los reconozca.

## Punto de confirmación

| Punto | Se muestra |
| :--- | :--- |
| Contexto | Framework, repositorio, rama, origen de los casos, lista de casos con su estado en Xray |
| Plan de automatización | Tabla de decisiones por caso, archivos a crear o modificar, datos y dependencias, riesgos, casos que no se automatizan con motivo |

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

`01-plan.md`:

```markdown
# Plan de automatización — <CLAVE>
| Dato | Valor |
| :--- | :--- |
| Estado | Borrador / Aprobado |
| Framework | <Playwright (POM) / otro framework que el equipo haya sumado> |
| Repositorio | <repo, por ejemplo plantilla-automation> |
| Rama | feature/<CLAVE>-<resumen> |
| HU | <clave o —> |
| Origen de los casos | <Xray / qa-maestro / pegado / diseñado> |
## Casos
| Caso | Summary | Decisión | Archivo de test / test | Datos | Observación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PROJ-123-CP01 / nuevo | Login exitoso con usuario válido | NEW_AUTOMATION | tests/sin-sesion/login.spec.ts | standard_user | Ejemplo: el login se prueba sin sesión guardada |
## Archivos
| Archivo | Acción |
| :--- | :--- |
| pages/LoginPage.ts | Reusar / modificar / crear |
| fixtures/index.ts | Modificar, solo si hay un Page Object nuevo (se registra en los dos lugares que indica el archivo) |
## Dependencias y riesgos
- <…>
## No se automatiza
| Caso | Decisión | Motivo |
| :--- | :--- | :--- |
```

> **Nota:** la columna "Caso" lleva el ID del caso (`PROJ-123-CP01`) o la palabra "nuevo" si todavía no existe en Xray. "Archivos" lista los Page Objects (`pages/[Pantalla]Page.ts`) y los tests (`tests/sin-sesion/[funcionalidad].spec.ts`, `tests/con-sesion/[funcionalidad].spec.ts` o `tests/api/[recurso].api.spec.ts`) a tocar.

Siguiente paso sugerido: `IMPLEMENTAR`. En Playwright, el agente `qa-automation` implementa con las convenciones de `pw-proyecto.md`; si el equipo sumó una skill `<prefijo>-implementar`, usa esa.

## Reglas

- No inventar casos, comportamiento ni resultados esperados. El expected sale del caso aprobado.
- No escribir código ni archivos fuera de `.qa-work/`.
- Cada caso del plan queda marcado como existente en Xray (con clave) o nuevo.
- Recomendar automatizar por riesgo y valor de regresión, no por cantidad.
- Las credenciales no se escriben en el plan: se usan variables de entorno (`QA_USER`, `QA_PASSWORD`). Las únicas credenciales que pueden aparecer son las del sitio demo público SauceDemo (`standard_user` / `secret_sauce`), y solo como ejemplo.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El repositorio del framework no está en el workspace | No se agregó la carpeta | Pedir que se agregue; no planificar a ciegas |
| El caso de Xray no tiene Gherkin | Test manual o genérico | Proponer reescribirlo con [`qa-revision-casos`](../qa-revision-casos/SKILL.md) o `qa-diseno-casos` |
| El ID del título de un test apunta a otro caso | Trazabilidad vieja | Informarlo en el plan; corregirlo en `REGISTRAR_XRAY` |

## Criterios de calidad

- Cada caso tiene una decisión justificada.
- Ningún caso se automatiza dos veces.
- Los archivos a tocar están identificados antes de implementar.
- Lo que no se automatiza tiene motivo y responsable.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Test Set de Xray con 5 casos, 2 ya automatizados | Plan con 2 `REUSE` y 3 `NEW_AUTOMATION` o `EXTEND_EXISTING` |
| 2 | HU antigua sin casos | Propone `qa-analisis-hu` + `qa-diseno-casos`; no planifica sin Gherkin |
| 3 | Falta el framework | Lo deduce o pregunta |
| 4 | Faltan datos de prueba | Marca `BLOCKED_DATA` con qué falta |
| 5 | El QA rechaza el plan | No avanza a implementar |
| 6 | Caso de login (sin sesión previa) y caso de carrito (con el login como precondición) | El primero va a `tests/sin-sesion/` y el segundo a `tests/con-sesion/` |
| 7 | Caso que verifica la respuesta de un servicio sin pantalla y el equipo no tiene Karate | Pregunta si va a `tests/api/` de la plantilla; no lo asigna a Karate por su cuenta |
