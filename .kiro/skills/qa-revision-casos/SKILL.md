---
name: qa-revision-casos
description: Revisa la calidad de casos de prueba existentes en Xray o en borrador - cobertura de criterios de aceptación, formato Gherkin, etiquetas, campos Regresión y Automatizado, duplicados, tests desactualizados - y propone correcciones, deprecaciones o tests faltantes con confirmación. Usar cuando el QA pide "revisá los tests", "VALIDAR_TESTS", "¿están bien los casos?", "revisá la cobertura de la HU", "limpiá el repositorio de tests de esta funcionalidad".
---
# Revisión de casos

> **Para qué sirve:** Revisa que los casos de prueba (en Xray o en borrador) estén completos, bien escritos, sin duplicados y alineados con la HU, y propone correcciones que se aplican solo con tu confirmación.
> **Quién lo usa:** Cualquier QA de los equipos Alfa, Beta, Gamma o Delta, y el agente de Kiro que lo asiste.
> **Cuándo se usa:** Antes de cargar casos escritos por otra persona, después de un cambio de alcance de una HU, antes de preparar una regresión o como revisión entre pares.

> **Nota:** Xray es la herramienta de Jira donde se guardan los tests. Gherkin es el formato de escenarios con `Given` / `When` / `Then`. Un *punto de control* es el momento en que Kiro se detiene y espera tu confirmación.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental (la skill todavía se está ajustando con el uso) |
| Versión | 0.1 |
| Puntos de control | Revisión de casos, Correcciones |
| Archivos en `.qa-work/` | `<CLAVE-HU>/08-revision-casos.md` o `revision-<equipo>-<funcionalidad>/revision.md` |

> **Ejemplo:** `.qa-work/PROJ-123/08-revision-casos.md` para una HU, o `.qa-work/revision-alfa-carrito/revision.md` para revisar toda la funcionalidad "carrito" del Equipo Alfa.

## Propósito

Mantener el repositorio de tests confiable: que cubra lo que tiene que cubrir, sin duplicados, con el formato y los campos del estándar, para que la regresión y la automatización se apoyen en él.

## Cuándo usarla

- Antes de cargar casos escritos por otra persona o importados.
- Después de un cambio de alcance de una HU.
- Antes de preparar una regresión, para revisar los tests de una funcionalidad.
- Como revisión entre pares.

## Cuándo no usarla

- Para escribir casos nuevos → `qa-diseno-casos`.
- Para cargar → `qa-carga-xray`.

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Alcance | Sí | Una de: clave de HU, Test Set, lista de tests, borrador en `.qa-work/<CLAVE-HU>/04-casos.md`, o funcionalidad (etiqueta) del equipo. Si no se indica, pedirlo |
| Equipo | Sí | Deducirlo de la etiqueta o el componente y confirmarlo |
| Profundidad | No | Estándar. Exhaustivo revisa también el contenido de cada paso contra la documentación funcional |

> **Nota:** un Test Set es un conjunto de tests agrupados en Xray, normalmente los de una HU.

## Contexto que lee

1. Steering `qa-gherkin` y `qa-jira-xray` (reglas de escritura de escenarios y de trabajo con Jira y Xray).
2. Catálogo de etiquetas: `02-qa-funcional/catalogo-etiquetas.md`.
3. Perfil del equipo (nombre del test, área, bloque técnico): `05-equipos/<equipo>.md`.
4. Documentación funcional de las carpetas del perfil.
5. HU y sus criterios de aceptación, si el alcance es una HU.

## Herramientas MCP

> **Nota:** MCP (*Model Context Protocol*) es el estándar con el que Kiro se conecta a herramientas externas. Esta skill usa solo `@atlassian` (Jira y Xray); no usa `@github`. Las operaciones de Xray dependen de cómo tenga configurado `@atlassian` el equipo.

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `@atlassian`: `getJiraIssue`, `searchJiraIssuesUsingJql`, consulta de tests de Xray |
| Escritura (solo después de la confirmación) | `@atlassian`: `editJiraIssue`, `transitionJiraIssue`, `addOrEditJiraIssueComment`, y las operaciones de Xray para actualizar un test y moverlo de carpeta |

## Pasos

0. **Espacio de trabajo.** Si el alcance es una HU, `.qa-work/<CLAVE-HU>/`; si es una funcionalidad, `.qa-work/revision-<equipo>-<funcionalidad>/`. Crear lo que falte.
1. **Leer los tests** del alcance: summary (título), Gherkin, descripción, etiquetas, estado, carpeta, Regresión, Automatizado, Estado Automatización y última ejecución. Para funcionalidades grandes, paginar y avisar la cantidad antes de seguir.
2. **Revisar cada test** con este checklist:

   | # | Criterio | Qué se marca |
   | :--- | :--- | :--- |
   | 1 | Nombre `<Área>.<Capa>.<título>` | Formato distinto (tests anteriores a la adopción del estándar: solo informar) |
   | 2 | Un objetivo por escenario y `When` atómico | Escenarios que mezclan objetivos |
   | 3 | Declarativo, sin selectores ni detalle de implementación | Pasos imperativos (por ejemplo "hacer clic en `#login-button`") |
   | 4 | Resultado esperado verificable | `Then` vago ("funciona correctamente") |
   | 5 | Validación de base de datos o BFF según la capa | Falta la validación o la justificación |
   | 6 | Scenario Outline bien usado | Outline con lógicas distintas, o casos iguales que deberían ser Outline |
   | 7 | Etiquetas del catálogo en orden (Equipo, Capa, Tipo de caso, Funcionalidad, Historia / Servicio) | Etiquetas que no están en el catálogo, fuera de uso (`regresion`, `testing_manual`, `test_set`, ...), duplicadas por concepto (`frontend` en lugar de `front`) o faltantes (por ejemplo, sin tipo de caso) |
   | 8 | Campo Regresión completo | Vacío |
   | 9 | Campo Automatizado completo | Vacío (bloquea la selección de regresión) |
   | 10 | Descripción con objetivo y referencias | Vacía o sin referencias |
   | 11 | Vigencia | Contradice la documentación funcional o una HU posterior |
   | 12 | Duplicados | Mismo objetivo que otro test del alcance |

   > **Nota:** el campo **Regresión** dice si el test entra en las regresiones de release. El campo **Automatizado** dice si ya existe un test automático equivalente. Un Scenario Outline es un escenario con una tabla de ejemplos: se usa cuando la lógica es la misma y cambian solo los datos.

