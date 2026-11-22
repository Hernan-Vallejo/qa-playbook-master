---
name: qa-sdd-fwt
description: Revisión estática de QA (FWT, Functional Walkthrough) del código de una HU de un equipo SDD antes del deploy a QA - alineación criterio × spec × código con scope creep, coherencia del Swagger u OpenAPI, seguridad básica, testabilidad de UI y cobertura de los tests unitarios del cambio (calidad, trazabilidad y herramienta de análisis de código). No necesita el sistema corriendo. Usar cuando el agente qa-sdd o el QA pide "FWT", "walkthrough", "revisá el código antes del deploy", "revisá los unit tests", "cobertura unitaria del PR". No usar para la revisión técnica del PR de desarrollo ni para PRs de repos de QA (qa-revisar-pr).
---
# FWT: revisión estática del código (SDD)

> **Para qué sirve:** revisar el código que desarrollo implementó para una historia, sin ejecutarlo, y comprobar que coincide con lo que dice la spec: criterios implementados, documentación de la API al día, seguridad básica, elementos de pantalla identificables y tests unitarios que de verdad prueban algo.
> **Quién lo usa:** el QA de un equipo que trabaja con SDD (por ejemplo el Equipo Delta), directamente o a través del agente `qa-sdd`.
> **Cuándo se usa:** cuando desarrollo termina la implementación y antes del deploy al ambiente de QA.

> **Nota:** **FWT** significa *Functional Walkthrough* (recorrido funcional). En este playbook es un recorrido de QA por el código del cambio, comparándolo criterio por criterio con la spec, antes de que el sistema se despliegue. Es estático: no necesita el sistema corriendo. **SDD** (*Spec-Driven Development*, desarrollo guiado por especificaciones) es la forma de trabajo en la que desarrollo escribe antes una spec (`requirement.md`, `design.md`, `tasks.md`) que QA revisa y usa para derivar casos y datos. **HU** es la historia de usuario. **PR** (*Pull Request*) es el pedido de revisión de un cambio de código en GitHub. **UI** es la interfaz de usuario.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Contexto, FWT, Comentario en Jira |
| Archivos en `.qa-work/<CLAVE-HU>/` | Lee `sdd/00-fuentes.md`, `sdd/01-revision-spec.md`, `sdd/02-cobertura-dev.md`, `04-casos.md`. Escribe `sdd/04-fwt.md` |

> **Nota:** `<CLAVE-HU>` es la clave de la historia en Jira, por ejemplo `PROJ-142`. `.qa-work/` es la carpeta de trabajo local donde los agentes guardan sus borradores (cada archivo pasa por los estados Borrador, Aprobado y Publicado).

## Propósito

Encontrar antes del deploy a QA lo que es más barato corregir en el código que reportar como bug después: criterios sin implementar, Swagger desactualizado, problemas básicos de seguridad, elementos de UI sin identificación estable y unitarios que no prueban lo que dicen.

> **Nota:** **Swagger** u **OpenAPI** es la documentación formal de los endpoints de una API (paths, parámetros, respuestas, errores). Debe coincidir con lo que el código hace y con lo que dice la spec.

## Cuándo usarla

- Cuando desarrollo termina la implementación y antes del deploy a QA.
- Cuando se actualiza el PR de desarrollo después de un FWT con hallazgos.

## Cuándo no usarla

- Revisión técnica del código (arquitectura, patrones, performance): es del code review de desarrollo.
- PRs de los repositorios de QA → `qa-revisar-pr`.
- Con el sistema desplegado para ejecutar casos → modo `EJECUTAR` del agente `qa-sdd`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Clave de la HU | Sí | Pedirla |
| Repositorio y rama del código, o PR de desarrollo | Sí | Pedirlos. **Nunca adivinar** |
| Rama base de comparación | Sí | Pedirla (por ejemplo `main` o `develop`, según el repositorio) |
| Spec (requirement y design) | Sí | Usar la registrada en `sdd/00-fuentes.md`. Si no hay, pedir la ubicación |
| Proyecto en la herramienta de análisis de código (por ejemplo SonarQube) | No | Buscarlo con la herramienta que tenga configurada el equipo y confirmarlo. Si no hay, omitir esa parte y avisarlo |
| Umbral de cobertura | No | 80 % sobre el código nuevo |

> **Nota:** el **código nuevo** es el que agrega o modifica el PR (no el repositorio entero). La **cobertura** es el porcentaje de líneas de ese código que ejecutan los tests unitarios. El umbral de 80 % es el valor por defecto de esta skill; el equipo puede definir otro.

## Contexto que lee

1. Steering `qa-sdd` (las reglas del flujo SDD).
2. `sdd/01-revision-spec.md` (contratos y errores) y `sdd/02-cobertura-dev.md` (unitarios pedidos y gaps de locator).
3. Si hay front: el steering de locators (`plantilla-automation/.kiro/steering/pw-proyecto.md` o el del repositorio de front del equipo).

## Herramientas MCP

