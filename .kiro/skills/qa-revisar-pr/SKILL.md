---
name: qa-revisar-pr
description: Revisa un Pull Request de un repositorio de QA - aplica los criterios transversales y los del framework (<prefijo>-code-review), arma el reporte con observaciones bloqueantes, importantes y menores y un veredicto, y publica comentarios o la aprobación en GitHub solo después de confirmación. Usar cuando el agente qa-pr o el QA pide "REVISAR_PR", "revisá el PR número 245", "hacé code review de este pull request". No modifica código.
---
# Revisar Pull Request

> **Para qué sirve:** hace el *code review* (revisión de código) de un Pull Request de QA con los mismos criterios y el mismo formato siempre, separando lo que bloquea de lo que se puede mejorar después.
> **Quién lo usa:** un QA revisor (distinto del autor), directamente o a través del agente [`qa-pr`](../../agents/qa-pr.md).
> **Cuándo se usa:** cuando hay un PR abierto en un repositorio de automatización o en el playbook, o varios PRs abiertos de un repositorio (de a uno).

> **Nota:** un Pull Request (PR) es el pedido para incorporar una rama a `main` después de que otra persona la revise. "Draft" es un PR marcado como borrador, todavía en trabajo. "Check" es una verificación automática de GitHub Actions asociada al PR.

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Revisión, Publicación de la revisión |
| Archivos en `.qa-work/<CLAVE>/automatizacion/` | Escribe `revision-pr-<número>.md` (si el PR no tiene clave de tarea, por ejemplo uno del playbook, en `.qa-work/pr-<repositorio>/`) |

## Propósito

Revisar todo PR de QA con los mismos criterios y el mismo formato, separando lo que bloquea de lo que se puede mejorar después.

## Cuándo usarla

- Hay un PR abierto en un repositorio de automatización o en el playbook.
- Para revisar varios PRs abiertos de un repositorio (de a uno).

## Cuándo no usarla

- Hay que crear el PR → [`qa-crear-pr`](../qa-crear-pr/SKILL.md).
- Hay que corregir lo observado → [`qa-automation`](../../agents/qa-automation.md) (esta skill no modifica archivos).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Repositorio | Sí | Deducirlo del framework (ver [contratos](../../../00-introduccion/kiro/contratos.md)) |
| Número del PR (`#número`) | Sí | Listar los abiertos con el servidor `@github` y preguntar cuál |

## Contexto que lee

1. [Contratos](../../../00-introduccion/kiro/contratos.md) (formato de rama, commits y título).
2. Steering `<prefijo>-code-review` del framework y, como referencia, las buenas prácticas del proyecto. En la plantilla de Playwright: [`pw-code-review.md`](../../../plantilla-automation/.kiro/steering/pw-code-review.md) y [`pw-proyecto.md`](../../../plantilla-automation/.kiro/steering/pw-proyecto.md). En el playbook: [`CONTRIBUTING.md`](../../../CONTRIBUTING.md).
3. La tarea de Jira de la rama, para comparar el alcance.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | Herramientas del servidor `@github` para leer el PR, su diff, la comparación de ramas, archivos de la rama origen y los checks; `getJiraIssue` (servidor `@atlassian`); el run de GitHub Actions para confirmar la validación |
| Escritura (solo después de la confirmación) | Herramientas del servidor `@github` para comentar el PR, comentar en una línea del diff y enviar la revisión (aprobar) |

## Pasos

1. **PR.** Leer el PR: autor, ramas, título, descripción, checks de GitHub Actions, conflictos, draft.
2. **Diff.** Leer el diff del PR. Si un archivo necesita más contexto, leerlo en la rama origen.
3. **Criterios transversales** (abajo) y **criterios del framework** (`<prefijo>-code-review`).
4. **[PUNTO DE CONTROL] Revisión · esperando tu confirmación.** Mostrar el reporte (ver "Entregable"), guardarlo en `revision-pr-<número>.md` (Borrador). Esperar OK o ajustes.
5. **[PUNTO DE CONTROL] Publicación de la revisión · esperando tu confirmación.** Proponer qué publicar: comentario general, comentarios en línea (archivo y línea) y aprobación (solo si el veredicto es APROBADO o CON OBSERVACIONES). Esperar OK.
6. **Publicar** lo confirmado. Si un comentario en línea es rechazado por posición, publicarlo dentro del comentario general. Pasar el archivo a Publicado.

## Criterios transversales

