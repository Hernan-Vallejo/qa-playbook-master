# Estructura de los Test Plans

> **Para qué sirve:** describe las secciones de los dos Test Plans que usan todos los equipos (el de sprint y el de regresión), quién completa cada sección y cómo se reemplazan los placeholders de las plantillas.
> **Quién lo usa:** el QA funcional responsable del Test Plan de su equipo y los agentes `qa-sprint` y `qa-regresion`.
> **Cuándo se usa:** al crear el Test Plan (al terminar la Planning del sprint o al preparar un release), al editarlo durante el sprint y al cerrarlo.

| Dato | Valor |
| :--- | :--- |
| Versión de las plantillas | 1.0 |
| Última actualización | 2026-10-28 |
| Plantillas | [`plantillas/test-plan-sprint.html`](./plantillas/test-plan-sprint.html), [`plantillas/test-plan-regresion.html`](./plantillas/test-plan-regresion.html) |

Un **Test Plan** es el documento que reúne el objetivo, el alcance, la estrategia, los riesgos y los resultados de un ciclo de pruebas. En Jira con Xray es un issue de tipo "Test Plan". Todos los equipos (Alfa, Beta, Gamma y Delta) usan la misma estructura. Lo que cambia entre equipos (proyecto, nombre, textos propios) sale del perfil del equipo en `05-equipos/`.

> **Nota:** las plantillas son archivos HTML autónomos: se pueden abrir en un navegador para ver el formato, y cada sección tiene un comentario HTML que explica cómo completarla. Los datos de ejemplo usan el proyecto `PROJ` y la HU `PROJ-123` del producto Tienda Demo.

---

## 1. Tipos de Test Plan

| Tipo | Cuándo | Cuántos | Lo crea |
| :--- | :--- | :--- | :--- |
| **Sprint** | Al terminar la Planning | Uno por equipo y sprint | Agente `qa-sprint`, modo `INICIO_SPRINT` |
| **Regresión** | Antes de una salida productiva o un release | Uno por release | Agente `qa-regresion`, modo `PREPARAR_REGRESION` |

El Test Plan del sprint es el centro del trabajo del sprint: los Test Sets, Test Executions, tests y bugs de cada HU se asocian a él a medida que avanza el sprint. `qa-maestro` no crea Test Plans: si no existe el del sprint, indica correr `qa-sprint`.

> **Ejemplo:** "Test Plan Sprint 12 - Equipo Alfa" y "Test Plan Regresión Release 2.4".

---

## 2. Test Plan del sprint

| # | Sección | Cómo se mantiene | Quién la completa |
| :--- | :--- | :--- | :--- |
| n/a | Panel: sprint, fechas, equipo, responsable | Al crear | `qa-inicio-sprint` |
| 1 | Objetivo | Al crear, con el objetivo del sprint de Jira | `qa-inicio-sprint` |
| 2 | Alcance, historias con su QA, equipo de QA y reparto | Al crear; se actualiza si cambia el reparto | `qa-inicio-sprint`, `qa-seguimiento-sprint` |
| 3 | Estrategia | Texto base + estrategia del equipo (perfil) | `qa-inicio-sprint` |
| 4 | Criterios de entrada y salida | Texto base | Plantilla |
| 5 | Pendientes del sprint anterior | Al crear | `qa-inicio-sprint` |
| 6.1 / 6.2 | Historias que requieren o no requieren QA | **Dinámica** (lista de Jira) | Se actualiza sola |
| 6.3 | Historias no planificadas | Al entrar una HU después de la Planning | `qa-seguimiento-sprint` |
| 7 | Tareas de QA | **Dinámica** | Se actualiza sola |
| 8.1 | Bugs del sprint | **Dinámica** | Se actualiza sola |
| 8.2 | Severidades y escalamiento | Texto base | Plantilla |
| 9 | Riesgos | **Tabla viva**: Nivel, Riesgo, Impacto, Mitigación, Estado | `qa-inicio-sprint`, `qa-seguimiento-sprint`, `qa-maestro` (al analizar una HU) |
| 10 | Ejecuciones | **Dinámica** | Se actualiza sola |
| 11 | Métricas | Links vivos durante el sprint; columna "Al cierre" con la API de Xray | `qa-informe-sprint` |
| 12 | Evidencias | Al crear | `qa-inicio-sprint` |
| 13 | Resumen del trabajo de QA | Al cierre | `qa-informe-sprint` |

Las secciones dinámicas son listas de Jira embebidas (por ejemplo con una búsqueda JQL, el lenguaje de consultas de Jira). No se editan: se actualizan solas.

Qué escribe Kiro y cuándo:

