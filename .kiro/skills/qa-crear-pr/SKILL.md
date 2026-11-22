---
name: qa-crear-pr
description: Crea el Pull Request de una rama de un repositorio de QA (automatización o playbook) hacia main - verifica la rama, los commits y el diff con los criterios del framework, arma el título con el formato homologado y la descripción, y lo crea en GitHub después de confirmación. Usar cuando el agente qa-pr o el QA pide "CREAR_PR", "creá el PR de AUTO-45", "abrí el pull request de mi rama". No modifica código.
---
# Crear Pull Request

> **Para qué sirve:** abre en GitHub el Pull Request (PR) de una rama de QA con un título y una descripción siempre iguales, y avisa antes de crearlo si hay observaciones que lo van a trabar.
> **Quién lo usa:** el QA autor del cambio, directamente o a través del agente [`qa-pr`](../../agents/qa-pr.md).
> **Cuándo se usa:** cuando la rama ya tiene los commits listos y subidos al remoto, al terminar una implementación, una reparación o un cambio de documentación.

> **Nota:** un Pull Request (PR) es el pedido para incorporar los cambios de una rama a la rama principal (`main`) después de que otra persona los revise. "Remoto" es el repositorio en GitHub (en contraposición al repositorio local de tu máquina).

| Dato | Valor |
| :--- | :--- |
| Estado | Experimental |
| Versión | 0.1 |
| Puntos de control | Revisión previa, PR a crear |
| Archivos en `.qa-work/<CLAVE>/automatizacion/` | Lee `indice.md` si existe. Escribe `05-pr.md` (si no hay clave de tarea, por ejemplo en un PR del playbook, en `.qa-work/pr-<repositorio>/`) |

## Propósito

Que todo PR de QA llegue con el mismo formato de título y descripción (ver [contratos](../../../00-introduccion/kiro/contratos.md) y [`CONTRIBUTING.md`](../../../CONTRIBUTING.md)) y sin observaciones bloqueantes evitables.

## Cuándo usarla

- La rama `feature/<CLAVE>-<resumen>` tiene los commits listos y subidos.
- Al terminar una implementación, reparación o cambio de documentación.

## Cuándo no usarla

- Hay que revisar un PR ya abierto → [`qa-revisar-pr`](../qa-revisar-pr/SKILL.md).
- Hay que corregir código → [`qa-automation`](../../agents/qa-automation.md) (esta skill no modifica archivos del repositorio).

## Entradas

| Entrada | Obligatoria | Si falta |
| :--- | :--- | :--- |
| Repositorio | Sí | Deducirlo del framework (ver [contratos](../../../00-introduccion/kiro/contratos.md)) o de `git -C <repo> remote get-url origin` |
| Clave de la tarea | Sí | Tomarla de la rama actual; si no coincide con la clave de Jira, preguntar |
| Tipo (`FEAT`, `FIX`, `CHORE`) | Sí | Deducirlo del tipo de issue y de los commits; confirmarlo |
| Reviewers | No | Crear sin reviewers y avisar |

> **Nota:** `FEAT` = funcionalidad nueva (por ejemplo, tests nuevos), `FIX` = reparación (por ejemplo, un test que fallaba), `CHORE` = tarea de mantenimiento (documentación, configuración, dependencias). "Reviewers" son las personas a quienes GitHub les pide revisar el PR.

## Contexto que lee

1. [Contratos](../../../00-introduccion/kiro/contratos.md) (formato de rama, commits y título).
2. Steering `<prefijo>-code-review` del framework. En la plantilla de Playwright es [`pw-code-review.md`](../../../plantilla-automation/.kiro/steering/pw-code-review.md). En el playbook no aplica.
3. Trabajo local de la tarea en `.qa-work/<CLAVE>/automatizacion/`, si existe, para la descripción.

## Herramientas MCP

| Uso | Herramientas |
| :--- | :--- |
| Lectura | `getJiraIssue` (servidor `@atlassian`); herramientas del servidor `@github` para listar PRs, ramas y comparar ramas; los checks de GitHub Actions de la rama; `git` local (`status`, `log`, `diff`) |
| Escritura (solo después de la confirmación) | Herramienta del servidor `@github` para crear el Pull Request |

> **Nota:** `@github` y `@atlassian` son servidores MCP (*Model Context Protocol*), la forma en que Kiro se conecta a GitHub y a Jira. Si el servidor `@github` no está disponible, la skill deja el título y la descripción listos para pegar al crear el PR a mano.

## Pasos

0. **Espacio de trabajo.** Si existe `.qa-work/<CLAVE>/automatizacion/`, leer `indice.md` y las etapas aprobadas.
1. **Rama.** `git -C <repo> branch --show-current` y `git -C <repo> status --short`. Si hay cambios sin commitear o la rama no está subida (`git -C <repo> status -sb`), avisar y no seguir.
2. **PR existente.** Listar los PRs abiertos con la rama como origen (`head`). Si ya hay uno abierto, mostrar su link y terminar.
3. **Commits.** `git -C <repo> log main..HEAD --format="%s"`. Marcar los que no siguen `<CLAVE>: <qué cambia>` (por ejemplo `AUTO-45: agrega casos negativos de login`).
4. **Diff.** Comparar `main` con la rama (o `git diff main...HEAD`). Aplicar los criterios transversales de `qa-revisar-pr` y los de `<prefijo>-code-review`.
5. **[PUNTO DE CONTROL] Revisión previa · esperando tu confirmación.** Mostrar archivos, commits fuera de formato y observaciones por severidad. Si hay bloqueantes, recomendar corregirlos antes de crear el PR. Esperar decisión.
6. **Título y descripción.** Summary de la tarea con `getJiraIssue`. Título `<TIPO> | <CLAVE> | <summary>`. Descripción con la plantilla.
7. **[PUNTO DE CONTROL] PR a crear · esperando tu confirmación.** Mostrar repositorio, ramas, título, descripción y reviewers; guardarlo en `05-pr.md` (Borrador). Esperar OK.
8. **Crear** el PR (rama destino `main`). Guardar el link en `05-pr.md` (Publicado) y actualizar `indice.md`.

