---
name: qa-cierre-hu
description: Evalúa el cierre de QA de una HU - estado de las ejecuciones en Xray, bugs abiertos, evidencias, regresión recomendada y DoD - da el resultado (Finalizada sin pendientes, con bug menor aceptado o con bug pendiente) y propone el comentario de cierre, la transición de la subtarea de ejecución y la actualización de riesgos del Test Plan. Usar cuando el QA pide "cerrá la HU", "CIERRE_HU", "STATUS_POST_TESTING", "QUALITY_GATE", "¿puedo cerrar la HU?".
---
# Cierre de HU

> **Para qué sirve:** Decide con evidencia si una HU (Historia de Usuario) cumple el DoD de QA y deja el cierre documentado en Jira: resultado, comentario, transiciones y riesgos del Test Plan.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta, y el agente de Kiro que lo asiste.
> **Cuándo se usa:** Al terminar de ejecutar los tests de una HU, incluidas las re-ejecuciones (`qa-reejecucion`).

> **Nota:** DoD (*Definition of Done*) es la lista de condiciones que una HU debe cumplir para darse por terminada desde QA: `01-estandares-globales/definicion-dor-dod.md`. Un *punto de control* es el momento en que Kiro se detiene y espera tu confirmación antes de escribir en Jira.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.2 |
| Puntos de control | Cierre |
| Archivos en `.qa-work/<CLAVE-HU>/` | `07-cierre.md`, `indice.md` |

> **Nota:** `.qa-work/<CLAVE-HU>/` (por ejemplo `.qa-work/PROJ-123/`) es la carpeta de trabajo de la HU. `07-cierre.md` pasa por los estados *Borrador*, *Aprobado* y *Publicado*.

## Propósito

Decidir con evidencia si la HU cumple el DoD de QA y dejar el cierre documentado en Jira.

## Cuándo usarla

- Al terminar de ejecutar los tests de una HU (incluidas las re-ejecuciones).

## Cuándo no usarla

- Para cerrar el sprint → `qa-informe-sprint`.
- Si todavía hay tests sin ejecutar y el QA solo quiere el avance → `ESTADO` de `qa-maestro` (el agente coordinador de QA).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU o de su subtarea de ejecución | Sí | Pedirla |
| Acuerdos con el PO sobre bugs menores | No | Buscarlos en los comentarios del bug y confirmarlos con el QA |

> **Nota:** PO es el Product Owner, la persona responsable de la HU desde el lado del negocio. Un "acuerdo" es, por ejemplo, un comentario del PO en el bug que dice que se puede salir a producción con ese defecto menor.

## Contexto que lee

1. DoD: `01-estandares-globales/definicion-dor-dod.md`.
2. Perfil del equipo (`05-equipos/<equipo>.md`): subtareas QA.
3. `.qa-work/<CLAVE-HU>/`: análisis (`02-analisis.md`: regresión recomendada y línea `Performance`), casos y carga.
4. Plan de pruebas de performance (`03-qa-automatizacion/plan-pruebas-performance.md`), solo si el análisis dice `Performance: aplica`.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Esta skill usa `@atlassian` para Jira y Xray. No usa `@github`.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `atlassianUserInfo`, `getJiraIssue` (view `evidence`), `searchJiraIssuesUsingJql`, `listJiraIssueComments`, `listJiraIssueRemoteIssueLinks` (con `executeRead`), consultas GraphQL de Xray |
| Escritura (solo después de la confirmación) | `@atlassian`: `addOrEditJiraIssueComment`, `transitionJiraIssue`, `editJiraIssue` (sección Riesgos del Test Plan) |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md`.
1. **Ejecuciones.** Todas las Test Executions vinculadas a la HU (incluidas `#2`, `#3`). Estado consolidado por test con GraphQL de Xray: la última ejecución de cada test es la que vale. Registrar también el estado de cada Test Execution en Jira y cuántos de sus tests siguen en TO DO o EXECUTING. Si existe `.qa-work/<CLAVE-HU>/10-auditoria-ejecucion.md` (skill `qa-auditar-ejecucion`), un test con `FALSE_PASS` abierto no cuenta como Passed: se informa aparte.
2. **Cobertura de criterios.** Cruzar los criterios de aceptación con los tests (matriz de `03-matriz-cobertura.md` si existe). Marcar CA sin test ejecutado en PASS.
3. **Bugs** vinculados a la HU o a sus tests: estado y severidad. Para los de severidad baja abiertos, buscar el acuerdo con el PO.
4. **Evidencias.** Verificar el enlace web en la HU y los comentarios de evidencia en el Test Set y la Test Execution.
5. **Regresión.** Comparar la regresión recomendada del análisis con lo ejecutado.
5b. **Vinculadas abiertas.** Revisar los vínculos de la HU y sus subtareas QA. Bloquean el cierre, según la lista de "Vinculadas que bloquean". Una vinculada bloqueante se informa y no se propone cerrar la HU hasta resolverla.
5c. **Performance.** Leer la línea `Performance` del análisis (comentario en la HU o `02-analisis.md`). Si dice `no aplica`, anotar N/A. Si dice `aplica`, verificar que exista el informe final de la prueba (tarea `AUTO` vinculada al pedido) con su severidad: Baja cumple; Media cumple solo con la aceptación del riesgo documentada del PO, el analista funcional y el TL; Alta no cumple el DoD; sin informe o sin severidad, no cumple. Si el análisis no tiene la línea `Performance`, informarlo como dato faltante y no suponer.
6. **Resultado** según el DoD:
   - **Finalizada sin pendientes:** todo en PASS, sin bugs abiertos, evidencias completas.
   - **Finalizada con bug menor aceptado:** bugs bajos abiertos con acuerdo del PO documentado.
   - **Finalizada con bug pendiente:** tests Failed o Blocked, bugs sin acuerdo, CA sin cubrir, evidencias faltantes, performance sin informe o con severidad Alta (o Media sin aceptación) o **vinculadas bloqueantes abiertas**. No cumple el DoD.

