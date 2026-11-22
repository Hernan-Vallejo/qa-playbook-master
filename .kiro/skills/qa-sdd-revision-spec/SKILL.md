---
name: qa-sdd-revision-spec
description: Revisa la especificación SDD de una HU de un equipo que trabaja con SDD - compara 1×1 los criterios de aceptación de Jira con requirement.md, contrasta decisiones de refinamiento, traza cada criterio a los endpoints y contratos de design.md, revisa el catálogo de errores, los estados y las tasks huérfanas, y dice qué falta para escribir casos. Propone el comentario para la subtarea de QA. Usar cuando el QA o el agente qa-sdd pide "REVISAR_SPEC", "revisá el requirement", "compará la HU con el requirement", "revisá el design", "¿la spec está lista para casos?". No usar en equipos funcionales (qa-analisis-hu) ni para revisar código implementado (qa-sdd-fwt).
---
# Revisión de la spec (SDD)

> **Para qué sirve:** comprobar, antes del sprint, que la especificación que escribió desarrollo (`requirement.md`, `design.md` y `tasks.md`) refleja la historia de usuario aprobada en Jira y que alcanza para escribir casos de prueba con resultado esperado comprobable.
> **Quién lo usa:** el QA de un equipo que trabaja con SDD (por ejemplo el Equipo Delta), directamente o a través del agente `qa-sdd`.
> **Cuándo se usa:** al recibir una historia con su spec, antes de analizarla o de diseñar casos, y cada vez que desarrollo actualiza la spec de una historia ya revisada.

> **Nota:** **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) es la forma de trabajo en la que, antes de programar, desarrollo escribe una spec revisable. `requirement.md` describe qué se necesita (criterios, reglas, alcance), `design.md` describe cómo se resuelve (endpoints, contratos, errores, estados) y `tasks.md` lista las tareas de implementación. **HU** es la historia de usuario. Un **criterio de aceptación** es una condición que la historia debe cumplir para darse por terminada. **Drift** es la desviación que se produce cuando dos documentos que deberían decir lo mismo empiezan a diferir. El **refinamiento** es la reunión previa al sprint donde el equipo aclara la historia y toma decisiones sobre ella.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Contexto, Coherencia, Comentario en Jira |
| Archivos en `.qa-work/<CLAVE-HU>/` | `sdd/00-fuentes.md`, `sdd/01-revision-spec.md` |

> **Nota:** `<CLAVE-HU>` es la clave de la historia en Jira, por ejemplo `PROJ-142` ("Consultar el estado de un pedido", de la épica `PROJ-40` "Pedidos y seguimiento"). `.qa-work/` es la carpeta de trabajo local donde los agentes guardan sus borradores (cada archivo pasa por los estados Borrador, Aprobado y Publicado). `00-fuentes.md` registra dónde está cada fuente y qué versión se leyó; `01-revision-spec.md` es el reporte de esta skill.

## Propósito

Responder antes del sprint si la spec de la HU refleja la HU aprobada y si alcanza para escribir casos de prueba, detectando drift, gaps y contradicciones entre HU, `requirement.md`, `design.md` y `tasks.md`.

## Cuándo usarla

- Al recibir una HU de un equipo SDD con su spec, antes de analizarla o de diseñar casos.
- Cuando desarrollo actualiza `requirement.md` o `design.md` de una HU ya revisada.
- Para validar los criterios 6 y 7 del DoR SDD.

> **Nota:** **DoR** (*Definition of Ready*) es la lista de condiciones que una HU debe cumplir para entrar al sprint. La versión para equipos SDD está en `01-estandares-globales/definicion-dor-dod-sdd.md`.

## Cuándo no usarla

- HU de un equipo funcional → `qa-analisis-hu`.
- Revisar el código ya implementado → `qa-sdd-fwt`.
- Refinar la redacción de la HU en Jira: no lo hace ninguna skill; se sugiere al PO desde el comentario.

