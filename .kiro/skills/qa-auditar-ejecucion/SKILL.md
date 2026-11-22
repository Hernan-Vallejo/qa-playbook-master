---
name: qa-auditar-ejecucion
description: Audita el resultado de una ejecución de pruebas - por cada caso marcado PASS (manual o automatizado) verifica con la evidencia que el resultado esperado se validó de verdad, y clasifica en PASS validado, falso PASS, no cubierto, inconcluso, falta evidencia, oráculo sin resolver o conflicto caso-spec. Usar cuando el QA o un agente pide "auditá la ejecución", "¿los PASS son reales?", "revisá la evidencia", "EJECUTAR" del flujo SDD, o antes del cierre de una HU con tests automatizados. No ejecuta tests ni los repara (skill de reparación del framework de automatización).
---
# Auditoría de la ejecución

> **Para qué sirve:** comprobar que cada caso que figura como PASS realmente validó su resultado esperado, mirando la evidencia (capturas, respuestas, reportes) y, si el caso está automatizado, el código del test.
> **Quién lo usa:** cualquier QA, el agente `qa-maestro` (modo `AUDITAR_EJECUCION`) y el agente `qa-sdd` como parte del modo `EJECUTAR` del flujo SDD.
> **Cuándo se usa:** después de ejecutar los casos de una historia de usuario (HU) y antes de cerrarla, o cuando hay dudas sobre un resultado automatizado.

> **Nota:** **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) es la forma de trabajo en la que desarrollo escribe antes una spec revisable (`requirement.md`, `design.md`, `tasks.md`); el Equipo Delta trabaja así. El **runner** es el programa que ejecuta los tests (por ejemplo Playwright). Un **oráculo** es la fuente que dice cuál es el resultado correcto de un caso. **Xray** es la herramienta de Jira donde se registran las Test Executions (las corridas de un conjunto de casos con el estado de cada uno).

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Auditoría de la ejecución |
| Archivos en `.qa-work/<CLAVE-HU>/` | Lee `04-casos.md` y `05-carga-xray.md`. Escribe `10-auditoria-ejecucion.md` |

> **Nota:** `<CLAVE-HU>` es la clave de la historia en Jira, por ejemplo `PROJ-142`. `.qa-work/` es la carpeta de trabajo local donde los agentes guardan sus borradores (cada archivo pasa por los estados Borrador, Aprobado y Publicado). `05-carga-xray.md` registra qué casos se cargaron en Xray.

## Propósito

Que un PASS signifique que el criterio se cumple. **Un PASS del runner no es un PASS validado**: el test puede pasar sin verificar el resultado esperado, verificando otra cosa o sin evidencia.

> **Ejemplo:** el caso `PROJ-142-CP02` espera que, al consultar un pedido en estado "Enviado", la pantalla muestre el texto "Enviado". Un test que solo comprueba que la página cargó (sin mirar el texto) pasa en verde, pero no validó nada: es un falso PASS.

## Cuándo usarla

- Después de ejecutar los casos de una HU, antes del cierre.
- En el flujo SDD, siempre como parte de `EJECUTAR`.
- En cualquier equipo, cuando el QA duda de un resultado automatizado.

## Cuándo no usarla

- Para ejecutar tests: los ejecuta el QA, el pipeline de CI (por ejemplo GitHub Actions) o el agente `qa-automation`.
- Para reparar un test que falla → la skill de reparación del framework de automatización que use el equipo (máximo 2 intentos, ver `00-introduccion/kiro/contratos.md`, sección 9.9).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU | Sí | Pedirla |
| Test Execution de Xray | Sí | Buscarla vinculada a la HU y confirmarla |
| Evidencia | Sí | Reporte del framework (por ejemplo el reporte HTML de Playwright), capturas, respuestas o consultas. Pedir dónde está |
| Código de los tests automatizados | No | Si hay automatizados, pedir el repositorio o usar el del workspace (por ejemplo `plantilla-automation/`) |

## Contexto que lee

1. Casos aprobados (`04-casos.md`) y su resultado esperado.
2. Steering `qa-sdd` si la HU es de un equipo SDD (jerarquía de verdad).
3. Steering del framework, si hay automatizados: para la plantilla Playwright, `plantilla-automation/.kiro/steering/pw-proyecto.md` (estructura y comandos) y `pw-code-review.md` (qué debe tener una aserción). Si el equipo sumó un catálogo `pw-troubleshooting.md` (contratos, sección 9.3), consultarlo para los errores conocidos.

> **Nota:** la **jerarquía de verdad** es el orden de autoridad entre las fuentes cuando se contradicen: HU de Jira, luego requirement, luego design, luego tasks.

## Herramientas MCP