- **Al crear el plan** (`qa-inicio-sprint`): el panel y las secciones 1, 2, 3, 5, 9 y 12. Las secciones 11 y 13 quedan en "pendiente".
- **Durante el sprint** (`qa-seguimiento-sprint`, y `qa-maestro` para los riesgos): solo las secciones 2, 5, 6.3 y 9.
- **Al cerrar** (`qa-informe-sprint`): solo las secciones 11 y 13.

Las demás secciones (4, 6.1, 6.2, 7, 8, 10) son texto base o listas dinámicas y Kiro no las toca.

> **Nota:** en la plantilla HTML autónoma, las secciones dinámicas se representan con un bloque que muestra la búsqueda JQL que hay que pegar o embeber en Jira. Al volcar el plan a Jira, ese bloque se reemplaza por la lista viva.

### Nombre y campos

| Dato | Valor |
| :--- | :--- |
| Nombre | Patrón del perfil del equipo (ej. `Test Plan Sprint 12 - Equipo Alfa`) |
| Proyecto | `PROJ`, tipo de issue `Test Plan` |
| Etiquetas | Equipo (`alfa`, `beta`, `gamma` o `delta`) según el [catálogo de etiquetas](./catalogo-etiquetas.md). No se usa la etiqueta `test_plan` (catálogo, sección 5): el tipo de issue ya lo indica |
| Asignado | Responsable del plan según el perfil del equipo |
| Estado | En curso al crearlo; Finalizada al cerrar el sprint, con confirmación |

---

## 3. Test Plan de regresión

| # | Sección | Contenido |
| :--- | :--- | :--- |
| n/a | Panel | Release, fechas, Test Plan del sprint vinculado, responsable |
| 1 | Objetivo | Release y destino (PRE, preproducción, o PROD, producción) |
| 2 | Alcance | Épicas, iniciativa, historias del release (dinámica) y flujos incluidos o excluidos |
| 3 | Estrategia | Selección por **Regresión = Sí**; ejecución según **Automatizado** (SI: suite automatizada; NO: manual). Filtros JQL usados y cantidad de tests de cada conjunto |
| 4 | Criterios de entrada y salida | Texto base |
| 5 | Defectos | Bugs del release (dinámica), bugs diferidos acordados con el PO, severidades |
| 6 | Riesgos | Tabla viva: Nivel, Riesgo, Impacto, Mitigación, Estado |
| 7 | QA participantes | Integrantes y rol |
| 8 | Ejecuciones | Dinámica |
| 9 | Métricas | Igual que el sprint |
| 10 | Evidencias | Carpeta de regresión en el repositorio documental del equipo |
| 11 | Veredicto de release | GO / GO WITH RISKS / NO GO, al cierre |

Qué escribe Kiro y cuándo:

- **Al crear el plan** (`qa-preparar-regresion`): el panel y las secciones 1, 2, 3, 6, 7 y 10. Las secciones 9 y 11 quedan en "pendiente".
- **Al cerrar** (`qa-informe-regresion`): solo las secciones 5.2, 6, 9 y 11.
- El Test Plan de regresión lleva la etiqueta de Equipo, igual que el del sprint, y el nombre sigue el patrón del perfil (por ejemplo `Test Plan Regresión Release 2.4`). Se vincula al Test Plan del sprint (`Relates`), a la iniciativa (`implements`) y a las épicas (`is implemented by`) del release.

> **Nota:** las pruebas de regresión se ejecutan en QA (o en PRE si el equipo lo indica expresamente). El destino PRE o PROD del objetivo indica adónde sale el release, no dónde se prueba: nunca se prueba en PROD.

### Regla de selección

| Campo Regresión | Campo Automatizado | Conjunto |
| :--- | :--- | :--- |
| Sí | `SI` | Test Set y Test Execution **automatizados**: se ejecutan en la suite del equipo |
| Sí | `NO` | Test Set y Test Execution **manuales**: no automatizables o todavía no automatizados |
| No | n/a | No entra en la regresión |

---

## 4. Reglas para editar un Test Plan

Estas reglas aplican cuando el Test Plan vive como descripción de un issue de Jira y Kiro lo edita por el MCP `@atlassian`. Valen para el plan del sprint y para el de regresión.

1. Leer la descripción en HTML (herramienta `getJiraIssue` con `responseContentFormat: html`).
2. Cambiar solo la sección que corresponde. Ubicarla por su título (`<h2>9. Riesgos</h2>`).
3. Mantener sin cambios las listas dinámicas (`data-type="block-card"`) y los links con `data-card-appearance="inline"`. Son los elementos con los que Jira dibuja las listas vivas.
4. Quitar los atributos `data-local-id` antes de escribir; Jira los regenera.
5. Mostrar al QA el cambio (antes y después de la sección) y escribir con `editJiraIssue` (`contentFormat: html`) solo con su confirmación.
6. Las filas de las tablas usan el formato `<tr><td><p>…</p></td>…</tr>`.

### Filas de la tabla de Riesgos