> **Nota:** **MCP** (*Model Context Protocol*) es el mecanismo con el que Kiro se conecta a sistemas externos. Acá se usan `@atlassian` (Jira) y `@github` (repositorio, PRs y pipelines). El análisis de calidad de código (cobertura, quality gate, issues) depende de que el equipo tenga configurada una herramienta como SonarQube y un servidor MCP para consultarla.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue` (`@atlassian`); en `@github`: lectura de un PR, de su diff, comparación entre ramas, lectura de archivos, listado de carpetas, búsqueda de código y consulta de pipelines. Si el equipo tiene la herramienta de análisis de código: proyectos, cobertura, métricas, quality gate e issues |
| Escritura (solo después de la confirmación) | `addOrEditJiraIssueComment` (`@atlassian`) en la subtarea de QA. Comentarios en el PR de desarrollo (`@github`), solo si el QA lo pide |

## Pasos

0. **Espacio de trabajo.** Verificar `.qa-work/<CLAVE-HU>/sdd/`. Comparar la versión de la spec con `00-fuentes.md` y avisar si cambió.
1. **Artefactos.** Obtener el diff de la rama contra la base, la spec, el Swagger u OpenAPI del servicio (archivo o anotaciones de los controllers) y los tests del diff.
2. **[PUNTO DE CONTROL] Contexto · esperando tu confirmación.** Mostrar HU, repositorio, rama, base, archivos del diff (productivos y de test), versión de la spec, Swagger encontrado, proyecto en la herramienta de análisis de código. Esperar.
3. **Alineación funcional.** Por cada criterio: endpoint o acción, validaciones, errores (código y mensaje) y comportamiento de éxito en el código. Veredicto: Implementado, Parcial o No implementado. Listar **scope creep**: cambios que no corresponden a ningún criterio (relacionados, como configuración, o no relacionados).
4. **Swagger u OpenAPI.** Por cada endpoint nuevo o modificado: path y método, parámetros, body, respuesta 2xx, errores y headers. Veredicto: Coherente, Desactualizado, Faltante o Contradictorio. Si el proyecto no usa Swagger, N/A.
5. **Seguridad básica** con la lista de abajo. Veredicto: Sin hallazgos, Observación o Vulnerabilidad.
6. **Testabilidad de UI** (solo si hay front en el diff). Revisar los elementos que usan los casos y los gaps de locator de `02-cobertura-dev.md`. Veredicto: Completa, Parcial, Ausente o N/A.
7. **Cobertura unitaria.**
   1. Mapear cada archivo productivo del diff a sus tests. Archivo con lógica y sin test: gap.
   2. Calidad de cada test: verifica el resultado y no solo que "no falle"; cubre caminos de error y bordes; los mocks no esconden la lógica que se quiere probar; el nombre describe el comportamiento.
   3. Trazar criterio → test y comparar con los `MUST_DEV` y `SHOULD_DEV` de `02-cobertura-dev.md`.
   4. Herramienta de análisis de código (si está disponible): cobertura del código nuevo, quality gate e issues nuevos. Comparar con el umbral.
   5. **Veredicto de cobertura unitaria** (definición única; el resto del playbook la cita):

      | Veredicto | Cuándo |
      | :--- | :--- |
      | `Suficiente` | Todos los `MUST_DEV` tienen test de calidad, ningún archivo con lógica queda sin test y la cobertura del código nuevo alcanza el umbral (si hay herramienta) |
      | `Observada` | Se cumple lo anterior en lo esencial, pero hay `SHOULD_DEV` sin cubrir, tests de calidad baja, quality gate con issues menores, o falta el dato de la herramienta |
      | `Insuficiente` | Algún `MUST_DEV` sin test, archivo con lógica sin test, o cobertura del código nuevo por debajo del umbral |
8. **[PUNTO DE CONTROL] FWT · esperando tu confirmación.** Mostrar el resultado con el formato del Entregable y guardarlo en `sdd/04-fwt.md` (Borrador). Esperar.
9. **[PUNTO DE CONTROL] Comentario en Jira · esperando tu confirmación.** Proponer el resumen para la subtarea `[QA] Ejecución de test cases` (steering `qa-sdd`) y publicarlo solo con OK. Si el QA lo pide, proponer también los comentarios en el PR de desarrollo, por separado y con su propia confirmación.

> **Nota:** el **scope creep** es todo cambio del código que no responde a ningún criterio de la HU. No siempre es un error (puede ser una mejora o una configuración necesaria), pero se informa para que el equipo decida. Un **quality gate** es el conjunto de condiciones (cobertura mínima, sin issues nuevos graves) que la herramienta de análisis exige para dar el código por aceptable.

### Seguridad básica

| Tema | Qué se revisa |
| :--- | :--- |
| Validación de entrada | Numéricos que rechazan texto, longitudes máximas, caracteres especiales sin 500, sin concatenar input en queries o comandos |
| Información sensible | Errores sin stack trace ni datos internos, sin credenciales en el código, emails, nombres o direcciones de compradores no logueados sin enmascarar, datos sensibles fuera de la URL |
| Autenticación y autorización | Endpoints que validan el token, sin acceso a datos de otro usuario cambiando IDs, token vencido que responde 401 y no 500 |

Esta revisión es básica: no reemplaza la revisión de seguridad que haga el responsable de seguridad del equipo.

> **Ejemplo:** en `PROJ-142` (consultar el estado de un pedido), un usuario autenticado que cambia el número de pedido en la URL por el de otro comprador no debe poder ver ese pedido. Si el código lo permite, es una vulnerabilidad y un bloqueante.

## Punto de confirmación

- **FWT:** "¿Aprobás el FWT, ajustamos algún hallazgo o lo dejamos acá?"
- **Comentario en Jira:** "¿Lo publico en <CLAVE-SUBTAREA>, lo ajustamos o lo dejamos acá?"

> **Nota:** en cada punto de control el agente se detiene y no publica nada hasta recibir la respuesta del QA.

## Entregable

El archivo `sdd/04-fwt.md` tiene esta estructura. El veredicto de cada dimensión usa las palabras definidas en los pasos 3 a 7.

```text
FWT - <CLAVE-HU> · <repo> · <rama> vs <base> · <n> archivos
Spec: requirement <versión> · design <versión>