> **Nota:** **PO** (*Product Owner*) es la persona responsable del producto y de definir qué se construye.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU o de la subtarea QA | Sí | Pedirla. Si es una subtarea, usar la HU padre |
| Ubicación de `requirement.md` | Sí | Pedirla: repositorio, rama y ruta, o ruta local. **Nunca adivinar** |
| Ubicación de `design.md` | Sí para la parte de diseño | Pedirla. Si todavía no existe, revisar solo el requirement y avisarlo |
| Ubicación de `tasks.md` | No | Pedirla. Si no existe, omitir la parte de tasks y avisarlo |
| Figma | Sí si la HU tiene front | Usar el link de la HU o del requirement. Si no hay, es gap crítico |
| Profundidad | No | Estándar |

> **Nota:** **Figma** es la herramienta donde se diseñan las pantallas; se accede con el servidor MCP `@figma` (opcional). "Front" es la parte de la HU que se ve en pantalla; "back" es la que se resuelve en el servidor.

## Contexto que lee

1. Steering `qa-sdd` (jerarquía de verdad, subtareas estándar, versiones de las fuentes).
2. Perfil del equipo (`05-equipos/delta.md`) y **todos** los documentos de sus carpetas de `04-funcionalidades/` (para el Equipo Delta, `04-funcionalidades/vision-cliente/05-pedidos-sdd/`).
3. `01-estandares-globales/definicion-dor-dod-sdd.md`.
4. Usuario de la sesión: `atlassianUserInfo` (servidor `@atlassian`), para firmar el comentario.

> **Nota:** el **steering** son las reglas permanentes que Kiro lee antes de trabajar (están en `.kiro/steering/`). La **jerarquía de verdad** es el orden de autoridad entre las fuentes cuando se contradicen: HU de Jira, luego requirement, luego design, luego tasks.

## Herramientas MCP