> **Nota:** "transversales" significa que valen para cualquier PR, sin importar el framework. Las severidades son: Bloqueante (no se puede aprobar), Importante (debería corregirse, puede acordarse resolverlo en otro PR) y Menor (mejora recomendada).

### Pull Request

| Criterio | Severidad si falla |
| :--- | :--- |
| Checks de GitHub Actions en verde o en curso (`Playwright Tests` o `Automation (plantilla)`, que incluyen `npm run verificar`: tipos, ESLint y formato) | Bloqueante si falló |
| Sin conflictos con `main` | Bloqueante |
| Rama `feature/<CLAVE>-<resumen>` | Menor |
| Título `<TIPO> \| <CLAVE> \| <summary de Jira>` | Menor |
| Commits `<CLAVE>: <qué cambia>` | Menor |
| Descripción con resumen, cambios y tarea | Importante si falta |
| Sin archivos ajenos (configuración del IDE, `.DS_Store`, reportes como `playwright-report/` o `test-results/`, `node_modules/`, credenciales, el archivo `.env`) | Bloqueante si hay credenciales; Importante en otro caso |
| El cambio corresponde al alcance de la tarea | Importante si mezcla temas |
| PR de automatización con el run de GitHub Actions que validó la rama, en verde (ver [`pipelines-ci-cd.md`](../../../03-qa-automatizacion/pipelines-ci-cd.md)). Si el equipo suma mobile: las sesiones de ejecución en Android e iOS. Si suma performance: el smoke en QA y el run de calibración en PRE | Importante si falta; Bloqueante si la validación falló en los tests del cambio |

### Casos de prueba y trazabilidad

> **Nota:** en Playwright los casos no viven en archivos `.feature` sino en tests de TypeScript (`tests/sin-sesion/`, `tests/con-sesion/` y `tests/api/`). Los criterios de Gherkin se aplican al caso que el test automatiza (el que está en Xray) y a cómo el test lo refleja. Si el equipo suma Karate, sus archivos `.feature` se revisan con los mismos criterios.

- El test automatiza un caso con estructura clara (Dado / Cuando / Entonces); en Karate, un `Feature` con user story (`COMO / QUIERO / PARA`) es recomendado, no obligatorio.
- Las precondiciones comunes están en `test.beforeEach`, y solo lo común a todos los tests del grupo (`test.describe`).
- Los tests tienen título descriptivo con el ID del caso: `test('PROJ-123-CP01 - Login exitoso con usuario válido', ...)`.
- Un test comentado sin motivo, o sin `test.fixme` con la causa: Importante.
- `test.skip` o `test.fixme` sin su marca y explicación: Importante. Un test excluido lleva `@BUG @BUG_<ID>` (falla por un bug reportado en Jira) o `@SKIP_WIP` (problema de ambiente o de datos) y, para `@SKIP_WIP`, la causa con evidencia, la fecha desde la que se excluyó, la fecha de revisión y el QA responsable (contratos, sección 9.9). Un `@SKIP_WIP` con la fecha de revisión vencida: Importante.
- `test.only` olvidado: Bloqueante (hace que el resto de los tests no se ejecute).
- Archivo de tests con más de 10 tests o `test.beforeEach` de más de 3 pasos sin justificación en el PR: Menor (es recomendación).
- Test parametrizado (varios datos en un mismo test) con un solo dato: Menor.

### Código

- Sin código muerto comentado, variables o imports sin usar, ni logs de debug (`console.log`).
- Errores manejados: sin `catch` vacíos ni fallos ocultos (un test que pasa cuando debería fallar es Bloqueante).
- Page Object Model: el Page Object (y el cliente de API de `api/`) sabe cómo interactuar (localizadores y acciones) y el test decide qué se espera. Las aserciones `expect` quedan en el test, no en el Page Object ni en el cliente (Importante; Bloqueante en la plantilla de Playwright, según `pw-code-review`).
- Selectores estables: preferir `data-test` o `data-testid` antes que textos o posiciones (Importante si hay selectores frágiles como `nth-child` o XPath largos).
- Nada de esperas fijas (`waitForTimeout`): se usan las esperas automáticas de Playwright y aserciones web-first (Importante; Bloqueante si el test depende de ellas para pasar).
- Sin credenciales ni URLs de ambientes escritas en el código: las URLs salen de `config/ambientes.ts` (variables `TEST_ENV`, `BASE_URL`, `API_URL`) y las credenciales, de variables de entorno (`QA_USER`, `QA_PASSWORD`). Ningún ambiente puede apuntar a producción (Bloqueante). Las únicas credenciales aceptables son las del sitio demo público SauceDemo, en datos de ejemplo (Bloqueante en cualquier otro caso).
- Nombres y ubicación según el steering del framework: Page Objects `pages/[Pantalla]Page.ts` (registrados en `fixtures/index.ts`), tests de web `tests/sin-sesion/[funcionalidad].spec.ts` o `tests/con-sesion/[funcionalidad].spec.ts` (Menor si está en la carpeta equivocada: va en `con-sesion/` si el login es solo una precondición) y tests de API `tests/api/[recurso].api.spec.ts`.

