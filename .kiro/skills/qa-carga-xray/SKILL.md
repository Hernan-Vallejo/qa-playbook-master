---
name: qa-carga-xray
description: Carga en Xray los casos aprobados de una HU - tests Cucumber, Test Set, Test Execution, campos, vínculos con la HU y el Test Plan del sprint y link de evidencias del repositorio documental del equipo - después de mostrar la lista exacta y recibir confirmación. Usar cuando el QA pide "subí los tests", "cargá los casos en Xray", "mapeo y seguimiento", "creá el Test Set y la Test Execution". No diseña casos.
---
# Carga en Xray

> **Para qué sirve:** Deja los casos aprobados de una HU (Historia de Usuario) cargados y trazados en Xray: tests, Test Set, Test Execution, campos, etiquetas y vínculos con la HU y el Test Plan del sprint.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta, y el agente de Kiro que lo asiste.
> **Cuándo se usa:** Después de que aprobaste los casos de `qa-diseno-casos` y antes de ejecutarlos.

> **Nota:** Xray es la herramienta de Jira para gestionar pruebas. Un **Test** es un caso. Un **Test Set** agrupa los tests de una HU. Una **Test Execution** es una corrida de esos tests con su resultado (Passed, Failed, Blocked). Un **Test Plan** reúne las ejecuciones de un sprint o de un release. Un *punto de control* es el momento en que Kiro se detiene y espera tu confirmación.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.1 |
| Puntos de control | Carga en Xray |
| Archivos en `.qa-work/<CLAVE-HU>/` | Lee `04-casos.md` y `04-casos.csv`. Escribe `05-carga-xray.md` |

> **Nota:** `.qa-work/<CLAVE-HU>/` (por ejemplo `.qa-work/PROJ-123/`) es la carpeta de trabajo de la HU. Cada archivo pasa por los estados *Borrador*, *Aprobado* y *Publicado*.

## Propósito

Dejar los casos aprobados de una HU cargados y trazados en Xray, con los nombres, campos, etiquetas y vínculos del estándar.

## Cuándo usarla

- Después de que el QA aprobó los casos de `qa-diseno-casos`.
- Para cargar un CSV de casos ya aprobado.

## Cuándo no usarla

