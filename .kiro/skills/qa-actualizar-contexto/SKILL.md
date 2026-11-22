---
name: qa-actualizar-contexto
description: Mantiene viva la documentación funcional del playbook - toma lo aprendido en un análisis, una HU cerrada, un Swagger nuevo, bugs o Xray y propone cambios a los documentos de 04-funcionalidades (reglas de negocio, contratos, flujos, datos de prueba), al perfil del equipo o al catálogo de etiquetas, sin duplicar y con confirmación. Usar cuando el QA pide "actualizá la documentación", "ACTUALIZAR_DOCUMENTACION", "guardá esto en el playbook", "llegó un Swagger nuevo", o al terminar una HU con aprendizajes.
---
# Actualizar contexto

> **Para qué sirve:** incorporar a la documentación funcional del playbook lo que se aprendió al analizar o cerrar una historia (reglas de negocio, estados, errores, contratos, datos de prueba), para que el próximo análisis parta de un conocimiento más completo y no dependa de la memoria de una persona.
> **Quién lo usa:** cualquier QA, directamente o a través de un agente (comando `ACTUALIZAR_DOCUMENTACION`).
> **Cuándo se usa:** al terminar el análisis o el cierre de una historia de usuario (HU) con aprendizajes, cuando llega un Swagger nuevo, cuando una regla documentada resultó incorrecta o cuando el perfil del equipo necesita un dato nuevo.

> **Nota:** **Swagger** (u OpenAPI) es la documentación formal de los endpoints de una API. **Xray** es la herramienta de Jira donde se registran los casos de prueba y sus ejecuciones. El **perfil del equipo** es el documento de `05-equipos/` que describe a cada equipo (Alfa, Beta, Gamma, Delta). El **catálogo de etiquetas** es `02-qa-funcional/catalogo-etiquetas.md`.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Aprendizajes, Cambios en el playbook |
| Archivos en `.qa-work/` | `<CLAVE-HU>/09-contexto.md` o `contexto-<equipo>-<AAAA-MM-DD>/cambios.md` |

> **Nota:** `<CLAVE-HU>` es la clave de la historia en Jira, por ejemplo `PROJ-142`; `<equipo>` es la etiqueta del equipo en minúscula (`alfa`, `beta`, `gamma`, `delta`). `.qa-work/` es la carpeta de trabajo local donde los agentes guardan sus borradores (cada archivo pasa por los estados Borrador, Aprobado y Publicado). Ejemplo de carpeta: `.qa-work/contexto-delta-2026-03-10/cambios.md`.

## Propósito

Que cada análisis deje el conocimiento del módulo un poco más completo para el próximo, sin depender de la memoria de una sesión ni de una persona.

## Cuándo usarla

- Al terminar el análisis o el cierre de una HU que reveló reglas, estados, errores o contratos no documentados.
- Cuando llega un Swagger actualizado.
- Cuando una regla documentada resultó incorrecta.
- Cuando el perfil del equipo o el catálogo de etiquetas necesitan un dato nuevo.

## Cuándo no usarla

- Para dudas que todavía no están confirmadas por PO, Desarrollo o una ejecución: se registran como "a confirmar", no como regla.

> **Nota:** **PO** (*Product Owner*) es la persona responsable del producto y de definir qué se construye.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Origen | Sí | HU, análisis, cierre, Swagger pegado, bug o tests. Por defecto, la HU de la conversación y sus archivos en `.qa-work/` |
| Equipo | Sí | Deducirlo y confirmarlo |

## Contexto que lee

1. Perfil del equipo: carpetas de `04-funcionalidades/` (por ejemplo `04-funcionalidades/vision-cliente/04-checkout/` para el Equipo Beta).
2. **Todos** los documentos de esas carpetas.
3. `04-funcionalidades/plantilla-reglas-negocio.md` (estructura de las secciones).
4. `.qa-work/<CLAVE-HU>/` (análisis, matriz, cierre) cuando el origen es una HU.
5. `CONTRIBUTING.md` (convención de nombres, ramas, commits y PR).

## Herramientas MCP

