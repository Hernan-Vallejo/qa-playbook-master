---
name: qa-reejecucion
description: 'Crea una re-ejecución de tests de una HU - nueva Test Execution con sufijo #2, #3, con todos o algunos tests de la original, las mismas vinculaciones (HU, Test Set, Test Plan del sprint) y el vínculo al bug que la motiva - después de confirmación. Usar cuando el QA pide "re-ejecutar", "REEJECUTAR", "nueva ejecución", "re-test", "volver a correr los tests" o un bug fue corregido.'
---
# Re-ejecución

> **Para qué sirve:** Vuelve a probar una HU (Historia de Usuario) después de una corrección, creando una Test Execution nueva que no pisa la anterior y mantiene la trazabilidad con la HU, el Test Plan y el bug.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta, y el agente de Kiro que lo asiste.
> **Cuándo se usa:** Cuando se corrigió un bug y hay que re-testear los tests fallidos o bloqueados, o cuando hay que repetir la ejecución por un cambio de ambiente o un redeploy (nueva publicación del sistema en el ambiente de pruebas).

> **Nota:** una **Test Execution** es una corrida de tests en Xray con su resultado por test: Passed (pasó), Failed (falló), Blocked (no se pudo ejecutar). Una **re-ejecución** es una Test Execution nueva con el mismo nombre y un sufijo: `#2`, `#3`, etc. Un *punto de control* es el momento en que Kiro se detiene y espera tu confirmación.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.2 |
| Puntos de control | Re-ejecución |
| Archivos en `.qa-work/<CLAVE-HU>/` | `06-reejecucion-<N>.md`, `indice.md` |

> **Nota:** `<N>` es el número de la re-ejecución (2, 3, ...). Por ejemplo `.qa-work/PROJ-123/06-reejecucion-2.md`. El archivo pasa por *Borrador*, *Aprobado* y *Publicado*.

## Propósito

Volver a probar después de una corrección sin pisar la ejecución anterior, manteniendo la trazabilidad con la HU, el Test Plan y el bug.

## Cuándo usarla

- Se corrigió un bug y hay que re-testear los tests fallidos o bloqueados.
- Hay que repetir la ejecución por un cambio de ambiente o un redeploy.

## Cuándo no usarla

- Para la primera ejecución → la Test Execution ya la crea `qa-carga-xray`.
- Para una regresión de release → `qa-preparar-regresion`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| HU o Test Execution original | Sí | Pedirla. Con la HU, buscar sus Test Executions y preguntar cuál |
| Tests a incluir | Sí | Proponer los Failed y Blocked de la original y preguntar: todos, los propuestos u otros |
| Bug de origen | No | Preguntar si la re-ejecución nace de un bug corregido |

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`): asignación y etiquetas base.
2. Steering `qa-jira-xray` (vínculos, campos, nombres).
3. `.qa-work/<CLAVE-HU>/indice.md` y `05-carga-xray.md`.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Esta skill usa `@atlassian` para Jira y Xray. Opcionalmente puede consultar en `@github`, solo en modo lectura, si el Pull Request (PR) que corrige el bug ya fue integrado; no escribe nada en GitHub. Las operaciones de Xray dependen de cómo tenga configurado `@atlassian` el equipo.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `atlassianUserInfo`, `getJiraIssue` (view `evidence`), `searchJiraIssuesUsingJql`, consultas GraphQL de Xray. `@github` (opcional): estado del PR de la corrección |
| Escritura (solo después de la confirmación) | `@atlassian`: `editJiraIssue`, `transitionJiraIssue`, `createJiraIssueLink` (con `executeWrite`), `addOrEditJiraIssueComment`. Operaciones de Xray: crear la Test Execution, agregarla al Test Plan, actualizar el comentario de un test run |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md`; crearlos si faltan.
1. **Ejecución original.** Leer la Test Execution: summary (título), etiquetas, ambiente, vínculos (HU, Test Set, Test Plan, bugs) y estado de cada test run (GraphQL de Xray). Si la original sigue en Por hacer o En curso y todos sus tests tienen resultado, proponer pasarla a Finalizada junto con la creación de la nueva (si está en Por hacer, pasar primero por En curso). Si le quedan tests en TO DO o EXECUTING, avisar al QA antes de seguir.
2. **Sufijo.** Buscar las ejecuciones hermanas (`project = PROJ AND issuetype = "Test Execution" AND summary ~ "<nombre base>"`). Original sin sufijo → `#2`; si existe `#2` → `#3`, y así. Si la que corresponde ya existe, avisar y no duplicar.
3. **Tests.** Proponer los Failed y Blocked; el QA elige.
4. **Bug.** Si hay bug de origen, verificar su estado. Si no está resuelto, avisar antes de seguir.
5. **[PUNTO DE CONTROL] Re-ejecución · esperando tu confirmación.** Mostrar y guardar en `06-reejecucion-<N>.md` (Borrador):
   - Nombre: `<nombre base> #<N>`.
   - Tests incluidos (claves, título y estado en la ejecución anterior).
   - Etiquetas, Ambiente QA, asignación según el perfil, estado Por hacer.
   - Vínculos a replicar: los mismos que tiene la Test Execution original en el steering `qa-jira-xray` (la HU y el Test Plan del sprint "is tested by" la re-ejecución), más el bug de origen. El Test Set no se vincula a una Test Execution: la re-ejecución solo incluye sus tests.
   - Link de evidencias en los comentarios de los test runs y de la Test Execution.
   - Transición de la ejecución original a Finalizada, si corresponde (paso 1).

   Esperar la confirmación.