3. **Cobertura** (si el alcance es una HU o funcionalidad): cruzar criterios de aceptación o reglas de negocio con los tests. Listar los no cubiertos.
4. **[PUNTO DE CONTROL] Revisión de casos · esperando tu confirmación.** Mostrar y guardar (Borrador):
   - Resumen: tests revisados, OK, con observaciones, a deprecar, duplicados, gaps.
   - Tabla Test | Observaciones (por # del checklist) | Severidad (Alta: bloquea regresión o trazabilidad / Media: calidad / Baja: forma) | Propuesta.
   - Gaps de cobertura, con la sugerencia de usar `qa-diseno-casos`.

   Esperar la respuesta: qué correcciones se aplican.
5. **[PUNTO DE CONTROL] Correcciones · esperando tu confirmación.** Mostrar la lista exacta de cambios aprobados (campo, valor anterior, valor nuevo) y esperar la confirmación. Tipos de cambio:
   - Completar Regresión, Automatizado o Estado Automatización.
   - Corregir o completar etiquetas (solo del catálogo).
   - Corregir descripción o Gherkin.
   - Deprecar: Estado Automatización o estado no aplicable según el flujo del equipo y comentario `deprecado por <CLAVE>`. Nunca borrar.
   - Mover a la carpeta correcta.
6. **Aplicar de a una** y verificar. Pasar el archivo a Publicado con la lista de cambios aplicados.

## Entregable

> **Nota:** es el texto que Kiro muestra y guarda en el archivo de revisión. La columna Observaciones usa los números del checklist del paso 2. Los valores entre `<>` se reemplazan con datos reales.

```text
Revisión de casos — <alcance> — <fecha>
Revisados: <n> | OK: <n> | Con observaciones: <n> | A deprecar: <n> | Duplicados: <n>
Campos vacíos: Regresión <n>, Automatizado <n>
Gaps de cobertura: <CA o reglas sin test>

| Test | Observaciones | Severidad | Propuesta |
| <clave> <summary> | 7, 9 | Alta | Completar Automatizado = NO; quitar `frontend`, agregar `front` |

Cambios aplicados: <lista> | Pendientes: <lista>
```

> **Ejemplo:** `PROJ-310 Cliente.FRONT.Agregar producto al carrito` con observaciones 7 y 9 (etiqueta duplicada por concepto y campo Automatizado vacío) tiene severidad Alta porque el campo vacío bloquea la selección de regresión.

## Reglas

- Proponer, no reescribir en bloque: cada cambio se muestra con su valor anterior y nuevo.
- No cambiar el objetivo de un test existente. Si el objetivo ya no vale, se depreca y se diseña uno nuevo.
- No inventar el valor de Automatizado: si no está claro si el test está automatizado, preguntar.
- Tests anteriores a la adopción del estándar con nombre en otro formato: se informa, no se renombran salvo que el QA lo pida.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El alcance trae cientos de tests | Se pidió una funcionalidad completa | Paginar, avisar la cantidad antes de seguir y proponer revisar por Test Set o por HU |
| Un test no se deja editar o mover | Xray responde "repository is being updated" por escrituras en paralelo | Aplicar los cambios de a uno y verificar cada uno (ver steering `qa-jira-xray`) |
| No se sabe si un test está automatizado | El campo Automatizado está vacío y no hay test automático a la vista | Preguntar al QA; no completar el campo por suposición |

## Criterios de calidad

- Cada observación cita el número del checklist y el test (clave y summary).
- Cada cambio propuesto muestra el valor anterior y el nuevo.
- Los gaps de cobertura salen de cruzar los criterios de aceptación o las reglas de negocio con los tests, no de una impresión.
- Nada se aplica sin la confirmación del punto de control Correcciones.

## Casos de aceptación

> **Nota:** estos casos describen cómo debería comportarse la skill. Sirven para validar que sigue funcionando bien después de un cambio.

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Test con etiqueta `regresion` y campo Regresión vacío | Propone quitar la etiqueta y completar el campo |
| 2 | Dos tests con el mismo objetivo | Los marca como duplicados y propone deprecar uno |
| 3 | CA de la HU sin test | Lo informa como gap y sugiere `qa-diseno-casos` |
| 4 | El QA no confirma las correcciones | No modifica nada |