> **Nota (severidades del framework):** el `pw-code-review.md` de la plantilla clasifica sus criterios en Bloqueante, Observación y Sugerencia. En el reporte se usan las severidades de esta skill: Bloqueante es Bloqueante, Observación es Importante y Sugerencia es Menor. Si un criterio del framework es más estricto que la tabla de esta skill (por ejemplo, un `test.skip` sin justificar es Bloqueante en `pw-code-review` y Importante acá), vale el del framework.

> **Nota (archivos de sesión y reportes):** la sesión guardada (`playwright/.auth/`), el reporte (`playwright-report/`), los resultados (`test-results/`) y el archivo `.env` están en el `.gitignore` de la plantilla. Si aparecen en el diff, aplica la fila "Sin archivos ajenos" de la tabla de PR: la sesión guardada contiene cookies y se trata como credencial (Bloqueante).

## Punto de confirmación

| Punto | Se muestra |
| :--- | :--- |
| Revisión | Reporte completo con veredicto |
| Publicación de la revisión | Texto exacto del comentario general, lista de comentarios en línea (archivo, línea, texto) y si se aprueba |

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

`revision-pr-<número>.md` y comentario general:

```markdown
## Revisión — PR #<número>: <título>
| Dato | Valor |
| :--- | :--- |
| Autor | <nombre> |
| Rama | `<origen>` → `<destino>` |
| Checks | <estado de GitHub Actions> |
| Conflictos | Sí / No |
### Resumen de cambios
<qué hace el PR>
### Lo bueno
- <…>
### Observaciones
#### Bloqueantes
1. `<archivo>:<línea>` — <qué pasa, por qué importa y cómo corregirlo>
#### Importantes
1. …
#### Menores
1. …
### Veredicto
<APROBADO / CON OBSERVACIONES / RECHAZADO>
Revisado por <USUARIO> y Kiro
```

> **Nota:** `<USUARIO>` es el nombre del QA que corre la revisión. "Revisado por … y Kiro" deja constancia de que la revisión fue asistida.

| Veredicto | Cuándo |
| :--- | :--- |
| APROBADO | Sin observaciones o solo menores |
| CON OBSERVACIONES | Hay importantes que pueden resolverse en otro PR, con acuerdo del autor |
| RECHAZADO (cambios requeridos) | Hay al menos un bloqueante, o importantes que afectan lo que el test valida |

Siguiente paso sugerido: si el veredicto es RECHAZADO, el autor corrige con `qa-automation` y se vuelve a revisar.

## Reglas

- No modificar código ni hacer commits.
- No aprobar con bloqueantes ni con los checks fallidos.
- Cada observación dice dónde, por qué y cómo corregir.
- No publicar nada sin confirmación del texto exacto.
- No repetir comentarios ya publicados en el PR.
- Si la revisión encuentra un error recurrente de ejecución que no está en la guía de problemas conocidos del framework (`<prefijo>-troubleshooting`, si el equipo la tiene), proponerlo en el reporte como entrada nueva del catálogo (lo agrega el autor en su rama o `qa-automation` en una reparación).

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| El comentario en línea es rechazado por posición | La línea no está en el diff | Incluir la observación en el comentario general |
| El diff es muy grande | PR con muchos archivos | Revisar por grupos (tests, Page Objects, datos, configuración) y avisarlo en el reporte |
| El PR es draft | Trabajo en curso | Revisar igual si el QA lo pide; no aprobar |

## Criterios de calidad

- Las severidades siguen las tablas de esta skill y del framework.
- El veredicto es consistente con las observaciones.
- El autor puede corregir sin preguntar qué se quiso decir.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | PR de Playwright con `test.only` en un archivo de tests | Bloqueante; veredicto RECHAZADO |
| 2 | PR con una URL de ambiente o una credencial escrita en el código | Bloqueante según `pw-code-review` |
| 3 | PR limpio con checks verdes | APROBADO; aprueba en GitHub solo tras OK |
| 4 | Checks fallidos | No aprueba |
| 5 | El QA no confirma la publicación | No publica nada |