6. **Crear:** Test Execution con los tests y `testEnvironments=["QA"]`; Ambiente con `editJiraIssue`; asociarla al Test Plan; vínculos tipo `Test` (la HU, el Test Plan y el bug quedan "is tested by" la re-ejecución); comentarios de evidencia.
7. **Verificar** vínculos, tests y estado. Pasar el archivo a Publicado y actualizar `indice.md`.

> **Nota:** los estados TO DO y EXECUTING son los de cada test run dentro de Xray (sin ejecutar y en ejecución). Los estados Por hacer, En curso y Finalizada son los del workflow de Jira de la Test Execution; si tu proyecto los llama distinto, usá los equivalentes. `testEnvironments=["QA"]` es el campo de Xray que indica en qué ambiente se ejecutó.

## Entregable

> **Nota:** es el resumen que Kiro muestra y guarda en `06-reejecucion-<N>.md`. Los valores entre `<>` se reemplazan con datos reales.

```text
Re-ejecución: <clave> <nombre base> #<N> (Por hacer, QA)
Tests: <n> (<claves>)
Vínculos: HU <clave>, Test Plan <clave>, Bug <clave>
Evidencias: <link>
Siguiente paso: ejecutar; al terminar, qa-cierre-hu
```

> **Ejemplo:** `Re-ejecución: PROJ-330 PROJ-123 Login con usuario válido #2 (Por hacer, QA)`, con 2 tests (`PROJ-310`, `PROJ-311`) y vínculo al bug `PROJ-340`.

## Reglas

- Nunca modificar ni reutilizar la ejecución anterior: siempre una nueva.
- Mismas etiquetas y vínculos que la original, más el bug.
- La ejecución original queda **Finalizada**: terminó, aunque tenga tests Failed. Nunca se reabre.
- Las re-ejecuciones no suman a las métricas: cada test cuenta una vez por su estado consolidado (el de su última ejecución).

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| "repository is being updated" al crear la ejecución o agregar tests | Escrituras en paralelo | Hacerlas de a una y buscar la Test Execution por summary antes de reintentar, para no duplicarla (ver steering `qa-jira-xray`) |
| No se pueden agregar los tests a la re-ejecución | Un test está en su estado inicial y no en Finalizada | Transicionarlo a Finalizada antes, igual que en `qa-carga-xray` |
| El vínculo quedó con la dirección invertida | Se usó `inwardIssue` y `outwardIssue` al revés | No se puede borrar por API: avisar al QA para que lo borre a mano |

## Criterios de calidad

- El nombre es `<nombre base> #<N>` y no repite un sufijo existente.
- Los tests incluidos son los que el QA eligió, con su estado anterior a la vista.
- La re-ejecución tiene los mismos vínculos y etiquetas que la original, más el bug.
- La ejecución original quedó en Finalizada (o el QA decidió explícitamente no pasarla).

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Original con 2 Failed y bug resuelto | Propone `#2` con esos 2 tests y el vínculo al bug |
| 2 | Ya existe `#2` | Propone `#3` |
| 3 | El bug sigue abierto | Avisa antes de crear |
| 4 | La original está en Por hacer con todos sus tests ejecutados | Propone En curso y Finalizada antes de crear la nueva |
| 5 | La original tiene tests en TO DO | Avisa al QA antes de seguir |
| 6 | El QA no confirma | No crea nada |
