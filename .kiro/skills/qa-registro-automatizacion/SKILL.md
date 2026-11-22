---
name: qa-registro-automatizacion
description: Registra en Xray el resultado de una automatización - crea los tests nuevos, marca los existentes como automatizados y reemplaza los IDs provisorios (`XRAY-PENDIENTE`) de los tests del repositorio por el ID real del caso, después de mostrar la lista exacta y recibir confirmación. Usar cuando el agente qa-automation o el QA pide "REGISTRAR_XRAY", "registrá en Xray lo automatizado", "marcá los tests como automatizados", "reemplazá los IDs provisorios". No implementa ni ejecuta tests.
---
# Registro de automatización en Xray

> **Para qué sirve:** cierra la trazabilidad entre el repositorio de automatización y Xray. Cada test automatizado apunta a su caso, y cada caso en Xray dice que está automatizado.
> **Quién lo usa:** el QA de automatización, directamente o a través del agente [`qa-automation`](../../agents/qa-automation.md).
> **Cuándo se usa:** después de que la implementación quedó aprobada, o para corregir el estado de casos ya automatizados.

> **Nota:** Xray es la herramienta de gestión de pruebas que se usa dentro de Jira. Un *test* de Xray es un caso de prueba. Un *Test Set* es un conjunto de tests. "Cucumber" es el tipo de test de Xray que guarda el caso en formato Gherkin (Dado / Cuando / Entonces).

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Registro en Xray |
| Archivos en `.qa-work/<CLAVE>/automatizacion/` | Lee `01-plan.md` y `02-implementacion.md`. Escribe `04-registro-xray.md` |

## Propósito

Cerrar la trazabilidad entre el repositorio de automatización y Xray: cada test automatizado apunta a su caso, y cada caso dice que está automatizado (ver [contratos](../../../00-introduccion/kiro/contratos.md)).

> **Nota:** en la plantilla de Playwright el vínculo se hace con el ID del caso en el título del test, por ejemplo `test('PROJ-123-CP01 - Login exitoso con usuario válido', ...)`. Cuando el caso todavía no existe en Xray, el test lleva el **marcador provisorio `XRAY-PENDIENTE`** en lugar del ID (por ejemplo `test('XRAY-PENDIENTE - Login con usuario bloqueado', ...)`). Ese marcador es el que definen los contratos (sección 9.7) y la decisión D-57: `PROJ` es el proyecto de la HU del caso y `XXXX` es el lugar de la clave real. Esta skill lo reemplaza por el **ID del caso** (`<CLAVE-HU>-CP<NN>`, el siguiente número libre de la HU, por ejemplo `PROJ-123-CP04`) una vez creado el test en Xray. Ese ID se escribe en la primera línea de la descripción del test (`ID del caso: PROJ-123-CP04`), como define el steering `qa-jira-xray`; la clave que Xray le asigna al test (por ejemplo `PROJ-310`) es otra cosa y se informa en el entregable. Resultado en el título: `test('PROJ-123-CP04 - Login con usuario bloqueado', ...)`. Si un mismo archivo tiene más de un test con el marcador, se distinguen por el resto del título.

## Cuándo usarla

- Después de que la skill de implementación del framework dejó la implementación aprobada.
- Para corregir los IDs de los tests o el estado de automatización de casos ya automatizados (decisión `REUSE` del plan).

## Cuándo no usarla

- La implementación no está aprobada → terminar la implementación.
- Hay que cargar casos manuales de una HU con Test Set y Test Execution → [`qa-carga-xray`](../qa-carga-xray/SKILL.md).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la tarea (`AUTO-…`) | Sí | Pedirla |
| `02-implementacion.md` aprobado (o `01-plan.md` con casos `REUSE`) | Sí | No avanzar |
| Repositorio y rama del framework | Sí | Tomarlos del plan |
| Equipo y carpeta de Xray para los tests nuevos | Si hay casos nuevos | Deducirlos del perfil del equipo de la HU; si no hay HU o hay dudas, preguntar |

## Contexto que lee

1. [Contratos](../../../00-introduccion/kiro/contratos.md) y steering [`qa-jira-xray`](../../steering/qa-jira-xray.md) (campos, ids, reglas de escritura).
2. Skill [`qa-carga-xray`](../qa-carga-xray/SKILL.md) (reglas para crear un test Cucumber: summary, Gherkin, etiquetas, carpeta, campos, transición).
3. Perfil del equipo ([`05-equipos/`](../../../05-equipos/indice-equipos.md)) y [catálogo de etiquetas](../../../02-qa-funcional/catalogo-etiquetas.md), si hay tests nuevos.
4. Los archivos de tests del repositorio con los IDs de la tarea (en la plantilla de Playwright: `tests/sin-sesion/`, `tests/con-sesion/` y `tests/api/`).

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `atlassianUserInfo`, `getJiraIssue`, `searchJiraIssuesUsingJql` y las herramientas de lectura de Xray (tests, carpetas, consultas GraphQL) |
| Escritura (solo después de la confirmación) | Herramientas de Xray para crear y mover tests, `editJiraIssue`, `transitionJiraIssue`, `createJiraIssueLink` (con `executeWrite`). En el repositorio: reemplazo del ID en el título de los tests |

> **Nota:** las herramientas de Xray las expone el servidor MCP configurado en el workspace (`@atlassian` u otro que el equipo haya sumado). Si no hay herramientas de Xray disponibles, la skill deja el listado y el QA lo carga a mano.