- Si los casos no están aprobados → `qa-diseno-casos`.
- Para una re-ejecución → `qa-reejecucion`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU | Sí | Pedirla |
| Casos aprobados | Sí | Tomarlos de `.qa-work/<CLAVE-HU>/04-casos.md` (estado Aprobado) o de la conversación. Si están en Borrador o no hay, no avanzar |
| Equipo | Sí | Deducirlo de la etiqueta o el componente de la HU y confirmarlo |
| Test Plan del sprint | Sí | Buscarlo con el patrón del perfil (por ejemplo "Test Plan Sprint 12 - Equipo Alfa"). Si no existe, no cargar y pedir que el responsable lo cree con el agente `qa-sprint` (modo `INICIO_SPRINT`, skill `qa-inicio-sprint`) |

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`): rutas de Xray y del repositorio de evidencias, patrón del Test Plan, reparto, subtareas QA.
2. Steering `qa-jira-xray`: campos, vínculos y reglas de escritura.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Esta skill usa `@atlassian` para Jira y Xray. No usa `@github`. Las operaciones de Xray y del repositorio documental (SharePoint, Drive u otro) dependen de cómo tenga configurado `@atlassian` el equipo y de los conectores que tenga habilitados; si falta alguno, la skill lo avisa y deja ese paso como pendiente.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `atlassianUserInfo`, `getJiraIssue`, `searchJiraIssuesUsingJql`, `listJiraIssueComments`, `getJiraBoardSprintData` y `listJiraIssueTransitions` (con `executeRead`), `listJiraIssueRemoteIssueLinks`. Operaciones de Xray: consultar tests y carpetas, consultas GraphQL. Repositorio documental: listar carpetas |
| Escritura (solo después de la confirmación) | `@atlassian`: `editJiraIssue`, `transitionJiraIssue`, `addOrEditJiraIssueComment`, `createJiraIssueLink` y `createJiraIssueRemoteIssueLink` (con `executeWrite`). Operaciones de Xray: crear carpeta, test, Test Set y Test Execution, mover un test, agregar tests y ejecuciones al Test Plan, actualizar el comentario de un test run. Repositorio documental: crear el link de solo lectura de una carpeta |

> **Nota:** `executeRead` y `executeWrite` indican si la operación solo lee o también escribe en Jira. Un *test run* es el resultado de un test dentro de una Test Execution concreta.

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md`; crearlos si faltan. Si existe `05-carga-xray.md` con estado Publicado, mostrar lo ya cargado y cargar solo lo que falta.
1. **Datos de la sesión.** Usuario con `atlassianUserInfo`. Sprint activo del board del perfil. Test Plan del sprint con el patrón del perfil; si no existe, detenerse (ver Entradas).
2. **Asignación.** Según el reparto del perfil. Si el perfil dice "Por completar", preguntar si el QA trabaja solo o con otros, quiénes son y cómo se dividen, y proponer actualizar el perfil.
3. **Estado actual.** Revisar si la HU ya tiene Test Set o Test Execution vinculados y si ya existen tests con el mismo summary (título) en la carpeta destino. Lo que existe se reutiliza.
4. **Carpeta de evidencias.** Buscar en el repositorio documental del equipo (por ejemplo SharePoint o Drive) la carpeta de la HU, con el nombre `<CLAVE-HU> <summary>` y los caracteres prohibidos reemplazados por `-`. Si no existe, avisar y ofrecer seguir sin el link de evidencias o esperar a que se cree.
5. **[PUNTO DE CONTROL] Carga en Xray · esperando tu confirmación.** Mostrar la lista del punto de confirmación y guardarla en `05-carga-xray.md` (Borrador).
6. **Punto de confirmación.** Esperar el OK y pasar el archivo a Aprobado.
7. **Crear, de a una:**
   1. Carpeta de Xray si no existe.
   2. Cada test tipo Cucumber con su summary (`<Área>.<Capa>.<título>`), Gherkin, etiquetas, descripción (con la primera línea `ID del caso: <ID>`, por ejemplo `PROJ-123-CP01`, como define el steering `qa-gherkin`) y carpeta. Luego setear Ambiente, Regresión, Automatizado y Estado Automatización con `editJiraIssue`, asignar y transicionar a Finalizada (buscar las transiciones por nombre).
   3. Test Set con los tests: nombre `<CLAVE-HU> <título>`, etiquetas base del equipo, Ambiente, asignado y Finalizada.
   4. Test Execution con los tests: mismo nombre, `testEnvironments=["QA"]`, Ambiente, asignación según el perfil y estado Por hacer. Queda en Por hacer hasta que se ejecuta: pasa a En curso al empezar y a Finalizada al terminar la ejecución (`qa-cierre-hu`).
   5. Vínculos tipo `Test`: HU y Test Plan "is tested by" Test Set y Test Execution. Si la HU tiene un bug que estos tests cubren, también el bug.
   6. Tests al Test Plan (operación de Xray para agregar tests) y la Test Execution al Test Plan (operación para agregar ejecuciones).
   7. Link de evidencias en 4 lugares: enlace web en la HU, comentario del test-run de cada test, comentario en el Test Set y en la Test Execution. Link solo de lectura para la organización.
8. **Subtarea QA.** Proponer pasar la subtarea de definición de casos a Finalizada. Transicionar solo si el QA confirma.
9. **Verificar** con JQL y Xray: estados, campos, etiquetas, carpeta, tests por set y execution, vínculos y comentarios.
10. **Resumen** con el formato del Entregable. Guardarlo en `05-carga-xray.md` (Publicado, con todas las claves creadas y lo que quedó pendiente) y actualizar `indice.md`. Pasar `04-casos.md` a Publicado. Si la carga se cortó a mitad, registrar lo creado hasta ese momento para retomar sin duplicar.

> **Nota:** los nombres de estados (Por hacer, En curso, Finalizada) son los del workflow de Jira que usa el equipo; si el workflow de tu proyecto los llama distinto, usá los equivalentes. Ambiente, Regresión, Automatizado y Estado Automatización son campos del test que define el steering `qa-jira-xray`; "Ambiente QA" indica que el test se ejecuta en el ambiente de pruebas (ver ejemplo de ambientes en el steering).