> **Nota:** **MCP** (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a sistemas externos. Acá se usa `@atlassian` (Jira y Xray) solo para leer.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue`, `searchJiraIssuesUsingJql`, `listJiraIssueComments` y la lectura de tests de Xray (servidor `@atlassian`) |
| Escritura | Solo archivos locales del playbook, con confirmación. Nada en Jira ni Xray |

## Pasos

0. **Espacio de trabajo.** Verificar la carpeta de `.qa-work/` según el origen.
1. **Leer el origen** y extraer hechos: reglas de negocio, permisos, estados y transiciones, endpoints, campos y códigos de error, validaciones de base de datos, datos de prueba, dependencias, bugs que revelan comportamiento, etiquetas nuevas, datos del equipo.
2. **Clasificar cada hecho:**
   - **Confirmado:** está en la HU aprobada, el Swagger, una ejecución o una respuesta del PO o Desarrollo. Indicar la fuente.
   - **A confirmar:** deducido o pendiente de respuesta. Se documenta marcado `(a confirmar con <PO/Dev>, <CLAVE>)`.
3. **Comparar con la documentación** existente (releerla antes):
   - Nuevo → agregar en la sección que corresponde según la plantilla de reglas de negocio.
   - Distinto → corregir y anotar qué cambió.
   - Igual → no tocar.
4. **[PUNTO DE CONTROL] Aprendizajes · esperando tu confirmación.** Mostrar la tabla Hecho | Tipo (nuevo / corrige / igual) | Confirmado o a confirmar | Fuente | Documento y sección destino. Guardar (Borrador) y esperar qué se incorpora.
5. **[PUNTO DE CONTROL] Cambios en el playbook · esperando tu confirmación.** Mostrar el cambio exacto por archivo (texto anterior y nuevo, o la sección a agregar). Incluir:
   - Línea en el registro de cambios del documento (o crearlo si no tiene) con fecha, cambio y origen.
   - Fecha de "Última actualización" si el documento la tiene.
   - Si un archivo nuevo es necesario: nombre en minúsculas con guiones, dentro de la carpeta de la funcionalidad.
   Esperar la confirmación.
6. **Escribir** los archivos confirmados. Verificar nombres (`[a-z0-9-]`), sin espacios al final de línea y links relativos válidos.
7. **Recordar el PR:** los cambios se suben por rama y Pull Request (PR) del playbook (`CONTRIBUTING.md`). Proponer el mensaje de commit. No hacer commit ni push.
8. Pasar el archivo local a Publicado con la lista de archivos modificados.

> **Ejemplo:** al cerrar `PROJ-142` ("Consultar el estado de un pedido") se confirma con el PO que un pedido "Cancelado" no admite seguimiento. El hecho es nuevo y está confirmado (fuente: comentario del PO en `PROJ-142`); se propone agregarlo en la sección de estados de `04-funcionalidades/vision-cliente/05-pedidos-sdd/reglas-negocio.md`, con una línea en su registro de cambios. Si el mismo dato fuera solo una deducción, se escribiría marcado `(a confirmar con PO, PROJ-142)`.

> **Nota:** el **registro de cambios** de un documento es una tabla o lista al final que dice qué cambió, cuándo y por qué fuente. La regla de nombres `[a-z0-9-]` significa solo minúsculas, números y guiones (por ejemplo `proj-142-consultar-estado-pedido`).

## Entregable

Es el resumen que se muestra al terminar, con los totales y los archivos tocados.

```text
Origen: <HU / Swagger / bug / tests>
Hechos: <n> nuevos | <n> correcciones | <n> a confirmar | <n> ya documentados
Archivos modificados: <rutas>
Commit sugerido: <CLAVE>: documenta <tema> de <funcionalidad> (ejemplo: PROJ-142: documenta estados de pedido)
```

> **Nota:** el mensaje de commit sigue la convención del playbook: `<CLAVE>: <qué cambia>`. La rama correspondiente sería `feature/<CLAVE>-<resumen>`.

## Reglas

- No duplicar: si ya está documentado, no se vuelve a escribir.
- No inventar: todo hecho tiene fuente; lo deducido va "a confirmar".
- No escribir datos sensibles (steering `qa-seguridad-datos`): ni credenciales ni datos de clientes reales. Los datos de ejemplo son ficticios (por ejemplo el comprador "Ana Prueba").
- Contratos y Swagger: anotar la fecha del Swagger usado.
- No cambiar reglas de proceso QA (steerings, estándares) desde esta skill: eso se propone aparte.
- Una etiqueta nueva se agrega al catálogo siguiendo su sección 7 ("Cómo agregar una etiqueta nueva"), con su línea en el registro de cambios del catálogo, antes de usarla en Jira o Xray.
- El perfil del equipo se cambia con la plantilla `00-introduccion/kiro/plantillas/plantilla-perfil-equipo.md` como guía. Un dato sin confirmar queda como `Por completar`.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La carpeta de la funcionalidad del equipo no existe o está vacía | El perfil apunta a una carpeta que todavía no se creó | Avisar al QA, proponer crearla con la plantilla `04-funcionalidades/plantilla-reglas-negocio.md` y esperar su confirmación |
| El Swagger pegado es más viejo que el documentado | Se pegó una versión desactualizada | Comparar las fechas y avisar antes de proponer cambios; no pisar lo vigente con lo viejo |
| Dos fuentes dicen cosas distintas | La HU y la ejecución real no coinciden | Registrar ambas con su fuente y marcar el hecho "a confirmar con <PO/Dev>, <CLAVE>" |

## Criterios de calidad

- Cada hecho tiene fuente (HU, Swagger, ejecución o respuesta del PO o Desarrollo) o está marcado "a confirmar".
- No hay duplicados: lo ya documentado no se vuelve a escribir.
- Cada cambio propuesto indica archivo, sección y texto anterior y nuevo.
- Los nombres de archivo nuevos cumplen `[a-z0-9-]` y los links relativos funcionan.

## Casos de aceptación

Son los escenarios con los que se verifica que la skill se comporta como se espera.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | El análisis encontró un código de error no documentado y confirmado en la HU | Propone agregarlo en Endpoints / Casos borde con la fuente |
| 2 | Un hecho deducido sin confirmación | Lo marca "a confirmar" |
| 3 | El hecho ya está documentado | No propone cambios |
| 4 | El QA no confirma | No escribe nada |