```html
<!-- Una fila por riesgo. Nivel: Alto, Medio o Bajo. Estado: Abierto, Mitigado, Materializado o Cerrado -->
<tr><td><p>Alto</p></td><td><p>Riesgo</p></td><td><p>Impacto</p></td><td><p>Mitigación</p></td><td><p>Abierto</p></td></tr>
```

Si no hay riesgos, una fila: `Sin riesgos identificados al <fecha>`.

---

## 5. Placeholders de las plantillas

Un **placeholder** es un texto marcador que se reemplaza por el dato real. En las plantillas HTML se escriben entre ángulos (`<EQUIPO>`, `<SPRINT>`) y, en el código fuente del HTML, como `&lt;EQUIPO&gt;` para que el navegador los muestre como texto.

| Placeholder | Valor |
| :--- | :--- |
| `<EQUIPO>`, `<PROYECTO>`, `<ETIQUETA_EQUIPO>` | Nombre del equipo (por ejemplo "Equipo Alfa"), clave del proyecto (por ejemplo `PROJ`) y etiqueta del equipo (por ejemplo `alfa`), del perfil del equipo |
| `<SPRINT>`, `<SPRINT_ID>` | Número del sprint (por ejemplo `12`) e id del sprint activo del board |
| `<RELEASE>`, `<DESTINO>` | Versión del release (por ejemplo `2.4`) y destino de salida (PRE o PROD) |
| `<FECHA_INICIO>`, `<FECHA_FIN>` | Fechas del sprint en formato `D de mes de AAAA` |
| `<FECHA_INICIO_ISO>`, `<FECHA_FIN_ISO>` | Fechas en formato `AAAA-MM-DD` (para JQL) |
| `<TEST_PLAN_KEY>` | Clave del Test Plan recién creado |
| `<RESPONSABLE>`, `<REPARTO>` | Respuesta del QA y perfil del equipo (`<REPARTO>` solo en el plan del sprint) |
| `<OBJETIVO_SPRINT>`, `<ALCANCE>` | Objetivo del sprint en Jira (solo sprint) y párrafo con el alcance general acordado en el punto de control (sprint y regresión) |
| `<ESTRATEGIA_EQUIPO>` | Estrategia propia del equipo, de la sección 4 del perfil (solo sprint) |
| `<TEST_PLAN_SPRINT>` | Nombre y clave del Test Plan del sprint al que se vincula la regresión (solo regresión) |
| `<JQL_ALCANCE>`, `<JQL_BUGS_RELEASE>` | Búsquedas JQL de las historias y de los bugs del release (solo regresión) |
| `<JQL_AUTO>`, `<JQL_MANUAL>`, `<CANT_AUTO>`, `<CANT_MANUAL>` | JQL de selección de cada conjunto y cantidad de tests que devolvió (solo regresión) |
| `<TEST_SET_AUTO>`, `<TEST_EXEC_AUTO>`, `<TEST_SET_MANUAL>`, `<TEST_EXEC_MANUAL>` | Claves de los Test Sets y Test Executions automatizados y manuales, que se conocen recién después de crearlos (solo regresión) |
| `<AMBIENTE>` | Ambiente de ejecución, URL y versión desplegada (solo regresión) |
| Filas de ejemplo (`PROJ-123`, etc.) | Filas `<tr>` armadas por la skill o por el QA. Sin datos: una fila con "Sin pendientes", "Ninguna", etc. |
| `<RES_TOTAL>`, `<RES_PASSED>`, `<RES_FAILED>`, `<RES_BLOCKED>`, `<RES_TODO>`, `<RES_EXECUTIONS>`, `<RES_SETS>`, `<RES_REEJECUCIONES>`, `<RES_PASS_RATE>`, `<RES_COBERTURA>`, `<RESUMEN_CIERRE>`, `<VEREDICTO>` | Al crear: se reemplazan por la palabra "pendiente". Se completan al cierre |
| `<VERSION_PLANTILLA>` | Versión de la plantilla: la de la tabla de datos al comienzo de esta página (hoy 1.0) |

Todos los placeholders se reemplazan antes de escribir, salvo `<TEST_PLAN_KEY>`, las claves de Test Sets y Test Executions y el link de Evidencias, que solo se conocen después de crear esos elementos y se completan en un segundo paso (`editJiraIssue`). Si queda alguno sin valor, la skill no escribe y avisa.

> **Ejemplo:** el título `Plan de Pruebas: <EQUIPO> - Sprint <SPRINT>` queda como `Plan de Pruebas: Equipo Alfa - Sprint 12`.

---

## 6. Registro de cambios

| Fecha | Versión | Cambio |
| :--- | :--- | :--- |
| 2026-10-28 | 1.0 | Plantillas homologadas de sprint y de regresión, reescritas como HTML autónomo con placeholders genéricos |
