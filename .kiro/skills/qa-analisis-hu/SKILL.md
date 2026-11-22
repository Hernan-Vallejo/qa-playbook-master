---
name: qa-analisis-hu
description: Analiza una Historia de Usuario (HU) de Jira desde QA - readiness (DoR), riesgos, impacto, regresión, prueba integral, decisión de performance y cobertura existente en Xray - y propone el comentario de análisis. Usar cuando el QA pide "analizá la HU", "ANALIZAR_HU", "revisá si la HU está lista", "qué riesgos tiene", "qué impacto o regresión necesita". No usar para escribir casos (qa-diseno-casos) ni para cargar en Xray (qa-carga-xray).
---
# Análisis de HU

> **Para qué sirve:** Determina si una Historia de Usuario (HU, la descripción de una funcionalidad desde el punto de vista de quien la usa) está lista para que QA la pruebe, y qué riesgos, impacto, regresión y cobertura existente tiene, antes de diseñar los casos.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta que toma una HU nueva, y el agente de Kiro que lo asiste.
> **Cuándo se usa:** Al tomar una HU del sprint (por ejemplo `PROJ-123`), o cuando cambia el alcance de una HU ya analizada. Es el primer paso del flujo de una HU y va antes de `qa-diseno-casos`.

> **Nota:** una *skill* es una tarea que se repite y que Kiro sabe ejecutar siguiendo un procedimiento fijo. Este archivo es ese procedimiento. Un *punto de control* es el momento en que Kiro se detiene, te muestra lo que preparó y espera tu confirmación antes de seguir o de escribir en Jira.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.1 |
| Puntos de control | Contexto, Análisis |
| Archivos en `.qa-work/<CLAVE-HU>/` | `01-contexto.md`, `02-analisis.md` |

> **Nota:** `.qa-work/<CLAVE-HU>/` es la carpeta de trabajo de la HU (por ejemplo `.qa-work/PROJ-123/`). Ahí Kiro guarda cada entregable con un estado: *Borrador* (recién generado), *Aprobado* (lo confirmaste) y *Publicado* (ya está escrito en Jira, con la clave del comentario). El detalle de esta convención está en `00-introduccion/kiro/contratos.md`.

## Propósito

Determinar si la HU está lista para QA, qué riesgos e impacto tiene, qué regresión e integración necesita y qué cobertura existe, para que el QA decida antes de diseñar casos.

## Cuándo usarla

- Al tomar una HU nueva o la subtarea de definición de casos.
- Cuando cambia el alcance de una HU ya analizada.
- Cuando el QA quiere solo el foco de riesgo, impacto, regresión o integración.

## Cuándo no usarla

- Para escribir los escenarios → `qa-diseno-casos`.
- Para evaluar una HU ya probada → `qa-cierre-hu`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU o de una subtarea QA | Sí | Pedirla. Si es una subtarea, usar la HU padre |
| Equipo | Sí | Deducirlo de la etiqueta o el componente de la HU (`alfa`, `beta`, `gamma`, `delta`) y confirmarlo |
| Profundidad | No | Estándar. Rápido analiza solo las HU relacionadas que la HU cita |
| Foco | No | Análisis completo. Opciones: riesgo, impacto, regresión, integral, cambio de alcance |
| Swagger actualizado | No | Usar la documentación guardada y avisar su fecha |

> **Nota:** Swagger (u OpenAPI) es la documentación de la API: lista los endpoints, los campos y los códigos de respuesta. Sirve para contrastar lo que dice la HU con lo que el back realmente expone.

## Contexto que lee