> **Nota:** **MCP** (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a sistemas externos. Acá se usan `@atlassian` (Jira), `@github` (repositorio) y, si la HU tiene front, `@figma`.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `atlassianUserInfo`, `getJiraIssue` (view `evidence`), `listJiraIssueComments`, `searchJiraIssuesUsingJql` (servidor `@atlassian`); en `@github`: lectura de archivos, listado de carpetas, listado de ramas y consulta de commits (para registrar la versión de cada archivo); lectura de nodos y archivos de Figma (`@figma`) |
| Escritura (solo después de la confirmación) | `addOrEditJiraIssueComment` en la subtarea de QA |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/`, `indice.md` y `sdd/`; crearlos si faltan. Si existen `sdd/00-fuentes.md` o `sdd/01-revision-spec.md`, leerlos.
1. **HU.** Leer la HU con view `evidence`: narrativa, criterios de aceptación, reglas, alcance y fuera de alcance, decisiones de refinamiento (tomadas y pendientes), dependencias, Figma, subtareas y comentarios.
2. **Fuentes.** Pedir las ubicaciones que falten. Leer cada archivo. Registrar ubicación y versión en `sdd/00-fuentes.md` (steering `qa-sdd`). Si un archivo no se puede leer, informar cuál y no inferir su contenido.
3. **[PUNTO DE CONTROL] Contexto · esperando tu confirmación.** Mostrar: HU, equipo, fuentes leídas con su versión, si es Front, Back o Full-stack, si hay Figma, trabajo previo y si alguna fuente cambió desde la revisión anterior. Esperar confirmación.
4. **HU ↔ requirement.** Con la [referencia de revisión](./referencia-revision.md), sección 1: criterios 1×1, reglas, alcance, decisiones pendientes y **decisiones de refinamiento contra la configuración del requirement**. Si es front, coherencia con Figma.
5. **requirement ↔ design.** Sección 2 de la referencia: trazabilidad criterio → endpoint o componente, completitud de contratos, catálogo de errores, estados y enums, alcance extra.
6. **design ↔ tasks.** Sección 3 de la referencia: tasks huérfanas y criterios sin task. Las tasks de QA no se evalúan.
7. **Qué falta para casos.** Listar lo que hace falta para escribir casos con resultado esperado determinista y no está en ninguna fuente.
8. **[PUNTO DE CONTROL] Coherencia · esperando tu confirmación.** Mostrar el reporte con el formato del Entregable y guardarlo en `sdd/01-revision-spec.md` (Borrador). Esperar. Al aprobar, pasarlo a Aprobado.
9. **[PUNTO DE CONTROL] Comentario en Jira · esperando tu confirmación.** Buscar la subtarea `[QA] Análisis de Testabilidad y Refinamiento de Contexto` de la HU. Si no está, pedir la clave. Mostrar el comentario (formato abajo) y publicarlo solo con OK. Al publicar, pasar el archivo a Publicado y actualizar `indice.md`.

> **Nota:** "1×1" significa comparar cada criterio de Jira con su criterio equivalente en el requirement, uno por uno, sin agrupar. Un resultado esperado **determinista** es el que se puede comprobar sin interpretar (qué valor, qué mensaje, qué pantalla).

## Punto de confirmación

- **Coherencia:** "¿Aprobás la revisión, ajustamos alguna discrepancia o la dejamos acá?"
- **Comentario en Jira:** mostrar el comentario y la subtarea destino. "¿Lo publico en <CLAVE-SUBTAREA>, lo ajustamos o lo dejamos acá?" Si ya hay un comentario de revisión de spec, preguntar si se edita o se agrega uno nuevo.

> **Nota:** en cada punto de control el agente se detiene y no publica nada hasta recibir la respuesta del QA.

## Entregable

El archivo `sdd/01-revision-spec.md` tiene esta estructura. Los veredictos se explican en la [referencia de revisión](./referencia-revision.md), secciones 1, 2 y 5.

```text
Revisión de la spec - <CLAVE-HU> <título>
Fuentes: HU (<fecha>) · requirement (<versión>) · design (<versión>) · tasks (<versión | no existe>)
Tipo: Front | Back | Full-stack

Veredicto
- HU ↔ requirement: Coherente | Con observaciones | Incoherente
- Spec para casos: Lista para casos | Gaps menores | Gaps bloqueantes

Criterios de aceptación (1×1)
| # | Criterio en Jira | En requirement | En design (endpoint/componente) | Veredicto | Detalle |

Reglas, alcance y decisiones
| Tema | Jira | requirement | Veredicto |
Decisiones de refinamiento vs configuración del requirement:
| Decisión | Lo que dice la spec | Veredicto |

Contratos (design)
| Endpoint | Método y path | Request | 2xx | Errores | Headers | Enums/validaciones | Estado |
Catálogo de errores:
| Código | HTTP | Condición | Mensaje | Criterio | Estado |

Tasks
- Tasks huérfanas: ...
- Criterios sin task: ...

Figma (solo front)
| Aspecto | requirement | Figma | Veredicto |

Discrepancias por severidad
- Crítica: ...
- Media: ...
- Baja: ...
- Informativa: ...

Lo que necesito para escribir casos y no está
1. <dato> - afecta <criterio o caso> - a quién preguntar

Fuentes
- Verificadas: ...
- INFORMACIÓN INSUFICIENTE: ...
```

> **Nota:** un **contrato** es la definición exacta de cómo se usa un endpoint (método, path, parámetros, cuerpo, respuestas, errores). Un **enum** es un campo que solo admite una lista cerrada de valores, por ejemplo los estados de un pedido (`CREADO`, `EN_PREPARACION`, `ENVIADO`, `ENTREGADO`, `CANCELADO`). **HTTP** es el código de estado de la respuesta (200, 400, 404, 500). Una **task huérfana** es una tarea de `tasks.md` que no corresponde a ningún criterio ni elemento del design.

### Comentario en la subtarea (hasta ~40 líneas)

Es el resumen accionable que ve el equipo. Se publica con formato de Jira (los asteriscos marcan negrita).

```text
*Revisión de la spec QA - <CLAVE-HU>*

*Resumen*
HU ↔ requirement: <veredicto>. Spec para casos: <veredicto>.
Criterios consistentes: <n>/<total>. Discrepancias críticas: <n>, medias: <n>.

*Observaciones*
- <tema> - <qué dice cada fuente> (<severidad>)

*Pendientes para el equipo*
- <pregunta o acción> - afecta <criterio>

*Siguientes pasos*
<qué tiene que resolver PO o Desarrollo para que QA escriba los casos>

Elaborado por <USUARIO JIRA> y Kiro
```

> **Nota:** `<USUARIO JIRA>` es el nombre del usuario de la sesión, que se obtiene con `atlassianUserInfo`. Las preguntas dirigidas al PO deben mencionarlo para que le llegue la notificación.

Siguiente paso sugerido: `ANALIZAR` con `qa-analisis-hu` usando la spec revisada como fuente.

## Reglas

- **Solo lectura** sobre la spec y el código. No modificar requirement, design ni tasks.
- **Comparación 1×1 obligatoria.** Cada criterio de Jira tiene su fila; agrupar criterios "parecidos" no es comparar.
- **Toda diferencia se reporta** con severidad, aunque parezca justificada. Si el requirement profundiza sin contradecir, es Enriquecido (con observación).
- **Una decisión de refinamiento contradicha por un parámetro, validación o error del requirement es Contradictorio**, no un detalle técnico.
- Un criterio sin endpoint, componente o error que lo implemente es un gap.
- Un error sin código, HTTP, condición y mensaje es un contrato incompleto.
- Si la HU tiene front y no hay Figma, es gap crítico.
- Si una fuente no se pudo leer, se dice en "Fuentes" y la revisión no se presenta como completa.
- Se publica solo en la subtarea de QA. Nunca en la HU padre sin indicación del QA.
- El comentario no lleva rutas locales, nombres de skills ni referencias internas.

## Anti-racionalización

Son las excusas más comunes para saltear un paso, y por qué no valen.

| Excusa | Realidad |
| :--- | :--- |
| "El requirement seguro está alineado con Jira" | El drift HU ↔ requirement es justamente lo que se busca |
| "Son diferencias de redacción" | Se reporta con severidad Baja; decide el QA |
| "Es solo configuración técnica" | Si contradice una decisión de refinamiento, es discrepancia funcional. Ejemplo (inventado) con `PROJ-142`: la decisión "un pedido de otro comprador responde igual que uno inexistente" (`CA-3`, `RN-PED-22`) queda contradicha por un parámetro `ocultarExistencia = false` en la configuración del requirement |
| "Busco en la rama principal porque es lo lógico" | La rama la indica el QA |
| "No pregunto por Figma, parece back" | Primero se clasifica el tipo de HU |
| "El reporte local alcanza" | El equipo no ve `.qa-work/`: el feedback va a la subtarea de QA |
| "Publico directo, el QA ya vio la revisión" | Ver la revisión no es aprobar el comentario |
| "No encuentro la subtarea, publico en la HU" | Se pide la clave al QA |

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La lectura de un archivo en `@github` devuelve 404 | Rama o ruta incorrecta, o el archivo todavía no se subió | Pedir al QA la ruta correcta. No probar rutas alternativas por cuenta propia |
| La HU es una subtarea | El QA pasó la clave de su subtarea | Leer `parent` y revisar la HU |
| El requirement trae criterios numerados distinto que Jira | Desarrollo reescribió los criterios | Mapear por contenido y explicar el mapeo en "Detalle" |

## Criterios de calidad

- Cada criterio de Jira tiene una fila con veredicto.
- Cada discrepancia tiene severidad y dice qué dice cada fuente.
- "Lo que necesito y no está" es concreto: dato, criterio afectado y a quién preguntar.
- El comentario se lee en un minuto y no tiene referencias internas.

## Casos de aceptación

Son los escenarios con los que se verifica que la skill se comporta como se espera.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | HU y requirement alineados, design completo | Veredictos Coherente y Lista para casos; el comentario igual se propone |
| 2 | Decisión de refinamiento contradicha por un parámetro del requirement (ejemplo `PROJ-142`: la decisión "el pedido ajeno responde igual que el inexistente" contra un parámetro `ocultarExistencia = false`) | Contradictorio con severidad Crítica |
| 3 | El QA no indica la ruta del requirement | La pide; no busca en ramas ni rutas por cuenta propia |
| 4 | HU con front sin Figma | Gap crítico |
| 5 | No existe la subtarea de QA | Pide la clave; no publica en la HU |
| 6 | El QA no confirma el comentario | No escribe en Jira |