## Plantilla de descripción

```markdown
## Resumen
<qué se hizo y por qué, en 2 a 4 líneas>
## Cambios
- <archivo o grupo de archivos>: <qué cambia>
## Casos de prueba
| Caso | Escenario | Estado |
| :--- | :--- | :--- |
| PROJ-123-CP01 | <escenario> | Automatizado / Reparado |
## Verificación
- GitHub Actions: <workflow> #<run> — <resultado de `npm run verificar` y de los tests del cambio>
- <otras verificaciones, por ejemplo la corrida local de `npm run verificar`; qué no se ejecutó y por qué>
## Excluidos
- <tests con test.skip o test.fixme en este PR, con su marca (`@BUG @BUG_<ID>` o `@SKIP_WIP`) y su causa; o "ninguno">
## Tarea
[<CLAVE>](https://acme.atlassian.net/browse/<CLAVE>)
```

> **Nota:** la plantilla se completa con los datos reales del cambio. El link a la tarea usa el dominio de Jira del equipo (`acme` es un ejemplo). `test.skip` marca un test que no se ejecuta; `test.fixme` marca un test conocido como roto que se va a arreglar (son funciones de Playwright).

La sección "Cambios" es un resumen funcional agrupado por área o módulo (qué se hizo y por qué), no una lista de archivos.

En el playbook o en cambios sin casos de prueba, se omiten "Casos de prueba", "Excluidos" y la línea de GitHub Actions.

En un PR de automatización, pedir al QA el workflow y el run de **GitHub Actions** con que validó la rama (ver [`pipelines-ci-cd.md`](../../../03-qa-automatizacion/pipelines-ci-cd.md)) y leerlo con las herramientas de `@github`. Si el equipo suma pruebas mobile, en cambio, los links de las sesiones de ejecución en Android e iOS; si suma performance, el resultado del smoke en QA y el run de calibración en PRE. Si no lo validó, recomendarlo antes de crear el PR; si igual se crea, dejarlo como pendiente en "Verificación".

> **Nota:** el workflow de la plantilla es `.github/workflows/playwright.yml` (en este playbook, donde la plantilla es una subcarpeta, corre el de la raíz `.github/workflows/automation.yml`): ejecuta `npm run verificar` y `npx playwright test` en cada push y PR y sube el reporte. "PRE" es el ambiente de preproducción.

## Punto de confirmación

| Punto | Se muestra |
| :--- | :--- |
| Revisión previa | Archivos, commits fuera de formato, observaciones bloqueantes, importantes y menores |
| PR a crear | Repositorio, rama origen y destino, título, descripción, reviewers |

Cerrar con: "¿Confirmás, ajustamos algo o lo dejamos acá?". No avanzar sin respuesta.

## Entregable

```text
PR: #<número> <título>
Link: <url>
Rama: feature/<CLAVE>-<resumen> → main
Observaciones previas pendientes: <lista o ninguna>
```

Siguiente paso sugerido: pedir revisión (`REVISAR_PR`) a otro QA.

## Reglas

- No modificar código, hacer commits ni push.
- El título se toma del summary de Jira, nunca de los commits.
- Rama destino siempre `main`.
- No crear el PR si hay cambios sin commitear o la rama no está en el remoto.

## Errores conocidos

| Síntoma | Causa | Qué hacer |
| :--- | :--- | :--- |
| La creación falla por un reviewer | Usuario de GitHub inexistente o sin acceso al repositorio | Crear sin ese reviewer y avisar |
| La rama no coincide con una clave de Jira | Rama vieja con otro formato | Pedir la clave; recomendar renombrar en próximas tareas |
| La comparación muestra cambios ajenos | Rama desactualizada respecto de `main` | Recomendar rebase o merge de `main` antes del PR |

## Criterios de calidad

- Título con el formato exacto y el summary de Jira.
- La descripción permite entender el cambio sin abrir el diff.
- Las observaciones bloqueantes se informaron antes de crear.

## Casos de aceptación

| # | Situación | Resultado esperado |
| :--- | :--- | :--- |
| 1 | Rama `feature/AUTO-45-login-negativos` subida, sin PR | Revisión previa, título `FEAT \| AUTO-45 \| <summary>`, PR creado tras OK |
| 2 | Ya existe un PR abierto | Muestra el link; no crea otro |
| 3 | Hay cambios sin commitear | Avisa y no sigue |
| 4 | `test.only` en un archivo de tests de Playwright | Lo marca bloqueante en la revisión previa |
| 5 | El QA no confirma | No crea el PR |
