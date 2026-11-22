---
name: qa-reporte-bug
description: Redacta y crea un bug en Jira (issuetype Bug) a partir de una captura, un JSON o la descripción de un fallo, con severidad, capa, ambiente, versión, épica y vínculos al test de Xray y a la HU, después de confirmación. Usar cuando el QA pide "reportá un bug", "REPORTAR_BUG", "cargá el defecto", "abrí una incidencia" o pasa un error para cargarlo.
---
# Reporte de bug

> **Para qué sirve:** Redacta y registra en Jira un defecto reproducible, vinculado a la HU (Historia de Usuario) y al test que falló, con la información que Desarrollo necesita para corregirlo.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta, y el agente de Kiro que lo asiste.
> **Cuándo se usa:** Cuando un test falla durante la ejecución, o cuando el QA encuentra un defecto fuera de un test y tiene evidencia (captura, JSON o log).

> **Nota:** un *bug* (defecto) es una diferencia entre lo que la HU o la documentación dicen que debe pasar y lo que realmente pasa. Un *punto de control* es el momento en que Kiro se detiene y espera tu confirmación antes de crear nada en Jira.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.1 |
| Puntos de control | Reporte de bug |
| Archivos en `.qa-work/<CLAVE-HU>/` | `bugs/<AAAA-MM-DD>-<resumen-corto>.md` |

> **Ejemplo:** `.qa-work/PROJ-123/bugs/2026-03-10-login-bloqueado-permite-ingreso.md`. El archivo pasa por *Borrador* (redactado), *Aprobado* (lo confirmaste) y *Publicado* (creado en Jira, con la clave del bug).

## Propósito

Registrar un defecto reproducible y trazado a la HU y al test que falló, con la información que Desarrollo necesita para corregirlo.

## Cuándo usarla

- Un test falló durante la ejecución.
- El QA encontró un defecto fuera de un test.

## Cuándo no usarla

- Para dudas o faltantes de una HU todavía no probada → comentario de `qa-analisis-hu`.
- Para re-probar un bug corregido → `qa-reejecucion`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Evidencia (captura, JSON, log) y descripción | Sí | Pedirla |
| HU afectada | Sí | Pedirla, o pedir la épica |
| Test de Xray que falló | No | Preguntar si hay uno |
| Capa | Sí | Inferirla y confirmarla |
| Severidad | Sí | Proponerla con justificación y confirmarla |
| Versión afectada | Sí | Proponerla del perfil según la capa y confirmarla |
| Sprint actual o backlog | Sí | Preguntar |
| Test Plan del sprint | No | Buscarlo con el patrón del perfil para el vínculo |

> **Nota:** la **capa** es dónde está el defecto: FRONT (pantalla), BFF (capa intermedia entre la pantalla y los servicios) o BACK (servicio que procesa y guarda datos). La **severidad** la propone QA según cuánto daña el uso del producto; no es lo mismo que la **criticidad**, que decide el PO (Product Owner) según el negocio.

## Contexto que lee