> **Nota:** "Finalizada" en el nombre del resultado se refiere a que QA terminó su trabajo de ejecución. No significa que la HU esté libre de problemas: eso lo dice el resultado completo. Los nombres de estados de Jira (Por hacer, En curso, Finalizada) son los del workflow del equipo; si tu proyecto los llama distinto, usá los equivalentes.

### Vinculadas que bloquean el cierre

| Vinculada | ¿Bloquea? |
| :--- | :--- |
| Test Set | Solo si no está en Finalizada |
| Test Execution | Si no está en Finalizada, salvo que sea una re-ejecución ya cubierta por otra ejecución posterior |
| Bug Bloqueante (Highest) o Alta (High) | Sí (lo cubre también el DoD) |
| Subtarea QA, salvo la subtarea de ejecución que este mismo cierre propone pasar a Finalizada | Sí |
| Bug de severidad baja | No: se resuelve con el acuerdo del PO (resultado "Finalizada con bug menor aceptado") |

Una HU con una vinculada bloqueante abierta no se cierra: se lista la vinculada y qué falta para cerrarla.

7. **[PUNTO DE CONTROL] Cierre · esperando tu confirmación.** Mostrar el resultado (Entregable) y guardarlo en `07-cierre.md` (Borrador). Proponer por separado:
   - Comentario de cierre en la HU.
   - Transición de cada Test Execution de la HU (la original y las re-ejecuciones) a **Finalizada** cuando su ejecución terminó, es decir, ninguno de sus tests está en TO DO o EXECUTING. Si está en Por hacer, pasar primero por En curso: el workflow no permite ir directo. Finalizada indica que la ejecución terminó, no que los tests pasaron: aplica también si hubo Failed y el resultado es "Finalizada con bug pendiente". Los tests Blocked se informan y se resuelven con una re-ejecución.
   - Transición de la subtarea de ejecución a Finalizada (solo si el resultado es "Finalizada sin pendientes" o "Finalizada con bug menor aceptado").
   - Cambio de estado de los riesgos del Test Plan relacionados con la HU (Mitigado, Materializado, Cerrado).

   Esperar la confirmación de cada acción. No proponer la transición de la HU: la mueve el equipo.
8. **Publicar** lo confirmado. Pasar `07-cierre.md` a Publicado y actualizar `indice.md`.
9. Si el análisis o la ejecución revelaron reglas o comportamientos no documentados, sugerir `qa-actualizar-contexto`.

> **Nota:** en el Test Plan, "Mitigado" significa que el riesgo ya no amenaza porque las pruebas lo cubrieron; "Materializado" significa que el riesgo ocurrió (por ejemplo, apareció un bug); "Cerrado" significa que ya no corresponde seguirlo.

## Entregable

> **Nota:** es el comentario de cierre que Kiro propone y guarda en `07-cierre.md`. Los asteriscos marcan negrita en el formato de Jira. Los valores entre `<>` se reemplazan con datos reales. En los puntos del DoD se responde Sí, No o N/A (no aplica); en la regresión también se admite Parcial.