> **Nota:** **MCP** (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a sistemas externos. Acá se usan `@atlassian` (Jira y Xray) y `@github` (repositorio). Consultar la base de QA para confirmar un resultado depende de que el equipo tenga un servidor MCP de base de datos configurado.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue` y las herramientas de lectura de Xray (tests, Test Executions, consultas GraphQL de lectura) del servidor `@atlassian`; lectura de archivos del repositorio (`@github`); consulta SQL de solo lectura (SELECT) a la base de QA `tienda_qa`, solo para confirmar un resultado, si hay servidor MCP configurado |
| Escritura (solo después de la confirmación) | `addOrEditJiraIssueComment` (`@atlassian`); actualización del estado de un test en la Test Execution con las herramientas de Xray |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md`.
1. **Ejecución.** Leer la Test Execution: tests, estado de cada uno y evidencias adjuntas.
2. **Por cada PASS**, comparar el resultado esperado del caso con lo que se verificó:
   - Automatizado: el test verifica el mismo observable del caso (status, campo, mensaje, estado en base, elemento en pantalla) y no uno parecido. Las verificaciones no están comentadas, vacías ni reemplazadas por un log.
   - Manual: la evidencia muestra el resultado esperado.
3. **Por cada FAIL**, confirmar que tiene bug vinculado o clasificarlo como problema del test, del dato o del ambiente.
4. **Clasificar** cada caso con la tabla de abajo.
5. **[PUNTO DE CONTROL] Auditoría de la ejecución · esperando tu confirmación.** Mostrar el entregable y guardarlo en `10-auditoria-ejecucion.md` (Borrador). Esperar.
6. Si el QA lo confirma: corregir en Xray el estado de los falsos PASS, publicar el resumen en la HU (si es de un equipo SDD, en la subtarea `[QA] Ejecución de test cases`) y sugerir `REPORTAR_BUG` o la reparación del test. Cada acción se confirma por separado.

> **Nota:** un **observable** es lo que se puede ver o medir para comprobar un resultado: el código de respuesta de un endpoint, el texto de un mensaje, el valor de un campo, el estado de un registro en la base o un elemento visible en pantalla. `REPORTAR_BUG` es el comando del agente que redacta un bug con su evidencia (se crea solo con aprobación del QA).

### Clasificación

> **Nota:** estos siete códigos son la definición oficial del playbook. Los demás archivos (agentes `qa-maestro` y `qa-sdd`, steering `qa-sdd`) los citan con estos mismos nombres; no se traducen ni se crean otros. El nombre en español es solo una ayuda para leerlos.

| Estado | En español | Cuándo |
| :--- | :--- | :--- |
| `VALIDATED_PASS` | PASS validado | El resultado esperado se verificó y hay evidencia |
| `FALSE_PASS` | Falso PASS | Pasó sin verificar el resultado esperado o verificando otra cosa |
| `NOT_COVERED` | No cubierto | Parte del resultado esperado no se verificó |
| `INCONCLUSIVE` | Inconcluso | La evidencia no alcanza para decidir |
| `EVIDENCE_REQUIRED` | Falta evidencia | No hay evidencia |
| `ORACLE_UNRESOLVED` | Oráculo sin resolver | El resultado esperado no está definido con precisión en el caso ni en la spec |
| `TC_SPEC_CONFLICT` | Conflicto caso-spec | El caso y la spec (o la HU) esperan cosas distintas |

Un caso que no es `VALIDATED_PASS` no se da por validado: queda pendiente de la acción propuesta (corregir el test, reportar un bug, aportar evidencia o aclarar con el PO) antes de cerrar la HU.

> **Nota:** `TC_SPEC_CONFLICT` abrevia *Test Case vs Spec conflict*: el caso de prueba y la spec esperan resultados distintos.

## Punto de confirmación

Mostrar la tabla de clasificación y la lista exacta de acciones (estados a corregir en Xray, comentario, bugs sugeridos). "¿Aprobás la auditoría, ajustamos algún caso o la dejamos acá?"

> **Nota:** un punto de control se presenta con la marca `[PUNTO DE CONTROL] Auditoría de la ejecución · esperando tu confirmación`. Hasta que el QA responda, el agente no cambia nada en Xray ni en Jira.

## Entregable

El archivo `10-auditoria-ejecucion.md` tiene esta estructura. Hay una fila por cada test de la Test Execution.

```text
Auditoría de la ejecución - <CLAVE-HU> · <Test Execution>
PASS en el runner: <n> · VALIDATED_PASS <n> · FALSE_PASS <n> · NOT_COVERED <n> · INCONCLUSIVE <n> · EVIDENCE_REQUIRED <n> · ORACLE_UNRESOLVED <n> · TC_SPEC_CONFLICT <n>

| Test | Caso | Estado runner | Resultado esperado | Qué se verificó | Evidencia | Clasificación | Acción |

Acciones propuestas
- Xray: <test> PASS → <estado> (motivo)
- Bug sugerido: ...
- Reparar test: <test> - <qué falta verificar>
- Aclarar con PO o Desarrollo: ...
```

> **Nota:** **PO** es el Product Owner (responsable del producto). La columna "Qué se verificó" describe lo que el test o la evidencia comprueban en la realidad, aunque sea distinto de lo que el caso esperaba; la comparación entre las dos columnas es el núcleo de la auditoría.

## Reglas

- No se marca nada como validado sin evidencia.
- Un `FALSE_PASS` no se corrige ajustando el resultado esperado: se corrige el test o se reporta un bug.
- Un `TC_SPEC_CONFLICT` se resuelve con la jerarquía de verdad (HU > requirement > design > tasks) y se informa; no se elige en silencio.
- Reparar un test sigue la regla de 2 intentos (`00-introduccion/kiro/contratos.md`, sección 9.9).
- No se cambia el estado en Xray sin confirmación.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El reporte del framework no coincide con la Test Execution | La ejecución se importó de otra corrida | Pedir al QA la corrida correcta |
| Test automatizado con la verificación en un `try/catch` que solo loguea | Error silenciado | `FALSE_PASS` |

## Criterios de calidad

- Cada PASS tiene clasificación y motivo.
- Cada acción propuesta es concreta: test, estado y motivo.

## Casos de aceptación

Son los escenarios con los que se verifica que la skill se comporta como se espera.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Test que verifica solo el status 200 y el caso espera un estado en base | `NOT_COVERED` |
| 2 | Test sin verificaciones | `FALSE_PASS` |
| 3 | Caso manual sin evidencia | `EVIDENCE_REQUIRED` |
| 4 | El caso espera un mensaje distinto al del design | `TC_SPEC_CONFLICT` |
| 5 | El QA no confirma | No se cambia nada en Xray ni en Jira |