## Pasos

0. **Espacio de trabajo.** Leer `indice.md`, `01-plan.md` y `02-implementacion.md`. Si `04-registro-xray.md` existe con estado Publicado, registrar solo lo que falta.
1. **Inventario.** Por cada test automatizado de la tarea: archivo, título del test, ID actual (`PROJ-123-CP01` o el marcador `XRAY-PENDIENTE`) y caso de origen del plan.
2. **Estado en Xray.** Por cada caso existente: Automatizado y Estado Automatización actuales. Por cada caso nuevo: verificar que no exista ya un test con el mismo summary en la carpeta destino.
3. **Gherkin del test nuevo.** Playwright: el caso en Gherkin en español del plan (el test de Playwright es código TypeScript y no se pega en Xray; el Gherkin del caso es el que se carga). Si el equipo sumó Karate, el Gherkin en Xray también es el caso en español, no el feature de Karate (ver [`qa-gherkin`](../../steering/qa-gherkin.md)). Un test por caso: no se crean tests por navegador ni por plataforma ni se usan sufijos en el ID.
4. **[PUNTO DE CONTROL] Registro en Xray · esperando tu confirmación.** Mostrar la lista del punto de confirmación y guardarla en `04-registro-xray.md` (Borrador). Esperar OK y pasarla a Aprobado.
5. **Escribir, de a una:**
   1. Caso existente: `editJiraIssue` con Automatizado = `SI` y Estado Automatización = `Automatizado`.
   2. Caso nuevo: crear el test Cucumber con las reglas de `qa-carga-xray` (summary, Gherkin, etiquetas, carpeta, Ambiente, Regresión), con Automatizado = `SI`, Estado Automatización = `Automatizado` y la primera línea de la descripción `ID del caso: <CLAVE-HU>-CP<NN>`; transicionar a Finalizada buscando la transición por nombre. Si hay HU, vincularla.
   3. Reemplazar en el título de cada test el marcador `XRAY-PENDIENTE` por el ID correspondiente. Verificar con `grep` (o `Select-String` en PowerShell) que no quede ningún `XRAY-PENDIENTE` en los archivos de tests de la tarea.
6. **Verificar** con JQL los campos y estados, y con `grep` los títulos de los tests del repositorio.
7. **Resumen** con el formato del Entregable. Guardar `04-registro-xray.md` (Publicado) y actualizar `indice.md`.

> **Nota:** los valores `SI`, `Automatizado` y `Finalizada` son los de la instancia de ejemplo; los valores permitidos reales se consultan antes de escribir (ver "Errores conocidos") y están en `qa-jira-xray`.

## Punto de confirmación

Mostrar:

- Casos existentes a marcar como automatizados: clave, summary, valores actuales y nuevos.
- Tests nuevos a crear: summary, carpeta, etiquetas, Regresión, Gherkin, vínculo con la HU.
- Reemplazos de ID: archivo, test, `XRAY-PENDIENTE` → ID del caso (los IDs nuevos se completan al crear los tests).
- Casos del plan que no se registran (`MANUAL_EXCEPTION`, `BLOCKED_DATA`) y por qué.

Cerrar con: "¿Confirmás el registro, ajustamos algo o lo dejamos acá?".

## Entregable

```text
Tarea: <CLAVE> (<framework>)
Tests marcados como automatizados: <claves con link>
Tests creados: <claves de Xray con link y su ID del caso> (carpeta <ruta>, Finalizada)
IDs reemplazados: <n> en <archivos>
Pendiente o no realizado: <lista y motivo>
```

Links con el formato `https://acme.atlassian.net/browse/<CLAVE>` (en un proyecto real, el dominio de Jira del equipo).

Siguiente paso sugerido: commit del cambio de IDs en la rama `feature/<CLAVE>-<resumen>` (mensaje `<CLAVE>: registra IDs de Xray en los tests`) y `CREAR_PR` con [`qa-crear-pr`](../qa-crear-pr/SKILL.md).

## Reglas

- Nada se escribe en Xray ni en el repositorio sin confirmación de la lista exacta.
- Escrituras en Xray de a una, nunca en paralelo.
- No duplicar tests: si existe uno con el mismo summary, reutilizarlo y avisar.
- No cambiar Regresión de un caso existente; solo los campos de automatización.
- Los valores de los campos se toman de `qa-jira-xray`, no se copian en esta skill.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| "repository is being updated" | Escrituras en paralelo | Buscar el test por summary; si quedó en la raíz, moverlo con la herramienta de Xray para mover tests. No recrearlo |
| Estado Automatización rechazado | Valor distinto de los permitidos | Consultar los valores permitidos antes de setear |
| Un mismo ID aparece en dos tests | El plan agrupó casos | Revisar el plan: un ID por caso |

## Criterios de calidad

- Ningún test de la tarea queda con el marcador `XRAY-PENDIENTE`.
- Cada ID del repositorio corresponde a un test con Automatizado = `SI`.
- Lo registrado coincide con lo confirmado.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Dos casos existentes y uno nuevo | Marca los dos, crea uno y reemplaza los tres IDs |
| 2 | Caso nuevo automatizado con Playwright | El Gherkin en Xray es el caso en español, no el código del test |
| 3 | Ya existe un test con el mismo summary | Lo reutiliza y avisa |
| 4 | La implementación no está aprobada | No avanza |
| 5 | El QA no confirma | No escribe nada |