1. Perfil del equipo: `05-equipos/<equipo>.md` (por ejemplo `05-equipos/alfa.md`).
2. Documentación funcional: **todos** los archivos de las carpetas de `04-funcionalidades/` que indica el perfil.
3. DoR (*Definition of Ready*, la lista de condiciones que una HU debe cumplir para poder empezar a probarse): `01-estandares-globales/definicion-dor-dod.md`.
4. Criterios de análisis: [referencia-analisis.md](./referencia-analisis.md).
5. Disparadores de performance: sección 4 ("Cuándo corresponde una prueba de performance") de `03-qa-automatizacion/plan-pruebas-performance.md` y el motor de performance de la [referencia de análisis](./referencia-analisis.md).
6. Usuario de la sesión de Jira: `atlassianUserInfo`.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Acá se usa el servidor `@atlassian` para Jira y Xray, y `@figma` (opcional) para leer diseños. Esta skill no necesita `@github`. Los nombres de herramientas de la tabla son las que expone cada servidor; las operaciones de Xray dependen de cómo tenga configurado `@atlassian` el equipo.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `atlassianUserInfo`, `getJiraIssue` (view `evidence`), `searchJiraIssuesUsingJql`, `listJiraIssueComments`, consulta de tests y de Test Sets y Test Executions de Xray. `@figma`: lectura de un nodo de diseño (si hay link de Figma) |
| Escritura (solo después de la confirmación) | `@atlassian`: `addOrEditJiraIssueComment`, `editJiraIssue` (campo QA Análisis y sección Riesgos del Test Plan) |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/` e `indice.md` (el índice de entregables de la HU); crearlos si faltan (ver `00-introduccion/kiro/contratos.md`, sección 3.5). Si ya existen `01-contexto.md` o `02-analisis.md`, leerlos para mostrarlos en el paso 2.
1. **HU.** Leer la HU con view `evidence`: summary (el título), descripción (objetivo, contexto, alcance, narrativa, criterios de aceptación), campo "Estrategia de testing", campo "Requiere pruebas de testing", QA Análisis, sprint, épica, subtareas, vínculos y comentarios.
2. **[PUNTO DE CONTROL] Contexto · esperando tu confirmación.** Mostrar en pocas líneas: HU, equipo, Test Plan del sprint (si no existe, avisar que lo crea el agente `qa-sprint` con el modo `INICIO_SPRINT`, que usa la skill `qa-inicio-sprint`; si se trabaja con el agente `qa-maestro`, él ya se detuvo antes), carpetas funcionales encontradas, si hay Figma, si ya tiene Test Set o Test Execution vinculados, fecha de la documentación de contrato, profundidad y trabajo previo en `.qa-work/`. Si hay un análisis previo y la HU no cambió desde entonces, ofrecer reutilizarlo en lugar de rehacerlo; si la HU cambió, avisarlo. Preguntar si hubo cambios de contrato o si hay un Swagger nuevo. Esperar la respuesta y guardar `01-contexto.md` (Aprobado).
3. **Documentación funcional.** Leer los documentos de las carpetas del perfil. Usar solo lo relevante para la HU.
4. **HU relacionadas y bugs.** Buscar por JQL (el lenguaje de consultas de Jira) en el proyecto del equipo: HU de la misma épica, HU citadas en la descripción o en "Estrategia de testing", y bugs (`issuetype = Bug`) del módulo. Profundidad Rápido: solo las citadas.
5. **Cobertura existente en Xray.** Consultar los Test Sets y Test Executions vinculados a la HU y los tests de las HU relacionadas. Identificar qué ya está cubierto, qué tests quedarían desactualizados y qué gaps hay (condiciones sin ningún test).
6. **Contrato.** Contrastar los criterios de aceptación con el contrato documentado (BFF y BACK). Marcar campos, códigos o transformaciones inconsistentes entre capas.
7. **Evaluar** con la [referencia de análisis](./referencia-analisis.md): tipo de cambio, DoR, riesgos, impacto, regresión, integración y performance (decisión según el motor de performance; buscar en los vínculos de la HU y por JQL en el proyecto del equipo un pedido de performance existente).
8. **[PUNTO DE CONTROL] Análisis · esperando tu confirmación.** Mostrar el análisis con el formato del Entregable y guardarlo en `02-analisis.md` (Borrador).
9. **Punto de confirmación** (ver abajo). Escribir solo lo que el QA confirme. Al aprobar, pasar `02-analisis.md` a Aprobado; al publicar, a Publicado con la clave del comentario. Actualizar `indice.md`.

> **Nota:** BFF (*Backend For Frontend*) es la capa intermedia que adapta los datos del back a lo que necesita la pantalla. BACK es el servicio que guarda y procesa los datos. En la Tienda Demo, por ejemplo, el BFF arma la lista del catálogo y el BACK es dueño de productos y pedidos.

## Punto de confirmación

Mostrar:

- El comentario que se publicaría en la HU, con el formato del steering `qa-jira-xray` y la firma.
- El valor propuesto para QA Análisis y el valor actual. Sale de la conclusión: Ready → `REVISADO_OK`; Parcialmente Ready o No Ready → `REVISADO_NOOK` (tabla "Resultado del análisis" de `01-estandares-globales/definicion-dor-dod.md`).
- Si hay riesgos de nivel Alto o Medio: las filas propuestas para la tabla de Riesgos del Test Plan del sprint (reglas en `02-qa-funcional/estructura-test-plan.md`).

Cerrar con: "¿Publico el comentario, actualizo QA Análisis, agrego los riesgos al Test Plan, ajustamos algo o lo dejamos acá?". Cada acción se confirma por separado.

## Entregable

> **Nota:** el entregable es el texto que Kiro te muestra y guarda en `02-analisis.md`. Cada bloque responde una pregunta del QA: qué cambia, si está lista, qué puede salir mal, qué ya está probado, qué regresión hace falta, si hay que probar de punta a punta y si hace falta performance. Los valores entre `<>` se reemplazan con datos reales.

```text
Análisis
- Tipo de cambio: <Front | BFF | Back | Integración | ...>
- Contexto: <qué cambia y para quién>