| Dimensión | Veredicto | Hallazgos |
| Alineación funcional | Implementado / Parcial / No implementado | ... |
| Swagger / OpenAPI | Coherente / Desactualizado / Faltante / Contradictorio / N/A | ... |
| Seguridad básica | Sin hallazgos / Observación / Vulnerabilidad | ... |
| Testabilidad UI | Completa / Parcial / Ausente / N/A | ... |
| Cobertura unitaria | Suficiente / Observada / Insuficiente | Código nuevo <n> % (umbral <n> %) · Quality gate <estado> |

Veredicto general: APROBADO para deploy | CON OBSERVACIONES | RECHAZADO (RECHAZADO si hay algún bloqueante; CON OBSERVACIONES si solo hay observaciones; en el tablero de `qa-sdd` se muestran como Rechazado, Con observaciones y Aprobado)

Alineación por criterio
| # | Criterio | Archivo:línea | Veredicto | Falta |

Scope creep
| Archivo | Cambio | Relacionado / No relacionado |

Cobertura unitaria
| Archivo productivo | Test | Criterio | Calidad | Observación |
Pedidos del Paquete: MUST_DEV <cubiertos>/<total> · SHOULD_DEV <cubiertos>/<total>

Bloqueantes (antes del deploy a QA)
1. ...

Observaciones (antes del merge)
- ...
```

Comentario en la subtarea: formato del steering `qa-jira-xray`, hasta ~40 líneas, con el veredicto por dimensión, los bloqueantes y las observaciones. Sin rutas locales ni nombres de skills.

> **Nota:** "merge" es la integración del PR a la rama principal. Un **bloqueante** impide el deploy a QA; una **observación** se puede corregir hasta el merge.

## Reglas

- **Solo lectura.** No se modifica código, tests ni spec.
- **Evidencia concreta:** cada hallazgo cita archivo y línea.
- **Severidad:** una vulnerabilidad es siempre bloqueante. Un criterio no implementado es bloqueante. Swagger faltante o desactualizado, falta de identificación en UI y cobertura unitaria `Observada` o `Insuficiente` son observaciones que se corrigen antes del merge (el QA puede decidir que una de ellas sea bloqueante). Código que contradice un Swagger correcto según la spec es bloqueante.
- **SDD no es cascada:** si el código resuelve distinto que la spec, se informa y el equipo decide si corrige el código o actualiza la spec.
- La cobertura medida por la herramienta de análisis no prueba calidad: un test sin verificaciones cubre líneas y no valida nada.
- Comentar en el PR de desarrollo solo si el QA lo pide y con confirmación.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La herramienta de análisis no tiene datos del código nuevo | El análisis del pipeline todavía no corrió para la rama | Avisar y dejar esa parte como INFORMACIÓN INSUFICIENTE |
| El diff trae muchos archivos generados | Lockfiles, builds o clientes generados | Excluirlos de la revisión y decirlo en el Contexto |

## Criterios de calidad

- Cada criterio tiene veredicto con archivo y línea.
- Los bloqueantes están separados de las observaciones.
- La cobertura unitaria se evalúa por calidad y trazabilidad, no solo por porcentaje.

## Casos de aceptación

Son los escenarios con los que se verifica que la skill se comporta como se espera.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Criterio con un error que el código no genera | Parcial en alineación, con lo que falta |
| 2 | Endpoint nuevo sin Swagger | Faltante, como observación |
| 3 | Log con el email del comprador sin enmascarar | Observación o Vulnerabilidad en seguridad según el caso, con archivo y línea |
| 4 | Test que solo verifica que no se lanza una excepción | Observado en calidad |
| 5 | El QA no indica rama ni PR | Los pide; no los adivina |