## Punto de confirmación

Mostrar:

- Tests a crear: summary, etiquetas, Regresión y carpeta. Tests que se reutilizan.
- Test Set y Test Execution: nombre, cantidad de tests y si ya existen.
- Asignaciones.
- Vínculos con la HU, el Test Plan y el bug si aplica.
- Link de evidencias y dónde se registra.
- Tests existentes a deprecar, si los hay.

Cerrar con: "¿Confirmás la carga, ajustamos algo o lo dejamos acá?".

## Entregable

> **Nota:** es el resumen que Kiro muestra y guarda en `05-carga-xray.md`. Los valores entre `<>` se reemplazan con datos reales.

```text
HU: <CLAVE> <título>
Tests creados: <claves con link> (carpeta <ruta>, Finalizada)
Tests reutilizados: <claves>
Test Set: <clave> (Finalizada) | Test Execution: <clave> (Por hacer, QA)
Test Plan: <clave> — tests agregados y vínculos creados
Evidencias: <link> registrado en HU, test-runs, Test Set y Test Execution
Subtarea: <clave> → <estado>
Pendiente o no realizado: <lista y motivo>
```

> **Ejemplo:** `HU: PROJ-123 Login con usuario válido`, `Test Set: PROJ-311 (Finalizada)`, `Test Execution: PROJ-312 (Por hacer, QA)`, `Test Plan: PROJ-300 Test Plan Sprint 12 - Equipo Gamma`.

Siguiente paso sugerido: ejecutar los casos; si algo falla, `qa-reporte-bug`.

## Reglas

- Nada se crea si el QA no confirmó la lista. Si la lista cambia, se vuelve a confirmar.
- Escrituras en el repositorio de Xray de a una, nunca en paralelo.
- No duplicar tests, Test Sets, Test Executions, enlaces web ni comentarios.
- No modificar el Test Plan más allá de agregar tests y vínculos.
- No usar etiquetas de artefacto ni `REGRESION`.

> **Nota:** las "etiquetas de artefacto" son las que identifican el tipo de objeto (por ejemplo "Test Set") en lugar de describir la funcionalidad. La regresión se marca con el campo Regresión, no con una etiqueta.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| "repository is being updated" | Escrituras en paralelo | Buscar el test por summary; si se creó en la raíz, moverlo con la operación de Xray para mover tests. No recrearlo |
| No se puede agregar un test a la Test Execution | El test está en su estado inicial ("Tareas por hacer" en el workflow de ejemplo) | Transicionarlo a Finalizada antes |
| No aparece la transición a Finalizada | El workflow no permite ir directo desde el estado inicial ("Tareas por hacer" o "Por hacer") | Pasar primero por En curso. Consultar con `includeUnavailableTransitions` si hace falta |
| El vínculo muestra "tests" en la HU | Dirección invertida | No se puede borrar por API: avisar al QA |
| Regresión rechazada | Valor sin tilde | Usar `Sí` |

## Criterios de calidad

- Lo creado coincide exactamente con lo confirmado.
- Todos los artefactos tienen Ambiente QA y etiquetas del catálogo (`02-qa-funcional/catalogo-etiquetas.md`).
- Cada test tiene el ID del caso en su descripción, para trazar el caso de `04-casos.md` con su test de Xray.
- La HU muestra "is tested by" el Test Set y la Test Execution.
- El resumen indica todo lo que no se pudo hacer.

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | HU sin artefactos previos | Crea tests, Test Set, Test Execution, vínculos y evidencias |
| 2 | HU con Test Set y Test Execution existentes (ej. `PROJ-123`: `PROJ-311` y `PROJ-312`) | Agrega los tests nuevos a los existentes; no crea otros |
| 3 | Un test con el mismo summary ya existe en la carpeta | Lo reutiliza y avisa |
| 4 | No existe la carpeta de evidencias | Avisa y no inventa la URL |
| 5 | El QA no confirma | No escribe nada |