```text
*Cierre QA — <CLAVE-HU>*
*Resultado:* Finalizada sin pendientes | Finalizada con bug menor aceptado | Finalizada con bug pendiente

*Ejecución*
- Tests: <total> | Passed <n> | Failed <n> | Blocked <n> | No ejecutados <n>
- Test Executions: <claves con su estado en Jira, incluidas re-ejecuciones>

*Criterios de aceptación:* <n de n cubiertos>; sin cubrir: <lista>
*Vinculadas:* Test Sets <estado> · Test Executions <estado> · subtareas QA <estado> — bloqueantes abiertas: <lista o ninguna>
*Bugs:* <clave, severidad, estado, acuerdo con PO>
*Regresión:* recomendada <tipo> — ejecutada <sí/parcial/no>
*Evidencias:* <link> (HU / Test Set / Test Execution)

*DoD de QA*
- Cobertura 100 % de CA: Sí/No
- Sin bugs Bloqueantes (Highest) o Altos (High) abiertos: Sí/No
- Evidencias registradas: Sí/No
- Regresión recomendada ejecutada: Sí/No/Parcial
- Automatización marcada en los tests: Sí/No
- Bugs bajos acordados con el PO: Sí/No/N/A
- Performance (si la decisión fue "aplica"): informe final con severidad aceptable: Sí/No/N/A

*Siguientes pasos:* <acciones>
Elaborado por <USUARIO JIRA> y Kiro
```

> **Ejemplo:** `PROJ-123` con 8 tests Passed, un bug Bajo (Low) abierto `PROJ-340` con comentario del PO que acepta salir así, evidencias registradas y regresión puntual ejecutada: resultado "Finalizada con bug menor aceptado".

## Reglas

- Basarse solo en evidencia de Jira y Xray. Si un dato no está, decirlo.
- La última ejecución de cada test es la que vale.
- Un acuerdo con el PO cuenta solo si está documentado.
- No reabrir una Test Execution Finalizada: un re-test va en una Test Execution nueva (`#N`, `qa-reejecucion`).
- No proponer el cierre de una HU con una vinculada bloqueante abierta (ver la tabla).

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El conteo por JQL no coincide con el del Test Plan | Los JQL de tipo `testPlanTests` dan números erróneos | Calcular el estado consolidado con GraphQL de Xray y, si se usa JQL, contrastarlo con el Test Plan (steering `qa-jira-xray`) |
| No hay transición a Finalizada para la Test Execution | Está en Por hacer y el workflow no permite ir directo | Pasar primero por En curso. Buscar las transiciones por nombre con `listJiraIssueTransitions` |
| Una HU parece sin evidencias | El link está solo en un lugar de los cuatro | Listar cuáles faltan (HU, test-run, Test Set, Test Execution) y proponer completarlos con `qa-carga-xray` |

## Criterios de calidad

- El resultado sale solo de evidencia de Jira y Xray, y cada dato lleva su clave con link.
- Cada criterio incumplido del DoD se lista con qué falta para cumplirlo.
- Cada acción propuesta (comentario, transición, riesgos) se confirma por separado.
- No se propone ninguna transición de la HU.

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Todo en PASS y evidencias completas | "Finalizada sin pendientes" y propone cerrar la subtarea |
| 2 | Test fallido en `#1` y PASS en `#2` | Cuenta el PASS de `#2` |
| 3 | Bug bajo abierto sin acuerdo documentado | "Finalizada con bug pendiente" y lo explica |
| 4 | Falta el link de evidencias | "Finalizada con bug pendiente" por evidencias y lo indica |
| 5 | El QA no confirma | No publica ni transiciona |
| 6 | Todos los tests ejecutados y la Test Execution sigue en Por hacer | Propone En curso y luego Finalizada, en ese orden |
| 7 | Una Test Execution con un test en TO DO | No propone Finalizada para esa ejecución y lo informa |
| 8 | Test Execution con Failed y re-ejecución `#2` creada | La original queda Finalizada; el resultado sale de la última ejecución de cada test |
| 9 | HU con una subtarea QA abierta | "Finalizada con bug pendiente" por vinculada bloqueante; la lista y no propone cerrar |
| 10 | HU con el Test Set aún en Por hacer | "Finalizada con bug pendiente" por vinculada bloqueante; propone finalizar el Test Set primero |
| 11 | HU con un bug Bajo (Low) abierto acordado con el PO | No bloquea: resultado "Finalizada con bug menor aceptado" |
| 12 | El análisis dice `Performance: aplica` y no hay informe final | "Finalizada con bug pendiente" por performance; lo lista y no propone cerrar |
| 13 | El análisis dice `Performance: no aplica` | La línea de performance del DoD queda en N/A y no bloquea |