Conclusión
- Estado: Ready | Parcialmente Ready | No Ready
- Motivo / Faltantes / Riesgo de avanzar

Observaciones QA
- Inconsistencias (incluye contrato BFF-BACK)
- Dependencias
- Preguntas para PO o Desarrollo      (PO = Product Owner, responsable de la HU)

Riesgos
- Alto / Medio / Bajo: <riesgo> — <justificación>

Cobertura existente
- Tests y sets que ya cubren la funcionalidad (claves con link)
- Tests que quedarían desactualizados
- Gaps

Regresión recomendada
- Tipo: No requerida | Puntual | Focalizada | Cross-module | Amplia
- Qué probar, prioridad P0-P3 y motivo (recomendada, no ejecutada)

Prueba integral
- Requerida / No requerida — justificación

Performance
- Performance: aplica (O-x / R-x) | no aplica — justificación con evidencia
- Pedido: <clave con link> | sin pedido (lo crea el TL del equipo al menos 2 sprints antes del release)

Fuentes
- Verificadas: ...
- INFORMACIÓN INSUFICIENTE: ...

QA Análisis propuesto: REVISADO_OK | REVISADO_NOOK
```

> **Ejemplo:** para `PROJ-123` "Login con usuario válido", un riesgo Alto sería "El bloqueo de usuarios (`locked_out_user`) comparte validación con el login: un cambio puede dejar entrar a un usuario bloqueado". TL es el *Tech Lead* (líder técnico) del equipo. Los códigos O-x y R-x son los disparadores obligatorios (O-1 a O-6) y recomendados (R-1 a R-5) de performance que define la sección 4 de `03-qa-automatizacion/plan-pruebas-performance.md`.

Siguiente paso sugerido: `qa-diseno-casos`.

## Reglas

- Si la HU no tiene "Requiere pruebas de testing" = Sí, avisarlo antes de analizar.
- No generar casos de prueba en esta skill.
- Toda recomendación de regresión o integración debe citar la evidencia (HU, bug, endpoint o regla compartida).
- Si una fuente no se pudo verificar, decirlo en "Fuentes". No presentar el análisis como completo.
- Si la HU ya tiene QA Análisis distinto de `NO_REVISADO`, mostrar el valor actual y preguntar antes de cambiarlo.
- Todo análisis lleva la línea `Performance: aplica / no aplica` con su justificación (DoR, punto 7). Sin evidencia, no se marca "no aplica": se pregunta.
- La skill no crea el pedido de performance: lo crea el TL (*Tech Lead*, líder técnico del equipo). Ofrece un borrador con la planilla de la sección 12.1 (Anexo A) de `03-qa-automatizacion/plan-pruebas-performance.md` y espera la confirmación del QA.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| JQL con `issuetype = Historia` falla | Según la configuración del Jira, los tipos de incidencia en JQL se escriben en inglés | Usar `issuetype = Story` |
| No se puede abrir el Swagger | El documento no es accesible desde la sesión (red restringida, VPN, permisos) | Usar la documentación de `04-funcionalidades/` y avisar su fecha |
| La HU es una subtarea | El QA pasó la clave de su subtarea | Leer el campo `parent` y analizar la HU |

## Criterios de calidad

- Cada riesgo tiene nivel y justificación.
- La regresión distingue qué se recomienda de qué ya está cubierto.
- Las preguntas son concretas y accionables por el PO o Desarrollo.
- Las claves de Jira y Xray van con link.

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | HU con criterios claros y sin cobertura previa | Análisis completo, QA Análisis propuesto `REVISADO_OK` |
| 2 | HU con criterios ambiguos (ej. `PROJ-123`: criterios en viñetas sin resultado esperado) | Preguntas concretas, estado Parcialmente Ready o No Ready |
| 3 | HU que ya tiene Test Set y Test Execution vinculados (ej. `PROJ-123` con `PROJ-310` y `PROJ-312`) | Los muestra en Cobertura existente y no propone duplicarlos |
| 4 | Se pasa la clave de una subtarea QA | Analiza la HU padre |
| 5 | El QA no confirma la publicación | No escribe nada en Jira |
| 6 | HU que mueve el procesamiento de pagos del checkout a una infraestructura nueva | `Performance: aplica (O-x)`, con el disparador que corresponda según la tabla del plan de performance, y avisa que falta el pedido del TL |
| 7 | HU de cambio de texto sin impacto en el back | `Performance: no aplica` con la justificación |
| 8 | No hay evidencia para decidir (volumen o alcance desconocidos) | INFORMACIÓN INSUFICIENTE y pregunta al TL o a arquitectura |
| 9 | La HU aplica, existe el pedido y faltan menos de 2 sprints para el release | Lo informa como riesgo del release |