1. Perfil del equipo (`05-equipos/<equipo>.md`): proyecto de bugs, versiones por capa, etiquetas base.
2. Steering `qa-jira-xray` (sección Bugs) y `qa-seguridad-datos` (qué datos nunca deben quedar en un bug).
3. Documentación funcional, para el resultado esperado.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Esta skill usa `@atlassian` para Jira. No usa `@github`.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `atlassianUserInfo`, `getJiraIssue`, `searchJiraIssuesUsingJql`, `getJiraProjectVersions` y `getJiraBoardSprintData` (con `executeRead`) |
| Escritura (solo después de la confirmación) | `@atlassian`: `createJiraIssue`, `editJiraIssue`, `createJiraIssueLink` (con `executeWrite`), adjunto de la evidencia si el QA lo pide |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/`, `indice.md` y la subcarpeta `bugs/`; crearlos si faltan. Revisar en `bugs/` si ya hay un borrador del mismo fallo.
1. Leer la evidencia y el contexto. Quitar tokens, cookies y datos sensibles de payloads y logs.
2. Leer la HU: épica, sprint y criterio de aceptación afectado.
3. Buscar bugs abiertos parecidos en el proyecto (mismo endpoint, pantalla o mensaje). Si hay uno, mostrarlo y preguntar si es el mismo.
4. **[PUNTO DE CONTROL] Reporte de bug · esperando tu confirmación.** Redactar el bug con el formato del Entregable y guardarlo en `bugs/<AAAA-MM-DD>-<resumen-corto>.md` (Borrador).
5. **Punto de confirmación.**
6. Crear el bug (issuetype `Bug`), setear etiquetas, Ambiente, versión afectada, épica (parent) y sprint si corresponde.
7. Vincular según la tabla "Vínculos" del steering `qa-jira-xray`: al test que falló con `Blocks` si es Bloqueante (Highest) o Alta (High) y `Relates` si es Media (Medium) o menor; a la HU con `Relates`; y al Test Plan del sprint con `Relates`, para que quede en su trazabilidad (la lista de bugs del plan también lo muestra por sprint). Si el bug es Bloqueante (Highest) o Alta (High), preguntar si se agrega un riesgo a la tabla de Riesgos del Test Plan (reglas de `02-qa-funcional/estructura-test-plan.md`).
8. Mostrar el resumen con la clave y los vínculos. Pasar el archivo del bug a Publicado con la clave y agregarlo a la tabla Bugs de `indice.md`.

> **Nota:** `Blocks` ("bloquea a") y `Relates` ("se relaciona con") son tipos de vínculo de Jira. Con `Blocks` el bug queda como impedimento visible del test; con `Relates` solo queda asociado.

## Punto de confirmación

Mostrar el bug completo, la severidad con su justificación, los campos y los vínculos. Cerrar con: "¿Creo el bug, ajustamos algo o lo dejamos acá?".

## Entregable

> **Nota:** es el texto del bug tal como se va a crear en Jira. La severidad se escribe con texto, sin iconos. Los valores entre `<>` se reemplazan con datos reales.

```text
Título: [<CAPA>] <qué falla> en <dónde>
Severidad: Bloqueante (Highest) | Alta (High) | Media (Medium) | Baja (Low) — <justificación>
Ambiente: QA | Versión afectada: <versión> | Sprint: <sprint o backlog>
Épica: <clave> | HU: <clave> | Test: <clave>
Etiquetas: <equipo>;<capa>;<funcionalidad>          # del catálogo (por ejemplo gamma;front;login)
Descripción: <qué pasa y en qué contexto>
Pasos para reproducir:
1. ...
Resultado esperado: <según el criterio de aceptación o la regla de negocio>
Resultado actual: <lo observado>
Evidencia: <captura, request y response sin datos sensibles>
Datos usados: <usuario de prueba, producto, comprador ficticio>
Impacto: <a quién afecta y qué bloquea>
Elaborado por <USUARIO JIRA> y Kiro
```

> **Ejemplo:** `Título: [FRONT] Un usuario bloqueado ingresa al catálogo en la pantalla de login`. `Severidad: Alta (High) — permite acceso a un usuario que no debería poder ingresar`. `Datos usados: locked_out_user (usuario público del sitio demo SauceDemo)`. En un proyecto real las credenciales no se escriben en el bug: van en variables de entorno.

Siguiente paso sugerido: al corregirse, `qa-reejecucion`.

## Reglas

- No crear el bug sin evidencia.
- El resultado esperado sale de la HU o de la documentación funcional; si no está documentado, decirlo.
- No inventar épica, versión ni test: usar lo que aporta el QA o lo que se confirma por JQL (el lenguaje de consultas de Jira).
- Severidad (QA) y criticidad (PO) son distintas; no confundirlas.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El bug no se crea con `issuetype = Bug` | El nombre del tipo en el proyecto es distinto, o el proyecto no lo tiene habilitado | Listar los tipos de incidencia del proyecto, confirmar con el QA cuál corresponde y usarlo. El tipo estándar de este playbook es `Bug` |
| La versión no existe | Nombre distinto en el proyecto | Listar con `getJiraProjectVersions` y confirmar |
| No hay test de Xray que vincular | El defecto se encontró fuera de un test | Crear el bug sin vínculo al test, vincularlo solo a la HU y al Test Plan, y avisar que no queda trazado a un test |

## Criterios de calidad

- Otro QA puede reproducir el bug solo con los pasos.
- Esperado y actual son distintos y verificables.
- No hay datos sensibles en el bug.

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Test falla con captura y JSON | Bug completo, vinculado con `Blocks` o `Relates` según severidad |
| 2 | Falta la evidencia | La pide y no crea nada |
| 3 | Existe un bug abierto igual | Lo muestra y pregunta antes de crear |
| 4 | El JSON trae un token | Lo quita del bug |
| 5 | El QA no confirma | No crea nada |
